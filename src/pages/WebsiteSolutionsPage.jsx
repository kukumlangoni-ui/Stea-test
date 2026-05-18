/**
 * WebsiteSolutionsPage — Phase 1+2+5
 * Route: /websites  /website-solutions
 * Fast debounced search · admin-created categories · lazy images
 * NOTE: Website Solutions = curated premium websites directory (movies, tools, etc.)
 *       NOT website design service (that lives in /services)
 */
import { useState, useMemo, useEffect } from "react";
import { Search, X, Globe, ArrowLeft, ExternalLink } from "lucide-react";
import { useMobile } from "../hooks/useMobile.js";
import { useCollection } from "../hooks/useFirestore.js";
import { useSearch } from "../hooks/useSearch.js";
import { useCustomCategories } from "../hooks/useCustomCategories.js";

import { WebsiteSolutionCard } from "../components/WebsiteSolutionCard.jsx";
import SEOHead from "../components/SEOHead.jsx";

const G      = "#F5A623";
const ACCENT = "#0ea5e9";
const BG     = "#06080f";
const BORDER = "rgba(255,255,255,.08)";

function Skel() {
  return (
    <div style={{
      borderRadius: 14, overflow: "hidden",
      background: "rgba(15, 17, 21, 0.4)",
      border: `1px solid ${BORDER}`,
      animation: "wspulse 1.6s ease-in-out infinite",
    }}>
      <div style={{ aspectRatio: "4 / 3", background: "rgba(255,255,255,.04)" }} />
      <div style={{ padding: "16px 20px" }}>
        <div style={{ height: 10, width: "30%", borderRadius: 4, background: "rgba(255,255,255,.05)", marginBottom: 12 }} />
        <div style={{ height: 16, width: "80%", borderRadius: 4, background: "rgba(255,255,255,.06)", marginBottom: 10 }} />
        <div style={{ height: 12, width: "95%", borderRadius: 4, background: "rgba(255,255,255,.04)", marginBottom: 16 }} />
        <div style={{ height: 12, width: "40%", borderRadius: 4, background: "rgba(255,255,255,.04)" }} />
      </div>
      <style>{`@keyframes wspulse{0%,100%{opacity:.5}50%{opacity:.8}}`}</style>
    </div>
  );
}

