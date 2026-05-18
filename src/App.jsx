import { useState, useEffect, useRef, useCallback, useMemo, Component, lazy, Suspense } from "react";
import { Routes, Route, useNavigate, Navigate, useParams, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import confetti from "canvas-confetti";

const generatePromptPDF = (prompt) => {
  console.log("Generate PDF for", prompt);
};

import { CheckoutProvider } from "./contexts/CheckoutContext.jsx";
import { SettingsProvider, useSettings } from "./contexts/SettingsContext";
import { SiteSettingsProvider } from "./contexts/SiteSettingsContext.jsx";
import { NotificationManager } from "./components/NotificationManager";
import { InstallPrompt } from "./components/InstallPrompt";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  CheckCircle,
  Copy,
  Download,
  Check,
  Send,
  ChevronRight,
  ArrowRight,
  Zap,
  BookOpen,
  Star,
  Users,
  Clock,
  Award,
  HelpCircle,
  ShieldCheck,
  MessageCircle,
  X,
  User,
  Globe,
  Share2,
  Search,
} from "lucide-react";
import VpnHelpPage from "./pages/VpnHelpPage.jsx";
import MarketplacePage from "./pages/MarketplacePage.jsx";
import ChabaMarketplacePage from "./pages/ChabaMarketplacePage.jsx";
import ChabaCheckoutPage from "./pages/ChabaCheckoutPage.jsx";
import TanzaniaMarketplaceCheckoutPage from "./pages/TanzaniaMarketplaceCheckoutPage.jsx";
import SellerProfilePage from "./pages/SellerProfilePage.jsx";
import WebsiteSolutionsPage from "./pages/WebsiteSolutionsPage.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import NewHomePage from "./pages/HomePageV2.jsx";
import SellerApplicationPage from "./pages/SellerApplicationPage.jsx";
import WebsiteDesignServicePage from "./pages/WebsiteDesignServicePage.jsx";
import ServiceRequestPage from "./pages/ServiceRequestPage.jsx";
import STEAAppSplash from "./components/STEAAppSplash.jsx";
import EmptyState from "./components/EmptyState";
import DigitalCheckoutModal from "./components/DigitalCheckoutModal.jsx";
import DigitalToolDetailPage from "./pages/DigitalToolDetailPage.jsx";




import {
  initFirebase,
  getFirebaseAuth,
  getFirebaseDb,
  db,
  GoogleAuthProvider,
  isAdminEmail,
  testConnection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  collection,
  orderBy,
  getDocs,
  serverTimestamp,
  normalizeEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  handleFirestoreError,
  OperationType,
} from "./firebase.js";
import {
  useCollection,
  incrementViews,
  timeAgo,
  fmtViews,
} from "./hooks/useFirestore.js";
import AdminPanel from "./admin/AdminPanel.jsx";
import SellerDashboard from "./admin/SellerDashboard.jsx";
import CreatorDashboard from "./admin/CreatorDashboard.jsx";
import ManagerDashboard from "./admin/ManagerDashboard.jsx";
import { CategoryTabs } from "./components/CategoryTabs.jsx";
import ProfilePictureUpload from "./components/ProfilePictureUpload.jsx";
import { PopupAd } from "./components/SponsoredAdsSection.jsx";
import { ShopProductCard } from "./components/ShopProductCard.jsx";
import Navbar from "./components/Navbar.jsx";
import { FloatingBackButton } from "./components/FloatingBackButton.jsx";
import { CourseCard } from "./components/CourseCard.jsx";

import BottomNav from "./components/BottomNav.jsx";
import TangazaNasiForm from "./components/services/TangazaNasiForm.jsx";
import NectaResultsPage from "./pages/NectaResultsPage.jsx";
import ExamsHubPage from "./pages/ExamsHubPage.jsx";
import PastPapersPage from "./pages/PastPapersPage.jsx";
import NotesPage from "./pages/NotesPage.jsx";
import PracticePage from "./pages/PracticePage.jsx";
import GigsPage from "./pages/GigsPage.jsx";
import OrderTrackingPage from "./pages/OrderTrackingPage.jsx";
import AILabPage from "./pages/AILabPage.jsx";
import PromptLabPage from "./pages/PromptLabPage.jsx";
import UniversityGuidePage from "./pages/UniversityGuidePage.jsx";
import TechHubPage from "./pages/TechHubPage.jsx";
import HudumaPage from "./pages/HudumaPage.jsx";
import AbroadMoneyGuidePage from "./pages/AbroadMoneyGuidePage.jsx";
import AssistantPage from "./pages/AssistantPage.jsx";
import ScholarshipsTZPage from "./pages/ScholarshipsTZPage.jsx";
import StudentUpdatesPage from "./pages/StudentUpdatesPage.jsx";
import StudyAbroadPage from "./pages/StudyAbroadPage.jsx";
import AdvertisePage from "./pages/AdvertisePage.jsx";
import TechTipsPage from "./pages/TechTipsPage.jsx";
import TipsResourcesPage from "./pages/TipsResourcesPage.jsx";
import TipsResourceDetailPage from "./pages/TipsResourceDetailPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CeoWorkspace from "./ceo/CeoWorkspace.jsx";
import ExploreResourcesPage from "./pages/ExploreResourcesPage.jsx";
import { routeSearchQuery } from "./utils/searchRouting.js";

const ResultSeoPage = lazy(() => import("./pages/ResultSeoPage.jsx"));


// ── Hooks ────────────────────────────────────────────────
// Trigger bundle refresh
import { useMobile } from "./hooks/useMobile.js";
import { useSearch as useSearchHook } from "./hooks/useSearch.js";
import { useCustomCategories as useCustomCatsHook } from "./hooks/useCustomCategories.js";

import { PWAProvider } from "./contexts/PWAContext";


