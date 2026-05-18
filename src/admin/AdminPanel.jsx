import { useState, useEffect } from "react";
import {
  getFirebaseDb, collection, addDoc, serverTimestamp, onSnapshot
} from "../firebase.js";
import VpnManager from "./VpnManager.jsx";
import MarketplaceManager from "./MarketplaceManager.jsx";
import ChabaManager from "./ChabaManager.jsx";

import { 
  Btn, Toast, StatCard, G, G2 
} from "./AdminUI.jsx";
import {
  AdminDashboardStyles,
  AdminSectionCard,
  AdminSidebar,
  AdminStatCard,
  AdminTopbar,
} from "./AdminDashboardComponents.jsx";
import {
  Bell,
  BookOpen,
  FileText,
  Globe,
  GraduationCap,
  Megaphone,
  MonitorCog,
  Package,
  Send,
  ShoppingBag,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { ADMIN_EMAILS } from "../firebase.js";
import TechContentManager from "./managers/TechContentManager.jsx";
import TipsResourcesManager from "./managers/TipsResourcesManager.jsx";
import ExamsHubManager from "./ExamsHubManager.jsx";
import CoursesManager from "./managers/CoursesManager.jsx";
import ResourcesManager from "./managers/ResourcesManager.jsx";
import WebsitesManager from "./managers/WebsitesManager.jsx";
import NectaManager from "./managers/NectaManager.jsx";
import PromptsManager from "./managers/PromptsManager.jsx";
import DigitalToolsManager from "./managers/DigitalToolsManager.jsx";
import SponsoredAdsManager from "./managers/SponsoredAdsManager.jsx";
import UsersManager from "./managers/UsersManager.jsx";
import SiteContentManager from "./managers/SiteContentManager.jsx";
import SubscriptionManager from "./managers/SubscriptionManager.jsx";
import NotificationsManager from "./managers/NotificationsManager.jsx";


// ── Admin Thumb ──────────────────────────────────────










// ══════════════════════════════════════════════════════
// SITE CONTENT MANAGER (About, Creator, Contact, Stats, FAQ)
// ══════════════════════════════════════════════════════




// ══════════════════════════════════════════════════════
// USERS MANAGER
// ══════════════════════════════════════════════════════




// ══════════════════════════════════════════════════════
// MAIN ADMIN PANEL
// ══════════════════════════════════════════════════════
export default function AdminPanel({ user, onBack }) {
  const [section, setSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counts,  setCounts]  = useState({ tips:0, posts:0, updates:0, deals:0, courses:0, users:0, marketplace:0, websites:0, prompts:0, sponsored_ads:0, orders:0, subscriptions:0, payments:0, deliveries:0, message_templates:0, necta:0, exams:0, news:0, ai:0, gigs:0, chaba_products:0, chaba_orders:0, tips_resources:0 });
  const [countErrors, setCountErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const db = getFirebaseDb();

  const toast_ = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const seedSampleData = async () => {
    if (!window.confirm("Hii itaongeza data za mfano kwenye database yako. Unaendelea?")) return;
    setLoading(true);
    try {
      // Add a tip
      await addDoc(collection(db, "tips"), {
        title: "Jinsi ya Kutumia AI Kukuza Biashara Yako",
        content: "AI inaweza kukusaidia katika mambo mengi kama vile customer service, marketing, na data analysis. Kwa mfano, unaweza kutumia ChatGPT kuandika emails za mauzo au Midjourney kutengeneza picha za bidhaa zako.",
        category: "AI & Business",
        author: "STEA Team",
        views: 0,
        createdAt: serverTimestamp(),
        imageUrl: "https://picsum.photos/seed/ai/800/600"
      });
      // Add a NECTA result
      await addDoc(collection(db, "necta"), {
        title: "Matokeo ya Kidato cha Nne 2025",
        content: "NECTA imetangaza matokeo ya kidato cha nne. Unaweza kuyaangalia hapa kwa urahisi.",
        category: "Results",
        author: "STEA Team",
        views: 0,
        createdAt: serverTimestamp(),
        imageUrl: "https://picsum.photos/seed/necta/800/600"
      });
      // Add an Exam
      await addDoc(collection(db, "exams"), {
        title: "Mathematics Past Paper - Form 4",
        content: "Pakua past paper ya Mathematics kwa ajili ya maandalizi ya mtihani wa taifa.",
        category: "Mathematics",
        author: "STEA Team",
        views: 0,
        createdAt: serverTimestamp(),
        imageUrl: "https://picsum.photos/seed/math/800/600"
      });
      // Add a News item
      await addDoc(collection(db, "news"), {
        title: "Apple yazindua iPhone 17 nchini Tanzania",
        content: "Kampuni ya Apple imezindua rasmi iPhone 17 huku kukiwa na maboresho makubwa ya kamera na betri.",
        category: "Tech News",
        author: "STEA Team",
        views: 0,
        createdAt: serverTimestamp(),
        imageUrl: "https://picsum.photos/seed/iphone17/800/600"
      });
      // Add a Gig
      await addDoc(collection(db, "gigs"), {
        title: "Natafuta Web Developer wa React",
        content: "Natafuta developer mwenye uzoefu wa React kutengeneza website ya biashara. Bajeti ni 500k.",
        category: "Web Development",
        author: "STEA Team",
        views: 0,
        createdAt: serverTimestamp(),
        imageUrl: "https://picsum.photos/seed/gig/800/600"
      });
      // Add a prompt
      await addDoc(collection(db, "prompts"), {
        title: "Msaidizi wa Kuandika Barua za Kazi",
        prompt: "Nisaidie kuandika barua ya maombi ya kazi kwa nafasi ya Software Developer. Mimi nina uzoefu wa miaka miwili katika React na Node.js. Barua iwe ya kitaalamu na ya kuvutia.",
        category: "Career",
        views: 0,
        createdAt: serverTimestamp(),
        isFeatured: true
      });
      // Add a deal
      await addDoc(collection(db, "deals"), {
        title: "Samsung Galaxy S23 Ultra - 20% OFF",
        description: "Pata simu bora zaidi ya Samsung kwa bei nafuu leo! Ofa hii ni ya muda mfupi tu.",
        price: "2,500,000",
        originalPrice: "3,100,000",
        link: "https://example.com",
        createdAt: serverTimestamp(),
        isFeatured: true,
        imageUrl: "https://picsum.photos/seed/phone/800/600"
      });
      // Add a website
      await addDoc(collection(db, "websites"), {
        name: "Canva",
        url: "https://canva.com",
        description: "Chombo bora cha design kwa kila mtu. Unaweza kutengeneza posters, logos, na presentations kwa urahisi.",
        category: "Design",
        createdAt: serverTimestamp(),
        imageUrl: "https://picsum.photos/seed/design/800/600"
      });
      toast_("Data za mfano zimeongezwa!");
    } catch (err) {
      console.error(err);
      toast_("Imeshindwa kuongeza data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!db) return;
    // Map collection name to section ID for permission checking
    const colToSection = {
      deals: "deals", marketplace: "marketplace", sponsored_ads: "ads", 
      orders: "marketplace", chaba_orders: "chaba", chaba_products: "chaba",
      subscriptions: "subs", users: "users", site_settings: "content",
      exams: "exams", gigs: "gigs", courses: "courses", resources: "resources",
      websites: "websites", prompts: "prompts", necta: "necta", tips: "tips",
      posts: "posts", updates: "updates", news: "content", ai: "content",
      deliveries: "marketplace", payments: "subs", message_templates: "notifications"
    };

    const cols = Object.keys(colToSection);
    
    const unsubs = cols.map(c => {
      const sectionId = colToSection[c];
      if (!sAllowed(user, sectionId)) return null;

      return onSnapshot(collection(db, c), (snap) => {
        setCounts(prev => ({ ...prev, [c]: snap.size }));
        setCountErrors(prev => ({ ...prev, [c]: null }));
      }, (err) => {
        console.error(`Error loading count for ${c}:`, err);
        setCountErrors(prev => ({ ...prev, [c]: err.message }));
      });
    }).filter(Boolean);
    return () => unsubs.forEach(unsub => unsub());
  }, [db, user]);

  const SECTIONS = [
    { id:"overview", icon:"📊", label:"System Overview" },
    { id:"exams",    icon:"📖", label:"Exam Hub" },
    { id:"gigs",     icon:"💼", label:"Gigs & Talent" },
    { id:"courses",  icon:"🎓", label:"Course Portal" },
    { id:"resources", icon:"📚", label:"Resources Hub" },
    { id:"tips_resources", icon:"📋", label:"Tips Resources" },
    { id:"websites", icon:"🌐", label:"Website Templates" },
    { id:"content",  icon:"📝", label:"Site Content" },
    { id:"prompts",  icon:"🤖", label:"Prompt Lab" },
    { id:"deals",    icon:"🛠️", label:"Digital Tools" },
    { id:"subs",     icon:"🔄", label:"Subs & Digital Orders" },
    { id:"marketplace", icon:"🛒", label:"Tanzania Marketplace" },
    { id:"chaba", icon:"🇨🇳", label:"Agiza China (Chaba)" },
    { id:"vpn",      icon:"🔒", label:"VPN Config & Orders" },
    { id:"notifications", icon:"🔔", label:"Notifications" },
    { id:"ads", icon:"📢", label:"Sponsored Ads" },
    { id:"necta",    icon:"🎓", label:"NECTA Results" },
    { id:"users",    icon:"👥", label:"Users / Team" },
  ];

  const sAllowed = (user, sectionId) => {
    const role = user?.role;
    const email = user?.email?.toLowerCase();
    
    // Check hardcoded whitelist first — this is the "Main Admin" override
    if (email && ADMIN_EMAILS.includes(email)) return true;

    // super_admin and admin get everything
    if (role === "super_admin" || role === "admin") return true;
    // Overview visible to all authenticated admins
    if (sectionId === "overview") return true;

    // Normalize sector aliases
    let assignedSector = user?.sector || "general";
    if (assignedSector === "tech_tips") assignedSector = "tips";
    if (assignedSector === "site_updates") assignedSector = "updates";
    if (assignedSector === "ai_lab") assignedSector = "ai";
    if (assignedSector === "sponsored_ads") assignedSector = "ads";

    // Managers: assigned sector + commerce/delivery read-write
    if (role === "manager") {
      const managerSections = (user?.sectors || [assignedSector]);
      return managerSections.includes(sectionId) || ["commerce","delivery","requests"].includes(sectionId);
    }
    // Editor: add/edit content in assigned sector, no delete/roles/users
    if (role === "editor") {
      const editorSections = (user?.sectors || [assignedSector]);
      return editorSections.includes(sectionId);
    }
    // Viewer: read-only dashboard + their sector
    if (role === "viewer") {
      return sectionId === assignedSector;
    }
    // Creator: assigned sector only
    if (role === "creator") {
      return sectionId === assignedSector;
    }
    // Seller: marketplace/orders/tips
    if (role === "seller") {
      return sectionId === "marketplace" || sectionId === "orders" || sectionId === "tips" || sectionId === "content";
    }
    // Reviewer: assigned sector read
    if (role === "reviewer") {
      return sectionId === assignedSector;
    }
    return false;
  };

  // Can user delete items in this section?
  const canDelete = (user, sectionId) => {
    const role = user?.role;
    return role === "super_admin" || role === "admin" || role === "manager";
  };

  // Can user manage users/roles?
  const canManageRoles = (user) => user?.role === "super_admin";

  const filteredSections = SECTIONS.filter(s => sAllowed(user, s.id));
  const activeSection = filteredSections.find(s => s.id === section) || filteredSections[0] || { label: "Dashboard", id: "overview" };
  const openSection = (id) => {
    setSection(id);
    setSidebarOpen(false);
  };

  return (
    <div className="admin-panel-container" style={{ minHeight:"100vh", display:"grid", gridTemplateColumns: "240px 1fr", background:"#0a0b0f" }}>
      <AdminDashboardStyles />
      <style>{`
        @media (max-width: 768px) {
          .admin-panel-container { grid-template-columns: 1fr !important; }
          .admin-sidebar { display: ${sidebarOpen ? 'flex' : 'none'} !important; position: fixed !important; z-index: 1000 !important; background: #0a0b0f !important; width: 100% !important; }
          .admin-main-content { padding: 16px !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
        @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
      `}</style>
      <AdminDashboardStyles />

      <AdminSidebar
        sections={filteredSections}
        activeId={section}
        onSelect={openSection}
        onBack={onBack}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      {/* Sidebar */}
      <div className="admin-sidebar" style={{ borderRight:"1px solid rgba(255,255,255,.06)", padding:"24px 16px", position:"sticky", top:0, height:"100vh", overflowY:"auto" }}>
        <div style={{ marginBottom:28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:20, fontWeight:800, marginBottom:4 }}>
              {user?.role === "seller" ? "💰 Seller Portal" : "⚡ Admin Panel"}
            </div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.35)" }}>STEA Platform</div>
          </div>
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ display:"grid", gap:4 }}>
          {filteredSections.map(s=>(
            <button key={s.id} onClick={()=>{setSection(s.id); setSidebarOpen(false);}}
              style={{ border:"none", borderRadius:12, padding:"11px 14px", textAlign:"left", cursor:"pointer", fontWeight:700, fontSize:14,
                background:section===s.id?`linear-gradient(135deg,${G},${G2})`:"transparent",
                color:section===s.id?"#111":"rgba(255,255,255,.65)",
                display:"flex", alignItems:"center", gap:10, transition:"all .2s" }}>
              <span style={{ fontSize:18 }}>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>

        <div style={{ marginTop:"auto", paddingTop:24 }}>
          <button onClick={onBack} style={{ border:"1px solid rgba(255,255,255,.08)", borderRadius:12, padding:"10px 14px", background:"transparent", color:"rgba(255,255,255,.5)", cursor:"pointer", fontWeight:700, fontSize:13, width:"100%", display:"flex", alignItems:"center", gap:8 }}>
            ← Rudi Website
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="admin-main-content" style={{ padding:"28px 32px", overflowY:"auto", minWidth: 0 }}>
        <AdminTopbar
          title={activeSection.label || "Dashboard"}
          breadcrumb={`Admin / ${activeSection.label || "Dashboard"}`}
          user={user}
          onMenu={() => setSidebarOpen(true)}
          onQuickAction={() => setSection("notifications")}
        />
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)} style={{ display:"none", marginBottom: 20, padding: '10px 15px', background: G, border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Menu</button>

        {section==="overview" && <div>
            {toast && <Toast msg={toast.msg} type={toast.type}/>}
            <div style={{ marginBottom:28, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
              <div>
                <h1 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:32, margin:"0 0 6px" }}>
                  Karibu, <span style={{ color:G }}>{user?.displayName||"Admin"}</span> 👋
                </h1>
                <p style={{ color:"rgba(255,255,255,.45)", fontSize:15, margin:0 }}>
                  Hapa unaweza kumanage content yote ya STEA — posts, updates, tools, courses na users.
                </p>
              </div>
              <Btn onClick={seedSampleData} disabled={loading} color="rgba(255,255,255,.05)" textColor="#fff" style={{ border: "1px solid rgba(255,255,255,.1)" }}>
                {loading ? "Inaongeza..." : "🌱 Ongeza Data za Mfano"}
              </Btn>
            </div>
            
            <div className="admin-stats-grid">
              <StatCard icon="🎓" label="Courses" value={counts.courses} error={countErrors.courses} color="#67f0c1"/>
              <StatCard icon="📚" label="Resources" value={counts.resources} error={countErrors.resources} color="#a5b4fc"/>
              <StatCard icon="🛒" label="Tanzania Products" value={counts.marketplace} error={countErrors.marketplace} color="#fbbf24"/>
              <StatCard icon="🇨🇳" label="Agiza China Products" value={counts.chaba_products} error={countErrors.chaba_products} color="#67f0c1"/>
              <StatCard icon="🔄" label="Subscriptions" value={counts.subscriptions} error={countErrors.subscriptions} color="#a5b4fc"/>
              <StatCard icon="💳" label="Orders (TZ)" value={counts.orders} error={countErrors.orders} color="#67f0c1"/>
              <StatCard icon="📦" label="Orders (China)" value={counts.chaba_orders} error={countErrors.chaba_orders} color="#ff85cf"/>
              <StatCard icon="📢" label="Ads" value={counts.sponsored_ads} error={countErrors.sponsored_ads} color="#f5a623"/>
              <StatCard icon="👥" label="Users" value={counts.users} error={countErrors.users} color="#ff85cf"/>
              <StatCard icon="📝" label="Exams" value={counts.exams} error={countErrors.exams} color="#a5b4fc"/>
              <StatCard icon="💼" label="Gigs" value={counts.gigs} error={countErrors.gigs} color="#818cf8"/>
              <StatCard icon="🌐" label="Websites" value={counts.websites} error={countErrors.websites} color="#818cf8"/>
              <StatCard icon="🤖" label="Prompts" value={counts.prompts} error={countErrors.prompts} color="#ff85cf"/>
              <StatCard icon="📝" label="Site Content" value={counts.site_settings} error={countErrors.site_settings} color="#67f0c1"/>
            </div>
            
            <AdminSectionCard title="Quick actions">
              <div className="admin-quick-grid">
                {[
                  { title:"Add course", desc:"Create or update a learning program.", target:"courses", icon:<GraduationCap size={18}/> },
                  { title:"Add resource", desc:"Upload guides, files, and study assets.", target:"resources", icon:<BookOpen size={18}/> },
                  { title:"Add website/tool", desc:"Publish websites or digital tools.", target:"websites", icon:<Globe size={18}/> },
                  { title:"Add post/update", desc:"Create tips, guides, and announcements.", target:"content", icon:<FileText size={18}/> },
                  { title:"Send notification", desc:"Reach opted-in STEA users.", target:"notifications", icon:<Send size={18}/> },
                  { title:"Review feedback", desc:"Check users, requests, and engagement.", target:"users", icon:<Users size={18}/> },
                ].filter(action => sAllowed(user, action.target)).map(action => (
                  <button key={action.title} className="admin-quick-card" onClick={() => setSection(action.target)}>
                    <div style={{ color:G }}>{action.icon}</div>
                    <strong>{action.title}</strong>
                    <span>{action.desc}</span>
                  </button>
                ))}
              </div>
            </AdminSectionCard>
        </div>}

        {(sAllowed(user, "marketplace")) && section==="marketplace" && <><h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:28, margin:"0 0 24px" }}>🛒 <span style={{color:G}}>STEA Duka (Marketplace)</span></h2><MarketplaceManager user={user}/></>}
        {section==="ads" && <><h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:28, margin:"0 0 24px" }}>📢 <span style={{color:G}}>Sponsored Ads</span></h2><SponsoredAdsManager /></>}
        {(sAllowed(user, "subs")) && section==="subs" && <><h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:28, margin:"0 0 24px" }}>🔄 Manage <span style={{color:G}}>Subscriptions & Digital Orders</span></h2><SubscriptionManager user={user}/></>}
        {(sAllowed(user, "chaba")) && section==="chaba" && <><h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:28, margin:"0 0 24px" }}>🇨🇳 <span style={{color:G}}>Agiza China Products</span></h2><ChabaManager /></>}
        {(sAllowed(user, "vpn")) && section==="vpn" && <><h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:28, margin:"0 0 24px" }}>🔒 <span style={{color:G}}>Manage VPN Config & Orders</span></h2><VpnManager user={user}/></>}
        {section==="notifications" && <NotificationsManager />}
        {(sAllowed(user, "deals")) && section==="deals" && <><h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:28, margin:"0 0 24px" }}>🏷️ Manage <span style={{color:G}}>Digital Tools</span></h2><DigitalToolsManager user={user}/></>}
        
        {(sAllowed(user, "exams")) && section==="exams" && <><h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:28, margin:"0 0 24px" }}>📝 Manage <span style={{color:G}}>Exam Hub</span></h2><ExamsHubManager user={user}/></>}
        {(sAllowed(user, "gigs")) && section==="gigs" && <><h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:28, margin:"0 0 24px" }}>💼 Manage <span style={{color:G}}>Gigs & Jobs</span></h2><TechContentManager collectionName="gigs" user={user} /></>}
        {(sAllowed(user, "courses")) && section==="courses" && <><h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:28, margin:"0 0 24px" }}>🎓 Manage <span style={{color:G}}>Courses</span></h2><CoursesManager user={user}/></>}
        {(sAllowed(user, "resources")) && section==="resources" && <><h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:28, margin:"0 0 24px" }}>📚 Manage <span style={{color:G}}>Resources</span></h2><ResourcesManager user={user}/></>}
        {section==="tips_resources" && <><h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:28, margin:"0 0 24px" }}>📋 Manage <span style={{color:G}}>Tips Resources</span></h2><TipsResourcesManager user={user}/></>}
        {(sAllowed(user, "websites")) && section==="websites" && <><h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:28, margin:"0 0 24px" }}>🌐 Manage <span style={{color:G}}>Websites</span></h2><WebsitesManager user={user}/></>}
        {(sAllowed(user, "prompts")) && section==="prompts" && <><h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:28, margin:"0 0 24px" }}>🤖 Manage <span style={{color:G}}>Prompt Lab</span></h2><PromptsManager user={user}/></>}
        {(sAllowed(user, "necta")) && section==="necta" && <><h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:28, margin:"0 0 24px" }}>🎓 Manage <span style={{color:G}}>NECTA Results</span></h2><NectaManager user={user}/></>}
        
        {(sAllowed(user, "content")) && section==="content" && <><h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:28, margin:"0 0 24px" }}>📝 Manage <span style={{color:G}}>Site Content</span></h2><SiteContentManager user={user}/></>}
        {(sAllowed(user, "users")) && section==="users" && <><h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:28, margin:"0 0 24px" }}>👥 Manage <span style={{color:G}}>Users</span></h2><UsersManager user={user}/></>}

        {/* Access denied fallback */}
        {section !== "overview" && !sAllowed(user, section) && (
          <div style={{ padding: 40, textAlign: 'center', color: '#ff4444' }}>
            <h2>Access Denied</h2>
            <p>You do not have permission to view this section.</p>
          </div>
        )}

      </div>

      <style>{`@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}
