/**
 * HomePageV2.jsx — STEA Africa
 * Stack: React + Firebase + Framer Motion
 * Mobile-first · marketplace-first · dark premium UI
 *
 * Section order (revenue-optimised):
 *  1  Hero + search + CTAs
 *  2  Quick access chips
 *  3  Core 4 sector cards
 *  4  STEA Tanzania Marketplace  ← MAIN REVENUE
 *  5  Agiza China / Global Imports
 *  6  AI & Digital Tools grid
 *  7  Services + promote CTA
 *  8  Learning & Courses
 *  9  Prompt Lab preview
 */
import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, ChevronRight, ArrowRight,
  Zap, GraduationCap, ShoppingBag, Globe,
  Sparkles, BookOpen, Shield, Star,
  RefreshCw, TrendingUp, MessageCircle, ExternalLink,
  Lightbulb, Briefcase, ShoppingCart, Bell, Mail, Trophy
} from "lucide-react";
import { useCollection, useCollectionWhere } from "../hooks/useFirestore.js";
import { useMultiCollection } from "../hooks/useMultiCollection.js";
import { MarketplaceProductCard } from "../components/MarketplaceProductCard.jsx";
import { PromptLabCard } from "../components/PromptLabCard.jsx";
import { WebsiteSolutionCard } from "../components/WebsiteSolutionCard.jsx";
import { CourseCard } from "../components/CourseCard.jsx";
import { BannerAd } from "../components/SponsoredAdsSection.jsx";
import AdSlot from "../components/AdSlot.jsx";
import SEOHead from "../components/SEOHead.jsx";
import ContentCard from "../components/ContentCard.jsx";
import { useMobile } from "../hooks/useMobile.js";
import { routeSearchQuery } from "../utils/searchRouting.js";

const G = "#F5A623";
const CB = "#0e101a"; // Dark background 

const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
  >
    {children}
  </motion.div>
);

const W = ({ children, style = {} }) => (
  <div className="stea-w" style={style}>{children}</div>
);

const Sec = ({ children, accent, style = {} }) => (
  <section
    className="stea-section"
    style={{ background: accent ? `${accent}06` : "transparent", ...style }}
  >
    {children}
  </section>
);

function SHead({ label, labelColor = G, labelIcon, title, desc, action, actionText = "View all" }) {
  return (
    <div className="stea-shead">
      {label && (
        <div className="stea-label" style={{ background: `${labelColor}12`, border: `1px solid ${labelColor}22`, color: labelColor }}>
          {labelIcon} {label}
        </div>
      )}
      <div className="stea-shead__row">
        <h2 className="stea-shead__title">{title}</h2>
        {action && (
          <button className="stea-shead__action" onClick={action}>
            {actionText} <ChevronRight size={14} />
          </button>
        )}
      </div>
      {desc && <p className="stea-shead__desc">{desc}</p>}
    </div>
  );
}

const HScroll = ({ children }) => (
  <div className="stea-hscroll no-scrollbar">{children}</div>
);

const ProdSkel = () => <div className="stea-skeleton stea-skeleton--product" style={{ flexShrink: 0 }} />;
const CourseSkel = () => (
  <div style={{
    width: "100%", aspectRatio: "4/3", borderRadius: 14, overflow: "hidden",
    background: "rgba(15,17,21,0.6)", border: "1px solid rgba(255,255,255,0.08)",
    animation: "stea-pulse 1.5s infinite ease-in-out"
  }}>
    <div style={{ width: "100%", height: "60%", background: "rgba(255,255,255,0.04)" }} />
    <div style={{ padding: 16 }}>
      <div style={{ width: "40%", height: 10, background: "rgba(255,255,255,0.04)", borderRadius: 4, marginBottom: 10 }} />
      <div style={{ width: "80%", height: 14, background: "rgba(255,255,255,0.06)", borderRadius: 4, marginBottom: 8 }} />
      <div style={{ width: "60%", height: 12, background: "rgba(255,255,255,0.03)", borderRadius: 4 }} />
    </div>
    <style>{`@keyframes stea-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.8; } }`}</style>
  </div>
);

