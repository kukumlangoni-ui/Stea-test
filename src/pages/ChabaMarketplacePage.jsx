import React, { useState, useEffect } from "react";
import { getFirebaseDb, collection, onSnapshot, query } from "../firebase.js";
import { useMobile } from "../hooks/useMobile.js";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { MarketplaceProductCard } from "../components/MarketplaceProductCard.jsx";
import { CHINA_MARKET_CATEGORIES } from "../constants/marketplace.js";
// ChabaProductModal and ChabaCheckoutModal are kept but no longer used in marketplace flow

const G = "#F5A623";

/** Legacy wrapper — Agiza China listing uses shared marketplace card (no Msaada on card). */
function ChabaProductCard({ product }) {
  return (
    <MarketplaceProductCard product={{ ...product, market: "china" }} type="china" />
  );
}

export default function ChabaMarketplacePage() {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const [activeCat, setActiveCat] = useState("Zote");

  const dynamicCategories = ["Zote", ...new Set(products.map(p => p.category).filter(Boolean))];

  useEffect(() => {
    const db = getFirebaseDb();
    const unsub = onSnapshot(query(collection(db, "chaba_products")), (snap) => {
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(p => p.visible !== false));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = products.filter(p => {
    if (activeCat !== "Zote" && p.category?.toLowerCase() !== activeCat.toLowerCase()) return false;
    if (searchQ) {
      const q = searchQ.toLowerCase();
      return (p.name || "").toLowerCase().includes(q) ||
             (p.category || "").toLowerCase().includes(q) ||
             (p.description || "").toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#05060A", color: "#fff", paddingTop: 80, paddingBottom: 100 }}>
       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 style={{ fontSize: isMobile ? 28 : 42, fontWeight: 900, marginBottom: 12, letterSpacing: "-0.03em" }}>Agiza China <span style={{ color: G }}>na STEA</span></h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,.6)", maxWidth: 600, margin: "0 auto" }}>Agiza bidhaa moja kwa moja kutoka nchi za nje kwa uhakika na usalama zaidi kupitia STEA.</p>
          </div>

          <div style={{ margin: "0 auto 32px", display: "flex", padding: "4px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 20, width: "100%", maxWidth: 360, position: "relative" }}>
            <button onClick={() => navigate("/duka")} style={{ flex: 1, padding: "12px", border: "none", background: "transparent", color: "rgba(255,255,255,.6)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>🇹🇿 TZ Market</button>
            <button style={{ flex: 1, padding: "12px", border: "none", background: G, color: "#000", fontWeight: 800, fontSize: 13, cursor: "pointer", borderRadius: 16 }}>🇨🇳 Agiza China</button>
          </div>

          {/* Flash Deals & Trending Section */}
          {!searchQ && activeCat === "Zote" && (
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#ff4d4f" }}>⚡ Flash Deals</span>
                </h2>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>INAYOISHA HIVI PUNDE</div>
              </div>
              
              <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 16, scrollbarWidth: "none" }}>
                {products.filter(p => p.isFlashSale).length > 0 ? (
                  products.filter(p => p.isFlashSale).map(p => (
                    <div key={p.id} style={{ minWidth: 220, maxWidth: 220 }}>
                      <ChabaProductCard product={p} />
                    </div>
                  ))
                ) : (
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 16, padding: 20, textAlign: "center", width: "100%" }}>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0 }}>Hakuma ofa za muda mfupi kwa sasa. Stay tuned!</p>
                  </div>
                )}
              </div>

              {products.filter(p => p.isTrending).length > 0 && (
                <div style={{ marginTop: 24 }}>
                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: G }}>🔥 Trending Now</span>
                    </h2>
                  </div>
                   <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 16, scrollbarWidth: "none" }}>
                    {products.filter(p => p.isTrending).map(p => (
                      <div key={p.id} style={{ minWidth: 220, maxWidth: 220 }}>
                        <ChabaProductCard product={p} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ position: "relative", maxWidth: 600, margin: "0 auto 24px", width: "100%" }}>
            <Search size={18} color="rgba(255,255,255,.4)" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Tafuta bidhaa — Electronics, Phones..."
              style={{ width: "100%", height: 50, borderRadius: 25, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,.03)", color: "#fff", paddingLeft: 46, paddingRight: 46, outline: "none", fontSize: 15 }}
            />
            {searchQ && <button onClick={() => setSearchQ("")} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,.5)", cursor: "pointer", fontSize: 18 }}>✕</button>}
          </div>

          <div className="stea-category-scroll no-scrollbar mb-10">
            <div 
              className={`stea-category-card ${activeCat === "Zote" ? "stea-category-card--active" : ""}`}
              onClick={() => setActiveCat("Zote")}
            >
              <div className="stea-category-icon-wrap">
                🌏
              </div>
              <span className="stea-category-label">
                Zote
              </span>
            </div>
            {Object.values(CHINA_MARKET_CATEGORIES).map(c => (
              <div 
                key={c.id} 
                className={`stea-category-card ${activeCat === c.label ? "stea-category-card--active" : ""}`}
                onClick={() => setActiveCat(c.label)}
              >
                <div className="stea-category-icon-wrap">
                  {c.emoji}
                </div>
                <span className="stea-category-label">
                  {c.label}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 20, color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{filtered.length} bidhaa zinapatikana</div>

          {loading ? (
             <div className="market-products-grid">
                {[1,2,3,4,5,6].map(i => <div key={i} style={{ minHeight: 260, borderRadius: 16, background: "rgba(255,255,255,0.03)" }} />)}
             </div>
          ) : filtered.length === 0 ? (
             <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Hakuna Bidhaa</h3>
                <p style={{ color: "rgba(255,255,255,.5)", marginTop: 8, marginBottom: 24 }}>Jaribu kubadilisha kategoria au utafutaji.</p>
                <button onClick={() => { setSearchQ(""); setActiveCat("Zote"); }} style={{ background: "none", border: "none", color: G, fontWeight: 800, cursor: "pointer", fontSize: 15 }}>Onyesha Zote →</button>
             </div>
          ) : (
             <div className="market-products-grid">
                {filtered.map(p => <ChabaProductCard key={p.id} product={p} />)}
             </div>
          )}
       </div>

    </div>
  );
}
