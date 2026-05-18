import React from "react";
import { Globe, Sparkles } from "lucide-react";
import LazyImage from "./LazyImage.jsx";

/**
 * WebsiteSolutionCard — Premium Platform-style Card
 * Used in Homepage and WebsiteSolutionsPage
 */
export function WebsiteSolutionCard({ site, isMobile }) {
  const ACCENT = "#0ea5e9";
  const G = "#F5A623";
  const BORDER = "rgba(255,255,255,.08)";

  const title = site.name || site.title || "Untitled Website";
  const desc = site.description || site.summary || "";
  const imageUrl = site.imageUrl || site.image || "";
  const category = String(site.subcategory || site.subCategory || site.category || site.categoryName || "").trim();

  return (
    <button
      onClick={() => site.url && window.open(site.url, "_blank", "noopener,noreferrer")}
      className="stea-btn"
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        background: "rgba(15, 17, 21, 0.6)",
        border: `1px solid ${BORDER}`,
        borderRadius: 18,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        fontFamily: "'Instrument Sans', system-ui, sans-serif",
        width: "100%",
        position: "relative",
        height: "100%",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(212,175,55,0.45)";
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.1)";
        if (e.currentTarget.querySelector('.card-img')) {
          e.currentTarget.querySelector('.card-img').style.transform = "scale(1.08)";
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = BORDER;
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
        if (e.currentTarget.querySelector('.card-img')) {
          e.currentTarget.querySelector('.card-img').style.transform = "scale(1)";
        }
      }}
    >
      {/* Image Container */}
      <div style={{ 
        width: "100%", 
        aspectRatio: "16 / 10", 
        background: "#0d0f1a", 
        position: "relative", 
        overflow: "hidden",
        borderBottom: `1px solid ${BORDER}`
      }}>
        {imageUrl ? (
          <LazyImage
            src={imageUrl}
            alt={title}
            className="card-img"
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover", 
              objectPosition: "center",
              display: "block",
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          />
        ) : (
          <div style={{ 
            width: "100%", 
            height: "100%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            background: "rgba(14,165,233,.06)" 
          }}>
            <Globe size={40} color="rgba(14,165,233,.2)" />
          </div>
        )}

        {/* Floating Gradient Overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 100%)",
          pointerEvents: "none"
        }} />

        {/* Category Badge — THE "thumbnail badge" FIX */}
        {/* Featured Icon */}
        {site.featured && (
          <div style={{ 
            position: "absolute", 
            top: 12, 
            right: 12, 
            background: "rgba(245,166,35,0.9)", 
            color: "#000", 
            width: 24, 
            height: 24, 
            borderRadius: "50%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(245,166,35,0.3)",
            zIndex: 2
          }}>
            <Sparkles size={12} fill="#000" />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div style={{ padding: "16px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 8 }}>
          <h3 style={{ 
            fontSize: 15, 
            fontWeight: 800, 
            color: "#fff", 
            margin: "0 0 4px", 
            lineHeight: 1.3, 
            display: "-webkit-box", 
            WebkitLineClamp: 1, 
            WebkitBoxOrient: "vertical", 
            overflow: "hidden" 
          }}>
            {title}
          </h3>
          {category && (
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              maxWidth: "100%",
              color: G,
              fontSize: 11,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: ".08em",
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}>
              <Globe size={11} />
              {category}
            </div>
          )}
        </div>

        <p style={{ 
          fontSize: 13, 
          color: "rgba(255,255,255,0.45)", 
          margin: "0 0 16px", 
          lineHeight: 1.5, 
          display: "-webkit-box", 
          WebkitLineClamp: 2, 
          WebkitBoxOrient: "vertical", 
          overflow: "hidden", 
          flex: 1 
        }}>
          {desc}
        </p>

        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          marginTop: "auto",
          paddingTop: 12,
          borderTop: "1px solid rgba(255,255,255,0.06)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: G, fontWeight: 800 }}>
             Visit site <ArrowRightIcon />
          </div>
          
          {site.url && (
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>
              {(() => {
                try {
                  const urlObj = new URL(site.url);
                  const hostname = urlObj.hostname;
                  const displayHost = hostname.replace('www.', '');
                  return (
                    <>
                      <div style={{ 
                        width: 14, 
                        height: 14, 
                        borderRadius: 3,
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.05)"
                      }}>
                        <img 
                          src={`https://s2.googleusercontent.com/s2/favicons?domain=${hostname}&sz=64`} 
                          alt="" 
                          style={{ width: "100%", height: "100%", objectFit: "contain" }} 
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                      {displayHost}
                    </>
                  );
                } catch (e) {
                  return "website";
                }
              })()}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-7-7 7 7-7 7"/>
    </svg>
  );
}
