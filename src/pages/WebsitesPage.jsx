import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, X, Globe, ChevronRight } from "lucide-react";
import { useMobile } from "../hooks/useMobile.js";
import { useCollection } from "../hooks/useFirestore.js";

const G = "#D4AF37";

// Simple Width Container
const W = ({ children, style }) => (
  <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,5vw,32px)", ...style }}>
    {children}
  </div>
);

export default function WebsitesPage() {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { docs: websitesDocs, loading: websitesLoading } = useCollection("website_solutions", "createdAt");
  
  // Internal search state (for input)
  const [searchQ, setSearchQ] = useState(location.state?.q || "");
  // Debounced search state (for filtering)
  const [debouncedSearch, setDebouncedSearch] = useState(location.state?.q || "");
  const [activeTag, setActiveTag] = useState("All");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQ);
    }, 400); 
    return () => clearTimeout(timer);
  }, [searchQ]);

  // SEO title update
  useEffect(() => {
    document.title = `Website Solutions — STEA`;
    return () => { document.title = "STEA — Kila Kitu Mahali Pamoja"; };
  }, []);

  // Collect unique tags from actual data
  const allTags = useMemo(() => {
    const tags = new Set();
    (websitesDocs || []).forEach(w => {
      if (w.status !== "published") return;
      if (w.category) tags.add(w.category);
      // Only include subCategory if requested, user said "admin-created categories only"
      // we extract them from the docs which the admin manages.
    });
    return Array.from(tags).sort();
  }, [websitesDocs]);

  // Filtering
  const websites = useMemo(() => {
    const q = (debouncedSearch || "").toLowerCase();
    
    return (websitesDocs || []).filter(w => {
      const isVisible = w.status === "published";
      if (!isVisible) return false;

      // Tag match
      if (activeTag !== "All") {
        const matchesCat = w.category === activeTag;
        const matchesSub = w.subCategory === activeTag;
        const matchesTags = Array.isArray(w.tags) && w.tags.includes(activeTag);
        if (!matchesCat && !matchesSub && !matchesTags) return false;
      }

      // search match
      if (q) {
        const title = (w.title || w.name || "").toLowerCase();
        const desc = (w.description || "").toLowerCase();
        const cat = (w.category || "").toLowerCase();
        const subCat = (w.subCategory || "").toLowerCase();
        const tags = Array.isArray(w.tags) ? w.tags.join(" ").toLowerCase() : "";
        const keywords = (w.searchKeywords || "").toLowerCase();

        return title.includes(q) || 
               desc.includes(q) || 
               cat.includes(q) || 
               subCat.includes(q) || 
               tags.includes(q) || 
               keywords.includes(q);
      }

      return true;
    });
  }, [websitesDocs, activeTag, debouncedSearch]);

  const resetFilters = () => {
    setActiveTag("All");
    setSearchQ("");
  };

  return (
    <section style={{ padding: isMobile ? "clamp(80px,14vw,100px) 0 80px" : "clamp(100px,10vw,130px) 0 60px", minHeight: "100vh", background: "#06080f" }}>
      <W>
        {/* Back button */}
        <button onClick={() => window.history.length > 1 ? window.history.back() : navigate("/")}
          style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,.5)", background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:12, padding:"8px 16px", cursor:"pointer", marginBottom:24, fontSize:13, fontWeight:700, transition:"all .18s", WebkitTapHighlightColor:"transparent" }}
          onMouseEnter={e=>{e.currentTarget.style.color="#fff";}} onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,.5)";}}>
          ← Back
        </button>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"5px 14px", borderRadius:999, background:"rgba(245,166,35,.1)", border:"1px solid rgba(245,166,35,.22)", color:G, fontSize:11, fontWeight:900, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>
            🌐 Website Solutions
          </div>
          <h1 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:"clamp(28px,5vw,42px)", fontWeight:900, letterSpacing:"-.04em", margin:"0 0 8px", lineHeight:1.15 }}>
            Useful Websites
          </h1>
          <p style={{ color:"rgba(255,255,255,.45)", fontSize:isMobile?15:17, lineHeight:1.6, maxWidth:520, margin:0 }}>
            Tafuta websites bora kwa ajili ya movies, elimu, zana za AI, na mengine mengi.
          </p>
        </div>

        {/* Search Input */}
        <div style={{ position: "relative", marginBottom: 24 }}>
          <Search size={20} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,.4)" }} />
          <input
            type="text"
            placeholder="Tafuta website — e.g. movies, tools, ChatGPT..."
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            style={{
              width: "100%",
              height: 56,
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 16,
              color: "#fff",
              padding: "0 16px 0 48px",
              fontSize: 16,
              outline: "none",
              transition: "border-color .2s",
            }}
            onFocus={(e) => e.target.style.borderColor = G}
            onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,.1)"}
          />
          {searchQ && (
            <button onClick={() => setSearchQ("")} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,.4)", cursor: "pointer" }}>
              <X size={20} />
            </button>
          )}
        </div>

        {/* Tag Pills */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, marginBottom: 24, scrollbarWidth: "none", msOverflowStyle: "none" }} className="no-scrollbar">
          <button
            onClick={resetFilters}
            style={{
              whiteSpace: "nowrap", padding: "8px 20px", borderRadius: 99,
              background: activeTag === "All" ? G : "rgba(255,255,255,.05)",
              color: activeTag === "All" ? "#000" : "rgba(255,255,255,.6)",
              border: activeTag === "All" ? "none" : "1px solid rgba(255,255,255,.1)",
              fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all .2s"
            }}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={{
                whiteSpace: "nowrap", padding: "8px 20px", borderRadius: 99,
                background: activeTag === tag ? G : "rgba(255,255,255,.05)",
                color: activeTag === tag ? "#000" : "rgba(255,255,255,.6)",
                border: activeTag === tag ? "none" : "1px solid rgba(255,255,255,.1)",
                fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all .2s"
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!websitesLoading && (
          <div style={{ marginBottom: 20, fontSize: 13, color: "rgba(255,255,255,.3)", fontWeight: 700 }}>
            {websites.length} website{websites.length !== 1 ? 's' : ''} found
          </div>
        )}

        {/* Grid / Empty State */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile?"1fr":"repeat(auto-fill,minmax(300px,1fr))", gap: isMobile ? 16 : 24 }}>
          {websitesLoading ? (
            [1,2,3,4,5,6].map(i => (
              <div key={i} style={{ aspectRatio:"16/10", borderRadius:20, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", animation: "pulse 1.5s infinite ease-in-out" }} />
            ))
          ) : websites.length > 0 ? (
            websites.map((w, i) => <WebsiteCard key={w.id || i} w={w} />)
          ) : (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🌐</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Hakuna matokeo</h3>
              <p style={{ color: "rgba(255,255,255,.5)", marginTop: 8, marginBottom: 24 }}>Jaribu kutafuta kitu kingine.</p>
              <button 
                onClick={resetFilters}
                style={{ background: "none", border: "none", color: G, fontWeight: 800, cursor: "pointer", fontSize: 15 }}
              >
                Angalia Zote →
              </button>
            </div>
          )}
        </div>
      </W>
      <style>{`
        @keyframes pulse {
           0% { opacity: 0.5; }
           50% { opacity: 1; }
           100% { opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}

function WebsiteCard({ w }) {
  const isMobile = useMobile();
  const [iconError, setIconError] = useState(false);
  
  const handleClick = () => {
    if (w.url) {
      window.open(w.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div 
      onClick={handleClick}
      style={{
        background: "rgba(255,255,255,.03)",
        border: "1px solid rgba(255,255,255,.07)",
        borderRadius: 20,
        padding: 20,
        cursor: "pointer",
        transition: "all .24s cubic-bezier(0.16, 1, 0.3, 1)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        position: "relative",
        overflow: "hidden"
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "rgba(255,255,255,.06)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,.15)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "rgba(255,255,255,.03)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,.07)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,.05)", display: "grid", placeItems: "center", overflow: "hidden", position: "relative" }}>
          {w.iconUrl && !iconError ? (
            <img src={w.iconUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setIconError(true)} />
          ) : w.url ? (
            <img src={`https://s2.googleusercontent.com/s2/favicons?domain=${(() => { try { return new URL(w.url).hostname } catch(e){return ''} })()}&sz=64`} alt="" style={{ width: "65%", height: "65%", objectFit: "contain" }} onError={() => setIconError(true)} />
          ) : (
            <Globe size={24} color="rgba(255,255,255,.3)" />
          )}
        </div>
        <div style={{ background: "rgba(255,255,255,.05)", padding: "4px 10px", borderRadius: 8, fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".05em", color: "rgba(255,255,255,.5)" }}>
          {w.category || "General"}
        </div>
      </div>
      
      <div>
        <h3 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 6px", color: "#fff" }}>{w.title}</h3>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)", lineHeight: 1.5, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {w.description}
        </p>
      </div>

      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: G }}>Visit Site</span>
        <ChevronRight size={16} color={G} />
      </div>
    </div>
  );
}
