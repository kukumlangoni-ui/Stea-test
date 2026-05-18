import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Search, X, Sparkles, ChevronRight, ArrowLeft } from "lucide-react";
import { useMobile } from "../hooks/useMobile.js";
import { useCollection } from "../hooks/useFirestore.js";
import { useSettings } from "../contexts/SettingsContext";
import SEOHead from "../components/SEOHead.jsx";
import DigitalCheckoutModal from "../components/DigitalCheckoutModal.jsx";
import EmptyState from "../components/EmptyState";
import { Skeleton } from "../components/Skeleton.jsx";

const G = "#F5A623";

// Simple Width Container
const W = ({ children, style }) => (
  <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,5vw,32px)", ...style }}>
    {children}
  </div>
);

// Section Heading
const SHead = ({ title, hi, copy }) => (
  <div>
    <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "clamp(24px,5vw,42px)", fontWeight: 900, letterSpacing: "-.04em", margin: "0 0 12px", lineHeight: 1.1 }}>
      {title} <span style={{ color: G }}>{hi}</span>
    </h2>
    {copy && <p style={{ color: "rgba(255,255,255,.5)", fontSize: 16, lineHeight: 1.6, maxWidth: 520, margin: 0 }}>{copy}</p>}
  </div>
);

export default function DigitalToolsPage({ goPage }) {
  const isMobile = useMobile();
  const location = useLocation();
  const { t } = useSettings();
  const { docs: dealsDocs, loading: dealsLoading } = useCollection("deals", "createdAt");
  const { docs: plansDocs, loading: plansLoading } = useCollection("subscription_plans", "createdAt");
  
  const [searchQ, setSearchQ] = useState(location.state?.q || "");
  const [debouncedSearch, setDebouncedSearch] = useState(location.state?.q || "");
  const [activeCat, setActiveCat] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [checkoutType, setCheckoutType] = useState("tool");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQ);
    }, 400); 
    return () => clearTimeout(timer);
  }, [searchQ]);

  const deals = useMemo(() => (dealsDocs || []).filter((d) => d.status === "published" || d.active !== false), [dealsDocs]);
  const plans = plansDocs || [];
  
  const dynamicCats = useMemo(() => {
    const cats = new Set();
    deals.forEach(d => {
      if (d.category) cats.add(d.category);
    });
    return ["All", ...Array.from(cats).sort()];
  }, [deals]);

  const filteredDeals = useMemo(() => {
    const q = (debouncedSearch || "").toLowerCase();
    return deals.filter(d => {
      const searchable = [d.title, d.name, d.category, d.description, ...(Array.isArray(d.tags) ? d.tags : []), d.slug].join(" ").toLowerCase();
      const matchesSearch = !q || searchable.includes(q);
      const matchesCat = activeCat === "All" || d.category === activeCat || (Array.isArray(d.tags) && d.tags.includes(activeCat));
      return matchesSearch && matchesCat;
    });
  }, [deals, debouncedSearch, activeCat]);

  return (
    <section style={{ padding: isMobile ? "clamp(80px,14vw,100px) 0 60px" : "100px 0 60px", minHeight:"100vh", background: "#06080f" }}>
      <SEOHead 
        title="Zana za Kidijitali — Canva Pro, ChatGPT Plus Tanzania | STEA"
        description="Pata Canva Pro, ChatGPT Plus, tools za kazi kwa bei nafuu Tanzania. Subscriptions za kidijitali zilizoidhinishwa na STEA."
        keywords={["Canva Pro Tanzania", "ChatGPT Tanzania", "digital tools Tanzania", "subscriptions Tanzania"]}
      />
      <W>
        <button onClick={() => window.history.length > 1 ? window.history.back() : goPage("home")}
          style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 16px", borderRadius:12,
            background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)",
            color:"rgba(255,255,255,.6)", cursor:"pointer", fontSize:13, fontWeight:700,
            transition:"all .18s", marginBottom:24 }}
          onMouseEnter={e => { e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor="rgba(255,255,255,.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.color="rgba(255,255,255,.6)"; e.currentTarget.style.borderColor="rgba(255,255,255,.1)"; }}>
          <ArrowLeft size={16} /> Back
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
        {(!plansLoading && plans.length > 0 && activeCat === "All" && !debouncedSearch) && (
          <div style={{ marginBottom: 48 }}>
             <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, letterSpacing: "-.02em" }}>Subscriptions</h3>
             <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
               {plans.filter(p => p.status !== "draft").map(p => (
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
               ))}
             </div>
          </div>
        )}

        {/* Digital Tools / Deals Section */}
        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, letterSpacing: "-.02em" }}>
          {debouncedSearch || activeCat !== "All" ? "Search Results" : "Other Digital Tools"}
        </h3>
        <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(300px,1fr))", gap:isMobile?16:20, alignItems:"start" }}>
          {dealsLoading ? (
            [1, 2, 3].map((i) => <Skeleton key={i} />)
          ) : filteredDeals.length > 0 ? (
            filteredDeals.map((d, i) => (
              <ToolCard key={d.id || i} d={d} onClick={() => goPage("tool-detail", { id: d.id })} />
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1" }}>
              <EmptyState 
                title={t("empty_no_results")} 
                message="Bado tunatafuta tools bora zaidi kwa ajili yako. Tafadhali rudi baadaye."
                actionText="View All Tools"
                onAction={() => { setSearchQ(""); setActiveCat("All"); }}
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

function ToolCard({ d, onClick }) {
  const [imgErr, setImgErr] = useState(false);
  const thumb = d.imageUrl || d.image || "";

  return (
    <div 
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,.03)",
        border: "1px solid rgba(255,255,255,.07)",
        borderRadius: 20,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all .2s"
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,.15)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,.07)";
      }}
    >
      <div style={{ aspectRatio: "16/9", background: "rgba(255,255,255,.05)", position: "relative" }}>
        {thumb && !imgErr ? (
          <img src={thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setImgErr(true)} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", fontSize: 32, opacity: .1 }}>🛠️</div>
        )}
        <div style={{ position: "absolute", top: 12, right: 12, background: G, color: "#000", padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 900 }}>
          {d.newPrice || d.price || "FREE"}
        </div>
      </div>
      <div style={{ padding: 20 }}>
        <h4 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 8px", color: "#fff" }}>{d.title || d.name}</h4>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)", lineHeight: 1.5, margin: "0 0 16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {d.description}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,.3)", fontWeight: 700, textTransform: "uppercase" }}>{d.category}</span>
          <ChevronRight size={16} color={G} />
        </div>
      </div>
    </div>
  );
}