function EmptyState({ query, onClear }) {
  return (
    <div style={{ textAlign: "center", padding: "64px 20px" }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,.05)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
        <Globe size={28} color="rgba(255,255,255,.25)" />
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 8px" }}>
        {query ? `No results for "${query}"` : "No sites yet"}
      </h3>
      <p style={{ color: "rgba(255,255,255,.4)", margin: "0 0 20px", fontSize: 14 }}>
        {query ? "Try a different keyword — e.g. movie, AI, tools, streaming." : "Check back soon."}
      </p>
      {query && (
        <button onClick={onClear} style={{ background: G, border: "none", borderRadius: 10, padding: "10px 20px", color: "#000", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
          Clear search
        </button>
      )}
    </div>
  );
}

export default function WebsiteSolutionsPage() {
  const isMobile = useMobile();
  const { docs: rawDocs, loading } = useCollection("websites", "updatedAt", 800);
  const [activeCat, setActiveCat] = useState("All");
  const [displayLimit, setDisplayLimit] = useState(12);

  // Published sites only — relaxed for better visibility of legacy data
  const allDocs = useMemo(() =>
    (rawDocs || []).filter(d =>
      d.active !== false &&
      d.status !== "draft" &&
      d.status !== "pending_review"
    ),
    [rawDocs]
  );

  // Phase 2: custom categories from admin
  const { categories: customCats } = useCustomCategories("website_solution_categories", allDocs);

  // Phase 1: debounced search
  const { query: searchQ, setQuery: setSearchQ, filtered: searched, isSearching } = useSearch(allDocs);

  // Reset page on search/filter change
  useEffect(() => setDisplayLimit(12), [searchQ, activeCat]);

  // Category list
  const allCats = useMemo(() => {
    const fromCustom = customCats.map(c => c.name || c).filter(Boolean);
    if (fromCustom.length > 0) return ["All", ...fromCustom];
    const s = new Set();
    allDocs.forEach(d => {
      if (d.category) s.add(d.category);
      if (d.subcategory) s.add(d.subcategory);
      if (d.subCategory) s.add(d.subCategory);
      if (Array.isArray(d.tags)) d.tags.forEach(t => s.add(t));
    });
    return ["All", ...Array.from(s).sort()];
  }, [customCats, allDocs]);

  // Apply category filter
  const filtered = useMemo(() => {
    if (activeCat === "All") return searched;
    return searched.filter(d =>
      d.category === activeCat ||
      d.subcategory === activeCat ||
      d.subCategory === activeCat ||
      (Array.isArray(d.tags) && d.tags.includes(activeCat))
    );
  }, [searched, activeCat]);

  // Featured first, then by date
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [filtered]);

  const shown  = sorted.slice(0, displayLimit);
  const hasMore= sorted.length > displayLimit;

  return (
    <div style={{
      minHeight: "100vh", background: BG, color: "#fff",
      fontFamily: "'Instrument Sans', system-ui, sans-serif",
      padding: isMobile ? "80px 0 80px" : "110px 0 60px",
    }}>
      <SEOHead 
        title="Website Solutions — Tovuti Bora za Movies, AI, Streaming | STEA"
        description="Mkusanyiko wa tovuti bora Tanzania. Movies, AI tools, streaming, elimu — zilizochaguliwa kwa makini kwa Watanzania."
        keywords={["websites Tanzania", "tovuti za movies Tanzania", "AI websites Tanzania"]}
      />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: `0 clamp(16px,4vw,40px)` }}>

        {/* Back */}
        <button onClick={() => window.history.length > 1 ? window.history.back() : (window.location.href = "/")}
          style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "rgba(255,255,255,.5)", background: "rgba(255,255,255,.05)", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 28, fontFamily: "inherit" }}>
          <ArrowLeft size={14} /> Back
        </button>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 999, background: `${ACCENT}14`, border: `1px solid ${ACCENT}28`, color: ACCENT, fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>
            <Globe size={11} /> Website Solutions
          </div>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(28px,5vw,44px)", fontWeight: 900, letterSpacing: "-.04em", margin: "0 0 8px", lineHeight: 1.12 }}>
            Premium Websites
          </h1>
          <p style={{ color: "rgba(255,255,255,.45)", fontSize: isMobile ? 14 : 16, lineHeight: 1.65, maxWidth: 520, margin: 0 }}>
            Movies, AI tools, streaming, education — the best sites curated for Tanzania.
          </p>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 18 }}>
          <Search size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,.38)", pointerEvents: "none" }} />
          <input
            type="text"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder='Search — e.g. "movies", "AI tools", "streaming"...'
            style={{ width: "100%", height: 52, background: "rgba(255,255,255,.06)", border: `1px solid ${BORDER}`, borderRadius: 14, color: "#fff", padding: "0 46px 0 48px", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color .2s" }}
            onFocus={e => e.target.style.borderColor = `${ACCENT}60`}
            onBlur={e => e.target.style.borderColor = BORDER}
          />
          {searchQ && (
            <button onClick={() => setSearchQ("")} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.4)", padding: 4 }}>
              <X size={16} />
            </button>
          )}
          {isSearching && <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "rgba(255,255,255,.3)", fontWeight: 700 }}>Searching…</div>}
        </div>

        {/* Category chips */}
        {allCats.length > 1 && (
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 18, scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {allCats.map(cat => (
              <button key={cat} onClick={() => setActiveCat(cat)} style={{
                whiteSpace: "nowrap", padding: "7px 16px", borderRadius: 999, border: "none",
                background: activeCat === cat ? ACCENT : "rgba(255,255,255,.06)",
                color: activeCat === cat ? "#fff" : "rgba(255,255,255,.7)",
                fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all .15s",
                fontFamily: "inherit",
              }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Count */}
        {!loading && (
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.3)", fontWeight: 700, marginBottom: 18 }}>
            {searchQ
              ? `${sorted.length} result${sorted.length !== 1 ? "s" : ""} for "${searchQ}"`
              : `${sorted.length} site${sorted.length !== 1 ? "s" : ""}`}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(auto-fill, minmax(160px, 1fr))" : "repeat(auto-fill, minmax(280px, 1fr))", gap: isMobile ? 12 : 22 }}>
            {Array.from({ length: 8 }).map((_, i) => <Skel key={i} />)}
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState query={searchQ} onClear={() => setSearchQ("")} />
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(auto-fill, minmax(160px, 1fr))" : "repeat(auto-fill, minmax(280px, 1fr))", gap: isMobile ? 12 : 22 }}>
              {shown.map(site => <WebsiteSolutionCard key={site.id} site={site} isMobile={isMobile} />)}
            </div>
            {hasMore && (
              <div style={{ textAlign: "center", marginTop: 32 }}>
                <button onClick={() => setDisplayLimit(n => n + 12)} style={{ background: "rgba(255,255,255,.06)", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "12px 28px", color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                  Load more ({sorted.length - displayLimit} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