function diversify(items, max = 8) {
  if (!items?.length) return [];
  const seen = new Set();
  const byCat = {};
  items.forEach(p => {
    if (seen.has(p.id)) return;
    const c = p.category || "other";
    (byCat[c] = byCat[c] || []).push(p);
  });
  const cats = Object.keys(byCat);
  const out = [];
  let round = 0;
  while (out.length < max) {
    let added = false;
    for (const c of cats) {
      if (out.length >= max) break;
      const item = byCat[c][round];
      if (item && !seen.has(item.id)) { seen.add(item.id); out.push(item); added = true; }
    }
    round++;
    if (!added) break;
  }
  return out;
}

// ─── 1. HERO ──────────────────────────────────────────────────────

function AnimatedStat({ end, suffix, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let triggered = false;
    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        const duration = 2000;
        const start = Date.now();
        const update = () => {
          const p = Math.min((Date.now() - start) / duration, 1);
          // easeOutExpo
          const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          setCount(Math.round(ease * end));
          if (p < 1) frame = requestAnimationFrame(update);
        };
        frame = requestAnimationFrame(update);
      }
    }, { threshold: 0.1 });
    
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [end]);

  return (
    <div style={{ textAlign: "center" }} ref={ref}>
      <div className="stea-stat__num">{count}{suffix}</div>
      <div className="stea-stat__label">{label}</div>
    </div>
  );
}

