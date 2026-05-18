import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getFirebaseDb, collection, query, onSnapshot,
  limit, updateDoc, doc, increment
} from "../firebase.js";
import { useMobile } from "../hooks/useMobile.js";
import { Search, ChevronLeft, X } from "lucide-react";
import SEOHead from "../components/SEOHead.jsx";
import { PromptLabCard } from "../components/PromptLabCard.jsx";
import { useSearch as useSearchHook } from "../hooks/useSearch.js";
import { useCustomCategories } from "../hooks/useCustomCategories.js";
import { useMultiCollection } from "../hooks/useMultiCollection.js";

const G = "#F5A623";
const BG = "#0a0b0f";
const CARD_BG = "#10121A";

export default function PromptLabPage() {
  const isMobile = useMobile();
  const location = useLocation();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState(location.state?.cat || "All");
  const [displayLimit, setDisplayLimit] = useState(12);
  const db = getFirebaseDb();

  // Phase 1: Fetch with limit, expand on load more
  const { docs: multiDocs, loading: multiLoading } = useMultiCollection(["prompts", "prompt_lab", "promptLab"], "createdAt", 500);

  useEffect(() => {
    setDocs(multiDocs);
    setLoading(multiLoading);
  }, [multiDocs, multiLoading]);

  // Phase 2: custom categories from Firestore
  const { categories: customCats } = useCustomCategories("prompt_categories", docs);

  // Phase 1: debounced search
  const { query: searchQ, setQuery: setSearchQ, filtered: searchFiltered, isSearching } = useSearchHook(docs);

  useEffect(() => { setDisplayLimit(12); }, [searchQ, activeTag]);

  const allTags = useMemo(() => {
    const tags = new Set(customCats.map(c => c.name || c).filter(Boolean));
    docs.forEach(d => {
      if (d.category) tags.add(d.category);
      if (Array.isArray(d.tags)) d.tags.forEach(t => tags.add(t));
    });
    return ["All", ...Array.from(tags).sort()];
  }, [docs, customCats]);

  const filtered = useMemo(() => {
    if (activeTag === "All") return searchFiltered;
    return searchFiltered.filter(p =>
      p.category === activeTag || (Array.isArray(p.tags) && p.tags.includes(activeTag))
    );
  }, [searchFiltered, activeTag]);

  const handleLike = async (e, id) => {
    e.stopPropagation();
    try {
      await updateDoc(doc(db, "prompts", id), {
        likes: increment(1)
      });
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: BG, 
      color: "#fff", 
      fontFamily: "'Instrument Sans', system-ui, sans-serif",
      paddingTop: isMobile ? 80 : 100,
      paddingBottom: 60
    }}>
      <SEOHead 
        title="Prompt Lab — AI Prompts za Kiswahili na Kiingereza | STEA"
        description="Maktaba ya AI prompts bora kwa ChatGPT, Claude, Midjourney na AI nyingine. Nakili na tumia mara moja kwa biashara, elimu na ubunifu."
        keywords={["AI prompts Tanzania", "ChatGPT prompts Kiswahili", "AI prompts bure", "prompt lab Tanzania"]}
      />
      <div style={{ 
        maxWidth: 700, 
        margin: "0 auto", 
        padding: isMobile ? "0 16px" : "0 24px" 
      }}>
        
        {/* Back Button */}
        <button 
          onClick={() => window.history.back()}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 6, 
            background: "none", 
            border: "none", 
            color: "rgba(255,255,255,.5)", 
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 20,
            padding: 0
          }}
        >
          <ChevronLeft size={18} /> Rudi
        </button>

        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: isMobile ? 32 : 42, fontWeight: 800, margin: "0 0 8px", color: "#fff" }}>
            Prompt Lab
          </h1>
          <p style={{ fontSize: isMobile ? 15 : 17, color: "rgba(255,255,255,.6)", margin: 0 }}>
            Maktaba ya AI Prompts bora zilizojaribiwa kwa Kiswahili.
          </p>
        </header>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 24 }}>
          <Search 
            size={20} 
            style={{ 
              position: "absolute", 
              left: 16, 
              top: "50%", 
              transform: "translateY(-50%)", 
              color: "rgba(255,255,255,.4)" 
            }} 
          />
          <input 
            type="text"
            placeholder="Search Prompt Lab — e.g. logo, cinematic, business..."
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
        </div>

        {/* Tags */}
        <div style={{ 
          display: "flex", 
          gap: 8, 
          overflowX: "auto", 
          paddingBottom: 12, 
          marginBottom: 24,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={{
                whiteSpace: "nowrap",
                padding: "8px 16px",
                borderRadius: 99,
                background: activeTag === tag ? G : "rgba(255,255,255,.05)",
                color: activeTag === tag ? "#000" : "rgba(255,255,255,.7)",
                border: "none",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all .2s"
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* List */}
        {!loading && (
          <div style={{ marginBottom: 12, fontSize: 12, color: "rgba(255,255,255,.3)", fontWeight: 700 }}>
            {searchQ ? `${filtered.length} results for "${searchQ}"` : `${filtered.length} prompts`}
            {isSearching && " — searching…"}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {loading ? (
            [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)
          ) : filtered.length > 0 ? (
            <>
              {filtered.slice(0, displayLimit).map((p) => (
                <PromptLabCard key={p.id} p={p} onLike={handleLike} />
              ))}
              {filtered.length > displayLimit && (
                <div style={{ textAlign: "center", paddingTop: 8 }}>
                  <button
                    onClick={() => setDisplayLimit(n => n + 12)}
                    style={{ background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.12)", borderRadius:12, padding:"12px 28px", color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer" }}
                  >
                    Load more ({filtered.length - displayLimit} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,.05)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Search size={32} color="rgba(255,255,255,.3)" />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Hakuna matokeo</h3>
              <p style={{ color: "rgba(255,255,255,.5)", marginTop: 8 }}>
                {searchQ ? `No prompts match "${searchQ}". Try another keyword.` : "No prompts available."}
              </p>
              {searchQ && <button onClick={() => setSearchQ("")} style={{ marginTop: 16, background: "none", border: "none", color: G, fontWeight: 800, cursor: "pointer", fontSize: 14 }}>Clear search →</button>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ 
      background: CARD_BG, borderRadius: 16, border: "1px solid rgba(255,255,255,.07)", 
      overflow: "hidden", height: 400, position: "relative" 
    }}>
      <div className="skeleton-pulse" style={{ height: "70%", background: "rgba(255,255,255,.03)" }} />
      <div style={{ padding: 16 }}>
        <div className="skeleton-pulse" style={{ height: 20, width: "60%", background: "rgba(255,255,255,.03)", borderRadius: 4, marginBottom: 12 }} />
        <div className="skeleton-pulse" style={{ height: 40, width: "100%", background: "rgba(255,255,255,.03)", borderRadius: 12 }} />
      </div>
      <style>{`
        .skeleton-pulse {
          animation: pulse 1.5s infinite ease-in-out;
        }
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
