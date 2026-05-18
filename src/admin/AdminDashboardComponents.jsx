import {
  BarChart3,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  ChevronLeft,
  ClipboardList,
  FileText,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  Menu,
  MonitorCog,
  Package,
  Search,
  Send,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";

export const ADMIN_MENU_GROUPS = [
  { title: "Overview", ids: ["overview"] },
  { title: "Learning", ids: ["courses", "resources", "tips_resources", "exams", "necta"] },
  { title: "Marketplace", ids: ["marketplace", "chaba", "deals", "subs", "vpn"] },
  { title: "Content", ids: ["websites", "content", "prompts", "gigs", "ads"] },
  { title: "Users & Engagement", ids: ["notifications", "users"] },
  { title: "System", ids: [] },
];

const iconMap = {
  overview: LayoutDashboard,
  exams: ClipboardList,
  gigs: BriefcaseBusiness,
  courses: GraduationCap,
  resources: BookOpen,
  tips_resources: FileText,
  websites: Globe,
  content: MonitorCog,
  prompts: Sparkles,
  deals: Zap,
  subs: Package,
  marketplace: ShoppingBag,
  chaba: ShoppingBag,
  vpn: ShieldCheck,
  notifications: Bell,
  ads: Megaphone,
  necta: BarChart3,
  users: Users,
};

const G = "#F5A623";
const G2 = "#FFD17C";
const BORDER = "rgba(255,255,255,.08)";

export function AdminSidebar({ sections, activeId, onSelect, onBack, open, onClose, user }) {
  const grouped = ADMIN_MENU_GROUPS.map((group) => ({
    ...group,
    items: sections.filter((item) => group.ids.includes(item.id)),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      {open && <button aria-label="Close admin menu" onClick={onClose} className="admin-sidebar-scrim" />}
      <aside className={`admin-sidebar-shell ${open ? "is-open" : ""}`}>
        <div className="admin-brand">
          <div className="admin-brand__mark">S</div>
          <div>
            <div className="admin-brand__name">STEA Admin</div>
            <div className="admin-brand__sub">Control Center</div>
          </div>
          <button className="admin-icon-btn admin-sidebar-close" onClick={onClose} aria-label="Close menu">
            <X size={17} />
          </button>
        </div>

        <nav className="admin-nav" aria-label="Admin navigation">
          {grouped.map((group) => (
            <div key={group.title} className="admin-nav-group">
              <div className="admin-nav-group__title">{group.title}</div>
              {group.items.map((item) => {
                const Icon = iconMap[item.id] || LayoutDashboard;
                const active = activeId === item.id;
                return (
                  <button key={item.id} className={`admin-nav-item ${active ? "is-active" : ""}`} onClick={() => onSelect(item.id)}>
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-mini">
            <div className="admin-user-mini__avatar">{(user?.displayName || user?.email || "A").slice(0, 1).toUpperCase()}</div>
            <div>
              <div className="admin-user-mini__name">{user?.displayName || "Admin"}</div>
              <div className="admin-user-mini__role">{user?.role || "admin"}</div>
            </div>
          </div>
          <button onClick={onBack} className="admin-back-btn">
            <ChevronLeft size={16} /> Back to site
          </button>
        </div>
      </aside>
    </>
  );
}

export function AdminTopbar({ title, breadcrumb, user, onMenu, onQuickAction }) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar__left">
        <button className="admin-icon-btn admin-mobile-menu" onClick={onMenu} aria-label="Open admin menu">
          <Menu size={19} />
        </button>
        <div>
          <div className="admin-breadcrumb">{breadcrumb}</div>
          <h1>{title}</h1>
        </div>
      </div>
      <div className="admin-topbar__right">
        <label className="admin-command">
          <Search size={15} />
          <input placeholder="Search admin..." aria-label="Search admin" />
        </label>
        <button className="admin-primary-action" onClick={onQuickAction}>
          <Send size={15} /> Quick action
        </button>
        <div className="admin-user-chip">
          <div className="admin-user-chip__avatar">{(user?.displayName || user?.email || "A").slice(0, 1).toUpperCase()}</div>
          <div>
            <div>{user?.displayName || "Admin"}</div>
            <span>{user?.email || "STEA team"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export function AdminStatCard({ icon: Icon = LayoutDashboard, label, value, color = G, error, helper }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-card__icon" style={{ color, background: `${color}16` }}>
        <Icon size={20} />
      </div>
      <div className="admin-stat-card__body">
        <div className="admin-stat-card__label">{label}</div>
        <div className="admin-stat-card__value" style={{ color: error ? "#fca5a5" : "#fff" }}>{error ? "Error" : value}</div>
        <div className="admin-stat-card__helper">{error ? "Needs permission check" : helper}</div>
      </div>
    </div>
  );
}

export function AdminSectionCard({ title, children, action }) {
  return (
    <section className="admin-section-card">
      <div className="admin-section-card__head">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function AdminEmptyState({ title = "Nothing here yet", message = "Create content to see it here." }) {
  return (
    <div className="admin-empty-state">
      <Sparkles size={22} />
      <strong>{title}</strong>
      <span>{message}</span>
    </div>
  );
}

export function AdminLoadingSkeleton() {
  return <div className="admin-loading-skeleton" />;
}

export function AdminDashboardStyles() {
  return (
    <style>{`
      .admin-panel-container{min-height:100vh;display:grid!important;grid-template-columns:280px minmax(0,1fr)!important;background:radial-gradient(circle at 12% 0,rgba(245,166,35,.1),transparent 28%),#08090d!important;color:#fff}.admin-sidebar,.mobile-menu-btn{display:none!important}
      .admin-sidebar-shell{position:sticky;top:0;height:100vh;padding:18px 14px;border-right:1px solid rgba(255,255,255,.08);background:linear-gradient(180deg,rgba(13,14,19,.98),rgba(7,8,12,.98));display:flex;flex-direction:column;gap:18px;overflow-y:auto}
      .admin-brand{display:flex;align-items:center;gap:12px;padding:8px 8px 14px;border-bottom:1px solid rgba(255,255,255,.07)}
      .admin-brand__mark{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,${G},${G2});color:#111;display:grid;place-items:center;font-weight:950;box-shadow:0 10px 30px rgba(245,166,35,.18)}
      .admin-brand__name{font-weight:900;font-size:15px}.admin-brand__sub{font-size:12px;color:rgba(255,255,255,.42);margin-top:2px}
      .admin-nav{display:grid;gap:18px}.admin-nav-group{display:grid;gap:5px}.admin-nav-group__title{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,.34);font-weight:900;padding:0 10px 5px}
      .admin-nav-item{height:40px;border:0;border-radius:10px;background:transparent;color:rgba(255,255,255,.64);display:flex;align-items:center;gap:10px;padding:0 11px;font-weight:800;font-size:13px;cursor:pointer;text-align:left;transition:.18s}
      .admin-nav-item:hover{background:rgba(255,255,255,.05);color:#fff}.admin-nav-item.is-active{background:linear-gradient(135deg,rgba(245,166,35,.96),rgba(255,209,124,.96));color:#111}
      .admin-sidebar-footer{margin-top:auto;display:grid;gap:10px}.admin-user-mini{display:flex;align-items:center;gap:10px;padding:10px;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(255,255,255,.03)}
      .admin-user-mini__avatar,.admin-user-chip__avatar{width:32px;height:32px;border-radius:9px;background:rgba(245,166,35,.14);color:${G};display:grid;place-items:center;font-weight:900;flex-shrink:0}.admin-user-mini__name{font-size:13px;font-weight:900}.admin-user-mini__role{font-size:11px;color:rgba(255,255,255,.38);text-transform:capitalize}
      .admin-back-btn,.admin-primary-action,.admin-icon-btn{border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.045);color:#fff;border-radius:10px;font-weight:850;cursor:pointer}.admin-back-btn{height:40px;display:flex;align-items:center;justify-content:center;gap:8px;color:rgba(255,255,255,.68)}.admin-icon-btn{width:38px;height:38px;display:grid;place-items:center}
      .admin-main-content{min-width:0;padding:0 28px 34px;overflow:auto;max-height:100vh}.admin-topbar{position:sticky;top:0;z-index:30;margin:0 -28px 26px;padding:18px 28px;border-bottom:1px solid rgba(255,255,255,.08);background:rgba(8,9,13,.86);backdrop-filter:blur(18px);display:flex;align-items:center;justify-content:space-between;gap:18px}
      .admin-topbar__left,.admin-topbar__right{display:flex;align-items:center;gap:12px;min-width:0}.admin-breadcrumb{font-size:12px;color:rgba(255,255,255,.42);font-weight:800}.admin-topbar h1{margin:2px 0 0;font-size:22px;line-height:1.1;letter-spacing:-.02em}
      .admin-command{height:38px;min-width:210px;border:1px solid rgba(255,255,255,.09);border-radius:10px;background:rgba(255,255,255,.04);display:flex;align-items:center;gap:8px;padding:0 11px;color:rgba(255,255,255,.38)}.admin-command input{background:transparent;border:0;outline:0;color:#fff;width:100%;font:inherit;font-size:13px}
      .admin-primary-action{height:38px;padding:0 13px;display:flex;align-items:center;gap:8px;color:#111;background:linear-gradient(135deg,${G},${G2});border:0}.admin-user-chip{display:flex;align-items:center;gap:9px;font-size:12px;font-weight:900}.admin-user-chip span{display:block;font-size:11px;color:rgba(255,255,255,.38);font-weight:700;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .admin-stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;margin-bottom:24px}.admin-stat-card{min-height:116px;border:1px solid rgba(255,255,255,.08);border-radius:14px;background:linear-gradient(180deg,rgba(255,255,255,.052),rgba(255,255,255,.025));padding:16px;display:flex;gap:13px;align-items:flex-start}.admin-stat-card__icon{width:42px;height:42px;border-radius:11px;display:grid;place-items:center;flex-shrink:0}.admin-stat-card__label{font-size:12px;color:rgba(255,255,255,.48);font-weight:850;line-height:1.25}.admin-stat-card__value{font-size:28px;font-weight:950;margin-top:6px;line-height:1}.admin-stat-card__helper{font-size:11px;color:rgba(255,255,255,.34);margin-top:7px}
      .admin-section-card{border:1px solid rgba(255,255,255,.08);border-radius:14px;background:rgba(255,255,255,.026);padding:18px;margin-bottom:22px}.admin-section-card__head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.admin-section-card h2{margin:0;font-size:17px;letter-spacing:-.01em}.admin-quick-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.admin-quick-card{border:1px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(255,255,255,.035);padding:14px;text-align:left;color:#fff;cursor:pointer;display:grid;gap:8px}.admin-quick-card strong{font-size:14px}.admin-quick-card span{font-size:12px;color:rgba(255,255,255,.46);line-height:1.45}
      .admin-empty-state{border:1px dashed rgba(255,255,255,.12);border-radius:14px;padding:28px;display:grid;place-items:center;text-align:center;color:rgba(255,255,255,.46);gap:8px}.admin-loading-skeleton{height:110px;border-radius:14px;background:linear-gradient(90deg,rgba(255,255,255,.04),rgba(255,255,255,.08),rgba(255,255,255,.04));background-size:200% 100%;animation:adminShimmer 1.4s infinite}@keyframes adminShimmer{to{background-position:-200% 0}}
      .admin-sidebar-close,.admin-mobile-menu{display:none}.admin-sidebar-scrim{display:none}
      @media(max-width:1100px){.admin-command{display:none}.admin-user-chip{display:none}.admin-panel-container{grid-template-columns:250px minmax(0,1fr)}}
      @media(max-width:820px){.admin-panel-container{grid-template-columns:1fr}.admin-sidebar-shell{position:fixed;left:0;top:0;bottom:0;width:min(86vw,310px);z-index:80;transform:translateX(-105%);transition:.22s;box-shadow:30px 0 80px rgba(0,0,0,.45)}.admin-sidebar-shell.is-open{transform:translateX(0)}.admin-sidebar-scrim{display:block;position:fixed;inset:0;z-index:70;background:rgba(0,0,0,.58);border:0}.admin-sidebar-close,.admin-mobile-menu{display:grid}.admin-main-content{padding:0 16px 26px;max-height:none}.admin-topbar{margin:0 -16px 20px;padding:14px 16px}.admin-topbar h1{font-size:19px}.admin-primary-action{display:none}.admin-stats-grid{grid-template-columns:1fr 1fr;gap:10px}.admin-stat-card{min-height:104px;padding:13px}.admin-stat-card__value{font-size:24px}}
      @media(max-width:520px){.admin-stats-grid{grid-template-columns:1fr}.admin-topbar__left{width:100%}.admin-breadcrumb{font-size:11px}.admin-section-card{padding:14px}.admin-quick-grid{grid-template-columns:1fr}}
    `}</style>
  );
}
