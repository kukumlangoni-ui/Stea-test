import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth, GoogleAuthProvider,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, signOut, onAuthStateChanged, sendPasswordResetEmail,
} from "firebase/auth";
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, getDoc, setDoc, onSnapshot, query, orderBy, limit,
  serverTimestamp, increment, where, getDocFromServer, runTransaction,
  initializeFirestore, getFirestore, or
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Import the Firebase configuration
import { firebaseConfig } from '../firebaseConfig.js';

export const ADMIN_EMAILS = ["isayamasika100@gmail.com", "kukumlangoni@gmail.com", "swahilitecheliteacademy@gmail.com"];
export const isAdminEmail = (email) => email && ADMIN_EMAILS.includes(email.toLowerCase());
export const ADMIN_EMAIL = ADMIN_EMAILS[0]; // Keep for backward compatibility

export const normalizeEmail = (email) => {
  if (!email) return "";
  const trimmed = email.trim().toLowerCase();
  if (!trimmed.includes("@")) return `${trimmed}@gmail.com`;
  return trimmed;
};

// ── Init (safe, runs once) ────────────────────────────
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Simple initialization: always use the default database
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});
const storage = getStorage(app);
// Set reasonable retry limits to avoid long-hanging operations that eventually fail
// storage.maxRetryTime is for individual retries, maxOperationRetryTime is for the whole op.
storage.maxRetryTime = 30000; // 30 seconds
storage.maxOperationRetryTime = 30000;

const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Messaging: lazy init to avoid crash on Safari/Firefox
let _messaging = null;
export const getMessagingInstance = async () => {
  if (_messaging) return _messaging;
  try {
    if (!("Notification" in window) || !navigator.serviceWorker) return null;
    const { getMessaging } = await import("firebase/messaging");
    _messaging = getMessaging(app);
    return _messaging;
  } catch { return null; }
};

export { auth, db, storage, analytics, GoogleAuthProvider };
export {
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, signOut, onAuthStateChanged, sendPasswordResetEmail,
};
export {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, getDoc, setDoc, onSnapshot, query, orderBy, limit,
  serverTimestamp, increment, where, getDocFromServer, runTransaction, or
};
export { ref, uploadBytes, getDownloadURL };


export const handleStorageError = (error) => {
  const code = error.code || "unknown";
  console.error(`[storage error] ${code}:`, error);
  if (code === "storage/retry-limit-exceeded") {
    throw new Error("Imeshindwa kufikia server ya picha (Network Timeout). Tafadhali kagua internet yako au jaribu picha ndogo zaidi.");
  }
  if (code === "storage/unauthorized") {
    throw new Error("Huna ruhusa ya kupakia hapa. Tafadhali login tena.");
  }
  if (code === "storage/quota-exceeded") {
    throw new Error("Nafasi ya kuhifadhi imejaa. Tafadhali wasiliana na msimamizi.");
  }
  throw error;
};


// Compat helpers
export const initFirebase = () => ({ auth, db });
export const getFirebaseAuth = () => auth;
export const getFirebaseDb = () => db;

export const OperationType = {
  CREATE: "create", UPDATE: "update", DELETE: "delete",
  LIST: "list", GET: "get", WRITE: "write",
};

function safeStringify(obj) {
  const cache = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (cache.has(value)) return;
      cache.add(value);
    }
    return value;
  });
}

export function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    code: error.code || "unknown",
    authInfo: {
      userId: auth.currentUser?.uid, 
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous
    },
    operationType, path,
  };
  
  // Log the error for diagnostic purposes
  console.error(`[firestore error] ${operationType} on ${path}:`, safeStringify(errInfo));

  // Only throw for critical write operations or specific user data fetches
  // Public settings and FAQs should fail gracefully to avoid app-breaking crashes
  const isPublicPath = path && (
    path.startsWith("site_settings") || 
    path.startsWith("faqs") || 
    path.startsWith("chaba_payment_methods") || 
    path.startsWith("chaba_products")
  );
  const isReadOp = operationType === OperationType.GET || operationType === OperationType.LIST;

  if (isPublicPath && isReadOp) {
    return; // Silently fail for public read operations
  }

  throw new Error(safeStringify(errInfo));
}

// ── Connection Test ──────────────────────────────────
export async function testConnection() {
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      console.log(`Testing Firestore connection (Attempt ${attempts + 1}/${maxAttempts})...`);
      // Attempt to fetch a non-existent doc from server to verify config
      await getDocFromServer(doc(db, "_connection_test_", "ping"));
      console.log("Firestore connection verified.");
      return true;
    } catch (error) {
      if (error instanceof Error && error.message.includes("Missing or insufficient permissions")) {
        console.log("Firestore connection verified (permission denied, but server reached).");
        return true;
      }

      attempts++;
      console.error(`Firestore Connection Test Attempt ${attempts} failed:`, error);
      
      if (error instanceof Error && error.message.includes("the client is offline")) {
        if (attempts < maxAttempts) {
          console.log("Retrying in 2 seconds...");
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        console.error("CRITICAL: Firestore is offline. This usually means the Firebase configuration is incorrect or the project needs to be re-provisioned.");
        return false;
      }
      // Other errors mean we reached the server
      return true;
    }
  }
  return false;
}