function HeroSection({ goPage }) {
  const [q, setQ] = useState("");
  const run = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    goPage(routeSearchQuery(q), { q: q.trim() });
  };

  return (
    <section className="stea-hero">
      <div aria-hidden style={{ position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)", width: "min(700px,160vw)", height: "min(500px,130vw)", borderRadius: "50%", background: "radial-gradient(ellipse,rgba(245,166,35,.07) 0%,transparent 65%)", pointerEvents: "none" }} />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }} style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: `${G}14`, border: `1px solid ${G}28`, borderRadius: 999, padding: "6px 16px", marginBottom: 22 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: G, display: "inline-block" }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: G, letterSpacing: ".04em" }}>Tanzania's #1 digital super app</span>
        </div>
        <h1 className="stea-hero__headline">AI Tools, Learning & Opportunities for <span style={{ color: G }}>African Students and Creators</span></h1>
        <p className="stea-hero__sub">Check results, learn AI skills, discover digital tools, and find products or opportunities inside one premium STEA ecosystem.</p>
        <form onSubmit={run} className="stea-search">
          <div className="stea-search__icon"><Search size={17} /></div>
          <input className="stea-search__input" value={q} onChange={e => setQ(e.target.value)} placeholder="Search courses, tools, marketplace, exams..." />
          <button type="submit" className="stea-search__btn">Search</button>
        </form>
        <div className="stea-cta-row">
          <button className="stea-btn stea-btn--primary" onClick={() => goPage("exams/results")}>
            <GraduationCap size={15} /> Check Results
          </button>
          <button className="stea-btn stea-btn--outline" onClick={() => goPage("courses")}><BookOpen size={15} /> Learn AI Skills</button>
          <button className="stea-btn stea-btn--outline" onClick={() => goPage("duka/phones")}><ShoppingBag size={15} /> Explore Marketplace</button>
        </div>

        <AdSlot id="home-after-hero" type="in-feed" />

        <div className="stea-stats">
          {[
            { end: 50, suffix: "K+", label: "Students & creators" },
            { end: 2, suffix: "K+", label: "Products & tools" },
            { end: 100, suffix: "+", label: "Guides & prompts" }
          ].map((s) => (
            <AnimatedStat key={s.label} end={s.end} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ─── 3. SECTORS ───────────────────────────────────────────────────
const TRENDING_RESULTS = [
  { title: "CSEE 2024 Results", path: "necta/csee/2024", meta: "Form Four schools" },
  { title: "ACSEE 2024 Results", path: "necta/acsee/2024", meta: "Form Six schools" },
  { title: "FTNA 2024 Results", path: "necta/ftna/2024", meta: "Form Two results" },
  { title: "Top Schools", path: "results/top-schools", meta: "Ranking and discovery" },
];

function TrafficEngineSection({ goPage, updates, learning, updatesLoading, learningLoading }) {
  const [email, setEmail] = useState("");
  const latestUpdates = (updates || []).filter(d => d.status !== "draft" && d.published !== false).slice(0, 3);
  const latestLearning = (learning || []).filter(d => d.status !== "draft" && d.published !== false).slice(0, 3);

  const saveEmail = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      const current = JSON.parse(localStorage.getItem("stea_email_interest") || "[]");
      localStorage.setItem("stea_email_interest", JSON.stringify([...new Set([...current, email.trim()])]));
    } catch {}
    setEmail("");
  };

  return (
    <Sec accent={G}>
      <W>
        <Reveal>
          <SHead
            label="Trending now"
            labelIcon={<TrendingUp size={11}/>}
            title="Results, skills and updates people are searching for"
            desc="Built for recurring student traffic, useful content, and premium monetization without clutter."
          />
        </Reveal>
        <div className="stea-growth-grid">
          <Reveal>
            <div className="stea-panel">
              <div className="stea-label" style={{ background:`${G}12`, border:`1px solid ${G}22`, color:G }}>
                <Trophy size={11}/> Trending results
              </div>
              <div className="stea-trending-list">
                {TRENDING_RESULTS.map((item) => (
                  <button key={item.path} className="stea-trending-row stea-btn" onClick={() => goPage(item.path)}>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.meta}</span>
                    </div>
                    <ArrowRight size={16} color={G}/>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="stea-panel">
              <div className="stea-label" style={{ background:"rgba(16,185,129,.12)", border:"1px solid rgba(16,185,129,.22)", color:"#10b981" }}>
                <Bell size={11}/> Latest updates
              </div>
              <div className="stea-trending-list">
                {updatesLoading && latestUpdates.length === 0 ? [1,2,3].map(i => <div key={i} className="stea-skeleton" style={{ height: 54 }} />) : latestUpdates.length ? latestUpdates.map((item) => (
                  <button key={item.id} className="stea-trending-row stea-btn" onClick={() => goPage("exams/updates")}>
                    <div>
                      <strong>{item.title || item.name || "Student update"}</strong>
                      <span>{item.category || "Student updates"}</span>
                    </div>
                    <ChevronRight size={16} color="#10b981"/>
                  </button>
                )) : (
                  <p style={{ color:"rgba(255,255,255,.45)", fontSize:13, lineHeight:1.6, margin:0 }}>Latest Firestore updates will appear here when published.</p>
                )}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div style={{ marginTop: 22 }}>
            <SHead
              label="Latest learning"
              labelColor="#10b981"
              labelIcon={<BookOpen size={11}/>}
              title="Fresh guides for AI, money, creators and digital skills"
              action={() => goPage("tech/tips-resources")}
              actionText="Open guides"
            />
            <div className="stea-content-grid stea-content-grid--fresh-guides">
              {learningLoading && latestLearning.length === 0 ? [1,2,3].map(i => <div key={i} className="stea-skeleton stea-skeleton--fresh-guide" style={{ minHeight: 260 }} />) : latestLearning.length ? latestLearning.map(item => (
                <ContentCard key={`${item._collection || "content"}-${item.id}`} item={item} onClick={() => item.slug ? goPage(`r/${item.slug}`) : goPage("tech/tips-resources")} />
              )) : (
                ["AI tutorials", "Student guides", "Creator tools"].map((title) => (
                  <ContentCard key={title} item={{ title, category: "Coming soon", summary: "Firestore-published content will appear here automatically." }} onClick={() => goPage("tech/tips-resources")} />
                ))
              )}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="stea-panel" style={{ marginTop: 22 }}>
            <div className="stea-label" style={{ background:`${G}12`, border:`1px solid ${G}22`, color:G }}>
              <Mail size={11}/> Stay updated
            </div>
            <h2 className="stea-shead__title">Get result alerts, AI guides and digital opportunities</h2>
            <p className="stea-shead__desc">A lightweight retention layer for future email/notification campaigns. This does not replace Firestore content.</p>
            <form className="stea-email-capture" onSubmit={saveEmail}>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Enter your email for STEA updates" />
              <button type="submit">Notify me</button>
            </form>
          </div>
        </Reveal>
      </W>
    </Sec>
  );
}

const SECTORS = [
  { id:"student", icon:<GraduationCap size={22}/>, title:"Student center",    desc:"NECTA results, past papers, notes, AI assistant, scholarships & university guide.", color:"#10b981", cta:"Open student center",  path:"exams",     badge:"Free" },
  { id:"tech",    icon:<Lightbulb size={22}/>,      title:"Tech hub",          desc:"AI Lab, Prompt Lab, digital tools, website solutions and daily tech tips.",          color:"#7F77DD", cta:"Explore AI tools",     path:"tech",    badge:"AI powered" },
  { id:"biz",     icon:<Briefcase size={22}/>,      title:"Business services", desc:"Advertise with STEA, brand partnerships, promotions and digital support.",           color:"#378ADD", cta:"View services",        path:"huduma",      badge:"Grow fast" },
  { id:"shop",    icon:<ShoppingCart size={22}/>,   title:"STEA shop",         desc:"Electronics, digital products, courses and verified Tanzania marketplace.",         color:G,         cta:"Shop now",             path:"duka/phones", badge:"Top deals" },
];

function SectorsGrid({ goPage }) {
  return (
    <Sec>
      <W>
        <Reveal>
          <SHead label="Core sectors" labelIcon={<Sparkles size={11}/>} title="Your complete digital ecosystem" desc="Four pillars of Tanzania's most powerful digital platform." />
        </Reveal>
        <div className="stea-sectors">
          {SECTORS.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.06}>
              <button 
                className="stea-sector-card stea-btn" 
                onClick={() => goPage(s.path)} 
                onMouseEnter={e => { e.currentTarget.style.background=`${s.color}08`; e.currentTarget.style.borderColor=`${s.color}40`; }}
                onMouseLeave={e => { e.currentTarget.style.background=""; e.currentTarget.style.borderColor=""; }}
              >
                <div className="stea-sector-card__icon" style={{ background:`${s.color}18`, color:s.color }}>{s.icon}</div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <span className="stea-sector-card__title">{s.title}</span>
                  <span style={{ fontSize:10, fontWeight:800, padding:"2px 8px", borderRadius:999, background:`${s.color}18`, color:s.color }}>{s.badge}</span>
                </div>
                <p className="stea-sector-card__desc">{s.desc}</p>
                <div className="stea-sector-card__cta" style={{ color:s.color }}>{s.cta} <ArrowRight size={13}/></div>
              </button>
            </Reveal>
          ))}
        </div>
      </W>
    </Sec>
  );
}

// ─── 4. TANZANIA MARKETPLACE (MAIN REVENUE) ───────────────────────
const TZ_CATS = ["All", "Phones", "Laptops", "Beauty products", "Digital tools", "Accessories"];

function MarketplaceSection({ products, loading, goPage, isMobile }) {
  const [cat, setCat] = useState("All");
  const shown = useMemo(() => {
    if (cat === "All") return products;
    const map = { 
      Phones: "phones", 
      Laptops: "laptops", 
      "Digital tools": "digital", 
      Accessories: "accessories",
      "Beauty products": "beauty"
    };
    return products.filter(p => (p.category || "").toLowerCase().includes(map[cat] || cat.toLowerCase()));
  }, [products, cat]);

  return (
    <Sec accent={G}>
      <W>
        <Reveal>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:8 }}>
            <div>
              <div className="stea-label" style={{ background:`${G}12`, border:`1px solid ${G}22`, color:G }}><ShoppingBag size={11}/> STEA Marketplace</div>
              <h2 className="stea-shead__title">Shop. Sell. <span style={{ color:G }}>Earn.</span></h2>
              <p className="stea-shead__desc">Tanzania's trusted marketplace — electronics, courses, digital tools & more.</p>
            </div>
            <button className="stea-btn stea-btn--large stea-btn--all" onClick={() => goPage("duka/phones")}>
              Browse all <ArrowRight size={15}/>
            </button>
          </div>
          <div className="stea-trust">
            {[
              { id: "p1", icon: <Shield size={12}/>, text: "Secure payments" },
              { id: "p2", icon: <Star size={12}/>, text: "Verified sellers" },
              { id: "p3", icon: <RefreshCw size={12}/>, text: "Easy returns" },
              { id: "p4", icon: <TrendingUp size={12}/>, text: "Best prices" }
            ].map((item) => (
              <div key={item.id} className="stea-trust__item">{item.icon} {item.text}</div>
            ))}
          </div>
          <div className="stea-cat-filter no-scrollbar">
            {TZ_CATS.map(c => (
              <button key={c} className={`stea-cat-btn stea-btn${cat===c?" stea-cat-btn--active":""}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
        </Reveal>
      </W>
      <HScroll>
        {loading
          ? Array.from({length:5}).map((_,i) => <div key={i} className="stea-hscroll__item"><ProdSkel/></div>)
          : shown.slice(0,8).map(p => (
              <div key={p.id} className="stea-hscroll__item" style={{ width: isMobile ? "46vw" : 240 }}>
                <MarketplaceProductCard product={p} onBuyNow={() => goPage(`marketplace/checkout/${p.id}`)} />
              </div>
            ))
        }
        <div className="stea-hscroll__item">
          <button className="stea-show-all-card stea-btn" onClick={() => goPage("duka/phones")}>
            <ArrowRight size={24} color={G}/><span>See all products</span>
          </button>
        </div>
      </HScroll>
      <div style={{ marginTop: 24 }}>
        <AdSlot id="home-after-marketplace-hscroll" />
      </div>

      <W>
        <div className="stea-vendor-cta">
          <div>
            <p className="stea-vendor-cta__title">Start Selling on STEA</p>
            <p className="stea-vendor-cta__sub">Join 200+ verified sellers. Start earning today.</p>
          </div>
          <button className="stea-vendor-cta__btn stea-btn" onClick={() => goPage("seller/apply")}>Become a seller →</button>
        </div>
      </W>
    </Sec>
  );
}

// ─── 5. AGIZA CHINA ───────────────────────────────────────────────
function ChinaSection({ products, loading, goPage, isMobile }) {
  if (!loading && products.length === 0) return null;
  return (
    <Sec>
      <W>
        <Reveal>
          <SHead label="Agiza China · Global imports" labelColor="#EF4444" labelIcon={<Globe size={11}/>} title="Import directly from China" desc="Premium electronics from verified global suppliers — shipped to Tanzania." action={() => goPage("chaba")} actionText="Explore imports" />
        </Reveal>
      </W>
      <HScroll>
        {loading
          ? Array.from({length:4}).map((_,i) => <div key={i} className="stea-hscroll__item"><ProdSkel/></div>)
          : products.slice(0,8).map(p => <div key={p.id} className="stea-hscroll__item" style={{ width: isMobile ? "46vw" : 240 }}><MarketplaceProductCard product={p} type="china"/></div>)
        }
      </HScroll>
    </Sec>
  );
}

// ─── 6. AI & DIGITAL TOOLS ────────────────────────────────────────
const TOOLS = [
  { id:"ai",       icon:<Zap size={19}/>,            title:"AI lab",             desc:"Explore powerful AI models & automation.",    color:"#7F77DD", path:"tech-hub" },
  { id:"prompt",   icon:<Sparkles size={19}/>,        title:"Prompt lab",         desc:"Copy-ready prompts for any task.",            color:"#a855f7", path:"prompts" },
  { id:"digital",  icon:<Globe size={19}/>,           title:"Digital tools",      desc:"Premium subscriptions & productivity apps.", color:"#378ADD", path:"digital-tools" },
  { id:"websites", icon:<BookOpen size={19}/>,        title:"Website solutions",  desc:"Build your digital presence with STEA.",     color:"#10b981", path:"websites" },
  { id:"tips",     icon:<TrendingUp size={19}/>,      title:"Tips & resources",   desc:"Daily tech tips, guides and tutorials.",     color:G,         path:"tips" },
  { id:"wa",       icon:<MessageCircle size={19}/>,   title:"WhatsApp tools",     desc:"Business automation & messaging tools.",     color:"#25d366", path:"tech-hub" },
];

function DigitalToolsSection({ goPage }) {
  return (
    <Sec accent="#7F77DD">
      <W>
        <Reveal>
          <SHead label="AI & Digital tools" labelColor="#7F77DD" labelIcon={<Zap size={11}/>} title="Powered by AI, built for you" desc="The same tools used by top creators and businesses globally." action={() => goPage("tech-hub")} actionText="See all tools" />
        </Reveal>
        <div className="stea-tools-grid">
          {TOOLS.map((tool, i) => (
            <Reveal key={tool.id} delay={i * 0.05}>
              <button className="stea-tool-card stea-btn" onClick={() => goPage(tool.path)}
                onMouseEnter={e => { e.currentTarget.style.background=`${tool.color}0a`; e.currentTarget.style.borderColor=`${tool.color}30`; }}
                onMouseLeave={e => { e.currentTarget.style.background=""; e.currentTarget.style.borderColor=""; }}
              >
                <div className="stea-tool-card__icon" style={{ background:`${tool.color}16`, color:tool.color }}>{tool.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p className="stea-tool-card__title">{tool.title}</p>
                  <p className="stea-tool-card__desc">{tool.desc}</p>
                </div>
                <span className="stea-tool-card__arrow" style={{ color:tool.color }}>Open →</span>
              </button>
            </Reveal>
          ))}
        </div>
      </W>
    </Sec>
  );
}

// ─── 7. SERVICES ──────────────────────────────────────────────────
const SERVICES = [
  { id: "adv",  icon: <Sparkles size={19}/>, title: "Advertise with us",   desc: "Reach 50K+ active STEA users across Tanzania.",   color: G, path: "advertise" },
  { id: "prom", icon: <TrendingUp size={19}/>, title: "Product promotion",  desc: "Feature your product or service on our platform.", color: "#378ADD", path: "services/product-promotion" },
  { id: "part", icon: <Zap size={19}/>,        title: "Brand partnerships", desc: "Long-term collaboration & corporate sponsorship.", color: "#7F77DD", path: "services/brand-partnerships" },
  { id: "web",  icon: <Globe size={19}/>,      title: "Website Design",  desc: "Professional websites & systems from TZS 150K.",  color: "#10b981", path: "services/website-design" },
  { id: "supp", icon: <MessageCircle size={19}/>, title: "Digital support",   desc: "IT help and digital automation for your business.", color: "#ec4899", path: "services/digital-support" },
  { id: "mon",  icon: <ShoppingBag size={19}/>, title: "Abroad money guide", desc: "Expert guide on sending/receiving money globally.", color: "#EF4444", path: "money-guide" },
];

function ServicesSection({ goPage }) {
  return (
    <Sec accent="#378ADD">
      <W>
        <Reveal>
          <SHead 
            label="Business services" 
            labelColor="#378ADD" 
            labelIcon={<Globe size={11}/>} 
            title="Grow your business with STEA" 
            desc="Professional services designed for Tanzania's digital economy." 
            action={() => goPage("huduma")} 
            actionText="All services" 
          />
        </Reveal>
        
        <div className="stea-tools-grid">
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.05}>
              <button 
                className="stea-tool-card stea-btn" 
                onClick={() => goPage(s.path)}
                onMouseEnter={e => { e.currentTarget.style.background=`${s.color}0a`; e.currentTarget.style.borderColor=`${s.color}30`; }}
                onMouseLeave={e => { e.currentTarget.style.background=""; e.currentTarget.style.borderColor=""; }}
              >
                <div className="stea-tool-card__icon" style={{ background:`${s.color}16`, color:s.color }}>
                  {s.icon}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p className="stea-tool-card__title">{s.title}</p>
                  <p className="stea-tool-card__desc">{s.desc}</p>
                </div>
                <span className="stea-tool-card__arrow" style={{ color:s.color }}>Open →</span>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="stea-promote-block" style={{ background:`linear-gradient(135deg,${G}10,${G}04)`, border:`1px solid ${G}22`, marginTop: 32 }}>
            <p className="stea-promote-block__title">Promote your business with STEA</p>
            <p className="stea-promote-block__sub">Reach 50,000+ active users across Tanzania</p>
            <button className="stea-btn stea-btn--primary" onClick={() => goPage("huduma")}>Get started today <ArrowRight size={14}/></button>
          </div>
        </Reveal>
      </W>
    </Sec>
  );
}

// ─── Website Solutions section ────────────────────────────────────
function WebsiteSolutionsSection({ websites, loading, goPage, isMobile }) {
  if (!loading && websites.length === 0) return null;
  return (
    <Sec accent="#0ea5e9">
      <W>
        <Reveal>
          <SHead
            label="Website solutions"
            labelColor="#0ea5e9"
            labelIcon={<ExternalLink size={11}/>}
            title="Discover premium websites"
            desc="Movies, AI tools, streaming, education — the best sites curated for you."
            action={() => goPage("websites")}
            actionText="Browse all"
          />
        </Reveal>
      </W>
      <HScroll>
        {loading
          ? Array.from({length:4}).map((_,i) => <div key={i} className="stea-hscroll__item"><CourseSkel/></div>)
          : websites.slice(0,8).map(site => (
              <div key={site.id} className="stea-hscroll__item" style={{ width: isMobile ? "clamp(180px, 60vw, 220px)" : 320 }}>
                <WebsiteSolutionCard site={site} isMobile={isMobile} />
              </div>
            ))
        }
        <div className="stea-hscroll__item">
          <button className="stea-show-all-card stea-btn" onClick={() => goPage("websites")} style={{ height: "100%", minHeight: 250 }}>
            <ArrowRight size={24} color="#0ea5e9"/>
            <span style={{ color:"#0ea5e9" }}>See all sites</span>
          </button>
        </div>
      </HScroll>
    </Sec>
  );
}

// ─── 8. LEARNING ──────────────────────────────────────────────────
function LearningSection({ courses, loading, goPage, isMobile }) {
  if (!loading && courses.length === 0) return null;
  return (
    <Sec accent="#10b981">
      <W>
        <Reveal>
          <SHead 
            label="Learning & resources" 
            labelColor="#10b981" 
            labelIcon={<GraduationCap size={11}/>} 
            title="Courses, guides & digital products" 
            desc="Learn new skills with video courses, PDF guides and paid resources." 
            action={() => goPage("courses")} 
            actionText="All courses" 
          />
        </Reveal>
      </W>
      <HScroll>
        {loading
          ? Array.from({length:4}).map((_,i) => <div key={i} className="stea-hscroll__item"><CourseSkel/></div>)
          : courses.slice(0,8).map(item => (
              <div key={item.id} className="stea-hscroll__item" style={{ width: isMobile ? "clamp(180px, 60vw, 220px)" : 320 }}>
                <CourseCard course={item} onClick={() => goPage("course-detail", item)} isMobile={isMobile} />
              </div>
            ))
        }
        <div className="stea-hscroll__item">
          <button className="stea-show-all-card stea-btn" onClick={() => goPage("courses")} style={{ height: "100%", minHeight: 250 }}>
            <ArrowRight size={24} color="#10b981"/>
            <span style={{ color:"#10b981" }}>See all courses</span>
          </button>
        </div>
      </HScroll>
    </Sec>
  );
}

function PromptSection({ prompts, loading, goPage, isMobile }) {
  if (!loading && prompts.length === 0) return null;
  return (
    <Sec accent="#a855f7">
      <W>
        <Reveal>
          <SHead label="Prompt lab" labelColor="#a855f7" labelIcon={<Sparkles size={11}/>} title="AI prompts — copy & use" desc="Ready-to-use prompts for ChatGPT, Claude, Gemini and more." action={() => goPage("prompts")} actionText="Open Prompt Lab" />
        </Reveal>
      </W>
      <HScroll>
        {loading
          ? Array.from({length:4}).map((_,i) => <div key={i} className="stea-hscroll__item"><CourseSkel/></div>)
          : prompts.slice(0,6).map(p => (
              <div key={p.id} className="stea-hscroll__item" style={{ width: isMobile ? "clamp(180px, 60vw, 220px)" : 320 }}>
                <PromptLabCard p={p} onLike={() => {}} />
              </div>
            ))
        }
        <div className="stea-hscroll__item">
          <button className="stea-show-all-card stea-btn" onClick={() => goPage("prompts")} style={{ height: "100%", minHeight: 250 }}>
            <ArrowRight size={24} color="#a855f7"/>
            <span style={{ color:"#a855f7" }}>See all prompts</span>
          </button>
        </div>
      </HScroll>
    </Sec>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────
export default function HomePageV2({ goPage }) {
  const isMobile = useMobile();

  const { docs: coursesDocs, loading: coursesLoading } = useMultiCollection(["video_courses", "courses", "learning_resources"]);
  const { docs: promptsDocs, loading: promptsLoading } = useMultiCollection(["prompts", "prompt_lab", "promptLab"]);
  const { docs: chabaDocs,   loading: chabaLoading   } = useCollection("chaba_products");
  const { docs: websitesDocs, loading: websitesLoading } = useMultiCollection(["website_solutions", "websites", "websiteSolutions"]);
  const { docs: tzDocs,      loading: tzLoading      } = useMultiCollection(["marketplace_products", "tanzania_products", "products"]);
  const { docs: updatesDocs, loading: updatesLoading } = useMultiCollection(["student_updates", "updates"], "createdAt", 12);
  const { docs: contentDocs, loading: contentLoading } = useMultiCollection(["tips_resources", "tech_tips", "posts"], "createdAt", 12);

  const pub = (item, isProduct = false) => {
    // If it's explicitly set to inactive or not visible, hide it
    if (item.visible === false || item.active === false || item.published === false || item.isActive === false) return false;
    
    // Status-based filtering
    if (item.status) {
      const s = item.status.toLowerCase();
      if (["draft", "rejected", "pending_review", "pending", "deleted", "inactive"].includes(s)) return false;
      // If we are in products, we usually look for active/approved
      if (isProduct && !["active", "published", "approved"].includes(s)) return false;
    }
    
    return true;
  };

  const tzProducts    = useMemo(() => diversify((tzDocs    ||[]).filter(d=>pub(d,true))), [tzDocs]);
  const chabaProducts = useMemo(() => diversify((chabaDocs ||[]).filter(d=>d.visible!==false)),  [chabaDocs]);
  const websites      = useMemo(() => (websitesDocs||[]).filter(d => d.active!==false && d.status!=="draft" && d.published!==false).slice(0,8), [websitesDocs]);
  const courses       = useMemo(() => (coursesDocs||[]).filter(d=>pub(d)).slice(0,6),           [coursesDocs]);
  const prompts = useMemo(() => {
    const filtered = (promptsDocs || []).filter(d => pub(d));
    if (filtered.length > 0) {
      console.log("[Homepage Prompt Lab] docs loaded count:", filtered.length);
      console.log("[Homepage Prompt Lab] first prompt title:", filtered[0].title || filtered[0].name || "N/A");
      console.log("[Homepage Prompt Lab] first prompt date:", filtered[0].createdAt || filtered[0].updatedAt || "N/A");
    }                
    return filtered.slice(0, 6);
  }, [promptsDocs]);

  return (
    <div style={{ minHeight:"100vh", background:"#05060a", color:"#fff", fontFamily:"'Instrument Sans',system-ui,sans-serif", overflowX:"hidden", paddingBottom: "env(safe-area-inset-bottom)" }}>
      <SEOHead 
        title="STEA — Elimu, Biashara, AI na Duka | Tanzania"
        description="STEA ni jukwaa la kidijitali la Tanzania. Pata matokeo ya NECTA, nunua bidhaa, tumia AI tools na ukue biashara yako. Jiunge na Watanzania 50,000+."
        keywords={["STEA Africa", "NECTA results Tanzania", "AI tools for students", "African creators", "Tanzania marketplace", "digital skills"]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "STEA Africa",
          "url": "https://stea.africa",
          "description": "AI tools, learning, results, marketplace and opportunities for African students and creators.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://stea.africa/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      <HeroSection goPage={goPage}/>
      <BannerAd />
      <SectorsGrid goPage={goPage}/>
      <TrafficEngineSection
        goPage={goPage}
        updates={updatesDocs}
        learning={contentDocs}
        updatesLoading={updatesLoading}
        learningLoading={contentLoading}
      />
      <MarketplaceSection products={tzProducts} loading={tzLoading} goPage={goPage} isMobile={isMobile}/>
      <ChinaSection products={chabaProducts} loading={chabaLoading} goPage={goPage} isMobile={isMobile}/>
      <DigitalToolsSection goPage={goPage}/>
      <WebsiteSolutionsSection websites={websites} loading={websitesLoading} goPage={goPage} isMobile={isMobile}/>
      <ServicesSection goPage={goPage}/>
      <LearningSection courses={courses} loading={coursesLoading} goPage={goPage} isMobile={isMobile}/>
      <PromptSection prompts={prompts} loading={promptsLoading} goPage={goPage} isMobile={isMobile}/>
      <div style={{ height: isMobile ? 40 : 80 }}/>
    </div>
  );
}
