import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, ChevronLeft, ChevronRight,
  MapPin, MessageCircle,
  Filter, Shield, RefreshCw
} from "lucide-react";
import {
  getFirebaseDb, collection, onSnapshot, query,
  where, limit
} from "../firebase.js";
import { useMobile } from "../hooks/useMobile.js";
import { useSettings } from "../contexts/SettingsContext.jsx";
import { useCheckout } from "../contexts/CheckoutContext.jsx";
import { ProductSkeleton } from "../components/Skeleton.jsx";
import { ShopProductCard } from "../components/ShopProductCard.jsx";
import AdSlot from "../components/AdSlot.jsx";
import SEOHead from "../components/SEOHead.jsx";

import { MARKET_CATEGORIES } from "../constants/marketplace.js";

// ── Constants ────────────────────────────────────────
const G = "#F5A623";
const DARK = "#05060a";
const BORDER = "rgba(255,255,255,0.06)";

// ── Category Config ──────────────────────────────────
// (Moved to src/constants/marketplace.js)

const STEA_WA = "255757053354";
const CONDITIONS = ["New","Used","Refurbished"];

// ── Price Formatter ─────────────────────────────────
function fmtPrice(n) {
  if (!n && n !== 0) return "";
  return `Tsh ${Number(n).toLocaleString()}`;
}

// ── Shared Micro Components ──────────────────────────
const Badge = ({ children, color = G, bg }) => (
  <span style={{
    padding: "3px 9px", borderRadius: 999, fontSize: 10, fontWeight: 800,
    background: bg || `${color}18`, color, border: `1px solid ${color}30`,
    textTransform: "uppercase", letterSpacing: ".04em", whiteSpace: "nowrap",
  }}>{children}</span>
);