// ── Error Boundary ───────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("STEA Error:", error?.message, errorInfo?.componentStack?.split('\n')[1]);
  }
  render() {
    if (this.state.hasError) {
      const isPermission = this.state.error?.message?.includes("permission");
      return (
        <div style={{ padding: 32, textAlign: "center", background: "#05060a", minHeight: "100vh",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff" }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>⚠️</div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 24, fontWeight: 900,
            marginBottom: 10, letterSpacing: "-.03em" }}>
            {isPermission ? "Access Denied" : "Something went wrong"}
          </h2>
          <p style={{ color: "rgba(255,255,255,.5)", maxWidth: 420, lineHeight: 1.68, marginBottom: 28, fontSize: 15 }}>
            {isPermission
              ? "You don't have permission for this. Please contact admin."
              : "This page ran into a problem. Try going back or reloading."}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={() => window.history.length > 1 ? window.history.back() : (window.location.href="/")}
              style={{ padding: "11px 24px", borderRadius: 12, border: "none",
                background: "linear-gradient(135deg,#F5A623,#FFD17C)", color: "#111", fontWeight: 900, cursor: "pointer", fontSize: 14 }}>
              ← Go Back
            </button>
            <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
              style={{ padding: "11px 24px", borderRadius: 12, border: "1px solid rgba(255,255,255,.15)",
                background: "rgba(255,255,255,.06)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
              Reload
            </button>
            <button onClick={() => window.location.href = "/"}
              style={{ padding: "11px 24px", borderRadius: 12, border: "1px solid rgba(255,255,255,.1)",
                background: "transparent", color: "rgba(255,255,255,.5)", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
              Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Page Wrapper for animations ─────────────────────
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

function SearchRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q") || "";
    const target = routeSearchQuery(q);
    navigate(`/${target}`, { replace: true, state: { q } });
  }, [location.search, navigate]);

  return (
    <div style={{ minHeight: "70vh", display: "grid", placeItems: "center", color: "#fff" }}>
      Searching STEA...
    </div>
  );
}

// ── Tokens ────────────────────────────────────────────
const G = "#F5A623",
  G2 = "#FFD17C",
  CB = "#141823";

// ── Portal Component ──────────────────────────────────
const Portal = ({ children }) => {
  return createPortal(children, document.body);
};


// ── Nav ───────────────────────────────────────────────
const NAV = [
  { id: "home", label: "Home" },
  { id: "vpn", label: "VPN" },
  { id: "necta", label: "NECTA" },
  { id: "ai", label: "AI Lab" },
  { id: "prompts", label: "Prompt Lab" },
  { id: "websites", label: "Website Design" },
  { id: "digital-tools", label: "Digital Tools" },
];


// ── Static fallbacks (shown when Firestore is empty) ──
const BS = {
  gold: {
    background: "rgba(245,166,35,.2)",
    color: G,
    border: "1px solid rgba(245,166,35,.3)",
  },
  blue: {
    background: "rgba(59,130,246,.2)",
    color: "#93c5fd",
    border: "1px solid rgba(59,130,246,.3)",
  },
  red: {
    background: "rgba(239,68,68,.2)",
    color: "#fca5a5",
    border: "1px solid rgba(239,68,68,.3)",
  },
  purple: {
    background: "rgba(99,102,241,.2)",
    color: "#a5b4fc",
    border: "1px solid rgba(99,102,241,.3)",
  },
  gray: {
    background: "rgba(255,255,255,.1)",
    color: "rgba(255,255,255,.8)",
    border: "1px solid rgba(255,255,255,.2)",
  },
};

// ════════════════════════════════════════════════════
// SHARED COMPONENTS
// ════════════════════════════════════════════════════



function TiltCard({ children, style = {}, className = "", onClick }) {
  const ref = useRef(null);
  const apply = useCallback((x, y) => {
    if (window.innerWidth < 768) return;
    const c = ref.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const px = (x - r.left) / r.width,
      py = (y - r.top) / r.height;
    c.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 7}deg) rotateY(${(px - 0.5) * 9}deg) translateY(-6px)`;
    c.style.boxShadow = "0 22px 54px rgba(0,0,0,.4)";
    c.style.borderColor = "rgba(245,166,35,.25)";
  }, []);
  const reset = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "";
    ref.current.style.boxShadow = "0 12px 36px rgba(0,0,0,.2)";
    ref.current.style.borderColor = "rgba(255,255,255,.08)";
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      onClick={onClick}
      onMouseMove={(e) => apply(e.clientX, e.clientY)}
      onMouseLeave={reset}
      onTouchStart={(e) => {
        const t = e.touches[0];
        apply(t.clientX, t.clientY);
      }}
      onTouchMove={(e) => {
        const t = e.touches[0];
        apply(t.clientX, t.clientY);
      }}
      onTouchEnd={() => setTimeout(reset, 300)}
      style={{ 
        position: "relative",
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,.08)",
        background: CB,
        overflow: "hidden",
        transition: "border-color .3s,box-shadow .3s",
        boxShadow: "0 12px 36px rgba(0,0,0,.2)",
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Thumb({ bg, iconUrl, name, domain, badge, bt, imageUrl, fit = "cover" }) {
  const [imgError, setImgError] = useState(false);
  const hasImage = imageUrl && !imgError;
  const [iconError, setIconError] = useState(false);
  const hasIcon = iconUrl && !iconError;

  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "16/9",
        background: "rgba(255,255,255,.03)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "36px 20px 20px",
        overflow: "hidden",
        borderBottom: "1px solid rgba(255,255,255,.07)",
      }}
    >
      {hasImage ? (
        <img
          loading="lazy"
          src={imageUrl}
          alt={name}
          referrerPolicy="no-referrer"
          style={{
            width: "100%",
            height: "100%",
            objectFit: fit,
            position: "absolute",
            inset: 0,
          }}
          onError={() => setImgError(true)}
        />
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: bg,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 30% 30%,rgba(255,255,255,.12),transparent 60%)",
              pointerEvents: "none",
            }}
          />
        </>
      )}
      {badge && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            padding: "5px 12px",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 900,
            zIndex: 5,
            ...(BS[bt] || BS.gray),
          }}
        >
          {badge}
        </div>
      )}
      {!hasImage && (
        <>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              overflow: "hidden",
              display: "grid",
              placeItems: "center",
              background: "rgba(255,255,255,.1)",
              zIndex: 2,
              backdropFilter: "blur(10px)",
            }}
          >
            {hasIcon && (
              <img
                src={iconUrl}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                referrerPolicy="no-referrer"
                onError={() => setIconError(true)}
              />
            )}
          </div>
          <div
            style={{
              fontFamily: "'Bricolage Grotesque',sans-serif",
              fontSize: 15,
              fontWeight: 800,
              color: "rgba(255,255,255,.92)",
              zIndex: 2,
              textAlign: "center",
            }}
          >
            {name}
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: 99,
              background: "rgba(255,255,255,.15)",
              color: "#fff",
              zIndex: 2,
            }}
          >
            {domain}
          </span>
        </>
      )}
    </div>
  );
}

function PushBtn({ children, onClick, style = {} }) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.querySelector(".ps").style.transform =
          "translateY(4px)";
        e.currentTarget.querySelector(".pf").style.transform =
          "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.querySelector(".ps").style.transform =
          "translateY(2px)";
        e.currentTarget.querySelector(".pf").style.transform =
          "translateY(-2px)";
      }}
      onMouseDown={(e) => {
        e.currentTarget.querySelector(".ps").style.transform =
          "translateY(0px)";
        e.currentTarget.querySelector(".pf").style.transform =
          "translateY(0px)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.querySelector(".ps").style.transform =
          "translateY(4px)";
        e.currentTarget.querySelector(".pf").style.transform =
          "translateY(-4px)";
      }}
      style={{
        position: "relative",
        border: "none",
        background: "transparent",
        padding: 0,
        cursor: "pointer",
        outline: "none",
        ...style,
      }}
    >
      <span
        className="ps"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: 16,
          background: "rgba(0,0,0,.3)",
          transform: "translateY(2px)",
          transition: "transform .2s cubic-bezier(.3,.7,.4,1)",
          display: "block",
        }}
      />
      <span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: 16,
          background:
            "linear-gradient(to left,hsl(37,60%,25%),hsl(37,60%,40%),hsl(37,60%,25%))",
          display: "block",
        }}
      />
      <span
        className="pf"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "13px 26px",
          borderRadius: 16,
          fontSize: 15,
          fontWeight: 900,
          color: "#111",
          background: `linear-gradient(135deg,${G},${G2})`,
          transform: "translateY(-2px)",
          transition: "transform .2s cubic-bezier(.3,.7,.4,1)",
        }}
      >
        {children}
      </span>
    </button>
  );
}

function GoldBtn({ children, onClick, style = {}, className = "" }) {
  return (
    <button
      className={className}
      onClick={onClick}
      style={{
        border: "none",
        cursor: "pointer",
        borderRadius: 14,
        padding: "11px 20px",
        fontWeight: 900,
        color: "#111",
        background: `linear-gradient(135deg,${G},${G2})`,
        fontSize: 14,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px) scale(1.05)";
        e.currentTarget.style.boxShadow = `0 16px 32px rgba(245,166,35,.4)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      {children}
    </button>
  );
}

function CopyBtn({ code }) {
  const [c, setC] = useState(false);
  return (
    <button
      onClick={() =>
        navigator.clipboard.writeText(code).then(() => {
          setC(true);
          setTimeout(() => setC(false), 2000);
        })
      }
      style={{
        background: c ? G : "rgba(255,255,255,.1)",
        color: c ? "#111" : "#fff",
        border: `1px solid ${c ? G : "rgba(255,255,255,.15)"}`,
        padding: "6px 14px",
        borderRadius: 8,
        fontWeight: 700,
        fontSize: 12,
        cursor: "pointer",
        transition: "all .2s",
      }}
    >
      {c ? "✅ Copied!" : "📋 Copy"}
    </button>
  );
}

function SHead({ title, hi, copy }) {
  const isMobile = useMobile();
  return (
    <div style={{ marginBottom: isMobile ? 16 : 24 }}>
      <h2
        style={{
          fontFamily: "'Bricolage Grotesque',sans-serif",
          fontSize: isMobile ? 24 : "clamp(28px,3vw,40px)",
          letterSpacing: "-.04em",
          margin: "0 0 4px",
          lineHeight: 1.1,
          fontWeight: 900,
        }}
      >
        {title} <span style={{ color: G }}>{hi}</span>
      </h2>
      {copy && (
        <p
          style={{
            margin: 0,
            color: "rgba(255,255,255,.45)",
            lineHeight: isMobile ? 1.5 : 1.8,
            maxWidth: 680,
            fontSize: isMobile ? 12 : 15,
          }}
        >
          {copy}
        </p>
      )}
    </div>
  );
}

const W = ({ children }) => {
  return (
    <div className="main-container">
      {children}
    </div>
  );
};

// ── Skeleton loader ───────────────────────────────────
function Skeleton({ type = "card" }) {
  if (type === "prompt") {
    return (
      <div
        style={{
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,.06)",
          background: CB,
          overflow: "hidden",
          height: 320,
        }}
      >
        <div
          style={{
            height: "100%",
            background:
              "linear-gradient(90deg,rgba(255,255,255,.02) 25%,rgba(255,255,255,.05) 50%,rgba(255,255,255,.02) 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 2s infinite",
          }}
        />
      </div>
    );
  }
  return (
    <div
      style={{
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,.06)",
        background: CB,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 160,
          background:
            "linear-gradient(90deg,rgba(255,255,255,.03) 25%,rgba(255,255,255,.07) 50%,rgba(255,255,255,.03) 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.8s infinite",
        }}
      />
      <div style={{ padding: 20 }}>
        <div
          style={{
            height: 18,
            borderRadius: 9,
            background: "rgba(255,255,255,.05)",
            marginBottom: 12,
            width: "80%",
          }}
        />
        <div
          style={{
            height: 12,
            borderRadius: 6,
            background: "rgba(255,255,255,.03)",
            width: "100%",
            marginBottom: 8,
          }}
        />
        <div
          style={{
            height: 12,
            borderRadius: 6,
            background: "rgba(255,255,255,.03)",
            width: "60%",
          }}
        />
      </div>
    </div>
  );
}

// ── Article modal ─────────────────────────────────────
function ArticleModal({ article, onClose }) {
  const [imgError, setImgError] = useState(false);
  const [content, setContent] = useState(article.content || "");
  const [loadingContent, setLoadingContent] = useState(!!article.contentFileUrl && !article.content);
  const hasImage = article.imageUrl && !imgError;

  useEffect(() => {
    if (article.contentFileUrl && !article.content) {
      // Use a microtask to avoid synchronous setState in effect
      Promise.resolve().then(() => setLoadingContent(true));
      fetch(article.contentFileUrl)
        .then(res => res.json())
        .then(data => {
            setContent(data);
            setLoadingContent(false);
        })
        .catch(err => {
            console.error("Error fetching content:", err);
            setLoadingContent(false);
        });
    }
  }, [article]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  });
  return (
    <Portal>
      <div
        style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px 16px" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#040509]/95 backdrop-blur-2xl"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className="relative w-full max-w-[800px] bg-[#0e101a] rounded-[40px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between p-7 bg-[#0e101a]/80 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] text-[10px] font-black uppercase tracking-wider">
                {article.badge}
              </span>
              {article.readTime && (
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                  {article.readTime} read
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all active:scale-90"
            >
              <X size={22} />
            </button>
          </div>

          <div className="overflow-y-auto scrollbar-hide">
            {hasImage && (
              <div className="w-full aspect-video overflow-hidden bg-white/5 border-b border-white/5">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                />
              </div>
            )}

            <div className="p-4 sm:p-16 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white leading-[1.1]">
                  {article.title}
                </h2>
                <div className="flex items-center gap-4 text-white/30 text-xs font-bold">
                  <span>{timeAgo(article.createdAt)}</span>
                  <div className="w-1 h-1 rounded-full bg-white/10" />
                  <span>{fmtViews(article.views)} views</span>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              <div className="prose prose-invert max-w-none px-2 sm:px-4">
                <div className="text-white/70 leading-relaxed text-lg sm:text-xl space-y-6 font-medium">
                  {loadingContent ? (
                    <p>Inapakia maudhui...</p>
                  ) : (
                    content?.split("\n").map((p, i) => (
                      <p key={i}>{p}</p>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Portal>
  );
}

// ── Video modal ───────────────────────────────────────
function VideoModal({ video, onClose }) {
  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const getEmbedUrl = (url, platform) => {
    if (!url) return "";
    if (platform === "youtube" || url.includes("youtube.com") || url.includes("youtu.be")) {
      if (url.includes("embed/")) return url;
      const id = url.includes("v=") ? url.split("v=")[1]?.split("&")[0] : url.split("be/")[1]?.split("?")[0] || url.split("/").pop()?.split("?")[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
    }
    if (platform === "tiktok" || url.includes("tiktok.com")) {
      if (url.includes("/video/")) {
        const id = url.split("/video/")[1]?.split("?")[0];
        return `https://www.tiktok.com/embed/v2/${id}`;
      }
      return url;
    }
    if (platform === "instagram" || url.includes("instagram.com")) {
      const id = url.split("/p/")[1]?.split("/")[0] || url.split("/reels/")[1]?.split("/")[0] || url.split("/reel/")[1]?.split("/")[0];
      if (id) return `https://www.instagram.com/p/${id}/embed`;
      return url;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(video.embedUrl || video.url, video.platform);
  const isVertical = video.platform === "tiktok" || (video.platform === "instagram" && (video.url?.includes("/reels/") || video.url?.includes("/reel/"))) || (video.platform === "youtube" && (video.url?.includes("/shorts/") || video.embedUrl?.includes("/shorts/")));

  return (
    <Portal>
      <div
        style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:"0" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#040509]/98 backdrop-blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className={`relative w-full ${isVertical ? 'max-w-[420px]' : 'max-w-[1000px]'} bg-black overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] sm:rounded-[40px] border border-white/10 flex flex-col`}
          style={{ height: window.innerWidth < 640 ? '100%' : 'auto' }}
        >
          <button
            onClick={onClose}
            className="absolute right-6 top-6 z-50 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/10 transition-all active:scale-90"
          >
            <X size={24} />
          </button>

          <div className={`relative w-full ${isVertical ? 'aspect-[9/16]' : 'aspect-video'} bg-black`}>
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full border-none"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="p-4 sm:p-12 bg-[#0e101a] border-t border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] text-[10px] font-black uppercase tracking-wider">
                {video.badge || "Video"}
              </span>
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                {video.platform}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-white leading-tight">
              {video.title}
            </h2>
          </div>
        </motion.div>
      </div>
    </Portal>
  );
}

// ── Article Card ──────────────────────────────────────
function ArticleCard({ item, onRead, collection: col }) {
  const isMobile = useMobile();
  const [imgError, setImgError] = useState(false);
  const hasImage = (item.image || item.imageUrl) && !imgError;
  const handleRead = () => {
    if (item.id && !item.id.startsWith("f") && !item.id.startsWith("u"))
      incrementViews(col, item.id);
    onRead(item);
  };
  const handleShare = async (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/tech-tip-detail?id=${item.id}`;
    const title = item.title || "STEA Tech Tip";
    const text = item.description || "Soma zaidi STEA Maujanja ya Tech";

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        console.log("Share failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied!");
      } catch (err) {
        console.log("Copy failed:", err);
      }
    }
  };
  return (
    <TiltCard
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div
        style={{
          flexShrink: 0,
          padding: hasImage ? 0 : isMobile ? "10px 10px 6px" : "18px 18px 10px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background:
            "linear-gradient(135deg,rgba(245,166,35,.1),rgba(255,255,255,.02)),linear-gradient(180deg,#1e2030,#161820)",
          aspectRatio: hasImage ? "16/9" : "auto",
          minHeight: hasImage ? 0 : isMobile ? 60 : 90,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {hasImage ? (
          <img
            src={item.image || item.imageUrl}
            alt={item.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              inset: 0,
            }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              width: "100%",
              padding: isMobile ? "12px" : "20px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: isMobile ? "3px 8px" : "4px 10px",
                borderRadius: 999,
                fontSize: isMobile ? 10 : 11,
                fontWeight: 800,
                ...BS.gold,
              }}
            >
              {item.badge}
            </span>
            <div
              style={{
                fontSize: isMobile ? 11 : 12,
                color: "rgba(255,255,255,.4)",
                marginTop: isMobile ? 6 : 8,
              }}
            >
              {item.readTime || "5 min"} read
            </div>
          </div>
        )}
        {hasImage && (
          <div
            style={{
              position: "absolute",
              top: isMobile ? 8 : 12,
              left: isMobile ? 8 : 12,
              padding: isMobile ? "3px 8px" : "4px 10px",
              borderRadius: 999,
              fontSize: isMobile ? 9 : 10,
              fontWeight: 800,
              ...BS.gold,
              backdropFilter: "blur(8px)",
            }}
          >
            {item.badge}
          </div>
        )}
      </div>
      <div
        style={{
          padding: isMobile ? 10 : 18,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          style={{
            fontFamily: "'Bricolage Grotesque',sans-serif",
            fontSize: isMobile ? 14 : 18,
            margin: "0 0 4px",
            letterSpacing: "-.03em",
            lineHeight: 1.2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.title}
        </h3>
        <p
          style={{
            color: "rgba(255,255,255,.62)",
            fontSize: isMobile ? 11 : 14,
            lineHeight: 1.5,
            margin: "0 0 10px",
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: isMobile ? 2 : 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.description || item.summary}
        </p>
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            marginBottom: 10,
            borderTop: "1px solid rgba(255,255,255,.05)",
            paddingTop: 8,
          }}
        >
          <span style={{ fontSize: 9, color: "rgba(255,255,255,.35)" }}>
            👁 {fmtViews(item.views)}
          </span>
          {item.createdAt && (
            <span style={{ fontSize: 9, color: "rgba(255,255,255,.35)" }}>
              {timeAgo(item.createdAt)}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <GoldBtn
            onClick={handleRead}
            style={{
              fontSize: isMobile ? 10 : 12,
              padding: isMobile ? "6px 10px" : "9px 16px",
              flex: 1,
              justifyContent: "center",
            }}
          >
            📖 Soma Zaidi
          </GoldBtn>
          <button
            onClick={handleShare}
            style={{
              width: isMobile ? 32 : 42,
              height: isMobile ? 32 : 42,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,.12)",
              background: "rgba(255,255,255,.05)",
              color: "rgba(255,255,255,.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all .2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,.1)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,.05)";
              e.currentTarget.style.color = "rgba(255,255,255,.7)";
            }}
          >
            <Share2 size={isMobile ? 14 : 18} />
          </button>
        </div>
      </div>
    </TiltCard>
  );
}

// ── Video Card ────────────────────────────────────────
function VideoCard({ item, collection: col }) {
  const isMobile = useMobile();
  const [playing, setPlaying] = useState(false);

  const ytRegex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/;
  const ytMatch = String(item.url || item.videoUrl || item.youtubeUrl || item.embedUrl || "").match(ytRegex);
  const videoId = ytMatch ? ytMatch[1] : null;

  const handlePlay = (e) => {
    if (e) e.stopPropagation();
    setPlaying(true);
    if (item.id && !item.id.startsWith("f") && !item.id.startsWith("u")) {
      incrementViews(col, item.id);
    }
  };

  return (
    <TiltCard
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div
        style={{
          flexShrink: 0,
          position: "relative",
          aspectRatio: "16/9",
          background: "rgba(255,255,255,.03)",
          overflow: "hidden",
        }}
      >
        {!videoId ? (
          <div style={{ width:"100%", height:"100%", display:"grid", placeItems:"center", background:"#161820" }}>
            <p style={{ color:"rgba(255,255,255,.5)", fontSize:13 }}>Video not available</p>
          </div>
        ) : playing ? (
          <iframe 
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} 
            title={item.title || "Video"} 
            width="100%" height="100%"
            style={{ display:"block", border:"none", position:"absolute", inset:0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen 
          />
        ) : (
          <div onClick={handlePlay} style={{ cursor:"pointer", width:"100%", height:"100%", position:"absolute", inset:0 }}>
            <img 
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
              alt={item.title || "Video"} 
              style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} 
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            {/* YouTube-style play button */}
            <div style={{ position:"absolute", inset:0, display:"grid", placeItems:"center", background:"rgba(0,0,0,.15)" }}>
              <div style={{ width:52, height:52, borderRadius:"50%", background:"rgba(255,0,0,.9)", display:"grid", placeItems:"center", boxShadow:"0 4px 20px rgba(0,0,0,.5)", transition:"transform .15s ease" }}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.12)"}
                onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                <div style={{ marginLeft:4, borderLeft:"18px solid #fff", borderTop:"11px solid transparent", borderBottom:"11px solid transparent" }} />
              </div>
            </div>
          </div>
        )}
        
        {!playing && (
          <div
            style={{
              position: "absolute",
              top: isMobile ? 8 : 10,
              left: isMobile ? 8 : 10,
              padding: isMobile ? "3px 8px" : "4px 10px",
              borderRadius: 999,
              fontSize: isMobile ? 9 : 10,
              fontWeight: 800,
              ...(item.platform === "youtube" ? BS.red : BS.purple),
              pointerEvents: "none",
            }}
          >
            {item.platform === "youtube" ? "▶ YouTube" : "♪ TikTok"}
          </div>
        )}
        {!playing && item.duration && (
          <div
            style={{
              position: "absolute",
              bottom: isMobile ? 8 : 10,
              right: isMobile ? 8 : 10,
              padding: isMobile ? "3px 6px" : "4px 8px",
              borderRadius: isMobile ? 6 : 8,
              fontSize: isMobile ? 9 : 10,
              fontWeight: 700,
              background: "rgba(0,0,0,.7)",
              color: "#fff",
              pointerEvents: "none",
            }}
          >
            {item.duration}
          </div>
        )}
      </div>
      <div
        style={{
          padding: isMobile ? 12 : 16,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: isMobile ? 8 : 10,
            alignItems: "center",
            marginBottom: isMobile ? 8 : 12,
          }}
        >
          <div
            style={{
              width: isMobile ? 24 : 32,
              height: isMobile ? 24 : 32,
              borderRadius: "50%",
              background: "rgba(255,255,255,.1)",
              display: "grid",
              placeItems: "center",
              fontSize: isMobile ? 11 : 14,
            }}
          >
            {typeof item.channelImg === "string" && item.channelImg.length < 5
              ? item.channelImg
              : "🎙️"}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: isMobile ? 11 : 13 }}>{item.channel}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,.4)" }}>
              👁 {fmtViews(item.views)} views
            </div>
          </div>
        </div>
        <h3
          style={{
            fontFamily: "'Bricolage Grotesque',sans-serif",
            fontSize: isMobile ? 14 : 16,
            margin: "0 0 12px",
            letterSpacing: "-.02em",
            lineHeight: 1.3,
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.title}
        </h3>
        <div style={{ display: "flex", gap: 6 }}>
          <GoldBtn
            onClick={handlePlay}
            style={{
              fontSize: isMobile ? 11 : 12,
              padding: isMobile ? "7px 12px" : "8px 14px",
              flex: 1,
              justifyContent: "center",
            }}
          >
            ▶ Tazama Sasa
          </GoldBtn>
          <button
            onClick={() =>
              window.open(
                `https://wa.me/8619715852043?text=Habari%20STEA,%20nimeona%20video%20hii:%20${encodeURIComponent(item.title)}`,
                "_blank",
              )
            }
            style={{
              width: isMobile ? 34 : 38,
              height: isMobile ? 34 : 38,
              borderRadius: 10,
              border: "1px solid rgba(37,211,102,.3)",
              background: "rgba(37,211,102,.1)",
              color: "#25d366",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <MessageCircle size={isMobile ? 14 : 18} />
          </button>
        </div>
      </div>
    </TiltCard>
  );
}

// ════════════════════════════════════════════════════
// AUTH MODAL
// ════════════════════════════════════════════════════
function AuthModal({ onClose, onUser }) {
  const [tog, setTog] = useState(false);
  const [mode, setMode] = useState("login");
  const [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [pw, setPw] = useState(""),
    [pw2, setPw2] = useState("");
  const [err, setErr] = useState(""), [loading, setLoading] = useState(false);

  const switchTo = (m) => {
    if (m === "register") { setTog(true); setTimeout(() => setMode("register"), 80); }
    else if (m === "login") { setTog(false); setTimeout(() => setMode("login"), 80); }
    else setMode("forgot");
    setErr("");
  };

  const saveUser = async (user, displayName, provider) => {
    const db = getFirebaseDb();
    if (!db) return;
    try {
      const r = doc(db, "users", user.uid);
      const s = await getDoc(r);
      let data = s.exists() ? s.data() : {};
      let role = isAdminEmail(user.email) ? "admin" : "user";
      if (s.exists() && data.role) {
        if (data.role !== "user" || !isAdminEmail(user.email)) {
          role = data.role;
        }
      }

      if (!s.exists()) {
        data = { uid: user.uid, name: displayName || user.displayName || "", email: user.email, role, provider, createdAt: serverTimestamp() };
        await setDoc(r, data);
      }
      
      onUser({
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.displayName,
        photoURL: user.photoURL,
        ...data,
        role: role
      });
    } catch (err) {
      console.error("Error saving user:", err);
      onUser({
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.displayName,
        photoURL: user.photoURL,
        role: isAdminEmail(user.email) ? "admin" : "user"
      });
    }
  };

  const isPreview = window.location.hostname.includes("run.app") || window.location.hostname.includes("webcontainer.io");

  const doGoogle = async () => {
    const auth = getFirebaseAuth();
    if (!auth) { setErr("⚠️ Firebase haijasanidiwa."); return; }
    setLoading(true); setErr("");
    try {

      const res = await signInWithPopup(auth, new GoogleAuthProvider());
      await saveUser(res.user, res.user.displayName, "google");
      onClose();
    } catch (e) {
      console.error("Google Auth error:", e);
      let msg = e.message.replace("Firebase:", "").trim();
      
      if (msg.includes("auth/popup-blocked")) {
        msg = "⚠️ Popup imezuiwa na browser yako. Tafadhali ruhusu popups kwa site hii.";
      } else if (msg.includes("auth/unauthorized-domain")) {
        msg = "⚠️ Domain hii haijaruhusiwa kwenye Firebase Console. Ongeza domain hii kwenye 'Authorized Domains'.";
      } else if (msg.includes("auth/operation-not-allowed")) {
        msg = "⚠️ Sign-in provider hii haijaruhusiwa. Tafadhali washa Google Login kwenye Firebase Console.";
      } else if (msg.includes("auth/network-request-failed")) {
        msg = isPreview 
          ? "⚠️ Google Login inaweza isifanye kazi vizuri kwenye Preview. Tafadhali tumia Email/Password au fungua app kwenye tab mpya."
          : "⚠️ Tatizo la mtandao. Tafadhali hakikisha umeunganishwa na mtandao na ujaribu tena.";
      } else if (msg.includes("auth/cancelled-popup-request")) {
        msg = "⚠️ Umeahirisha login. Jaribu tena ukihitaji kuingia.";
      } else {
        msg = `⚠️ Tatizo la Login: ${msg}`;
      }
      setErr(msg);
    } finally { setLoading(false); }
  };

  const doEmail = async () => {
    const auth = getFirebaseAuth();
    if (!auth) { setErr("⚠️ Firebase haijasanidiwa."); return; }
    if (!email || !pw) { setErr("Jaza email na password."); return; }
    setLoading(true); setErr("");
    const normalizedEmail = normalizeEmail(email);
    try {

      if (mode === "login") {
        const res = await signInWithEmailAndPassword(auth, normalizedEmail, pw);
        await saveUser(res.user, res.user.displayName || name, "email");
      } else {
        if (pw !== pw2) { setErr("Passwords hazifanani."); setLoading(false); return; }
        if (pw.length < 6) { setErr("Password lazima iwe herufi 6+."); setLoading(false); return; }
        const res = await createUserWithEmailAndPassword(auth, normalizedEmail, pw);
        await saveUser(res.user, name, "email");
      }
      onClose();
    } catch (e) {
      console.error("Email Auth error:", e);
      let msg = e.message.replace("Firebase:", "").trim();
      if (msg.includes("auth/user-not-found")) msg = "⚠️ Akaunti hii haipo. Tafadhali jisajili.";
      else if (msg.includes("auth/operation-not-allowed")) msg = "⚠️ Barua pepe na nenosiri hazijawashwa kwenye Firebase. Tafadhali nenda Firebase Console > Authentication > Sign-in method na uwashe (Enable) Email/Password.";
      else if (msg.includes("auth/wrong-password")) msg = "⚠️ Password si sahihi.";
      else if (msg.includes("auth/invalid-credential")) msg = "⚠️ Email au Password si sahihi.";
      else if (msg.includes("auth/email-already-in-use")) msg = "⚠️ Email hii tayari inatumika.";
      else if (msg.includes("auth/invalid-email")) msg = "⚠️ Email si sahihi.";
      else if (msg.includes("auth/network-request-failed")) {
        msg = isPreview 
          ? "⚠️ Network error kwenye Preview. Hii inaweza kusababishwa na browser blocking. Jaribu kufungua app kwenye tab mpya au tumia incognito."
          : "⚠️ Tatizo la mtandao. Tafadhali hakikisha umeunganishwa na mtandao.";
      } else {
        msg = `⚠️ Tatizo: ${msg}`;
      }
      setErr(msg);
    } finally { setLoading(false); }
  };

  const doForgot = async () => {
    const auth = getFirebaseAuth();
    if (!auth) { setErr("⚠️ Firebase haijasanidiwa."); return; }
    if (!email) { setErr("Weka email yako kwanza."); return; }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setErr("✅ Reset link imetumwa!");
    } catch (e) { setErr(e.message.replace("Firebase:", "").trim()); }
    finally { setLoading(false); }
  };

  // Shared input style
  const inputStyle = {
    width: "100%", height: 54, borderRadius: 16,
    border: "1px solid rgba(255,255,255,.1)",
    background: "rgba(255,255,255,.05)",
    color: "#fff", padding: "0 18px", outline: "none",
    fontFamily: "inherit", fontSize: 14, boxSizing: "border-box",
  };

  return (
    <Portal>
      {/* ── Overlay ── */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 9000,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px",
        }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Dark backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{
            position: "absolute", inset: 0,
            background: "rgba(4,5,9,0.92)",
            backdropFilter: "blur(16px)",
          }}
        />

        {/* ── Modal card ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          style={{
            position: "relative",
            width: "100%", maxWidth: 860,
            background: "#0e101a",
            borderRadius: 32,
            border: "1px solid rgba(255,255,255,.08)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.85)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
            minHeight: 540,
            maxHeight: "calc(100vh - 32px)",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 20, right: 20, zIndex: 50,
              width: 44, height: 44, borderRadius: 14,
              border: "1px solid rgba(255,255,255,.07)",
              background: "rgba(255,255,255,.05)",
              color: "rgba(255,255,255,.4)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.1)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.05)"; e.currentTarget.style.color = "rgba(255,255,255,.4)"; }}
          >
            <X size={20} />
          </button>

          {/* ── Left: Form ── */}
          <div style={{
            flex: 1, padding: "clamp(28px,5vw,52px)",
            display: "flex", flexDirection: "column", justifyContent: "center",
            overflowY: "auto",
          }}>
            {/* Login / Register tabs */}
            {mode !== "forgot" && (
              <div style={{
                display: "inline-flex", padding: 5,
                borderRadius: 999, background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(255,255,255,.08)",
                marginBottom: 28, alignSelf: "flex-start",
              }}>
                {["login", "register"].map((m) => (
                  <button key={m} onClick={() => switchTo(m)}
                    style={{
                      padding: "9px 22px", borderRadius: 999, border: "none",
                      fontSize: 11, fontWeight: 900, textTransform: "uppercase",
                      letterSpacing: ".1em", cursor: "pointer", transition: "all .2s",
                      background: mode === m ? G : "transparent",
                      color: mode === m ? "#111" : "rgba(255,255,255,.4)",
                      boxShadow: mode === m ? "0 4px 14px rgba(245,166,35,.3)" : "none",
                    }}
                  >
                    {m === "login" ? "Ingia" : "Jisajili"}
                  </button>
                ))}
              </div>
            )}

            {/* Heading */}
            <div style={{ marginBottom: 24 }}>
              <h2 style={{
                fontFamily: "'Bricolage Grotesque',sans-serif",
                fontSize: "clamp(28px,4vw,38px)", fontWeight: 900,
                letterSpacing: "-.04em", color: "#fff", margin: "0 0 8px",
              }}>
                {mode === "login" ? "Karibu Tena" : mode === "register" ? "Jisajili Sasa" : "Reset Password"}
              </h2>
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,.4)", margin: 0 }}>
                {mode === "login" ? "Ingia kwenye akaunti yako ya STEA"
                  : mode === "register" ? "Anza safari yako ya kidijitali nasi"
                  : "Weka email yako kupata link ya reset"}
              </p>
              {isPreview && mode === "login" && (
                <p style={{ fontSize: 11, color: G, marginTop: 12, fontWeight: 700 }}>
                  💡 Google Login inaweza isifanye kazi kwenye Preview. Ikishindikana, fungua app kwenye tab mpya.
                </p>
              )}
            </div>

            {/* Error message */}
            {err && (
              <motion.div
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                style={{
                  marginBottom: 20, padding: "12px 16px", borderRadius: 14,
                  border: `1px solid ${err.startsWith("✅") ? "rgba(34,197,94,.25)" : "rgba(239,68,68,.25)"}`,
                  background: err.startsWith("✅") ? "rgba(34,197,94,.08)" : "rgba(239,68,68,.08)",
                  color: err.startsWith("✅") ? "#4ade80" : "#fca5a5",
                  fontSize: 12.5, fontWeight: 700, lineHeight: 1.5,
                  display: "flex", alignItems: "flex-start", gap: 10,
                }}
              >
                {err.startsWith("✅")
                  ? <CheckCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                  : <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />}
                {err}
              </motion.div>
            )}

            {/* Form fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Google button (login only) */}
              {mode === "login" && (
                <button onClick={doGoogle} disabled={loading}
                  style={{
                    width: "100%", height: 54, borderRadius: 16,
                    border: "1px solid rgba(255,255,255,.1)",
                    background: "rgba(255,255,255,.05)",
                    color: "#fff", fontSize: 14, fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                    transition: "all .2s", marginBottom: 4,
                    opacity: loading ? .6 : 1,
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "rgba(255,255,255,.09)"; }}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.05)"}
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    style={{ width: 20, height: 20 }} alt="Google" />
                  Endelea kwa Google
                </button>
              )}

              {mode === "register" && (
                <input type="text" placeholder="Jina Kamili" value={name}
                  onChange={(e) => setName(e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = G}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.1)"} />
              )}

              <input type="email" placeholder="Email address" value={email}
                onChange={(e) => setEmail(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = G}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.1)"} />

              {mode !== "forgot" && (
                <input type="password" placeholder="Password" value={pw}
                  onChange={(e) => setPw(e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = G}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.1)"} />
              )}

              {mode === "register" && (
                <input type="password" placeholder="Thibitisha Password" value={pw2}
                  onChange={(e) => setPw2(e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = G}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.1)"} />
              )}

              {/* Submit button */}
              <button
                onClick={mode === "forgot" ? doForgot : doEmail}
                disabled={loading}
                style={{
                  width: "100%", height: 54, borderRadius: 16, border: "none",
                  background: loading ? "rgba(245,166,35,.6)" : `linear-gradient(135deg,${G},${G2})`,
                  color: "#111", fontSize: 14, fontWeight: 900,
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 8px 20px rgba(245,166,35,.3)",
                  marginTop: 4, transition: "all .2s",
                }}
              >
                {loading ? "Tafadhali subiri..." : mode === "login" ? "Ingia Sasa →"
                  : mode === "register" ? "Fungua Account →" : "Tuma Reset Link"}
              </button>

              {/* Footer link */}
              <div style={{ textAlign: "center", paddingTop: 8 }}>
                {mode === "login" ? (
                  <button onClick={() => switchTo("forgot")}
                    style={{ background: "none", border: "none", color: "rgba(255,255,255,.25)",
                      fontSize: 10, fontWeight: 900, textTransform: "uppercase",
                      letterSpacing: ".1em", cursor: "pointer" }}>
                    Umesahau Password?
                  </button>
                ) : mode === "forgot" ? (
                  <button onClick={() => switchTo("login")}
                    style={{ background: "none", border: "none", color: "rgba(255,255,255,.4)",
                      fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    ← Rudi kwenye Login
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {/* ── Right: Brand panel (desktop only) ── */}
          <div style={{
            width: 340, flexShrink: 0,
            position: "relative", overflow: "hidden",
            background: "linear-gradient(135deg,#0d1019,#090b12)",
            padding: 44,
            display: "flex", flexDirection: "column", justifyContent: "center",
          }}
            className="auth-brand-panel"
          >
            {/* Animated gold slab */}
            <motion.div
              animate={{ rotate: tog ? 0 : 10, skewY: tog ? 0 : 38 }}
              transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
              style={{
                position: "absolute", right: "-5%", top: "-8%",
                height: "130%", width: "115%",
                background: `linear-gradient(135deg,${G},#E09612)`,
                transformOrigin: "bottom right",
              }}
            />
            <motion.div
              animate={{ rotate: tog ? -10 : 0, skewY: tog ? -38 : 0 }}
              transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
              style={{
                position: "absolute", left: "22%", top: "98%",
                height: "120%", width: "110%",
                background: "#0c0e16",
                borderTop: `4px solid ${G}`,
                transformOrigin: "bottom left",
              }}
            />
            <div style={{ position: "relative", zIndex: 10, color: "#111" }}>
              <h3 style={{
                fontFamily: "'Bricolage Grotesque',sans-serif",
                fontSize: 52, fontWeight: 900, lineHeight: 0.88,
                letterSpacing: "-.06em", marginBottom: 20,
                whiteSpace: "pre-line",
              }}>
                {tog ? "KARIBU\nSTEA" : "KARIBU\nTENA"}
              </h3>
              <p style={{ maxWidth: 260, fontSize: 13.5, fontWeight: 500, lineHeight: 1.6, marginBottom: 20, opacity: .8 }}>
                {tog
                  ? "Anza safari yako ya tech. Platform ya kwanza ya tech kwa Watanzania."
                  : "Login uendelee kujifunza na kupata tools bora za kidijitali."}
              </p>
              <div style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".12em", opacity: .4 }}>
                ✉️ swahilitecheliteacademy@gmail.com
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hide brand panel on mobile */}
      <style>{`.auth-brand-panel { display: flex; } @media(max-width:640px){ .auth-brand-panel{ display:none!important; } }`}</style>
    </Portal>
  );
}

function ProfileModal({ user, onClose, onUpdate }) {
  const [name, setName] = useState(user.displayName || "");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general"); // general, security, activity

  const { docs: mySubscriptions, loading: subsLoading } = useCollection("subscriptions");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), { displayName: name });
      onUpdate({ ...user, displayName: name });
      // Show success toast or something if available
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "general", label: "Taarifa", icon: <User size={18} /> },
    { id: "subscriptions", label: "Subscriptions", icon: <Award size={18} /> },
    { id: "security", label: "Usalama", icon: <ShieldCheck size={18} /> },
    { id: "activity", label: "Historia", icon: <Clock size={18} /> },
  ];

  return (
    <Portal>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 5000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="relative w-full max-w-[850px] aspect-[16/10] bg-[#05060a] rounded-[48px] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex"
        >
          {/* Sidebar Navigation */}
          <div className="w-[200px] sm:w-[260px] border-r border-white/5 flex flex-col p-8 hidden sm:flex">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 rounded-2xl bg-[#F5A623] flex items-center justify-center font-black text-black text-xl">
                S
              </div>
              <div>
                <h1 className="text-white font-black text-xs uppercase tracking-widest leading-none">STEA</h1>
                <p className="text-white/30 text-[9px] font-bold uppercase tracking-wider mt-1">Profile Hub</p>
              </div>
            </div>

            <nav className="space-y-2 flex-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-5 h-14 rounded-2xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-white/5 text-[#F5A623] shadow-lg border border-white/5"
                      : "text-white/40 hover:text-white hover:bg-white/[0.02]"
                  }`}
                >
                  <span className={activeTab === tab.id ? "text-[#F5A623]" : "text-white/20"}>
                    {tab.icon}
                  </span>
                  <span className="text-sm font-bold tracking-tight">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="active-nav"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-[#F5A623] shadow-[0_0_10px_#F5A623]"
                    />
                  )}
                </button>
              ))}
            </nav>

            <div className="pt-8 border-t border-white/5 space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-[#3b82f6]/20 flex items-center justify-center">
                  <Star size={14} className="text-[#3b82f6]" />
                </div>
                <div>
                  <p className="text-white font-bold text-[10px]">Premium Member</p>
                  <p className="text-white/20 text-[8px] uppercase tracking-widest font-black">Active</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col relative">
            {/* Header / Mobile Controls */}
            <div className="flex items-center justify-between p-6 sm:p-10 pb-4">
              <div className="sm:hidden">
                <h2 className="text-white font-black text-xl tracking-tighter">Profile</h2>
              </div>
              <div className="hidden sm:block">
                <h2 className="text-white/30 text-[10px] uppercase font-black tracking-[0.3em] mb-1">
                  Settings / {activeTab}
                </h2>
                <h3 className="text-white text-2xl font-black tracking-tighter">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 pt-2 scrollbar-hide">
              <AnimatePresence mode="wait">
                {activeTab === "general" && (
                  <motion.div
                    key="general"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    {/* Hero Profile Section */}
                    <div className="relative group p-1 bg-gradient-to-br from-white/10 to-transparent rounded-[32px]">
                      <div className="bg-[#0e101a] rounded-[30px] p-8 flex items-center gap-8 border border-white/5">
                        <ProfilePictureUpload
                          userId={user.uid}
                          currentPhotoURL={user.photoURL}
                          onUpdate={(url) => onUpdate({ ...user, photoURL: url })}
                        />
                        <div className="space-y-2">
                          <h4 className="text-white text-xl font-black tracking-tight leading-none">
                            {user.displayName || "STEA Member"}
                          </h4>
                          <p className="text-white/40 text-sm font-medium">{user.email}</p>
                          <div className="flex gap-2 pt-2">
                            <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[9px] font-black text-white uppercase tracking-widest">
                              ID: {user.uid.slice(0, 8)}
                            </span>
                            <span className="px-3 py-1 bg-[#F5A623]/10 border border-[#F5A623]/10 rounded-full text-[9px] font-black text-[#F5A623] uppercase tracking-widest">
                              Tanzania 🇹🇿
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Edit Form */}
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30 ml-2">
                          Jina Kamili
                        </label>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Weka jina lako..."
                          className="w-full h-16 px-6 bg-white/[0.02] border border-white/5 rounded-2xl text-white font-bold placeholder:text-white/5 outline-none focus:border-[#F5A623]/30 focus:bg-white/[0.04] transition-all duration-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30 ml-2">
                          Email Address
                        </label>
                        <div className="w-full h-16 px-6 bg-white/[0.01] border border-white/5 rounded-2xl text-white/30 flex items-center font-bold text-sm cursor-not-allowed">
                          {user.email}
                          <ShieldCheck size={16} className="ml-auto text-white/10" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "subscriptions" && (
                  <motion.div
                    key="subscriptions"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-white text-lg font-black">My Subscriptions</h3>
                    {subsLoading ? (
                      <div className="text-white/40 text-sm">Loading subscriptions...</div>
                    ) : (
                      <div className="space-y-4">
                        {(mySubscriptions || []).filter(s => s.userId === user.uid || s.customerEmail === user.email).length > 0 ? (
                          (mySubscriptions || []).filter(s => s.userId === user.uid || s.customerEmail === user.email).map((sub, i) => {
                            const nowTime = new Date().getTime();
                            const endTime = sub.endDate?.toMillis ? sub.endDate.toMillis() : sub.endDate;
                            const isExpired = endTime < nowTime;
                            return (
                              <div key={sub.id || i} className={`p-6 rounded-2xl border ${isExpired ? 'border-red-500/20 bg-red-500/5' : 'border-[#F5A623]/20 bg-[#F5A623]/5'}`}>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="text-white font-bold">{sub.planName}</h4>
                                    <p className="text-white/50 text-xs mt-1">Status: <span className={isExpired ? 'text-red-400' : 'text-green-400'}>{isExpired ? 'Expired' : 'Active'}</span></p>
                                    <p className="text-white/30 text-[10px] mt-2">Started: {sub.startDate?.toDate ? sub.startDate.toDate().toLocaleDateString() : new Date(sub.startDate).toLocaleDateString()}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-[#F5A623] text-sm font-bold">Ends</div>
                                    <div className="text-white/70 text-sm">{new Date(endTime).toLocaleDateString()}</div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-8 text-center border border-white/5 bg-white/[0.02] rounded-2xl">
                            <Award size={32} className="mx-auto text-white/20 mb-3" />
                            <p className="text-white/50 text-sm">You don't have any active subscriptions yet.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "security" && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-4">
                        <div className="w-10 h-10 rounded-2xl bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6]">
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-sm">Account Verification</h4>
                          <p className="text-white/30 text-[10px] leading-relaxed mt-1">Akaunti yako imethibitishwa na STEA Trust system.</p>
                        </div>
                        <div className="pt-2">
                          <span className="px-2 py-1 bg-[#22c55e]/10 text-[#22c55e] text-[8px] font-black uppercase tracking-widest rounded-lg">Verified</span>
                        </div>
                      </div>
                      <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-4">
                        <div className="w-10 h-10 rounded-2xl bg-[#F5A623]/10 flex items-center justify-center text-[#F5A623]">
                          <User size={20} />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-sm">Role & Permissions</h4>
                          <p className="text-white/30 text-[10px] leading-relaxed mt-1">Hivi ndivyo unavyoweza kufanya kwenye mfumo.</p>
                        </div>
                        <div className="pt-2">
                          <span className="px-2 py-1 bg-white/5 text-white/60 text-[8px] font-black uppercase tracking-widest rounded-lg">{user.role || 'User'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6]">
                          <ShieldCheck size={24} />
                        </div>
                        <div>
                          <h4 className="text-white font-black">Two-Factor Authentication</h4>
                          <p className="text-white/40 text-xs">Linda akaunti yako na safu ya ziada ya usalama.</p>
                        </div>
                        <button className="ml-auto text-[#F5A623] text-xs font-black uppercase tracking-widest hover:text-[#FFD17C] transition-colors">Enable</button>
                      </div>
                      <div className="h-px bg-white/5" />
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
                          <Zap size={24} />
                        </div>
                        <div>
                          <h4 className="text-white font-black">Password Management</h4>
                          <p className="text-white/40 text-xs">Badilisha neno lako la siri mara kwa mara.</p>
                        </div>
                        <button 
                          onClick={() => {
                            const auth = getFirebaseAuth();
                            if (auth && user.email) sendPasswordResetEmail(auth, user.email);
                            // Show toast or alert
                          }}
                          className="ml-auto text-white/40 text-xs font-black uppercase tracking-widest hover:text-white transition-colors">Reset</button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "activity" && (
                  <motion.div
                    key="activity"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white/30 text-[10px] uppercase font-black tracking-widest">Recent Activity</h4>
                      <button className="text-[10px] text-[#F5A623] font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">Clear All</button>
                    </div>
                    {[
                      { icon: <Clock size={16} />, title: "Uliingia kwenye mfumo", time: "Hivi sasa", sub: "Chrome/Mac • Tanzania" },
                      { icon: <Star size={16} />, title: "Ulihifadhi kozi mpya", time: "Masaa 2 yaliyopita", sub: "Python for Beginners" },
                      { icon: <MessageCircle size={16} />, title: "Ulijibu ujumbe STEA Chat", time: "Jana", sub: "Assistant Lab" },
                    ].map((act, i) => (
                      <div key={i} className="group p-5 bg-white/[0.02] border border-white/5 rounded-[24px] flex items-center gap-4 hover:bg-white/[0.04] transition-all duration-300">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-[#F5A623]/10 group-hover:text-[#F5A623] transition-all">
                          {act.icon}
                        </div>
                        <div>
                          <p className="text-white text-sm font-bold">{act.title}</p>
                          <p className="text-white/20 text-[10px] uppercase font-black tracking-widest mt-0.5">{act.time} • {act.sub}</p>
                        </div>
                        <ChevronRight className="ml-auto text-white/5 group-hover:text-white/20 transition-all" size={16} />
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="p-8 sm:p-10 pt-4 flex items-center justify-between border-t border-white/5 bg-[#05060a]/80 backdrop-blur-md">
              <p className="text-white/20 text-[9px] font-black uppercase tracking-widest leading-none hidden sm:block">
                Last updated<br />Today at 10:24 AM
              </p>
              <div className="flex gap-4 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none h-14 px-8 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all border border-white/5"
                >
                  Ghairi
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || activeTab !== 'general'}
                  className="flex-[2] sm:flex-none h-14 px-10 rounded-2xl bg-[#F5A623] text-[#111] font-black hover:bg-[#FFD17C] transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
                >
                  {saving ? "..." : "Hifadhi Mabadiliko"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Portal>
  );
}

const TOOL_CURRENCIES = ["TZS", "USD", "CNY"];

function parseToolMoney(value) {
  if (value === null || value === undefined || value === "") return 0;
  const parsed = Number(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatToolMoney(currency, value) {
  const n = parseToolMoney(value);
  if (!n) return currency === "CNY" ? "CNY ¥-" : currency === "USD" ? "USD -" : "TZS -";
  if (currency === "USD") return `USD $${n.toLocaleString()}`;
  if (currency === "CNY") return `CNY ¥${n.toLocaleString()}`;
  return `TZS ${n.toLocaleString()}`;
}

function getToolCurrencyPrices(tool) {
  const plans = Array.isArray(tool?.plans) ? tool.plans : [];
  const firstActive = plans.find(p => p?.isPopular || p?.isDefault || p?.enabled !== false || p?.isActive !== false) || plans[0] || {};
  const prices = firstActive.prices || {};
  return {
    TZS: parseToolMoney(prices.TZS ?? prices.tzs ?? firstActive.priceTZS ?? firstActive.price ?? tool?.salePriceTZS ?? tool?.salePrice ?? tool?.newPrice ?? tool?.price),
    USD: parseToolMoney(prices.USD ?? prices.usd ?? firstActive.priceUSD ?? tool?.salePriceUSD),
    CNY: parseToolMoney(prices.CNY ?? prices.cny ?? firstActive.priceCNY ?? tool?.salePriceCNY),
  };
}

function ToolCard({ d, i, goPage, onBuyNow }) {
  const isMobile = useMobile();
  const navigate = useNavigate();

  // Phase 11: New system uses slug navigation, old uses modal/goPage
  const isNewTool = (d._collection === "digital_tools" || d._collection === "digitalTools" || d.sector === "digital_tools" || Array.isArray(d.plans)) && d.slug;
  const currencyPrices = getToolCurrencyPrices(d);
  const displayPrice = currencyPrices.TZS || d.salePrice || d.newPrice || d.price || 0;
  const oldPrice     = d.regularPrice || d.oldPrice || 0;
  const discount     = oldPrice > displayPrice ? Math.round((1 - displayPrice/oldPrice)*100) : 0;

  const handleClick = () => {
    if (isNewTool) {
      navigate(`/digital-tools/${d.slug}`, { state: { tool: d } });
    } else if (onBuyNow) {
      onBuyNow(d);
    } else {
      goPage && goPage("tool-detail", d);
    }
  };

  const getCTA = () => {
    if (isNewTool) return { text: "Choose Plan", url: null };
    if (d.ctaText) {
      let text = d.ctaText;
      if (text.startsWith("Get ")) text = text.replace("Get ", "Pata ");
      return { text, url: d.directLink || d.affiliateLink || d.whatsappLink };
    }
    if (d.dealType === "affiliate_offer") return { text: "Nunua Sasa", url: d.affiliateLink };
    if (d.dealType === "lead_offer")      return { text: "Ulizia WhatsApp", url: d.whatsappLink };
    if (d.dealType === "promo_code")      return { text: "Tumia Promo Code", url: d.directLink };
    return { text: "Pata Tool", url: d.directLink };
  };

  const cta = getCTA();

  return (
    <TiltCard key={d.id || i} onClick={handleClick} style={{ cursor: "pointer", width: "100%", maxWidth: "100%", height: "100%" }}>
      <div style={{ display:"flex", flexDirection:"column", width:"100%", height:"100%" }}>
        <div style={{ width:"100%", height:isMobile ? 118 : 180, flexShrink:0, position:"relative", overflow:"hidden" }}>
          {discount > 0 && <div style={{ position:"absolute",top:10,left:10,zIndex:2,background:"#ef4444",color:"#fff",fontSize:10,fontWeight:900,padding:"3px 8px",borderRadius:6 }}>-{discount}%</div>}
          <Thumb
            bg={d.bg || "linear-gradient(135deg,#00c4cc,#7d2ae8)"}
            name={d.title || d.name}
            imageUrl={d.image || d.imageUrl || d.thumbnailUrl}
            fit="cover"
          />
        </div>
        <div style={{ padding:isMobile ? "12px" : "16px", display:"flex", flexDirection:"column", flex:1, width:"100%", minWidth:0 }}>
          <h3
            style={{
              fontFamily: "'Bricolage Grotesque',sans-serif",
              fontSize: isMobile ? 15 : 19,
              margin: "0 0 4px",
              letterSpacing: "-.03em",
              lineHeight: 1.2,
            }}
          >
            {d.title || d.name}
          </h3>
          <div style={{ color: "rgba(255,255,255,.42)", fontSize: isMobile ? 10 : 12, fontWeight: 800, marginBottom: 6 }}>
            {(d.title || d.name) && d.category ? `${d.title || d.name} · ${d.category}` : d.category || "Digital Tool"}
          </div>
          <p
            style={{
              color: "rgba(255,255,255,.68)",
              fontSize: isMobile ? 12 : 14,
              lineHeight: 1.5,
              margin: "4px 0",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {d.shortDescription || d.description}
          </p>
          
          {(d.joinedCount || d.membersJoined) && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, fontSize: isMobile ? 10 : 12, color: "rgba(255,255,255,.5)" }}>
              <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: "#00c4cc", animation: "pulse 2s infinite" }}></span>
              {d.liveJoinedText || `${d.membersJoined || d.joinedCount}+ members joined`}
            </div>
          )}

          <div style={{ marginTop:"auto", paddingTop:isMobile ? 6 : 8 }}>
            {/* Price row — works for both old deals format and new digital_tools format */}
            {isNewTool ? (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,minmax(0,1fr))", gap:isMobile ? 5 : 6, marginBottom:isMobile ? 8 : 10 }}>
                {TOOL_CURRENCIES.map(currency => (
                  <div key={currency} style={{ border:"1px solid rgba(255,255,255,.07)", background:"rgba(255,255,255,.035)", borderRadius:10, padding:isMobile?"6px 6px":"7px 8px", minWidth:0 }}>
                    <div style={{ color:"rgba(255,255,255,.35)", fontSize:9, fontWeight:900 }}>{currency}</div>
                    <div style={{ color:currency==="TZS"?G:"rgba(255,255,255,.82)", fontSize:isMobile?10:12, fontWeight:900, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                      {formatToolMoney(currency, currencyPrices[currency])}
                    </div>
                  </div>
                ))}
              </div>
            ) : (displayPrice > 0) && (
              <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap", marginBottom:8 }}>
                {(oldPrice > displayPrice) && (
                  <span style={{ color:"rgba(255,255,255,.42)", textDecoration:"line-through", fontSize:isMobile?11:14, fontWeight:700 }}>
                    {d.oldPrice || `TZS ${Number(oldPrice).toLocaleString()}`}
                  </span>
                )}
                <span style={{ color:G, fontSize:isMobile?16:20, fontWeight:900 }}>
                  {d.newPrice || `TZS ${Number(displayPrice).toLocaleString()}`}
                </span>
                {d.savingsText && (
                  <span style={{ fontSize:isMobile?9:12, color:"#00c4cc", fontWeight:700, background:"rgba(0,196,204,.1)", padding:"2px 5px", borderRadius:6 }}>
                    {d.savingsText}
                  </span>
                )}
              </div>
            )}
            {d.promoCode && (
              <div
                style={{
                  marginBottom: 8,
                  padding: isMobile ? "6px 10px" : "12px 14px",
                  borderRadius: 10,
                  border: "1px dashed rgba(245,166,35,.3)",
                  background: "rgba(245,166,35,.07)",
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,.38)",
                    marginBottom: 2,
                  }}
                >
                  🎫 Promo Code
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <strong
                    style={{
                      fontSize: isMobile ? 14 : 18,
                      fontWeight: 900,
                      color: G,
                      letterSpacing: ".06em",
                    }}
                  >
                    {d.promoCode}
                  </strong>
                  <CopyBtn code={d.promoCode} />
                </div>
              </div>
            )}
            <div style={{ width: "100%", marginTop: isMobile ? 2 : 4 }}>
              <GoldBtn
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: isMobile ? "7px 12px" : "10px 18px",
                  fontSize: isMobile ? 11 : 14,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                {cta.text} →
              </GoldBtn>
            </div>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

function DigitalToolsPage({ goPage }) {
  const isMobile = useMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useSettings();

  // Phase 11: load from digital_tools, requested digitalTools, and legacy deals.
  const { docs: digitalToolsDocs, loading: dtLoading } = useCollection("digital_tools", "updatedAt");
  const { docs: digitalToolsCamelDocs, loading: dtCamelLoading } = useCollection("digitalTools", "updatedAt");
  const { docs: dealsDocs, loading: dealsLoading } = useCollection("deals", "createdAt");
  const { docs: plansDocs, loading: plansLoading } = useCollection("subscription_plans", "createdAt");
  const plans = plansDocs || [];

  // Merge without renaming old data. digital_tools remains primary; digitalTools is supported for compatibility.
  const allItems = useMemo(() => {
    const isPublishedTool = (d) => d?.published === true || d?.status === "published" || (!d?.status && d?.active !== false);
    const primaryTools = (digitalToolsDocs || [])
      .filter(isPublishedTool)
      .map(d => ({ ...d, _collection: "digital_tools", sector: d.sector || "digital_tools" }));
    const camelTools = (digitalToolsCamelDocs || [])
      .filter(isPublishedTool)
      .map(d => ({ ...d, _collection: "digitalTools", sector: d.sector || "digital_tools" }));
    const legacyDeals = (dealsDocs || [])
      .filter(d => d.active !== false)
      .map(d => ({ ...d, _collection: "deals" }));

    const merged = [];
    const seen = new Set();
    [...primaryTools, ...camelTools, ...legacyDeals].forEach(item => {
      const key = item.slug || item.id || `${item.title || item.name}-${item._collection}`;
      if (seen.has(key)) return;
      seen.add(key);
      merged.push(item);
    });
    return merged;
  }, [digitalToolsDocs, digitalToolsCamelDocs, dealsDocs]);

  const loading = (dtLoading || dtCamelLoading) && dealsLoading;

  const [searchQ, setSearchQ] = useState(location.state?.q || "");
  const [activeCat, setActiveCat] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [checkoutType, setCheckoutType] = useState("tool");

  const dynamicCats = useMemo(() => {
    const cats = new Set();
    allItems.forEach(d => {
      if (d.category) cats.add(d.category);
      if (Array.isArray(d.tags)) d.tags.forEach(tg => cats.add(tg));
    });
    return ["All", ...Array.from(cats).sort()];
  }, [allItems]);

  const filteredDeals = useMemo(() => {
    return allItems.filter(d => {
      const q = searchQ.toLowerCase();
      const searchable = [d.title, d.name, d.category, d.shortDescription, d.description, ...(Array.isArray(d.tags) ? d.tags : []), d.slug].join(" ").toLowerCase();
      const matchesSearch = !searchQ || searchable.includes(q);
      const matchesCat = activeCat === "All" || d.category === activeCat || (Array.isArray(d.tags) && d.tags.includes(activeCat));
      return matchesSearch && matchesCat;
    });
  }, [allItems, searchQ, activeCat]);

  // Click handler: new system uses slug route, old system uses modal
  const handleItemClick = (item) => {
    const isSubscriptionTool = item.slug && (item._collection === "digital_tools" || item._collection === "digitalTools" || item.sector === "digital_tools" || Array.isArray(item.plans));
    if (isSubscriptionTool) {
      navigate(`/digital-tools/${item.slug}`, { state: { tool: item } });
    } else {
      setSelectedItem(item);
      setCheckoutType("tool");
    }
  };

  return (
    <section style={{ padding: isMobile ? "clamp(80px,14vw,100px) 0 60px" : "100px 0 60px", minHeight:"100vh" }}>
      <SEOHead 
        title={activeCat !== "All" ? `${activeCat} Tools` : "Digital Tools & Subscriptions"}
        description="Pata tools za kidigitali bora zaidi kwa bei nafuu — AI tools, editing tools, premium hardware deals, na subscriptions za kila aina STEA."
      />
      <W>
        <button onClick={() => window.history.length > 1 ? window.history.back() : goPage("home")}
          style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 16px", borderRadius:12,
            background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)",
            color:"rgba(255,255,255,.6)", cursor:"pointer", fontSize:13, fontWeight:700,
            transition:"all .18s", marginBottom:24 }}
          onMouseEnter={e => { e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor="rgba(255,255,255,.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.color="rgba(255,255,255,.6)"; e.currentTarget.style.borderColor="rgba(255,255,255,.1)"; }}>
          ← Back
        </button>

        <div style={{ marginBottom:28 }}>
          <SHead
            title="Digital Tools &"
            hi="Subscriptions"
            copy="Pata tools za kidigitali kwa bei nzuri kupitia STEA — AI tools, editing tools, premium apps, na subscriptions muhimu kwa kazi, content na productivity."
          />
        </div>

        {/* Search & Filter Bar */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ position: "relative", marginBottom: 20 }}>
            <Search size={20} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,.4)" }} />
            <input
              type="text"
              placeholder="Search tools, deals, categories..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              style={{
                width: "100%", height: 50, borderRadius: 12, background: "rgba(255,255,255,.04)", 
                border: "1px solid rgba(255,255,255,.1)", color: "#fff", padding: "0 16px 0 48px", outline: "none", fontSize: 15
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10 }} className="no-scrollbar">
            {dynamicCats.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCat(cat)}
                style={{
                  whiteSpace: "nowrap", padding: "7px 16px", borderRadius: 99, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all .2s",
                  background: activeCat === cat ? G : "rgba(255,255,255,.05)",
                  color: activeCat === cat ? "#111" : "rgba(255,255,255,.6)",
                  border: "none"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Subscription Plans Section */}
        {(!plansLoading && plans.length > 0 && activeCat === "All" && !searchQ) && (
          <div style={{ marginBottom: 48 }}>
             <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, letterSpacing: "-.02em" }}>Subscriptions</h3>
             <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
               {plans.map(p => {
                 return (
                   <div key={p.id} style={{ 
                     background: "rgba(255,255,255,.03)", 
                     border: "1px solid rgba(255,255,255,.06)", 
                     borderRadius: 20, 
                     padding: 24,
                     display: "flex",
                     flexDirection: "column"
                   }}>
                     <div style={{ fontSize: 24, fontWeight: 900, color: G, marginBottom: 8 }}>{p.name}</div>
                     <div style={{ fontSize: 14, color: "rgba(255,255,255,.5)", marginBottom: 16 }}>{p.description}</div>
                     <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 20 }}>
                       TZS {Number(p.price).toLocaleString()} 
                       <span style={{ fontSize: 14, color: "rgba(255,255,255,.4)", fontWeight: 700 }}> / {p.durationMonths} Months</span>
                     </div>
                     <div style={{ display: "grid", gap: 10, marginBottom: 24, flex: 1 }}>
                       {(p.features || []).map((f, idx) => (
                         <div key={idx} style={{ display: "flex", gap: 8, fontSize: 13, color: "rgba(255,255,255,.7)" }}>
                           <span style={{ color: G }}>✓</span> {f}
                         </div>
                       ))}
                     </div>
                     <button
                       onClick={() => {
                         setSelectedItem(p);
                         setCheckoutType("subscription");
                       }}
                       style={{ background: G, color: "#111", border: "none", padding: "12px 20px", borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: "pointer", width: "100%" }}
                     >
                       Buy Subscription
                     </button>
                   </div>
                 );
               })}
             </div>
          </div>
        )}

        {/* Digital Tools / Deals Section */}
        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, letterSpacing: "-.02em" }}>
          {searchQ || activeCat !== "All" ? "Search Results" : "Digital Tools"}
        </h3>
        <div
          className={isMobile ? "no-scrollbar" : undefined}
          style={isMobile
            ? {
                display: "flex",
                gap: 14,
                overflowX: "auto",
                overflowY: "hidden",
                WebkitOverflowScrolling: "touch",
                scrollSnapType: "x mandatory",
                padding: "2px 16px 14px",
                margin: "0 -16px",
                alignItems: "stretch",
              }
            : { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20, alignItems:"stretch" }}
        >
          {loading ? (
            [1, 2, 3].map((i) => (
              isMobile ? (
                <div key={i} style={{ flex: "0 0 clamp(260px,78vw,300px)", width: "clamp(260px,78vw,300px)", scrollSnapAlign: "start" }}>
                  <Skeleton />
                </div>
              ) : <Skeleton key={i} />
            ))
          ) : filteredDeals.length > 0 ? (
            filteredDeals.map((d, i) => (
              isMobile ? (
                <div key={d.id || i} style={{ flex: "0 0 clamp(260px,78vw,300px)", width: "clamp(260px,78vw,300px)", scrollSnapAlign: "start", scrollSnapStop: "always", display: "flex" }}>
                  <ToolCard d={d} i={i} goPage={goPage} onBuyNow={()=>handleItemClick(d)} />
                </div>
              ) : <ToolCard key={d.id || i} d={d} i={i} goPage={goPage} onBuyNow={()=>handleItemClick(d)} />
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1" }}>
              <EmptyState 
                title={t("empty_no_results")} 
                message="Bado tunatafuta tools bora zaidi kwa ajili yako. Tafadhali rudi baadaye."
                actionText="Rudi Home"
                onAction={() => goPage("home")}
              />
            </div>
          )}
        </div>
      </W>
      
      {selectedItem && (
        <DigitalCheckoutModal 
          isOpen={!!selectedItem}
          item={selectedItem}
          type={checkoutType}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </section>
  );
}


// ── ToolDetailWrapper: safe navigation with null handling ──
function ToolDetailWrapper({ selectedDeal, goPage }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();
  const [deal, setDeal] = useState(selectedDeal || location.state?.deal || null);
  const [loading, setLoading] = useState(!deal);

  useEffect(() => {
    if (deal) { setLoading(false); return; }
    if (!slug) { setLoading(false); return; }
    
    // Fetch tool by slug
    const fetchTool = async () => {
      try {
        const db = getFirebaseDb();
        const q = query(collection(db, "digital_tools"), where("slug", "==", slug), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setDeal({ id: snap.docs[0].id, ...snap.docs[0].data() });
        }
      } catch (err) {
        console.error("Error fetching tool by slug:", err);
      }
      setLoading(false);
    };
    fetchTool();
  }, [slug, deal]);

  if (loading) {
    return <div style={{ minHeight:"100vh", background:"#06080f", display:"grid", placeItems:"center", color:"#fff" }}>Loading...</div>;
  }

  if (!deal) {
    return (
      <div style={{ minHeight:"100vh", background:"#06080f", display:"grid", placeItems:"center", textAlign:"center", padding:32, color:"#fff" }}>
        <div>
          <div style={{ fontSize:48, marginBottom:16 }}>🛠️</div>
          <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:22, fontWeight:900, marginBottom:10 }}>Tool not found</h2>
          <p style={{ color:"rgba(255,255,255,.45)", fontSize:14, marginBottom:24 }}>Please select a tool from the library.</p>
          <button onClick={() => navigate("/digital-tools")}
            style={{ padding:"10px 24px", borderRadius:12, background:"linear-gradient(135deg,#F5A623,#FFD17C)", color:"#111", fontWeight:800, border:"none", cursor:"pointer" }}>
            Back to Tools
          </button>
        </div>
      </div>
    );
  }

  return <ToolDetailPage deal={deal} goPage={goPage} />;
}

function ToolDetailPage({ deal: d, goPage }) {
  const isMobile = useMobile();
  const { t } = useSettings();
  const [imgError, setImgError] = useState(false);
  const [content, setContent] = useState(d.fullDescription || "");
  const [loadingContent, setLoadingContent] = useState(!!d.contentFileUrl && !d.fullDescription);
  const hasImage = d && d.imageUrl && !imgError;
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (d.contentFileUrl && !d.fullDescription) {
      // Use a microtask to avoid synchronous setState in effect
      Promise.resolve().then(() => setLoadingContent(true));
      fetch(d.contentFileUrl)
        .then(res => res.json())
        .then(data => {
            setContent(data);
            setLoadingContent(false);
        })
        .catch(err => {
            console.error("Error fetching content:", err);
            setLoadingContent(false);
        });
    }
  }, [d]);

  if (!d)
    return (
      <div style={{ padding: isMobile ? 40 : 100, textAlign: "center" }}>
        Tool not found.{" "}
        <button onClick={() => goPage("digital-tools")}>Back to Digital Tools</button>
      </div>
    );

  const getCTA = () => {
    if (d.ctaText) {
      let text = d.ctaText;
      if (text.startsWith("Get ")) text = text.replace("Get ", "Pata ");
      return { text, url: d.directLink || d.affiliateLink || d.whatsappLink };
    }
    if (d.dealType === "affiliate_offer")
      return { text: "Nunua Sasa", url: d.affiliateLink };
    if (d.dealType === "lead_offer")
      return { text: "Ulizia WhatsApp", url: d.whatsappLink };
    if (d.dealType === "promo_code")
      return { text: "Tumia Promo Code", url: d.directLink };
    return { text: "Pata Tool", url: d.directLink };
  };

  const cta = getCTA();
  const features = d.includedFeatures ? d.includedFeatures.split('\n').filter(f => f.trim()) : [];

  return (
    <div style={{ paddingBottom: isMobile ? 60 : 100 }}>
      <SEOHead 
        title={d.title || d.name || "Tool Details"} 
        category={d.category} 
        tags={d.tags} 
        description={d.shortDescription || d.description} 
        url={d.slug ? `${window.location.origin}/tools/${d.slug}` : window.location.href}
      />
      {/* Hero Section */}
      <section
        style={{
          background: d.bg || "linear-gradient(135deg, #1a1d2e, #0f111a)",
          padding: isMobile ? "30px 0 20px" : "60px 0 40px",
          borderBottom: "1px solid rgba(255,255,255,.05)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <W>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 64, alignItems: "center" }}>
            {/* Image/Media */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  aspectRatio: "4/3",
                  borderRadius: isMobile ? 16 : 24,
                  overflow: "hidden",
                  background: "rgba(255,255,255,.02)",
                  border: "1px solid rgba(255,255,255,.05)",
                  boxShadow: "0 20px 40px rgba(0,0,0,.3)",
                }}
              >
                {hasImage ? (
                  <img
                    src={d.imageUrl}
                    alt={d.name}
                    referrerPolicy="no-referrer"
                    style={{ width: "100%", height: "100%", objectFit: "contain", background: "rgba(255,255,255,.02)" }}
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", fontSize: isMobile ? 48 : 64, opacity: 0.1 }}>
                    🎁
                  </div>
                )}
              </div>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                {d.badge && (
                  <span
                    style={{
                      background: "rgba(245,166,35,.15)",
                      color: G,
                      padding: isMobile ? "2px 8px" : "4px 12px",
                      borderRadius: 20,
                      fontSize: isMobile ? 10 : 12,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      border: "1px solid rgba(245,166,35,.3)",
                    }}
                  >
                    {d.badge}
                  </span>
                )}
                {d.provider && (
                  <span style={{ color: "rgba(255,255,255,.5)", fontSize: isMobile ? 12 : 14 }}>
                    by {d.provider}
                  </span>
                )}
              </div>
              <h1
                style={{
                  fontSize: isMobile ? 28 : "clamp(32px, 5vw, 48px)",
                  fontWeight: 900,
                  lineHeight: 1.1,
                  margin: isMobile ? "0 0 12px" : "0 0 20px",
                  letterSpacing: "-.03em",
                }}
              >
                {d.name}
              </h1>
              <p
                style={{
                  fontSize: isMobile ? 15 : 18,
                  color: "rgba(255,255,255,.7)",
                  lineHeight: 1.6,
                  margin: isMobile ? "0 0 20px" : "0 0 30px",
                  maxWidth: 600,
                }}
              >
                {d.description}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: isMobile ? 20 : 30 }}>
                {d.oldPrice && (
                  <span
                    style={{
                      color: "rgba(255,255,255,.4)",
                      textDecoration: "line-through",
                      fontSize: isMobile ? 16 : 20,
                      fontWeight: 700,
                    }}
                  >
                    {d.oldPrice}
                  </span>
                )}
                <span style={{ color: G, fontSize: isMobile ? 28 : 36, fontWeight: 900 }}>
                  {d.newPrice}
                </span>
                {d.savingsText && (
                  <span style={{ fontSize: isMobile ? 11 : 14, color: "#00c4cc", fontWeight: 700, background: "rgba(0,196,204,.1)", padding: "4px 10px", borderRadius: 10 }}>
                    {d.savingsText}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12, alignItems: isMobile ? "stretch" : "center", flexWrap: "wrap" }}>
                <GoldBtn
                  onClick={() => {
                    if (d.dealType === "direct_offer" || !cta.url) {
                      setShowCheckout(true);
                    } else {
                      window.open(cta.url, "_blank");
                    }
                  }}
                  style={{ fontSize: isMobile ? 14 : 16, padding: isMobile ? "12px 24px" : "16px 32px" }}
                >
                  {cta.text} →
                </GoldBtn>
                
                {d.promoCode && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: isMobile ? "8px 12px" : "12px 20px",
                      borderRadius: isMobile ? 12 : 16,
                      border: "1px dashed rgba(245,166,35,.3)",
                      background: "rgba(245,166,35,.07)",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>Promo Code</div>
                      <strong style={{ fontSize: isMobile ? 14 : 18, color: G, letterSpacing: 1 }}>{d.promoCode}</strong>
                    </div>
                    <CopyBtn code={d.promoCode} />
                  </div>
                )}
              </div>

              {/* Trust Elements */}
              <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 20, marginTop: isMobile ? 20 : 30, flexWrap: "wrap" }}>
                {d.joinedCount && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: isMobile ? 12 : 14, color: "rgba(255,255,255,.6)" }}>
                    <div style={{ display: "flex", paddingLeft: 10 }}>
                      {[1, 2, 3].map(i => (
                        <div key={i} style={{ width: isMobile ? 24 : 28, height: isMobile ? 24 : 28, borderRadius: "50%", background: "#2a2d3e", border: "2px solid #1a1d2e", marginLeft: -10, display: "grid", placeItems: "center", fontSize: 10 }}>👤</div>
                      ))}
                    </div>
                    <span>
                      <strong style={{ color: "#fff" }}>{d.joinedCount}+</strong> {d.liveJoinedText || (isMobile ? "joined" : "members joined")}
                      {d.todayJoinedCount && <span style={{ color: G, marginLeft: 6 }}>({d.todayJoinedCount} today)</span>}
                    </span>
                  </div>
                )}
                {d.rating && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: isMobile ? 12 : 14, color: "rgba(255,255,255,.6)" }}>
                    <span style={{ color: G }}>★</span>
                    <strong style={{ color: "#fff" }}>{d.rating}/5</strong> rating
                  </div>
                )}
                {d.urgencyText && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: isMobile ? 12 : 14, color: "#ef4444" }}>
                    <span style={{ animation: "pulse 2s infinite" }}>🔥</span>
                    {d.urgencyText}
                  </div>
                )}
              </div>
            </div>
          </div>
        </W>
      </section>

      {/* Content Section */}
      <section style={{ padding: isMobile ? "40px 0" : "60px 0" }}>
        <W>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {(content || loadingContent) && (
                <div style={{ marginBottom: isMobile ? 30 : 40 }}>
                  <h2 style={{ fontSize: isMobile ? 20 : 24, marginBottom: 16 }}>What is this?</h2>
                  <div style={{ color: "rgba(255,255,255,.7)", lineHeight: 1.8, fontSize: isMobile ? 15 : 16, whiteSpace: "pre-wrap" }}>
                    {loadingContent ? t("empty_loading") : content}
                  </div>
                </div>
              )}

              {d.whyThisDeal && (
                <div style={{ marginBottom: isMobile ? 30 : 40 }}>
                  <h2 style={{ fontSize: isMobile ? 20 : 24, marginBottom: 16 }}>Why should I buy it?</h2>
                  <div style={{ color: "rgba(255,255,255,.7)", lineHeight: 1.8, fontSize: isMobile ? 15 : 16, whiteSpace: "pre-wrap" }}>
                    {d.whyThisDeal}
                  </div>
                </div>
              )}

              {features.length > 0 && (
                <div style={{ marginBottom: isMobile ? 30 : 40 }}>
                  <h2 style={{ fontSize: isMobile ? 20 : 24, marginBottom: 16 }}>What do I get?</h2>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
                    {features.map((f, i) => (
                      <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", color: "rgba(255,255,255,.8)", fontSize: isMobile ? 15 : 16, lineHeight: 1.6 }}>
                        <span style={{ color: "#00c4cc", marginTop: 2 }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {d.reviewText && (
                <div style={{ padding: isMobile ? 20 : 30, background: "rgba(255,255,255,.02)", borderRadius: isMobile ? 16 : 20, border: "1px solid rgba(255,255,255,.05)", marginBottom: isMobile ? 30 : 40 }}>
                  <div style={{ color: G, fontSize: 24, marginBottom: 10 }}>&quot;</div>
                  <p style={{ fontSize: isMobile ? 16 : 18, fontStyle: "italic", color: "rgba(255,255,255,.8)", lineHeight: 1.6, margin: 0 }}>
                    {d.reviewText}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div style={{ position: isMobile ? "relative" : "sticky", top: 100 }}>
                <div style={{ padding: isMobile ? 20 : 30, background: "rgba(255,255,255,.02)", borderRadius: isMobile ? 20 : 24, border: "1px solid rgba(255,255,255,.05)" }}>
                  <h3 style={{ fontSize: isMobile ? 18 : 20, marginBottom: 16 }}>Tool Summary</h3>
                  
                  <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,.6)", fontSize: isMobile ? 14 : 16 }}>
                      <span>Original Price</span>
                      <span style={{ textDecoration: "line-through" }}>{d.oldPrice || "-"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,.9)", fontWeight: 700, fontSize: isMobile ? 15 : 16 }}>
                      <span>Current Price</span>
                      <span style={{ color: G }}>{d.newPrice || "-"}</span>
                    </div>
                    {d.savingsText && (
                      <div style={{ display: "flex", justifyContent: "space-between", color: "#00c4cc", fontWeight: 700, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,.1)", fontSize: isMobile ? 15 : 16 }}>
                        <span>You Save</span>
                        <span>{d.savingsText}</span>
                      </div>
                    )}
                  </div>

                  <GoldBtn
                    onClick={() => {
                      if (d.dealType === "direct_offer" || !cta.url) {
                        setShowCheckout(true);
                      } else {
                        window.open(cta.url, "_blank");
                      }
                    }}
                    style={{ width: "100%", padding: isMobile ? "14px" : "16px", fontSize: isMobile ? 15 : 16, justifyContent: "center" }}
                  >
                    {cta.text} →
                  </GoldBtn>

                  {d.terms && (
                    <div style={{ marginTop: 16, fontSize: 11, color: "rgba(255,255,255,.4)", lineHeight: 1.6, textAlign: "center" }}>
                      {d.terms}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </W>
      </section>

      {showCheckout && (
        <DigitalCheckoutModal 
          isOpen={showCheckout}
          item={d}
          type="tool"
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}

function PrivacyPage() {
  return (
    <section style={{ padding: "60px 0" }}>
      <W>
        <SHead title="Privacy" hi="Policy" copy="Sera yetu ya faragha." />
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            color: "rgba(255,255,255,.7)",
            lineHeight: 1.8,
          }}
        >
          <p>
            Tunathamini faragha yako. STEA inakusanya taarifa muhimu tu ili
            kuboresha huduma zetu. Hatutashiriki taarifa zako na watu wengine
            bila idhini yako. Data yako iko salama nasi.
          </p>
        </div>
      </W>
    </section>
  );
}

function TermsPage() {
  return (
    <section style={{ padding: "60px 0" }}>
      <W>
        <SHead
          title="Terms"
          hi="of Use"
          copy="Masharti ya matumizi ya jukwaa la STEA."
        />
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            color: "rgba(255,255,255,.7)",
            lineHeight: 1.8,
          }}
        >
          <p>
            Kwa kutumia STEA, unakubaliana na masharti yetu. Tunajitahidi kutoa
            elimu bora, lakini tunatarajia watumiaji wetu watumie jukwaa hili
            kwa heshima na kwa malengo ya kimaendeleo. Hatuhusiki na matumizi
            mabaya ya ujuzi unaopata.
          </p>
        </div>
      </W>
    </section>
  );
}

const getWhatsAppLink = (course) => {
  const number = course.adminWhatsAppNumber || "8619715852043";
  const price = course.newPrice || course.price || "Bure";
  const defaultMsg = `Habari STEA, nataka kujiunga na kozi ya: ${course.title} yenye bei ya ${price}.\n\nNaomba maelekezo ya jinsi ya kuanza na utaratibu wa malipo.`;
  const msg = course.customWhatsAppMessageTemplate || defaultMsg;
  return `https://wa.me/${number.replace(/\+/g, "")}?text=${encodeURIComponent(msg)}`;
};


import SEOHead from "./components/SEOHead.jsx";

// ── CourseDetailWrapper: safe navigation with null handling ──
function CourseDetailWrapper({ selectedCourse, goPage }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();
  const [course, setCourse] = useState(selectedCourse || location.state?.course || null);
  const [loading, setLoading] = useState(!course);

  useEffect(() => {
    if (course) { setLoading(false); return; }
    if (!slug) { setLoading(false); return; }
    
    // Fetch course by slug
    const fetchCourse = async () => {
      try {
        const db = getFirebaseDb();
        const q = query(collection(db, "courses"), where("slug", "==", slug), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setCourse({ id: snap.docs[0].id, ...snap.docs[0].data() });
        }
      } catch (err) {
        console.error("Error fetching course by slug:", err);
      }
      setLoading(false);
    };
    fetchCourse();
  }, [slug, course]);

  if (loading) {
    return <div style={{ minHeight:"100vh", background:"#06080f", display:"grid", placeItems:"center", color:"#fff" }}>Loading...</div>;
  }

  if (!course) {
    return (
      <div style={{ minHeight:"100vh", background:"#06080f", display:"grid", placeItems:"center", textAlign:"center", padding:32, color:"#fff" }}>
        <div>
          <div style={{ fontSize:48, marginBottom:16 }}>📚</div>
          <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:22, fontWeight:900, marginBottom:10 }}>Course not found</h2>
          <p style={{ color:"rgba(255,255,255,.45)", fontSize:14, marginBottom:24 }}>Please select a course from the library.</p>
          <button onClick={() => navigate("/courses")}
            style={{ padding:"10px 24px", borderRadius:12, background:"linear-gradient(135deg,#F5A623,#FFD17C)", color:"#111", fontWeight:800, border:"none", cursor:"pointer" }}>
            ← Browse Courses
          </button>
        </div>
      </div>
    );
  }
  return <CourseDetailPage course={course} goPage={goPage} />;
}

function CourseDetailPage({ course: c, goPage }) {
  const isMobile = useMobile();
  const [playing, setPlaying] = useState(false);
  const [imgErr,  setImgErr]  = useState(false);

  if (!c) return (
    <div style={{ minHeight:"100vh", background:"#06080f", display:"grid", placeItems:"center", textAlign:"center", padding:32, color:"#fff" }}>
      <div>
        <div style={{ fontSize:48, marginBottom:16 }}>📚</div>
        <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:22, fontWeight:900, marginBottom:10 }}>Course not found</h2>
        <p style={{ color:"rgba(255,255,255,.45)", fontSize:14, marginBottom:24 }}>Please select a course from the library.</p>
        <button onClick={() => window.history.length > 1 ? window.history.back() : (window.location.href = "/courses")}
          style={{ padding:"10px 24px", borderRadius:12, background:`linear-gradient(135deg,${G},${G2})`, color:"#111", fontWeight:800, border:"none", cursor:"pointer" }}>
          ← Back to Courses
        </button>
      </div>
    </div>
  );

  const isFree = c.free || c.courseType === "free" || !c.newPrice || String(c.price||"").toLowerCase().includes("bure") || String(c.newPrice||"").toLowerCase().includes("bure");
  const displayTitle = c.title || c.titleEn || c.titleSw || c.name || "STEA Course";
  const displayDesc = c.description || c.descriptionEn || c.descriptionSw || c.desc || c.caption || "";
  const thumb = c.imageUrl || c.image || c.thumbnailUrl || c.thumbnail || c.coverImage || "";
  const hasImg = !!thumb && !imgErr;

  // Robust YouTube ID extraction supporting all URL formats including raw IDs
  const rawVideoUrl = c.youtubeUrl || c.videoUrl || c.embedUrl || c.url || c.link || "";
  const getVideoId = (url) => {
    if (!url) return null;
    const s = String(url).trim();
    // Already an embed URL
    const em = s.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    if (em) return em[1];
    // youtu.be, watch?v=, shorts/, v/ formats
    const m = s.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|v\/|live\/))([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
    // Raw 11-char video ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
    return null;
  };
  const videoId = getVideoId(rawVideoUrl);

  return (
    <div style={{ minHeight:"100vh", background:"#06080f", paddingTop: isMobile?72:100, paddingBottom:80, color:"#fff" }}>
      <SEOHead 
        title={displayTitle} 
        category={c.category || "Courses"} 
        tags={c.tags} 
        description={displayDesc} 
        url={c.slug ? `${window.location.origin}/courses/${c.slug}` : window.location.href}
      />
      <div style={{ maxWidth:900, margin:"0 auto", padding:"0 clamp(16px,4vw,32px)" }}>

        {/* Back button */}
        <button onClick={() => goPage("courses")} style={{ display:"flex", alignItems:"center", gap:8, color:"rgba(255,255,255,.5)", background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:12, padding:"8px 16px", cursor:"pointer", marginBottom:28, fontSize:13, fontWeight:700, transition:"all .18s" }}
          onMouseEnter={e => { e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor="rgba(255,255,255,.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.color="rgba(255,255,255,.5)"; e.currentTarget.style.borderColor="rgba(255,255,255,.1)"; }}>
          <ChevronRight size={16} style={{ transform:"rotate(180deg)" }} /> Back to Courses
        </button>

        {/* Video / thumbnail */}
        <div style={{ borderRadius:20, overflow:"hidden", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", marginBottom:28, aspectRatio:"16/9", position:"relative" }}>
          {!videoId ? (
            <div style={{ width:"100%", height:"100%", display:"grid", placeItems:"center", background:"#161820" }}>
              <p style={{ color:"rgba(255,255,255,.5)", fontSize:14 }}>Video not available for this course</p>
            </div>
          ) : !playing ? (
            /* Thumbnail with YouTube-style play button — tap once to play */
            <div onClick={() => setPlaying(true)} style={{ width:"100%", height:"100%", cursor:"pointer", position:"relative" }}>
              <img
                src={hasImg ? thumb : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt={displayTitle}
                style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                referrerPolicy="no-referrer"
                onError={e => {
                  setImgErr(true);
                  e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }}
              />
              {/* YouTube-style play button overlay */}
              <div style={{ position:"absolute", inset:0, display:"grid", placeItems:"center", background:"rgba(0,0,0,.2)" }}>
                <div style={{ width:68, height:68, borderRadius:"50%", background:"rgba(255,0,0,.88)", display:"grid", placeItems:"center", boxShadow:"0 4px 24px rgba(0,0,0,.5)", transition:"transform .15s" }}>
                  <div style={{ marginLeft:5, borderLeft:"26px solid #fff", borderTop:"16px solid transparent", borderBottom:"16px solid transparent" }} />
                </div>
              </div>
            </div>
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={displayTitle}
              width="100%" height="100%"
              style={{ display:"block", border:"none", position:"absolute", inset:0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        {/* Badges row */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
          {isFree && <span style={{ padding:"4px 12px", borderRadius:999, background:`${G}14`, border:`1px solid ${G}22`, color:G, fontSize:11, fontWeight:900 }}>Free</span>}
          {c.level && <span style={{ padding:"4px 12px", borderRadius:999, background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.12)", color:"rgba(255,255,255,.7)", fontSize:11, fontWeight:700 }}>{c.level}</span>}
          {c.category && <span style={{ padding:"4px 12px", borderRadius:999, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", color:"rgba(255,255,255,.55)", fontSize:11, fontWeight:700 }}>{c.category}</span>}
          {c.language && <span style={{ padding:"4px 12px", borderRadius:999, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", color:"rgba(255,255,255,.55)", fontSize:11, fontWeight:700 }}>🌐 {c.language}</span>}
        </div>

        {/* Title */}
        <h1 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:isMobile?"clamp(22px,7vw,32px)":"clamp(26px,4vw,40px)", fontWeight:900, letterSpacing:"-.04em", margin:"0 0 12px", lineHeight:1.15 }}>
          {displayTitle}
        </h1>

        {/* Creator / instructor */}
        {(c.instructorName || c.instructor) && (
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:`${G}20`, border:`1px solid ${G}30`, display:"grid", placeItems:"center", fontSize:14, color:G, fontWeight:900, flexShrink:0 }}>
              {(c.instructorName||c.instructor||"?")[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:"rgba(255,255,255,.85)" }}>{c.instructorName||c.instructor}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", fontWeight:600 }}>Instructor</div>
            </div>
          </div>
        )}

        {/* Duration + modules */}
        {(c.duration || c.totalLessons) && (
          <div style={{ display:"flex", gap:16, marginBottom:20, color:"rgba(255,255,255,.45)", fontSize:13 }}>
            {c.duration && <span>⏱ {c.duration}</span>}
            {c.totalLessons && <span>📖 {c.totalLessons} Modules</span>}
          </div>
        )}

        {/* Description */}
        {displayDesc && (
          <p style={{ color:"rgba(255,255,255,.6)", fontSize:isMobile?14:16, lineHeight:1.78, marginBottom:28, maxWidth:700 }}>
            {displayDesc}
          </p>
        )}

        {/* Video plays by clicking the thumbnail above */}

      </div>
    </div>
  );
}

// ── WEBSITE SOLUTIONS ─────────────────────────────────
function WebsiteCard({ w }) {
  const [hov, setHov] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  if (!w) return null;

  const img = w.imageUrl || w.image || w.thumbnailUrl || w.thumbnail || w.coverImage || "";
  const hasImg = img && !imgErr;
  const title = w.title || w.name || "Website";
  const url = w.url || w.link || w.websiteUrl || w.targetUrl || "";

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => { if (url) window.open(url, "_blank"); }}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/10",
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: hov ? "0 10px 25px rgba(0,0,0,0.5)" : "0 6px 15px rgba(0,0,0,0.3)",
        transform: hov ? "scale(1.05)" : "scale(1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        background: "#121212",
      }}
    >
      {/* Full-bleed image */}
      {hasImg ? (
        <img
          src={img}
          alt={title}
          loading="lazy"
          className="no-invert"
          referrerPolicy="no-referrer"
          onError={() => setImgErr(true)}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            transform: hov ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.3s ease",
          }}
        />
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 52, opacity: 0.2 }}>🌐</div>
      )}

      {/* Glassy Title Pill */}
      <div style={{
        position: "absolute",
        bottom: 12,
        left: 12,
        padding: "6px 12px",
        borderRadius: 8,
        background: hov ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        textShadow: "0 1px 3px rgba(0,0,0,0.5)",
        transition: "all 0.3s ease",
        maxWidth: "calc(100% - 24px)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}>
        {title}
      </div>
    </div>
  );
}

function WebsitesPage() {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const location = useLocation();

  // Phase 1: Fetch with small initial limit, then expand
  const { docs: websitesDocs, loading: websitesLoading } = useCollection("websites", "updatedAt", 200);
  const [activeTag, setActiveTag] = useState("All");
  const [displayLimit, setDisplayLimit] = useState(12);

  // Phase 1: debounced search via hook
  const { query: searchQ, setQuery: setSearchQ, filtered: searchFiltered, isSearching } = useSearchHook(
    useMemo(() => (websitesDocs || []).filter(w => {
      if (w.active === false) return false;
      if (w.status === "draft") return false;
      if (w.published === false && w.isPublished === false) return false;
      return true;
    }), [websitesDocs])
  );

  // SEO title
  useEffect(() => {
    document.title = `Website Solutions — STEA`;
    return () => { document.title = "STEA — Kila Kitu Mahali Pamoja"; };
  }, []);

  // Reset page on filter/search change
  useEffect(() => { setDisplayLimit(12); }, [searchQ, activeTag]);

  // Extract tags from all docs (not just filtered)
  const { categories: customWebCats } = useCustomCatsHook("website_solution_categories", websitesDocs || []);
  const allTags = useMemo(() => {
    if (customWebCats.length > 0) {
      return ["All", ...customWebCats.map(c => c.name || c).filter(Boolean)];
    }
    const tags = new Set();
    (websitesDocs || []).forEach(w => {
      if (w.category)    tags.add(w.category);
      if (w.subcategory) tags.add(w.subcategory);
      if (w.subCategory) tags.add(w.subCategory);
      if (Array.isArray(w.tags)) w.tags.forEach(t => tags.add(t));
    });
    return ["All", ...Array.from(tags).sort()];
  }, [websitesDocs, customWebCats]);

  // Category filter on top of search results
  const websites = useMemo(() => {
    if (activeTag === "All") return searchFiltered;
    return searchFiltered.filter(w =>
      w.category === activeTag ||
      w.subcategory === activeTag ||
      w.subCategory === activeTag ||
      (Array.isArray(w.tags) && w.tags.includes(activeTag))
    );
  }, [searchFiltered, activeTag]);

  const resetFilters = () => { setActiveTag("All"); setSearchQ(""); };

  return (
    <section style={{ padding: isMobile ? "clamp(80px,14vw,100px) 0 80px" : "clamp(100px,10vw,130px) 0 60px", minHeight: "100vh", background: "#06080f" }}>
      <W>
        {/* Back */}
        <button onClick={() => window.history.length > 1 ? window.history.back() : navigate("/")}
          style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,.5)", background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:12, padding:"8px 16px", cursor:"pointer", marginBottom:24, fontSize:13, fontWeight:700 }}>
          ← Back
        </button>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"5px 14px", borderRadius:999, background:"rgba(14,165,233,.1)", border:"1px solid rgba(14,165,233,.22)", color:"#0ea5e9", fontSize:11, fontWeight:900, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>
            🌐 Website Solutions
          </div>
          <h1 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:"clamp(28px,5vw,42px)", fontWeight:900, letterSpacing:"-.04em", margin:"0 0 8px", lineHeight:1.15 }}>
            Premium Websites
          </h1>
          <p style={{ color:"rgba(255,255,255,.45)", fontSize:isMobile?15:17, lineHeight:1.6, maxWidth:520, margin:0 }}>
            Movies, AI tools, streaming, education — the best sites curated for you.
          </p>
        </div>

        {/* Phase 1: Debounced search bar */}
        <div style={{ position:"relative", marginBottom:20 }}>
          <Search size={20} style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,.4)", pointerEvents:"none" }} />
          <input
            type="text"
            placeholder='Tafuta website — e.g. "movies", "ai", "tools"...'
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            style={{ width:"100%", height:54, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.12)", borderRadius:16, color:"#fff", padding:"0 16px 0 50px", fontSize:15, outline:"none", fontFamily:"inherit", boxSizing:"border-box", transition:"border-color .2s" }}
            onFocus={e => e.target.style.borderColor="rgba(14,165,233,.5)"}
            onBlur={e => e.target.style.borderColor="rgba(255,255,255,.12)"}
          />
          {isSearching && (
            <div style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", fontSize:11, color:"rgba(255,255,255,.3)", fontWeight:700 }}>Searching…</div>
          )}
        </div>

        {/* Category chips */}
        <div style={{ display:"flex", gap:8, overflowX:"auto", marginBottom:20, paddingBottom:4, scrollbarWidth:"none" }}>
          {allTags.map(tag => (
            <button key={tag} onClick={() => setActiveTag(tag)} style={{ whiteSpace:"nowrap", padding:"7px 16px", borderRadius:99, background:activeTag===tag?"#0ea5e9":"rgba(255,255,255,.05)", color:activeTag===tag?"#000":"rgba(255,255,255,.65)", border:activeTag===tag?"none":"1px solid rgba(255,255,255,.1)", fontSize:13, fontWeight:700, cursor:"pointer", transition:"all .2s", flexShrink:0 }}>
              {tag}
            </button>
          ))}
        </div>

        {/* Result count */}
        {!websitesLoading && (
          <div style={{ marginBottom:16, fontSize:12, color:"rgba(255,255,255,.3)", fontWeight:700 }}>
            {searchQ ? `${websites.length} results for "${searchQ}"` : `${websites.length} websites`}
          </div>
        )}

        {/* Grid */}
        <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(280px,1fr))", gap:isMobile?16:20 }}>
          {websitesLoading ? (
            Array.from({length:6}).map((_,i) => (
              <div key={i} className="stea-skeleton" style={{ height:220, borderRadius:16 }} />
            ))
          ) : websites.length > 0 ? (
            websites.slice(0, displayLimit).map((w, i) => <WebsiteCard key={w.id || i} w={w} />)
          ) : (
            <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"72px 0" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🌐</div>
              <h3 style={{ fontSize:20, fontWeight:700, margin:0 }}>Hakuna matokeo</h3>
              <p style={{ color:"rgba(255,255,255,.5)", marginTop:8, marginBottom:24 }}>
                {searchQ ? `No websites match "${searchQ}". Try a different keyword.` : "No websites available."}
              </p>
              <button onClick={resetFilters} style={{ background:"none", border:"none", color:G, fontWeight:800, cursor:"pointer", fontSize:15 }}>
                Clear filters →
              </button>
            </div>
          )}
        </div>

        {/* Load more */}
        {websites.length > displayLimit && (
          <div style={{ textAlign:"center", marginTop:32 }}>
            <button onClick={() => setDisplayLimit(n => n + 12)} style={{ background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.12)", borderRadius:12, padding:"12px 28px", color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer" }}>
              Load more ({websites.length - displayLimit} remaining)
            </button>
          </div>
        )}
      </W>
    </section>
  );
}



function ToolLink({ tool }) {
  const [iconError, setIconError] = useState(false);
  const hasIcon = tool.iconUrl && !iconError;
  let hostname;
  try {
    hostname = new URL(tool.toolUrl).hostname.replace("www.", "");
  } catch {
    hostname = "Tool";
  }

  return (
    <a
      href={tool.toolUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 16px",
        borderRadius: 12,
        background: "rgba(255,255,255,.05)",
        border: "1px solid rgba(255,255,255,.1)",
        textDecoration: "none",
        color: "#fff",
        fontSize: 13,
        fontWeight: 700,
        transition: ".2s",
      }}
      onMouseEnter={(ev) =>
        (ev.currentTarget.style.background = "rgba(255,255,255,.1)")
      }
      onMouseLeave={(ev) =>
        (ev.currentTarget.style.background = "rgba(255,255,255,.05)")
      }
    >
      {hasIcon ? (
        <img
          loading="lazy"
          src={tool.iconUrl}
          style={{ width: 20, height: 20, borderRadius: 4 }}
          referrerPolicy="no-referrer"
          onError={() => setIconError(true)}
        />
      ) : (
        "🔗"
      )}
      {hostname}
    </a>
  );
}

function ToolIcon({ tool }) {
  const [iconError, setIconError] = useState(false);
  const hasIcon = tool.iconUrl && !iconError;
  
  const handleClick = (e) => {
    if (tool.toolUrl) {
      e.stopPropagation();
      window.open(tool.toolUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      title={tool.toolUrl || tool.name}
      onClick={handleClick}
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        background: "rgba(255,255,255,.05)",
        border: "1px solid rgba(255,255,255,.1)",
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        cursor: tool.toolUrl ? "pointer" : "default",
        transition: ".2s",
      }}
      onMouseEnter={(e) => { if (tool.toolUrl) e.currentTarget.style.borderColor = G; }}
      onMouseLeave={(e) => { if (tool.toolUrl) e.currentTarget.style.borderColor = "rgba(255,255,255,.1)"; }}
    >
      {hasIcon ? (
        <img
          loading="lazy"
          src={tool.iconUrl}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          referrerPolicy="no-referrer"
          onError={() => setIconError(true)}
        />
      ) : (
        <span style={{ fontSize: 12 }}>🔗</span>
      )}
    </div>
  );
}

function SupportForm() {
  const isMobile = useMobile();
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "General",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const db = getFirebaseDb();
      if (db) {
        await setDoc(doc(db, "support_messages", Date.now().toString()), {
          ...form,
          createdAt: serverTimestamp(),
        });
      }
      setSent(true);
      (async () => { const { default: confetti } = await import("canvas-confetti"); confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } }); })();
    } catch (err) {
      console.error(err);
      alert("Samahani, imeshindikana kutuma ujumbe.");
    } finally {
      setLoading(false);
    }
  };

  if (sent)
    return (
      <div style={{ textAlign: "center", padding: isMobile ? "30px 16px" : "40px 20px" }}>
        <div
          style={{
            width: isMobile ? 56 : 64,
            height: isMobile ? 56 : 64,
            borderRadius: "50%",
            background: "rgba(0,196,140,.1)",
            color: "#00C48C",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 20px",
          }}
        >
          <Check size={isMobile ? 28 : 32} />
        </div>
        <h3 style={{ fontSize: isMobile ? 20 : 24, marginBottom: 10 }}>Asante!</h3>
        <p style={{ color: "rgba(255,255,255,.6)", fontSize: isMobile ? 14 : 16 }}>
          Ujumbe wako umepokelewa. Tutajibu hivi karibuni.
        </p>
        <button
          onClick={() => setSent(false)}
          style={{
            marginTop: 20,
            color: G,
            background: "none",
            border: "none",
            fontWeight: 800,
            cursor: "pointer",
            fontSize: isMobile ? 14 : 16,
          }}
        >
          Tuma ujumbe mwingine
        </button>
      </div>
    );

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: isMobile ? 10 : 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 10 : 16 }}>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Jina lako"
          style={{
            height: isMobile ? 44 : 50,
            borderRadius: isMobile ? 10 : 14,
            border: "1px solid rgba(255,255,255,.1)",
            background: "rgba(255,255,255,.05)",
            color: "#fff",
            padding: "0 14px",
            outline: "none",
            fontSize: isMobile ? 13 : 16,
          }}
        />
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email yako"
          style={{
            height: isMobile ? 44 : 50,
            borderRadius: isMobile ? 10 : 14,
            border: "1px solid rgba(255,255,255,.1)",
            background: "rgba(255,255,255,.05)",
            color: "#fff",
            padding: "0 14px",
            outline: "none",
            fontSize: isMobile ? 13 : 16,
          }}
        />
      </div>
      <select
        value={form.topic}
        onChange={(e) => setForm({ ...form, topic: e.target.value })}
        style={{
          height: isMobile ? 44 : 50,
          borderRadius: isMobile ? 10 : 14,
          border: "1px solid rgba(255,255,255,.1)",
          background: "rgba(255,255,255,.05)",
          color: "#fff",
          padding: "0 14px",
          outline: "none",
          fontSize: isMobile ? 13 : 16,
        }}
      >
        <option value="General">General Inquiry</option>
        <option value="Courses">Courses Support</option>
        <option value="Digital Tools">Digital Tools</option>
        <option value="Technical">Technical Issue</option>
      </select>
      <textarea
        required
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        placeholder="Ujumbe wako..."
        style={{
          height: isMobile ? 80 : 120,
          borderRadius: isMobile ? 10 : 14,
          border: "1px solid rgba(255,255,255,.1)",
          background: "rgba(255,255,255,.05)",
          color: "#fff",
          padding: "14px",
          outline: "none",
          resize: "none",
          fontSize: isMobile ? 13 : 16,
        }}
      />
      <button
        disabled={loading}
        style={{
          height: isMobile ? 46 : 54,
          borderRadius: isMobile ? 12 : 16,
          border: "none",
          background: `linear-gradient(135deg,${G},${G2})`,
          color: "#111",
          fontWeight: 900,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontSize: isMobile ? 14 : 16,
          transition: ".2s"
        }}
      >
        {loading ? (
          "Inatuma..."
        ) : (
          <>
            <Send size={isMobile ? 14 : 18} /> Tuma Ujumbe
          </>
        )}
      </button>
    </form>
  );
}








