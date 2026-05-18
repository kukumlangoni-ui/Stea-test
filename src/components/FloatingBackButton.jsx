import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

function fallbackForPath(pathname) {
  if (pathname.startsWith("/chaba")) return "/chaba";
  if (pathname.startsWith("/marketplace/checkout") || pathname.startsWith("/duka"))
    return "/duka/phones";
  if (pathname.startsWith("/tech")) return "/tech";
  return "/";
}

/**
 * Floating history back — left-middle of viewport (not under navbar).
 */
export function FloatingBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname || "/";

  if (path === "/" || path === "") return null;

  const fallback = fallbackForPath(path);

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length <= 1) {
      navigate(fallback);
      return;
    }
    navigate(-1);
  };

  return (
    <motion.button
      type="button"
      aria-label="Rudi nyuma"
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={goBack}
      className="floating-back-btn"
      style={{
        position: "fixed",
        left: "max(14px, env(safe-area-inset-left))",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 8800,
        width: 40,
        height: 40,
        borderRadius: 13,
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(10,12,20,0.88)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        color: "#fff",
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
        boxShadow: "0 10px 32px rgba(0,0,0,0.42)",
      }}
    >
      <ArrowLeft size={18} strokeWidth={2.5} />
    </motion.button>
  );
}
