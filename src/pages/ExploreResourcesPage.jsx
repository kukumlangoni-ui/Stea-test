import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import { useMobile } from "../hooks/useMobile.js";
import { useCollectionWhere } from "../hooks/useFirestore.js";
import { ResourceExploreCard, ResourceModal } from "../components/explore/ExploreCards.jsx";
import ComingSoonCard from "../components/ComingSoonCard.jsx";

export default function ExploreResourcesPage({ goPage }) {
  const isMobile = useMobile();
  const [search, setSearch] = useState("");
  const [activeResource, setActiveResource] = useState(null);
  const [pricingFilter, setPricingFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const { docs: productsDocs, loading } = useCollectionWhere("products", "sector", "==", "marketplace", "createdAt", 100);

  const rawResources = useMemo(() => {
    return productsDocs.filter(d => !d.category || d.category.toLowerCase().includes('digital') || d.category.toLowerCase().includes('pdf') || d.category.toLowerCase().includes('resource'));
  }, [productsDocs]);

  const fileTypes = ["All", ...Array.from(new Set(rawResources.map(r => r.fileType || "PDF")))];

  const filteredResources = useMemo(() => {
    return rawResources.filter(r => {
      if (typeFilter !== "All" && (r.fileType || "PDF") !== typeFilter) return false;
      
      const isFree = !r.price || r.price === 0 || r.price === "0";
      if (pricingFilter === "Free" && !isFree) return false;
      if (pricingFilter === "Paid" && isFree) return false;

      if (search) {
        const query = search.toLowerCase();
        if (!r.title?.toLowerCase().includes(query) && !r.description?.toLowerCase().includes(query)) return false;
      }
      return true;
    });
  }, [rawResources, search, typeFilter, pricingFilter]);

  return (
    <div style={{ minHeight: "100vh", background: "#05060a", color: "#fff" }}>
      {/* Header */}
      <div style={{ padding: "clamp(80px, 10vw, 110px) clamp(16px,4vw,48px) 20px", position: "relative" }}>
        {/* Refined Back Button */}
        {goPage && (
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => goPage("explore")}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 44, height: 44, borderRadius: 12,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              color: "#fff", cursor: "pointer",
              marginBottom: 24
            }}
          >
            <ArrowLeft size={20} />
          </motion.button>
        )}
        <h1 style={{ fontSize: isMobile ? 32 : 48, fontWeight: 900, marginTop: 0, marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,.05)" }}>
          Digital Resources
        </h1>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "8px 16px", flex: "1 1 280px" }}>
             <Search size={18} color="rgba(255,255,255,.4)" />
             <input type="text" placeholder="Search templates, guides..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: "none", border: "none", color: "#fff", fontSize: 15, outline: "none", flex: 1 }} />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <select value={pricingFilter} onChange={e => setPricingFilter(e.target.value)} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff", padding: "8px 16px", borderRadius: 10, outline: "none", fontSize: 14 }}>
              <option value="All" style={{ background: "#111" }}>All Prices</option>
              <option value="Free" style={{ background: "#111" }}>Free</option>
              <option value="Paid" style={{ background: "#111" }}>Premium</option>
            </select>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff", padding: "8px 16px", borderRadius: 10, outline: "none", fontSize: 14 }}>
              {fileTypes.map(t_val => <option key={t_val} value={t_val} style={{ background: "#111" }}>{t_val}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 clamp(16px,4vw,48px) 100px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(5, 1fr)", gap: 20 }}>
          {loading ? (
             [1,2,3,4,5].map(i => <div key={i} style={{ height: 200, background: "rgba(255,255,255,.03)", borderRadius: 20 }} />)
          ) : filteredResources.length === 0 ? (
             <div style={{ gridColumn: "1/-1" }}>
               <ComingSoonCard 
                 title="More Resources Incoming"
                 subtitle="We are preparing new templates and guides for you."
                 iconType="construction"
               />
             </div>
          ) : (
            filteredResources.map(resource => <ResourceExploreCard key={resource.id} item={resource} onClick={() => setActiveResource(resource)} />)
          )}
        </div>
      </div>

      {activeResource && <ResourceModal item={activeResource} onClose={() => setActiveResource(null)} />}
    </div>
  );
}