// ── Legal & Trust Pages ──────────────────────────────
function CreatorSection({ goPage, siteSettings }) {
  const isMobile = useMobile();
  const [imgError, setImgError] = useState(false);
  const data = siteSettings?.about_creator || {
    fullName: "Isaya Hans Masika",
    title: "Founder & Developer",
    shortBio: "Tanzanian tech creator na web developer.",
    fullBio: "Isaya Hans Masika ni Tanzanian tech creator na web developer, asili yake ikiwa ni mkoani Mbeya na kwa sasa anaishi nchini China. Anashikilia Shahada ya Uzamili (Bachelor’s Degree) katika Computer Science kutoka Guilin University of Electronic Technology, China. Safari yake ya elimu ilianzia Wazo Hill Primary School, akaendelea Mbezi Beach Secondary School, na baadaye Lugufu Boys Secondary School. Isaya ana shauku kubwa na teknolojia, AI, na kujenga majukwaa ya kidijitali yanayosaidia watu kupata maarifa kwa lugha ya Kiswahili.",
    imageUrl: "/stea-icon.jpg",
    imageAlt: "Isaya Hans Masika",
    contactText: "Contact Creator"
  };

  return (
    <section style={{ padding: isMobile ? "40px 0" : "100px 0", position: "relative", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: isMobile ? "100%" : "80%",
          height: isMobile ? "100%" : "80%",
          background: `radial-gradient(circle, ${G}15, transparent 70%)`,
          filter: "blur(80px)",
          zIndex: -1,
        }}
      />
      <W>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(320px, 1fr))",
            gap: isMobile ? 32 : 60,
            alignItems: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : -30, y: isMobile ? 20 : 0 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div
              style={{
                display: "inline-block",
                padding: isMobile ? "3px 10px" : "6px 14px",
                borderRadius: 99,
                background: "rgba(255,209,124,0.1)",
                color: G,
                fontSize: isMobile ? 9 : 12,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                marginBottom: isMobile ? 12 : 20,
              }}
            >
              The Visionary
            </div>
            <h2
              style={{
                fontSize: isMobile ? "28px" : "clamp(32px, 5vw, 48px)",
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: isMobile ? 16 : 24,
                color: "#fff",
                letterSpacing: "-0.03em",
              }}
            >
              About the <span style={{ color: G }}>Creator</span>
            </h2>
            <div
              style={{
                fontSize: isMobile ? 14 : 18,
                lineHeight: isMobile ? 1.6 : 1.8,
                color: "rgba(255,255,255,0.7)",
                display: "grid",
                gap: isMobile ? 12 : 20,
              }}
            >
              <p>
                <strong style={{ color: "#fff", fontSize: isMobile ? 16 : 20 }}>{data.fullName}</strong> {data.shortBio}
              </p>
              <div style={{ whiteSpace: "pre-wrap" }}>
                {data.fullBio}
              </div>
              {data.education && (
                <p style={{ fontSize: isMobile ? 13 : 16 }}>
                  🎓 <strong>Education:</strong> {data.education}
                </p>
              )}
              {data.career && (
                <p style={{ fontSize: isMobile ? 13 : 16 }}>
                  💼 <strong>Career:</strong> {data.career}
                </p>
              )}
              {data.hobbies && (
                <p style={{ fontSize: isMobile ? 13 : 16 }}>
                  🎨 <strong>Interests:</strong> {data.hobbies}
                </p>
              )}
            </div>
            <div style={{ marginTop: isMobile ? 24 : 40 }}>
              <PushBtn onClick={() => {
                if (data.contactLink) window.open(data.contactLink, "_blank");
                else goPage("contact");
              }} style={{ fontSize: isMobile ? 13 : 15, padding: isMobile ? "10px 20px" : "12px 24px" }}>
                ✉️ {data.contactText || "Contact Creator"}
              </PushBtn>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ position: "relative", order: isMobile ? -1 : 0 }}
          >
            {/* Avatar Area */}
            <div
              style={{
                width: "100%",
                maxWidth: isMobile ? 260 : 400,
                margin: "0 auto",
                position: "relative",
              }}
            >
              <div
                style={{
                  aspectRatio: "1/1",
                  borderRadius: isMobile ? 24 : 40,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                  display: "grid",
                  placeItems: "center",
                  position: "relative",
                  boxShadow: `0 20px 50px rgba(0,0,0,0.4), 0 0 20px ${G}10`,
                }}
              >
                {!imgError && data.imageUrl ? (
                  <img
                    src={data.imageUrl}
                    alt={data.imageAlt || data.fullName}
                    referrerPolicy="no-referrer"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: 0.9,
                    }}
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "grid",
                      placeItems: "center",
                      background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))`,
                    }}
                  >
                    <User size={isMobile ? 60 : 120} color={G} strokeWidth={1} opacity={0.3} />
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, #0a0b10 0%, transparent 40%)",
                    pointerEvents: "none",
                  }}
                />
                
                {/* Info Overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: isMobile ? 16 : 30,
                    left: isMobile ? 16 : 30,
                    right: isMobile ? 16 : 30,
                    zIndex: 2,
                  }}
                >
                  <div style={{ fontSize: isMobile ? 18 : 24, fontWeight: 900, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                    {data.fullName}
                  </div>
                  <div style={{ fontSize: isMobile ? 11 : 14, color: G, fontWeight: 700, letterSpacing: 0.5 }}>
                    {data.title}
                  </div>
                </div>
              </div>

              {/* Decorative Rings */}
              <div
                style={{
                  position: "absolute",
                  top: -30,
                  right: -30,
                  width: 140,
                  height: 140,
                  borderRadius: "50%",
                  border: `1px dashed ${G}30`,
                  animation: "spin 30s linear infinite",
                  zIndex: -1,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -20,
                  left: -20,
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${G}20, transparent)`,
                  filter: "blur(20px)",
                  zIndex: -1,
                }}
              />
            </div>
          </motion.div>
        </div>
      </W>
    </section>
  );
}

