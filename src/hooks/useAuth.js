import { useState, useEffect } from "react";
import { getFirebaseAuth, getFirebaseDb } from "../firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();
    
    if (!auth || !db) {
       setLoading(false);
       return;
    }

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // fetch role from users
        try {
          const docRef = doc(db, "users", u.uid);
          const snap = await getDoc(docRef);
          if (snap.exists() && snap.data().role) {
            u.role = snap.data().role;
          }
        } catch(e){}
        setUser(u);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { user, loading };
}