// ── Category Filters ─────────────────────────────────
function CategoryFilters({ catId, filters, onChange }) {
  const { t } = useSettings();
  const cat = MARKET_CATEGORIES[catId];
  if (!cat) return null;

  const hasSubcats = cat.subcategories?.length > 0;
  const hasBrands = cat.brands?.length > 0;
  const hasSubItems = cat.subItems && filters.subcategory;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Row: Subcategories/Types */}
      {hasSubcats && (
        <div>
          <span className="stea-shop-category-header">Shop by type</span>
          <div className="stea-chip-group no-scrollbar">
            <button 
              className={`stea-chip ${!filters.subcategory ? 'stea-chip--active' : ''}`}
              onClick={() => onChange({ ...filters, subcategory: null, subItem: null })}
            >
              All items
            </button>
            {cat.subcategories.map(sub => (
              <button 
                key={sub} 
                className={`stea-chip ${filters.subcategory === sub ? 'stea-chip--active' : ''}`}
                onClick={() => onChange({ ...filters, subcategory: sub, subItem: null })}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Row: Brands / SubItems */}
      {(hasBrands || hasSubItems) && (
        <div style={{ background: "rgba(255,255,255,.02)", padding: 16, borderRadius: 18, border: "1px solid rgba(255,255,255,.04)" }}>
          {hasBrands && (
            <>
              <span className="stea-shop-category-header">Filter by Brand</span>
              <div className="stea-chip-group no-scrollbar">
                <button 
                  className={`stea-chip ${!filters.brand ? 'stea-chip--active' : ''}`}
                  onClick={() => onChange({ ...filters, brand: null })}
                >
                  All Brands
                </button>
                {cat.brands.map(b => (
                  <button 
                    key={b} 
                    className={`stea-chip ${filters.brand === b ? 'stea-chip--active' : ''}`}
                    onClick={() => onChange({ ...filters, brand: filters.brand === b ? null : b })}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </>
          )}
          {hasSubItems && cat.subItems[filters.subcategory] && (
            <>
              <span className="stea-shop-category-header">Specific Models</span>
              <div className="stea-chip-group no-scrollbar">
                {cat.subItems[filters.subcategory].map(item => (
                  <button 
                    key={item} 
                    className={`stea-chip ${filters.subItem === item ? 'stea-chip--active' : ''}`}
                    onClick={() => onChange({ ...filters, subItem: filters.subItem === item ? null : item })}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Row: Conditions (Hide for Beauty) */}
      {catId !== 'beauty' && (
        <div>
          <span className="stea-shop-category-header">Condition</span>
          <div className="stea-chip-group no-scrollbar">
            {CONDITIONS.map(c => (
              <button 
                key={c} 
                className={`stea-chip ${filters.condition === c ? 'stea-chip--active' : ''}`}
                onClick={() => onChange({ ...filters, condition: filters.condition === c ? null : c })}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const FilterChip = ({ children, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: "7px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700,
    border: `1px solid ${active ? G : "rgba(255,255,255,.1)"}`,
    background: active ? `${G}15` : "transparent",
    color: active ? G : "rgba(255,255,255,.55)",
    cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s", flexShrink: 0,
  }}>{children}</button>
);

// ── Products Grid (Live Firebase) ────────────────────
function ProductsGrid({ catId, filters, searchQ, onRefresh }) {
  const isMobile = useMobile();
  const { t } = useSettings();
  const [products, setProducts] = useState(() => {
    try {
      const cached = localStorage.getItem(`stea_cache_products_${catId}`);
      return cached ? JSON.parse(cached) : [];
    } catch { return []; }
  });
  const [loading, setLoading] = useState(products.length === 0);

  useEffect(() => {
    const db = getFirebaseDb();
    if (!db) {
      setTimeout(() => setLoading(false), 0);
      return;
    }

    let q = query(
      collection(db, "products"),
      where("sector", "==", "marketplace"),
      limit(200)
    );

    const unsub = onSnapshot(q, { includeMetadataChanges: true }, snap => {
      const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Same filter logic as HomePage for consistency
      const processed = fetched
        .filter(p => {
          // Must be visible
          if (p.visible === false) return false;
          // Must be published/active (same as homepage)
          if (p.published === false && p.isActive === false) return false;
          if (p.status && !["active", "published", "approved"].includes(p.status)) return false;
          return true;
        })
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      setProducts(processed);
      setLoading(false);

      // Cache
      try {
        localStorage.setItem(`stea_cache_products_${catId}`, JSON.stringify(processed));
      } catch (err) {
        console.warn("Storage error", err);
      }
    }, err => {
      console.error("Marketplace fetch error:", err);
      setLoading(false);
    });

    return () => unsub();
  }, [catId]);

  // Client-side filtering
  const filtered = products.filter(p => {
    // Basic category match handling case differences
    if (catId && catId !== "zote") {
       const pCat = (p.category || "").toLowerCase();
       const cId = catId.toLowerCase();
       // "phones" -> "Phones", match it roughly
       if (pCat !== cId && !pCat.includes(cId) && !cId.includes(pCat)) {
          return false;
       }
    }

    if (filters.subcategory && p.subcategory !== filters.subcategory) return false;
    if (filters.subItem && p.subItem !== filters.subItem && p.subcategory !== filters.subItem) return false;
    if (filters.brand && p.brand !== filters.brand) return false;
    if (filters.condition && p.condition !== filters.condition) return false;
    if (searchQ) {
      const q = searchQ.toLowerCase();
      return (p.name||"").toLowerCase().includes(q) ||
             (p.brand||"").toLowerCase().includes(q) ||
             (p.description||"").toLowerCase().includes(q) ||
             (p.location||"").toLowerCase().includes(q);
    }
    return true;
  });

  if (loading) {
    return (
      <div className="market-products-grid">
        {[1,2,3,4,5,6].map(i => <div key={i} style={{ minHeight: 200 }}><ProductSkeleton /></div>)}
      </div>
    );
  }

  return (
    <>
      {/* Product count + refresh */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,.4)", fontWeight: 700 }}>
          {filtered.length > 0 ? `${filtered.length} bidhaa` : ""}
        </span>
        <button onClick={onRefresh} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 10, padding: "6px 12px", color: "rgba(255,255,255,.5)", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
          <RefreshCw size={12} /> Refresh
        </button>
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "rgba(255,255,255,.02)", borderRadius: 20, border: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>📦</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{t('duka_no_products')}</h3>
          <p style={{ color: "rgba(255,255,255,.5)", fontSize: 14, maxWidth: 380, margin: "0 auto" }}>
            {searchQ ? `${t('duka_no_results')} "${searchQ}" kwa kichujio hiki.` : "Bidhaa mpya zinaongezwa hivi karibuni. Rudi tena au wasiliana nasi."}
          </p>
          <a href={`https://wa.me/${STEA_WA}?text=${encodeURIComponent("Habari STEA, natafuta bidhaa ambayo siioni kwenye STEA Duka.")}`}
            target="_blank" rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 20, padding: "10px 20px", background: "#25d366", color: "#fff", borderRadius: 12, fontWeight: 800, textDecoration: "none", fontSize: 14 }}>
            <MessageCircle size={16} /> {t('duka_request_product')}
          </a>
        </div>
      ) : (
        <div className="market-products-grid">
          {filtered.map(p => (
            <ShopProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}

// ── Main Marketplace Page ────────────────────────────
export default function MarketplacePage() {
  const isMobile = useMobile();
  const { t } = useSettings();
  const { category: urlCategory } = useParams();
  const navigate = useNavigate();

  // Redirect /duka to /duka/phones
  useEffect(() => {
    if (!urlCategory) {
      navigate("/duka/phones", { replace: true });
    }
  }, [urlCategory, navigate]);

  // Derive state from URL param
  const activeCat = urlCategory && MARKET_CATEGORIES[urlCategory] ? urlCategory : "phones";

  const [filters, setFilters] = useState({});
  const [searchQ, setSearchQ] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [refreshKey, setRefreshKey] = useState(0);
  const topRef = useRef(null);

  // Reset filters when category changes
  const [prevUrlCategory, setPrevUrlCategory] = useState(urlCategory);
  if (urlCategory !== prevUrlCategory) {
    setPrevUrlCategory(urlCategory);
    setFilters({});
    setSearchQ("");
    setActiveSearch("");
  }

  const cat = activeCat ? MARKET_CATEGORIES[activeCat] : null;

  const handleSelectCategory = (catId) => {
    navigate(`/duka/${catId}`);
    setFilters({});
    setSearchQ("");
    setActiveSearch("");
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => setActiveSearch(searchQ), 350);
    return () => clearTimeout(t);
  }, [searchQ]);

  return (
    <div ref={topRef} style={{ paddingTop: 80, paddingBottom: 60, minHeight: "100vh", background: DARK, color: "#fff", fontFamily: "'Instrument Sans',system-ui,sans-serif" }}>
      <SEOHead 
        title="STEA Duka — Nunua Simu, Laptops na Bidhaa Tanzania"
        description="Sokoni la kidijitali la Tanzania. Nunua simu mpya, laptops, accessories kwa bei nafuu. Wauzaji waliothitishwa. Malipo salama."
        keywords={["duka la simu Tanzania", "nunua simu online Tanzania", "bei ya simu Tanzania", "Tanzania online shopping"]}
      />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "0 14px" : "0 28px" }}>
        
        {/* MARKETPLACE SWITCHER */}
        <div style={{ marginTop: 24, marginBottom: 16, display: "flex", padding: "4px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 20, width: "100%", maxWidth: 360, position: "relative", boxShadow: "inset 0 2px 10px rgba(0,0,0,.5)" }}>
          <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
            <button style={{ width: "100%", padding: "12px", border: "none", background: "transparent", color: "#000", fontWeight: 800, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
               🇹🇿 TZ Market
            </button>
            <div style={{ position: "absolute", inset: 0, background: G, borderRadius: 16, zIndex: -1, boxShadow: "0 4px 12px rgba(245,166,35,0.2)" }} />
          </div>
          <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
            <button onClick={() => navigate("/chaba")} style={{ width: "100%", padding: "12px", border: "none", background: "transparent", color: "rgba(255,255,255,.6)", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "color .2s" }} onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,.6)"}>
               🇨🇳 Agiza China
            </button>
          </div>
        </div>

        <>
          {/* ── CATEGORY VIEW ── */}
          {cat && (
            <motion.div 
              key={`cat-${activeCat}`} 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              style={{ overflow: "visible" }}
            >

              {/* Top bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: isMobile ? "16px 0 12px" : "20px 0 16px" }}>
                
                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                  <span style={{ fontSize: isMobile ? 22 : 26 }}>{cat.emoji}</span>
                  <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: isMobile ? 20 : 26, fontWeight: 900, letterSpacing: "-.03em", margin: 0 }}>
                    {t(cat.labelKey)}
                  </h2>
                </div>

                {/* Category switcher cards — BOTH mobile and desktop now premium */}
                <div 
                  className="stea-category-scroll no-scrollbar" 
                  style={{ 
                    padding: isMobile ? "24px 0 10px" : "30px 0 20px",
                    margin: isMobile ? "-24px -14px 0" : "-30px 0 -20px", 
                    paddingLeft: isMobile ? 14 : 0,
                    paddingRight: isMobile ? 14 : 0,
                    display: "flex",
                    overflowX: "auto",
                    overflowY: "visible", // Added to ensure vertical overflow isn't clipped
                    gap: isMobile ? 16 : 32,
                    justifyContent: isMobile ? "flex-start" : "center",
                    width: isMobile ? "calc(100% + 28px)" : "auto"
                  }}
                >
                  {Object.values(MARKET_CATEGORIES).map(c => (
                    <div 
                      key={c.id} 
                      className={`stea-category-card ${activeCat === c.id ? "stea-category-card--active" : ""}`}
                      onClick={() => handleSelectCategory(c.id)}
                      style={{ width: isMobile ? 90 : 130 }}
                    >
                      <div className="stea-category-icon-wrap" data-cat={c.id} style={{ 
                        width: isMobile ? 64 : 110, 
                        height: isMobile ? 64 : 110, 
                        fontSize: isMobile ? 28 : 52, 
                        borderRadius: isMobile ? 20 : 38,
                        background: c.glowColor ? `linear-gradient(135deg, ${c.glowColor}25, ${c.glowColor}05)` : undefined,
                        borderColor: c.glowColor ? `${c.glowColor}50` : undefined,
                        boxShadow: c.glowColor ? `0 10px 30px ${c.glowColor}15` : undefined
                      }}>
                        {c.emoji}
                      </div>
                      <span className="stea-category-label" style={{ fontSize: isMobile ? 11 : 15 }}>
                        {t(c.labelKey) !== c.labelKey ? t(c.labelKey) : (c.label || c.id)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search + filter toggle row */}
              <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <Search size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,.3)", pointerEvents: "none" }} />
                  <input
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                    placeholder={`${t('action_search')} ${cat?.labelKey ? t(cat.labelKey).toLowerCase() : ""}...`}
                    style={{ width: "100%", height: 42, borderRadius: 12, border: `1px solid ${BORDER}`, background: "rgba(255,255,255,.04)", color: "#fff", paddingLeft: 38, paddingRight: searchQ ? 36 : 14, outline: "none", fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor = G}
                    onBlur={e => e.target.style.borderColor = BORDER}
                  />
                  {searchQ && (
                    <button onClick={() => setSearchQ("")}
                      style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,.35)", cursor: "pointer" }}>
                      <X size={13} />
                    </button>
                  )}
                </div>

                {isMobile && (
                  <button onClick={() => setShowFilters(v => !v)}
                    style={{ height: 42, padding: "0 14px", borderRadius: 12, border: `1px solid ${showFilters ? G : BORDER}`, background: showFilters ? `${G}12` : "rgba(255,255,255,.04)", color: showFilters ? G : "rgba(255,255,255,.6)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                    <Filter size={13} /> {t('duka_filter_label')}
                    {Object.values(filters).filter(Boolean).length > 0 && (
                      <span style={{ width: 16, height: 16, borderRadius: "50%", background: G, color: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900 }}>
                        {Object.values(filters).filter(Boolean).length}
                      </span>
                    )}
                  </button>
                )}
              </div>

              {/* Filters */}
              <AnimatePresence>
                {(showFilters || !isMobile) && (
                  <motion.div
                    initial={isMobile ? { height: 0, opacity: 0 } : false}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={isMobile ? { height: 0, opacity: 0 } : {}}
                    style={{ overflow: "hidden", marginBottom: 16 }}
                  >
                    <div style={{ overflowX: "auto", paddingBottom: 4 }} className="filter-scroll">
                      <CategoryFilters catId={activeCat} filters={filters} onChange={f => setFilters(f)} />
                    </div>

                    {/* Active filter badges */}
                    {Object.values(filters).some(Boolean) && (
                      <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,.4)", fontWeight: 700 }}>Active:</span>
                        {Object.entries(filters).filter(([,v]) => v).map(([k, v]) => (
                          <button key={k} onClick={() => setFilters(f => ({ ...f, [k]: null }))}
                            style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: `${G}15`, color: G, border: `1px solid ${G}30`, cursor: "pointer" }}>
                            {v} <X size={9} />
                          </button>
                        ))}
                        <button onClick={() => setFilters({})}
                          style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.35)", background: "none", border: "none", cursor: "pointer" }}>
                          Futa Filters
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

      {/* Mobile category switcher */}
      {isMobile && (
        <div style={{ marginTop: 24, marginBottom: 12 }}>
          <span className="stea-shop-category-header" style={{ marginLeft: 16 }}>Shop by Section</span>
          <div className="stea-category-scroll no-scrollbar">
            {Object.values(MARKET_CATEGORIES).map(c => (
              <div 
                key={c.id} 
                className={`stea-category-card ${activeCat === c.id ? "stea-category-card--active" : ""}`}
                onClick={() => handleSelectCategory(c.id)}
              >
                <div className="stea-category-icon-wrap">
                  {c.emoji}
                </div>
                <span className="stea-category-label">
                  {t(c.labelKey) !== c.labelKey ? t(c.labelKey) : (c.label || c.id)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <AdSlot id="marketplace-before-products" />

              {/* Products */}
              <ProductsGrid
                catId={activeCat}
                filters={filters}
                searchQ={activeSearch}
                onRefresh={() => setRefreshKey(k => k + 1)}
              />
            </motion.div>
          )}
        </>
      </div>

    </div>
  );
}