function AboutPage({ goPage, siteSettings }) {
  const isMobile = useMobile();
  const data = siteSettings?.about_us || {
    title: "Kuhusu",
    hi: "STEA",
    copy: "STEA ni jukwaa namba moja la teknolojia kwa lugha ya Kiswahili.",
    fullDesc: "STEA ni jukwaa la kisasa la teknolojia linalolenga kuwapa Watanzania na Waafrika Mashariki ujuzi wa vitendo. Tunaamini teknolojia ni haki ya kila mtu. Tunatoa elimu rahisi kwa Kiswahili ili uweze kujifunza, kubuni, na kujipatia kipato kupitia ujuzi wa kidijitali.",
    mission: "Kutoa elimu na fursa za tech zinazobadilisha maisha.",
    vision: "Kuwa jukwaa namba moja la tech kwa Kiswahili Afrika."
  };

  return (
    <div style={{ background: "#0a0b10" }}>
      <section style={{ padding: isMobile ? "40px 0 30px" : "100px 0 60px" }}>
        <W>
          <SHead
            title={data.title || "Kuhusu"}
            hi={data.hi || "STEA"}
            copy={data.copy || data.shortDesc || "STEA ni jukwaa namba moja la teknolojia kwa lugha ya Kiswahili."}
          />
          <div
            style={{
              maxWidth: 800,
              margin: isMobile ? "20px auto 0" : "40px auto 0",
              color: "rgba(255,255,255,.7)",
              lineHeight: isMobile ? 1.6 : 1.9,
              fontSize: isMobile ? 15 : 18,
              display: "grid",
              gap: isMobile ? 16 : 24,
            }}
          >
            <div style={{ whiteSpace: "pre-wrap" }}>
              {data.fullDesc}
            </div>
            
            <div style={{ 
              background: "rgba(255,255,255,0.03)", 
              padding: isMobile ? 20 : 40, 
              borderRadius: isMobile ? 20 : 32, 
              border: "1px solid rgba(255,255,255,0.06)",
              marginTop: isMobile ? 20 : 40
            }}>
              <h3 style={{ color: "#fff", fontSize: isMobile ? 18 : 24, fontWeight: 900, marginBottom: isMobile ? 14 : 24 }}>
                Tunachotoa
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))", gap: isMobile ? 10 : 20 }}>
                {[
                  "Kozi za Tech na AI",
                  "Tech Tips",
                  "Prompt Lab",
                  "Digital Tools na Duka la Tech",
                  "Websites za Earning"
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: G }} />
                    <span style={{ fontWeight: 600, fontSize: isMobile ? 13 : 16 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: isMobile ? 20 : 40, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))", gap: isMobile ? 20 : 32 }}>
              <div>
                <h3 style={{ color: G, fontSize: isMobile ? 11 : 14, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Vision</h3>
                <p style={{ fontSize: isMobile ? 16 : 20, color: "#fff", fontWeight: 700 }}>{data.vision}</p>
              </div>
              <div>
                <h3 style={{ color: G, fontSize: isMobile ? 11 : 14, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Mission</h3>
                <p style={{ fontSize: isMobile ? 16 : 20, color: "#fff", fontWeight: 700 }}>{data.mission}</p>
              </div>
            </div>

            {data.btnText && (
              <div style={{ textAlign: "center", marginTop: isMobile ? 24 : 40 }}>
                <PushBtn onClick={() => {
                  if (data.btnLink?.startsWith("http")) window.open(data.btnLink, "_blank");
                  else goPage(data.btnLink || "home");
                }} style={{ fontSize: isMobile ? 13 : 15, padding: isMobile ? "10px 20px" : "12px 24px" }}>
                  {data.btnText}
                </PushBtn>
              </div>
            )}
          </div>
        </W>
      </section>
    </div>
  );
}

function CreatorPage({ goPage, siteSettings }) {
  return (
    <div style={{ padding: "20px 0" }}>
      <CreatorSection goPage={goPage} siteSettings={siteSettings} />
    </div>
  );
}

function ContactPage({ siteSettings }) {
  const isMobile = useMobile();
  const data = siteSettings?.contact_info || {
    title: "Wasiliana",
    hi: "Nasi",
    copy: "Je, una swali au unahitaji msaada? Tupo hapa kukusaidia.",
    email: "swahilitecheliteacademy@gmail.com",
    whatsapp: "8619715852043"
  };

  return (
    <section style={{ padding: isMobile ? "30px 0" : "60px 0" }}>
      <W>
        <SHead
          title={data.title || "Wasiliana"}
          hi={data.hi || "Nasi"}
          copy={data.copy || "Je, una swali au unahitaji msaada? Tupo hapa kukusaidia."}
        />
        <div style={{ display: "grid", gap: isMobile ? 20 : 32, marginTop: isMobile ? 24 : 40 }}>
          <div>
            <div style={{ marginBottom: isMobile ? 16 : 24 }}>
              <div
                style={{
                  color: G,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  fontSize: isMobile ? 9 : 12,
                  letterSpacing: 1,
                  marginBottom: 6,
                }}
              >
                Email
              </div>
              <div style={{ fontSize: isMobile ? 15 : 18, color: "#fff", wordBreak: "break-all" }}>
                {data.email}
              </div>
            </div>
            <div>
              <div
                style={{
                  color: G,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  fontSize: isMobile ? 9 : 12,
                  letterSpacing: 1,
                  marginBottom: 6,
                }}
              >
                WhatsApp
              </div>
              <a
                href={`https://wa.me/${data.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: isMobile ? 15 : 18,
                  color: "#25d366",
                  textDecoration: "none",
                }}
              >
                Wasiliana nasi hapa
              </a>
            </div>
          </div>
        </div>
      </W>
    </section>
  );
}

function FAQPage({ faqs: remoteFaqs }) {
  const [openIndex, setOpenIndex] = useState(null);
  const defaultFaqs = [
    {
      q: "STEA ni nini?",
      a: "Ni jukwaa la elimu ya teknolojia na fursa za kidijitali kwa Kiswahili.",
    },
    {
      q: "Nani anaweza kujiunga?",
      a: "Kila mtu! Vijana, wajasiriamali, na yeyote anayetaka kujifunza tech.",
    },
    {
      q: "Kozi zenu zinafundishwa kwa lugha gani?",
      a: "Tunafundisha kwa Kiswahili rahisi ili kila mtu aelewe.",
    },
    {
      q: "Je, ninaweza kupata kipato kupitia STEA?",
      a: "Ndiyo, tunakupa ujuzi na fursa za kuanza kujipatia kipato mtandaoni.",
    },
    {
      q: "Je, huduma zenu ni za bure?",
      a: "Tuna huduma za bure na kozi za kulipia ili kukuza ujuzi wako kwa kina.",
    },
    {
      q: "Ninawezaje kupata msaada?",
      a: "Wasiliana nasi kupitia WhatsApp au Email wakati wowote.",
    },
  ];

  const displayFaqs = remoteFaqs?.length > 0 ? remoteFaqs : defaultFaqs;

  return (
    <div style={{ background: "#0a0b10", minHeight: "100vh", padding: "100px 0" }}>
      <W>
        <SHead
          title="Maswali"
          hi="Yanayoulizwa"
          copy="Pata majibu ya maswali yanayoulizwa mara kwa mara kuhusu STEA."
        />
        <div style={{ maxWidth: 800, margin: "60px auto 0", display: "grid", gap: 16 }}>
          {displayFaqs.map((f, i) => (
            <div
              key={i}
              style={{
                borderRadius: 20,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                overflow: "hidden",
                transition: "0.3s"
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  width: "100%",
                  padding: "24px 30px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  color: "#fff"
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 700 }}>{f.question || f.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  style={{ color: G }}
                >
                  <HelpCircle size={24} />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div style={{ padding: "0 30px 30px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontSize: 16 }}>
                      {f.answer || f.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </W>
    </div>
  );
}

// ════════════════════════════════════════════════════





// ════════════════════════════════════════════════════
// ROOT APP
// ════════════════════════════════════════════════════

function SectorPage({ title, hi, collection }) {
  const { t } = useSettings();
  const isMobile = useMobile();
  const { docs: rawDocs, loading, error } = useCollection(collection, "createdAt", 24);
  const [art, setArt] = useState(null);
  const [vid, setVid] = useState(null);

  const starterAI = [
    { id: 's1', title: 'ChatGPT Swahili Optimizer', desc: 'Boresha majibu ya ChatGPT kwa Kiswahili fasaha.', imageUrl: 'https://picsum.photos/seed/ai1/800/600', badge: 'Popular', type: 'article', content: 'Hii ni zana ya kuboresha majibu ya ChatGPT kwa Kiswahili fasaha. Inasaidia kupata majibu yenye mantiki na lugha sahihi.' },
    { id: 's2', title: 'Gemini Pro for Swahili', desc: 'Tumia nguvu ya Google Gemini kwa lugha ya Kiswahili.', imageUrl: 'https://picsum.photos/seed/ai2/800/600', badge: 'New', type: 'article', content: 'Gemini Pro inasaidia Kiswahili kwa kiwango cha juu sana. Unaweza kuitumia kutafsiri, kuandika barua, au kufanya uchambuzi wa data.' },
    { id: 's3', title: 'AI Image Generator', desc: 'Tengeneza picha za kustaajabisha kwa kutumia AI.', imageUrl: 'https://picsum.photos/seed/ai3/800/600', badge: 'Creative', type: 'article', content: 'Zana hii inakuwezesha kutengeneza picha za kustaajabisha kwa kutumia maelezo ya maandishi tu (Text-to-Image).' }
  ];

  const docs = (collection === 'ai' && (!rawDocs || rawDocs.length === 0)) ? starterAI : rawDocs;

  return (
    <div style={{ paddingTop: 100, paddingBottom: 60, minHeight: '100vh', background: '#05060a', color: '#fff' }}>
      <W>
        {art && <ArticleModal article={art} onClose={() => setArt(null)} collection={collection} />}
        {vid && <VideoModal video={vid} onClose={() => setVid(null)} collection={collection} />}
        
        <div style={{ marginBottom: 32 }}>
          <SHead title={title} hi={hi} />
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 20 }}>
            {[1, 2, 3].map(i => <Skeleton key={i} />)}
          </div>
        ) : error || !docs || docs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
            <Globe size={48} color="rgba(255,255,255,0.2)" style={{ marginBottom: 16 }} />
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              {t("empty_no_results")}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
              {error ? "Kuna tatizo la mtandao au ruhusa. Tafadhali jaribu tena." : "Tafadhali rudi tena baadaye."}
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{ padding: '10px 24px', background: '#F5A623', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
            >
              Jaribu tena
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 20 }}>
            {docs.map(item => {
               if (collection === 'shop') return <ShopProductCard key={item.id} product={item} onClick={() => setArt(item)} />;
               return item.type === 'video' ? 
               <VideoCard key={item.id} item={item} onPlay={setVid} collection={collection} /> :
               <ArticleCard key={item.id} item={item} onRead={setArt} collection={collection} />
            })}
          </div>
        )}
      </W>
    </div>
  );
}

export default function App() {
  console.log("App component starting...");
  const isMobile = useMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const [transitioning, setTransitioning] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [forcedAuthShown, setForcedAuthShown] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [scrollPct, setScrollPct] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [siteSettings, setSiteSettings] = useState({});
  const [faqs, setFaqs] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [tangazaNasiOpen, setTangazaNasiOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const handleAppInstalled = () => {

      // Dispatch a custom event or trigger a notification if needed
    };
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => window.removeEventListener('appinstalled', handleAppInstalled);
  }, []);

  useEffect(() => {
    console.log("Initializing Firebase...");
    initFirebase();
    const db = getFirebaseDb();
    if (!db) return;

    // Sponsored Ads Popup

    // Site Settings
    const settingDocs = ["about_us", "about_creator", "contact_info", "stats", "hero"];
    settingDocs.forEach(async (id) => {
      try {
        const snap = await getDoc(doc(db, "site_settings", id));
        if (snap.exists()) {
          setSiteSettings(prev => ({ ...prev, [id]: snap.data().data }));
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `site_settings/${id}`);
      }
    });
    
    // FAQs
    getDocs(query(collection(db, "faqs"), orderBy("order", "asc")))
      .then((snap) => {
        setFaqs(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(f => f.isActive));
      })
      .catch((error) => {
        handleFirestoreError(error, OperationType.GET, "faqs");
      });
    const unsubAuth = onAuthStateChanged(getFirebaseAuth(), async (u) => {

      if (u) {
        const db = getFirebaseDb();
        // Admin email whitelist always wins — Firestore role cannot downgrade an admin
        let role = isAdminEmail(u.email) ? "admin" : "user";
        let extraData = {};
        let source = role === "admin" ? "email-whitelist" : "default";
        if (db) {
          try {
            const s = await getDoc(doc(db, "users", u.uid));


            if (s.exists()) {
              const data = s.data();

              
              // Handle disabled users
              if (data.status === "disabled") {

                const auth = getFirebaseAuth();
                if (auth) await signOut(auth);
                alert("Account yako imezimwa. Tafadhali wasiliana na admin.");
                setUser(null);
                setAuthLoading(false);
                return;
              }

              // Allow Firestore role to override default 'admin' whitelist,
              // unless Firestore says 'user' and they are whitelisted (prevent lockout)
              if (data.role) {
                if (data.role !== "user" || !isAdminEmail(u.email)) {
                  role = data.role;
                  source = "firestore-user-doc";
                }
              }

              extraData = {
                ...data,
                photoURL: data.photoURL || u.photoURL,
                displayName: data.displayName || u.displayName,
              };
            } else {

            }
          } catch (e) {
            console.error("Error fetching user data:", e);
            handleFirestoreError(e, OperationType.GET, `users/${u.uid}`);
          }
        }

        const resolvedUser = {
          uid: u.uid,
          email: u.email,
          displayName: extraData.displayName || u.displayName,
          photoURL: extraData.photoURL || u.photoURL,
          ...extraData,
          role: role
        };
        setUser(resolvedUser);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => { 
      unsubAuth();
    };
  }, []);

  useEffect(() => {
    console.log("App mounted! Removing splash...");
    // Remove splash screen
    const splash = document.getElementById('app-loader');
    if (splash) {
      splash.style.transition = 'opacity 0.6s ease';
      splash.style.opacity = '0';
      const timer = setTimeout(() => splash.remove(), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Test Firestore connection after a short delay
    const timer = setTimeout(() => {
      testConnection();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fn = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(h > 0 ? (window.scrollY / h) * 100 : 0);
      setShowTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {

    if (user) {
      setTimeout(() => setForcedAuthShown(true), 0);
    }
  }, [user]);

  // Soft Forced Login Logic
  useEffect(() => {
    if (user || forcedAuthShown || authLoading) return;

    // Timer-based forced login (after 20 seconds)
    const timer = setTimeout(() => {
      if (!user && !forcedAuthShown) {
        setAuthOpen(true);
        setForcedAuthShown(true);
      }
    }, 20000);

    // Scroll-based forced login (after scrolling 40%) - only for confirmed guests
    if (scrollPct > 40 && !user && !forcedAuthShown && !authLoading) {
      setTimeout(() => {
        setAuthOpen(true);
        setForcedAuthShown(true);
      }, 0);
    }

    return () => clearTimeout(timer);
  }, [user, forcedAuthShown, scrollPct, authLoading]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [selectedTip, setSelectedTip] = useState(null);

  const goPage = (p, data = null) => {
    if (p === "course-detail" && data) {
      setSelectedCourse(data);
      navigate("/course-detail", { state: { course: data } });
      window.scrollTo(0, 0);
      return;
    }
    if (p === "tool-detail" && data) {
      setSelectedDeal(data);
    }
    if (p === "tech-tip-detail" && data) {
      setSelectedTip(data);
    }
    
    let targetPath = p === "home" ? "/" : p;
    if (!targetPath.startsWith("/") && targetPath !== "/") {
      targetPath = `/${targetPath}`;
    }
    
    // Support passing state (e.g. search query)
    if (data && data.q) {
      navigate(targetPath, { state: data });
    } else {
      navigate(targetPath, { state: data }); // General case: pass data as state
    }
    window.scrollTo(0, 0);
  };
  const handleLogout = async () => {
    try {
      await signOut(getFirebaseAuth());
      setUser(null);
      navigate("/");
      setAdminOpen(false);
      setAuthOpen(false);
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  console.log("App component rendering...");

  return (
    <>
      <STEAAppSplash onComplete={() => setShowSplash(false)} />
      <div style={{ opacity: showSplash ? 0 : 1, transition: 'opacity 0.3s ease-in-out', pointerEvents: showSplash ? 'none' : 'auto' }}>
        <ErrorBoundary>
      <SettingsProvider>
        <SiteSettingsProvider>
          <CheckoutProvider>
            <PWAProvider>
            <NotificationManager user={user} enabled={!showSplash} />
        <PopupAd />
        <InstallPrompt />
      {adminOpen ? (
        <div
          style={{
            fontFamily: "'Instrument Sans',system-ui,sans-serif",
            color: "#fff",
            minHeight: "100vh",
            background: "#0a0b0f",
          }}
        >
          <style>{`@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@800&family=Instrument+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}input::placeholder{color:rgba(255,255,255,.28)}textarea::placeholder{color:rgba(255,255,255,.28)}`}</style>
          {user?.role === "seller" ? (
            <SellerDashboard user={user} onBack={() => setAdminOpen(false)} />
          ) : user?.role === "creator" ? (
            <CreatorDashboard user={user} onBack={() => setAdminOpen(false)} />
          ) : user?.role === "manager" ? (
            <ManagerDashboard user={user} onBack={() => setAdminOpen(false)} />
          ) : (
            <AdminPanel user={user} onBack={() => setAdminOpen(false)} />
          )}
        </div>
      ) : (
        <div
          style={{
            fontFamily: "'Instrument Sans',system-ui,sans-serif",
            color: "#fff",
            minHeight: "100vh",
            overflowX: "hidden",
            background:
              "radial-gradient(circle at 14% 12%,rgba(245,166,35,.12),transparent 18%),radial-gradient(circle at 84% 22%,rgba(86,183,255,.12),transparent 20%),linear-gradient(180deg,#05060a,#080a11)",
          }}
        >
          <style>{`@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@800&family=Instrument+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes blink{50%{opacity:0}}@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}@keyframes logoPulse{0%,100%{box-shadow:0 0 0 0 rgba(245,166,35,.45)}50%{box-shadow:0 0 0 18px rgba(245,166,35,0)}}@keyframes steaGlow{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}@keyframes steaEntrance{from{opacity:0;transform:scale(0.75)}to{opacity:1;transform:scale(1)}}@keyframes steaPulse{0%,100%{transform:scale(1);filter:drop-shadow(0 0 0px rgba(245,166,35,0))}50%{transform:scale(1.04);filter:drop-shadow(0 0 18px rgba(245,166,35,0.35))}}@keyframes loadBar{0%{width:0%}60%{width:65%}100%{width:100%}}@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:rgba(245,166,35,.28);border-radius:3px}input::placeholder{color:rgba(255,255,255,.28)}a{text-decoration:none;color:inherit}nav::-webkit-scrollbar{display:none}@media(max-width:900px){#desktopNav{display:none!important}}.course-list-item{display:flex;flex-direction:column;height:100%}.course-img-container{aspect-ratio:16/9;width:100%;border-bottom:1px solid rgba(255,255,255,.05)}.course-hero{display:grid;grid-template-columns:1fr;gap:30px}.course-hero-img{aspect-ratio:16/9;width:100%}@media(min-width:900px){.course-hero{grid-template-columns:1.2fr 1fr;gap:60px;align-items:center}.course-hero-img{aspect-ratio:16/9}}`}</style>

          <AnimatePresence>
            {transitioning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 1000,
                  background: "rgba(5, 6, 10, 0.4)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 24,
                    background: `linear-gradient(135deg, ${G}, ${G2})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 0 40px ${G}44`,
                    marginBottom: 24,
                  }}
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#111"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
                  </svg>
                </motion.div>
                <div
                  style={{
                    width: 140,
                    height: 4,
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 99,
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5 }}
                    style={{ height: "100%", background: G }}
                  />
                </div>
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 10,
                    fontWeight: 900,
                    color: G,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                  }}
                >
                  STEA Loading...
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              height: 3,
              width: `${scrollPct}%`,
              zIndex: 400,
              background: `linear-gradient(90deg,${G},${G2})`,
              boxShadow: `0 0 12px rgba(245,166,35,.6)`,
              transition: "width .1s",
              pointerEvents: "none",
            }}
          />

          {/* Ticker */}
          <div
            style={{
              background: `linear-gradient(90deg,${G},${G2})`,
              color: "#111",
              padding: isMobile ? "7px 0" : "9px 0",
              overflow: "hidden",
              whiteSpace: "nowrap",
              fontSize: isMobile ? 11 : 13,
              fontWeight: 800,
              userSelect: "none",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                gap: isMobile ? 24 : 32,
                animation: "ticker 26s linear infinite",
              }}
            >
              {[
                "🤖 AI & ChatGPT kwa Kiswahili",
                "📱 Android, iPhone na PC Hacks",
                "🛠️ Digital Tools",
                "🎓 Kozi za STEA kwa M-Pesa",
                "⚡ STEA",
                "🤖 AI & ChatGPT kwa Kiswahili",
                "📱 Android, iPhone na PC Hacks",
                "🛠️ Digital Tools",
                "🎓 Kozi za STEA kwa M-Pesa",
                "⚡ STEA",
              ].map((t, i) => (
                <span key={i}>{t}</span>
              ))}
            </div>
          </div>

          {/* Topbar */}
          <Navbar 
            user={user}
            onAuth={() => { if (!user && !authLoading) setAuthOpen(true); }}
            onAdmin={() => setAdminOpen(true)}
            onProfile={() => navigate("/profile")}
            onSearch={() => setSearchOpen(true)}
            onNotif={() => setNotifOpen(!notifOpen)}
            onTangazaNasi={() => setTangazaNasiOpen(true)}
            onLogout={handleLogout}
          />

          <FloatingBackButton />

          {notifOpen && (
            <div
              style={{
                position: "fixed",
                right: 24,
                top: 80,
                width: 290,
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,.12)",
                background: "rgba(14,16,26,.98)",
                boxShadow: "0 24px 60px rgba(0,0,0,.45)",
                padding: 12,
                zIndex: 9500,
              }}
            >
              {[
                {
                  t: "Tool mpya imeingia",
                  b: "Angalia tools zetu mpya.",
                },
                {
                  t: "Kozi mpya iko active",
                  b: "AI & ChatGPT Mastery iko tayari.",
                },
              ].map((n, i) => (
                <div
                  key={i}
                  style={{
                    padding: "11px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,.06)",
                    background: "rgba(255,255,255,.04)",
                    marginTop: i > 0 ? 8 : 0,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      marginBottom: 3,
                      fontSize: 14,
                    }}
                  >
                    {n.t}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,.55)",
                      lineHeight: 1.55,
                    }}
                  >
                    {n.b}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Search */}
          {searchOpen && (
            <div
              onClick={(e) => {
                if (e.target === e.currentTarget) setSearchOpen(false);
              }}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 600,
                background: "rgba(4,5,9,.84)",
                backdropFilter: "blur(18px)",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                padding: "88px 16px 20px",
              }}
            >
              <div
                style={{
                  width: "min(680px,100%)",
                  borderRadius: 24,
                  border: "1px solid rgba(255,255,255,.12)",
                  background: "rgba(12,14,22,.97)",
                  boxShadow: "0 32px 80px rgba(0,0,0,.55)",
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: 16 }}>
                  <input
                    autoFocus
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter" || !searchQ.trim()) return;
                      goPage(routeSearchQuery(searchQ), { q: searchQ.trim() });
                      setSearchOpen(false);
                      setSearchQ("");
                    }}
                    placeholder="Search STEA — tools, courses, websites..."
                    style={{
                      width: "100%",
                      height: 52,
                      borderRadius: 14,
                      border: "1px solid rgba(255,255,255,.1)",
                      background: "rgba(255,255,255,.05)",
                      color: "#fff",
                      padding: "0 16px",
                      outline: "none",
                      fontSize: 15,
                      fontFamily: "inherit",
                    }}
                  />
                </div>
                <div
                  style={{ padding: "0 16px 16px", display: "grid", gap: 7 }}
                >
                  {NAV.filter(
                    (n) =>
                      !searchQ ||
                      n.label.toLowerCase().includes(searchQ.toLowerCase()),
                  ).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => goPage(n.id)}
                      style={{
                        border: "1px solid rgba(255,255,255,.06)",
                        background: "rgba(255,255,255,.04)",
                        borderRadius: 13,
                        padding: "12px 16px",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,.08)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,.04)")
                      }
                    >
                      <strong
                        style={{
                          display: "block",
                          marginBottom: 3,
                          fontSize: 15,
                        }}
                      >
                        {n.label}
                      </strong>
                      <span
                        style={{ fontSize: 13, color: "rgba(255,255,255,.45)" }}
                      >
                        STEA — {n.label} section
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {authOpen && (
            <AuthModal
              onClose={() => setAuthOpen(false)}
              onUser={(u) => {
                setUser(u);
                setAuthOpen(false);
              }}
            />
          )}

          <main style={{ paddingBottom: isMobile ? 80 : 0 }}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageWrapper><NewHomePage goPage={goPage} settings={siteSettings} /></PageWrapper>} />
                <Route path="/search" element={<PageWrapper><SearchRedirect /></PageWrapper>} />
                <Route path="/courses" element={<PageWrapper><CoursesPage goPage={goPage} /></PageWrapper>} />
                <Route path="/learning" element={<PageWrapper><CoursesPage goPage={goPage} /></PageWrapper>} />
                <Route path="/prompts" element={<PageWrapper><PromptLabPage /></PageWrapper>} />
                <Route path="/prompt-lab" element={<PageWrapper><PromptLabPage /></PageWrapper>} />
                <Route path="/digital-tools" element={<PageWrapper><DigitalToolsPage goPage={goPage} /></PageWrapper>} />
                <Route path="/digital-tools/:slug" element={<PageWrapper><DigitalToolDetailPage /></PageWrapper>} />
                <Route path="/deals" element={<Navigate to="/digital-tools" replace />} />
                <Route path="/duka" element={<PageWrapper><MarketplacePage /></PageWrapper>} />
                <Route path="/duka/:category" element={<PageWrapper><MarketplacePage /></PageWrapper>} />
                <Route path="/marketplace" element={<Navigate to="/duka" replace />} />
                <Route path="/resources" element={<PageWrapper><ExploreResourcesPage goPage={goPage} /></PageWrapper>} />
                <Route path="/explore/resources" element={<PageWrapper><ExploreResourcesPage goPage={goPage} /></PageWrapper>} />
                <Route path="/chaba" element={<PageWrapper><ChabaMarketplacePage /></PageWrapper>} />
                <Route path="/chaba/checkout/:productId" element={<PageWrapper><ChabaCheckoutPage /></PageWrapper>} />
                <Route path="/marketplace/checkout/:productId" element={<PageWrapper><TanzaniaMarketplaceCheckoutPage /></PageWrapper>} />
                <Route path="/seller/:sellerId" element={<PageWrapper><SellerProfilePage /></PageWrapper>} />
                <Route path="/seller/dashboard" element={
                  (user && ["seller", "admin", "super_admin", "manager"].includes(user.role)) 
                  ? <PageWrapper><SellerDashboard user={user} onBack={() => window.location.href = '/'} /></PageWrapper>
                  : <Navigate to="/" replace />
                } />
                <Route path="/websites" element={<PageWrapper><WebsiteSolutionsPage /></PageWrapper>} />
                <Route path="/websites/:category" element={<PageWrapper><WebsiteSolutionsPage /></PageWrapper>} />
                <Route path="/websites/:category/:subcategory" element={<PageWrapper><WebsiteSolutionsPage /></PageWrapper>} />
                <Route path="/website-solutions" element={<PageWrapper><WebsiteSolutionsPage /></PageWrapper>} />
                <Route path="/website-solutions/:category" element={<PageWrapper><WebsiteSolutionsPage /></PageWrapper>} />
                <Route path="/website-solutions/:category/:subcategory" element={<PageWrapper><WebsiteSolutionsPage /></PageWrapper>} />
                <Route path="/course-detail" element={<PageWrapper><CourseDetailWrapper selectedCourse={selectedCourse} goPage={goPage} /></PageWrapper>} />
                <Route path="/courses/:slug" element={<PageWrapper><CourseDetailWrapper selectedCourse={selectedCourse} goPage={goPage} /></PageWrapper>} />
                <Route path="/tool-detail" element={<PageWrapper><ToolDetailWrapper selectedDeal={selectedDeal} goPage={goPage} /></PageWrapper>} />
                <Route path="/tools/:slug" element={<PageWrapper><ToolDetailWrapper selectedDeal={selectedDeal} goPage={goPage} /></PageWrapper>} />
                <Route path="/deal-detail" element={<Navigate to="/tool-detail" replace />} />
                <Route path="/about" element={<PageWrapper><AboutPage goPage={goPage} siteSettings={siteSettings} /></PageWrapper>} />
                <Route path="/creator" element={<PageWrapper><CreatorPage goPage={goPage} siteSettings={siteSettings} /></PageWrapper>} />
                <Route path="/contact" element={<PageWrapper><ContactPage siteSettings={siteSettings} /></PageWrapper>} />
                <Route path="/faq" element={<PageWrapper><FAQPage faqs={faqs} /></PageWrapper>} />
                <Route path="/privacy" element={<PageWrapper><PrivacyPage /></PageWrapper>} />
                <Route path="/terms" element={<PageWrapper><TermsPage /></PageWrapper>} />
                
                {/* NECTA Results — deep links */}
                <Route path="/necta" element={<PageWrapper><NectaResultsPage /></PageWrapper>} />
                <Route path="/necta/:level" element={<PageWrapper><NectaResultsPage /></PageWrapper>} />
                <Route path="/necta/:level/:year" element={<PageWrapper><NectaResultsPage /></PageWrapper>} />
                <Route path="/results/region/:region" element={<PageWrapper><Suspense fallback={<div style={{ minHeight:"70vh", display:"grid", placeItems:"center", color:"#fff" }}>Loading region...</div>}><ResultSeoPage type="region" /></Suspense></PageWrapper>} />
                <Route path="/results/top-schools" element={<PageWrapper><Suspense fallback={<div style={{ minHeight:"70vh", display:"grid", placeItems:"center", color:"#fff" }}>Loading top schools...</div>}><ResultSeoPage type="top" /></Suspense></PageWrapper>} />
                <Route path="/results/statistics" element={<PageWrapper><Suspense fallback={<div style={{ minHeight:"70vh", display:"grid", placeItems:"center", color:"#fff" }}>Loading statistics...</div>}><ResultSeoPage type="statistics" /></Suspense></PageWrapper>} />
                <Route path="/results/:year/:school" element={<PageWrapper><Suspense fallback={<div style={{ minHeight:"70vh", display:"grid", placeItems:"center", color:"#fff" }}>Loading results...</div>}><ResultSeoPage type="school" /></Suspense></PageWrapper>} />
                <Route path="/exams" element={<PageWrapper><ExamsHubPage /></PageWrapper>} />
                <Route path="/exams/results" element={<PageWrapper><NectaResultsPage /></PageWrapper>} />
                <Route path="/profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
                <Route path="/exams/past-papers" element={<PageWrapper><PastPapersPage /></PageWrapper>} />
                <Route path="/exams/notes" element={<PageWrapper><NotesPage /></PageWrapper>} />
                <Route path="/exams/practice" element={<PageWrapper><PracticePage /></PageWrapper>} />
                {/* Student Center – new sub-section routes */}
                <Route path="/exams/university-guide" element={<PageWrapper><UniversityGuidePage /></PageWrapper>} />
                <Route path="/exams/scholarships" element={<PageWrapper><ScholarshipsTZPage /></PageWrapper>} />
                <Route path="/exams/abroad" element={<PageWrapper><StudyAbroadPage /></PageWrapper>} />
                <Route path="/exams/updates" element={<PageWrapper><StudentUpdatesPage /></PageWrapper>} />
                <Route path="/exams/assistant" element={<PageWrapper><AssistantPage /></PageWrapper>} />
                <Route path="/tech" element={<PageWrapper><TechHubPage /></PageWrapper>} />
                <Route path="/tech-tips" element={<PageWrapper><TechTipsPage /></PageWrapper>} />
                <Route path="/tech/tips-resources" element={<PageWrapper><TipsResourcesPage /></PageWrapper>} />
                <Route path="/r/:slug" element={<PageWrapper><TipsResourceDetailPage /></PageWrapper>} />
                <Route path="/huduma" element={<PageWrapper><HudumaPage /></PageWrapper>} />
                <Route path="/services/website-design" element={<PageWrapper><WebsiteDesignServicePage /></PageWrapper>} />
                <Route path="/services/product-promotion" element={<PageWrapper><ServiceRequestPage serviceName="Product Promotion" description="Tangaza bidhaa yako kwa wanafunzi na watumiaji wa STEA." /></PageWrapper>} />
                <Route path="/services/brand-partnerships" element={<PageWrapper><ServiceRequestPage serviceName="Brand Partnerships" description="Fanya kazi nasi kwa muda mrefu." /></PageWrapper>} />
                <Route path="/services/digital-support" element={<PageWrapper><ServiceRequestPage serviceName="Digital Support" description="Msaada wa IT na digital automation." /></PageWrapper>} />
                <Route path="/advertise" element={<PageWrapper><AdvertisePage /></PageWrapper>} />
                <Route path="/vpn" element={<PageWrapper><VpnHelpPage /></PageWrapper>} />
                <Route path="/ai" element={<PageWrapper><AILabPage /></PageWrapper>} />
                <Route path="/shop" element={<Navigate to="/duka" replace />} />
                <Route path="/sell" element={<Navigate to="/seller/apply" replace />} />
                <Route path="/seller/apply" element={<PageWrapper><SellerApplicationPage /></PageWrapper>} />
                <Route path="/gigs" element={<PageWrapper><GigsPage /></PageWrapper>} />
                <Route path="/necta-results" element={<Navigate to="/exams/results" replace />} />
                <Route path="/vpn-china" element={<Navigate to="/vpn" replace />} />
                <Route path="/university-guide" element={<PageWrapper><UniversityGuidePage /></PageWrapper>} />
                <Route path="/university" element={<Navigate to="/university-guide" replace />} />
                <Route path="/shule" element={<Navigate to="/university-guide" replace />} />
                <Route path="/money-guide" element={<PageWrapper><AbroadMoneyGuidePage /></PageWrapper>} />
                <Route path="/abroad-money" element={<Navigate to="/money-guide" replace />} />
                <Route path="/assistant-preview" element={<PageWrapper><AssistantPage /></PageWrapper>} />
                <Route path="/track-order" element={<PageWrapper><OrderTrackingPage /></PageWrapper>} />
                <Route path="/ceo" element={<CeoWorkspace />} />
              </Routes>
            </AnimatePresence>
          </main>
          
          <TangazaNasiForm isOpen={tangazaNasiOpen} onClose={() => setTangazaNasiOpen(false)} />

          {isMobile && <BottomNav />}


          {/* Footer */}
          <footer
            style={{
              background: "#05060a",
              borderTop: "1px solid rgba(255,255,255,.06)",
              padding: isMobile ? "40px 0 24px" : "80px 0 40px",
              marginTop: isMobile ? 40 : 100,
            }}
          >
            <W>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit,minmax(200px,1fr))",
                  gap: isMobile ? 32 : 60,
                  marginBottom: isMobile ? 32 : 60,
                }}
              >
                <div style={{ gridColumn: isMobile ? "auto" : "span 2" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: isMobile ? 16 : 24,
                    }}
                  >
                    <img 
                      src="/android-chrome-512x512.png" 
                      alt="STEA Logo" 
                      className="stea-footer-logo" 
                      referrerPolicy="no-referrer"
                      style={{ height: isMobile ? 32 : 44, borderRadius: 10, objectFit: 'cover' }}
                    />
                  </div>
                  <p
                    style={{
                      color: "rgba(255,255,255,.5)",
                      lineHeight: 1.8,
                      maxWidth: 380,
                      marginBottom: isMobile ? 24 : 32,
                      fontSize: isMobile ? 13 : 14,
                    }}
                  >
                    {siteSettings.about_us?.shortDesc ||
                      "STEA ni jukwaa namba moja la teknolojia kwa Kiswahili nchini Tanzania. Tunaleta elimu, habari na ofa bora za tech kiganjani mwako."}
                  </p>
                  <div style={{ display: "flex", gap: 12, marginBottom: isMobile ? 24 : 32 }}>
                    {Object.entries(siteSettings.contact_info?.socialLinks || {}).map(
                      ([s, url]) =>
                        url && (
                          <a
                            key={s}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              width: isMobile ? 36 : 40,
                              height: isMobile ? 36 : 40,
                              borderRadius: 10,
                              border: "1px solid rgba(255,255,255,.08)",
                              background: "rgba(255,255,255,.04)",
                              display: "grid",
                              placeItems: "center",
                              color: "rgba(255,255,255,.6)",
                              fontSize: isMobile ? 16 : 18,
                            }}
                          >
                            {s === "facebook" && "F"}
                            {s === "instagram" && "I"}
                            {s === "twitter" && "X"}
                            {s === "youtube" && "Y"}
                            {s === "linkedin" && "L"}
                            {s === "tiktok" && "T"}
                          </a>
                        )
                    )}
                  </div>
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: isMobile ? 14 : 16,
                      fontWeight: 800,
                      marginBottom: isMobile ? 16 : 24,
                      color: "#fff",
                    }}
                  >
                    Quick Links
                  </h4>
                  <div style={{ display: "grid", gap: 10 }}>
                    {NAV.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => goPage(n.id)}
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "rgba(255,255,255,.5)",
                          fontSize: isMobile ? 13 : 14,
                          textAlign: "left",
                          cursor: "pointer",
                          padding: 0,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = G)}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "rgba(255,255,255,.5)")
                        }
                      >
                        {n.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: isMobile ? 14 : 16,
                      fontWeight: 800,
                      marginBottom: isMobile ? 16 : 24,
                      color: "#fff",
                    }}
                  >
                    Trust & Legal
                  </h4>
                  <div style={{ display: "grid", gap: 10 }}>
                    {[
                      { id: "about", l: "About Us" },
                      { id: "creator", l: "About Creator" },
                      { id: "contact", l: "Contact Us" },
                      { id: "faq", l: "FAQ" },
                      { id: "privacy", l: "Privacy Policy" },
                      { id: "terms", l: "Terms of Use" },
                    ].map((l) => (
                      <button
                        key={l.id}
                        onClick={() => goPage(l.id)}
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "rgba(255,255,255,.5)",
                          fontSize: isMobile ? 13 : 14,
                          textAlign: "left",
                          cursor: "pointer",
                          padding: 0,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = G)}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "rgba(255,255,255,.5)")
                        }
                      >
                        {l.l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,.06)",
                  paddingTop: isMobile ? 24 : 40,
                  display: "flex",
                  justifyContent: isMobile ? "center" : "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: isMobile ? 12 : 20,
                  textAlign: isMobile ? "center" : "left",
                }}
              >
                <div style={{ color: "rgba(255,255,255,.3)", fontSize: 12 }}>
                  © 2026 STEA. All rights reserved.
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: isMobile ? 16 : 24,
                    color: "rgba(255,255,255,.3)",
                    fontSize: 12,
                  }}
                >
                  <span>Made with ❤️ in Tanzania</span>
                  <span>v2.5.0 Premium</span>
                </div>
              </div>
            </W>
          </footer>


          {showTop && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              style={{
                position: "fixed",
                right: isMobile ? 16 : 34,
                bottom: isMobile ? 100 : 120,
                zIndex: 200,
                width: 50,
                height: 50,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(245,166,35,.3)",
                background: "rgba(12,14,24,.92)",
                color: G,
                cursor: "pointer",
                fontSize: 20,
                boxShadow: "0 8px 24px rgba(0,0,0,.35)",
              }}
            >
              ↑
            </button>
          )}

          {profileOpen && user && (
            <ProfileModal
              user={user}
              onClose={() => setProfileOpen(false)}
              onUpdate={(u) => setUser(u)}
            />
          )}
        </div>
      )}

      {/* AI Assistant — globally mounted, always visible */}
      </PWAProvider>
      </CheckoutProvider>
      </SiteSettingsProvider>
      </SettingsProvider>
      </ErrorBoundary>
      </div>
    </>
  );
}
