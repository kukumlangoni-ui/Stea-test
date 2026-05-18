import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { updateProfile } from "firebase/auth";
import {
  Award,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  ChevronRight,
  Edit3,
  ExternalLink,
  Globe,
  GraduationCap,
  History,
  Link as LinkIcon,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  Save,
  Settings,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
  X,
} from "lucide-react";
import {
  auth,
  db,
  doc,
  getDoc,
  ref,
  serverTimestamp,
  setDoc,
  storage,
  uploadBytes,
  getDownloadURL,
  handleStorageError,
} from "../firebase";
import ProfilePictureUpload from "../components/ProfilePictureUpload";
import ProfileImage from "../components/ProfileImage";

const G = "#F5A623";
const G2 = "#FFD17C";

const editableDefaults = {
  fullName: "",
  displayName: "",
  username: "",
  phone: "",
  country: "",
  city: "",
  location: "",
  bio: "",
  skills: "",
  interests: "",
  educationLevel: "",
  school: "",
  organization: "",
  website: "",
  instagram: "",
  linkedin: "",
  tiktok: "",
  x: "",
};

const protectedRoles = new Set(["admin", "super_admin", "seller", "manager", "creator"]);

function formatDate(value) {
  if (!value) return "Not available";
  const date = value.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function listFrom(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
}

function getRole(user) {
  return user?.role || "user";
}

function getDisplayName(user) {
  return user?.fullName || user?.displayName || user?.name || user?.email?.split("@")[0] || "STEA Member";
}

function calculateCompletion(user) {
  const checks = [
    getDisplayName(user),
    user?.email,
    user?.phone,
    user?.country || user?.city || user?.location,
    user?.bio,
    listFrom(user?.skills).length || listFrom(user?.interests).length,
    user?.educationLevel,
    user?.school || user?.organization,
    user?.photoURL,
    user?.coverURL,
    user?.website || user?.instagram || user?.linkedin || user?.tiktok || user?.x,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function normalizeUser(firebaseUser, firestoreData = {}) {
  return {
    uid: firebaseUser.uid,
    emailVerified: firebaseUser.emailVerified,
    ...firestoreData,
    email: firestoreData.email || firebaseUser.email,
    photoURL: firestoreData.photoURL || firebaseUser.photoURL || "",
    displayName: firestoreData.displayName || firestoreData.name || firebaseUser.displayName || "",
  };
}

function roleBadges(user) {
  const role = getRole(user);
  const badges = [];
  if (user?.emailVerified) badges.push({ label: "Verified", icon: BadgeCheck, tone: "green" });
  if (protectedRoles.has(role)) badges.push({ label: role.replace("_", " "), icon: ShieldCheck, tone: "gold" });
  if (role === "seller") badges.push({ label: "Seller", icon: BriefcaseBusiness, tone: "blue" });
  if (role === "manager") badges.push({ label: "Manager", icon: Award, tone: "purple" });
  if (!badges.length) badges.push({ label: "Member", icon: UserIcon, tone: "muted" });
  return badges;
}

function ProfileSkeleton() {
  return (
    <div className="stea-profile-shell">
      <div className="profile-skeleton hero" />
      <div className="profile-grid">
        <div className="profile-skeleton card" />
        <div className="profile-skeleton card" />
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon = Sparkles, title, message, action }) {
  return (
    <div className="profile-empty">
      <Icon size={26} />
      <strong>{title}</strong>
      <span>{message}</span>
      {action}
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, fallback = "Not set" }) {
  return (
    <div className="profile-info-card">
      <div className="profile-info-icon"><Icon size={18} /></div>
      <div>
        <span>{label}</span>
        <strong>{value || fallback}</strong>
      </div>
    </div>
  );
}

function Badge({ badge }) {
  const Icon = badge.icon;
  return (
    <span className={`profile-badge profile-badge--${badge.tone}`}>
      <Icon size={14} /> {badge.label}
    </span>
  );
}

function Field({ label, children, wide = false }) {
  return (
    <label className={`profile-field ${wide ? "profile-field--wide" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function EditProfileModal({ user, onClose, onSaved }) {
  const [form, setForm] = useState(() => ({
    ...editableDefaults,
    fullName: user.fullName || user.name || user.displayName || "",
    displayName: user.displayName || user.name || "",
    username: user.username || "",
    phone: user.phone || user.phoneNumber || "",
    country: user.country || "",
    city: user.city || "",
    location: user.location || "",
    bio: user.bio || user.about || "",
    skills: listFrom(user.skills).join(", "),
    interests: listFrom(user.interests).join(", "),
    educationLevel: user.educationLevel || user.education || "",
    school: user.school || "",
    organization: user.organization || "",
    website: user.website || user.socialLinks?.website || "",
    instagram: user.instagram || user.socialLinks?.instagram || "",
    linkedin: user.linkedin || user.socialLinks?.linkedin || "",
    tiktok: user.tiktok || user.socialLinks?.tiktok || "",
    x: user.x || user.twitter || user.socialLinks?.x || "",
  }));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const setValue = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus({ type: "loading", message: "Saving profile..." });
    try {
      const fullName = form.fullName.trim();
      const displayName = form.displayName.trim() || fullName;
      const payload = {
        fullName,
        name: fullName,
        displayName,
        username: form.username.trim(),
        phone: form.phone.trim(),
        country: form.country.trim(),
        city: form.city.trim(),
        location: form.location.trim(),
        bio: form.bio.trim(),
        about: form.bio.trim(),
        skills: listFrom(form.skills),
        interests: listFrom(form.interests),
        educationLevel: form.educationLevel.trim(),
        education: form.educationLevel.trim(),
        school: form.school.trim(),
        organization: form.organization.trim(),
        website: form.website.trim(),
        instagram: form.instagram.trim(),
        linkedin: form.linkedin.trim(),
        tiktok: form.tiktok.trim(),
        x: form.x.trim(),
        socialLinks: {
          website: form.website.trim(),
          instagram: form.instagram.trim(),
          linkedin: form.linkedin.trim(),
          tiktok: form.tiktok.trim(),
          x: form.x.trim(),
        },
        email: user.email,
        uid: user.uid,
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", user.uid), payload, { merge: true });
      if (auth.currentUser && displayName && displayName !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName });
      }

      const nextUser = { ...user, ...payload, updatedAt: new Date().toISOString() };
      onSaved(nextUser);
      setStatus({ type: "success", message: "Profile saved." });
      setTimeout(onClose, 700);
    } catch (err) {
      console.error("Profile save failed:", err);
      setStatus({ type: "error", message: err.message || "Could not save profile." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <motion.form
        className="profile-modal"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        onSubmit={save}
      >
        <div className="profile-modal-head">
          <div>
            <span>Account settings</span>
            <h2>Edit Profile</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close edit profile"><X size={20} /></button>
        </div>

        <div className="profile-form-grid">
          <Field label="Full name"><input value={form.fullName} onChange={(e) => setValue("fullName", e.target.value)} /></Field>
          <Field label="Display name"><input value={form.displayName} onChange={(e) => setValue("displayName", e.target.value)} /></Field>
          <Field label="Username"><input value={form.username} onChange={(e) => setValue("username", e.target.value)} /></Field>
          <Field label="Email"><input value={user.email || ""} readOnly /></Field>
          <Field label="Phone"><input value={form.phone} onChange={(e) => setValue("phone", e.target.value)} /></Field>
          <Field label="Country"><input value={form.country} onChange={(e) => setValue("country", e.target.value)} /></Field>
          <Field label="City"><input value={form.city} onChange={(e) => setValue("city", e.target.value)} /></Field>
          <Field label="Location"><input value={form.location} onChange={(e) => setValue("location", e.target.value)} /></Field>
          <Field label="Education level"><input value={form.educationLevel} onChange={(e) => setValue("educationLevel", e.target.value)} /></Field>
          <Field label="School"><input value={form.school} onChange={(e) => setValue("school", e.target.value)} /></Field>
          <Field label="Organization"><input value={form.organization} onChange={(e) => setValue("organization", e.target.value)} /></Field>
          <Field label="Website"><input value={form.website} onChange={(e) => setValue("website", e.target.value)} /></Field>
          <Field label="Instagram"><input value={form.instagram} onChange={(e) => setValue("instagram", e.target.value)} /></Field>
          <Field label="LinkedIn"><input value={form.linkedin} onChange={(e) => setValue("linkedin", e.target.value)} /></Field>
          <Field label="TikTok"><input value={form.tiktok} onChange={(e) => setValue("tiktok", e.target.value)} /></Field>
          <Field label="X / Twitter"><input value={form.x} onChange={(e) => setValue("x", e.target.value)} /></Field>
          <Field label="Skills" wide><textarea value={form.skills} onChange={(e) => setValue("skills", e.target.value)} placeholder="React, design, AI, business..." /></Field>
          <Field label="Interests" wide><textarea value={form.interests} onChange={(e) => setValue("interests", e.target.value)} placeholder="Learning, tech, entrepreneurship..." /></Field>
          <Field label="Bio / about" wide><textarea value={form.bio} onChange={(e) => setValue("bio", e.target.value)} /></Field>
        </div>

        <div className="profile-protected-note">
          Role, admin permissions, seller status, and manager access are protected fields and are not editable here.
        </div>

        <div className="profile-modal-actions">
          {status && <span className={`profile-save-status profile-save-status--${status.type}`}>{status.message}</span>}
          <button type="button" className="profile-secondary-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="profile-primary-btn" disabled={saving}>
            {saving ? <Loader2 className="profile-spin" size={16} /> : <Save size={16} />} Save changes
          </button>
        </div>
      </motion.form>
    </div>
  );
}

function CoverUploader({ user, onUploaded }) {
  const [uploading, setUploading] = useState(false);

  const uploadCover = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    setUploading(true);
    try {
      const path = `profileCovers/${user.uid}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
      const coverRef = ref(storage, path);
      await uploadBytes(coverRef, file);
      const coverURL = await getDownloadURL(coverRef);
      await setDoc(doc(db, "users", user.uid), { coverURL, updatedAt: serverTimestamp() }, { merge: true });
      onUploaded(coverURL);
    } catch (err) {
      console.error("Cover upload failed:", err);
      try {
        handleStorageError(err);
      } catch (formattedError) {
        alert(formattedError.message);
      }
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <label className="profile-cover-upload">
      {uploading ? <Loader2 className="profile-spin" size={16} /> : <Camera size={16} />} Cover
      <input type="file" accept="image/*" onChange={uploadCover} disabled={uploading} />
    </label>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [editOpen, setEditOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const loadProfile = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate("/");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        const profile = normalizeUser(currentUser, snap.exists() ? snap.data() : {});
        if (!snap.exists()) {
          await setDoc(doc(db, "users", currentUser.uid), {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || "",
            photoURL: currentUser.photoURL || "",
            role: "user",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }, { merge: true });
        }
        if (!cancelled) setUser(profile);
      } catch (err) {
        console.error("Profile load failed:", err);
        if (!cancelled) {
          setError(err.message || "Could not load profile.");
          setUser(normalizeUser(currentUser));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const completion = useMemo(() => calculateCompletion(user), [user]);
  const skills = listFrom(user?.skills);
  const interests = listFrom(user?.interests);
  const badges = roleBadges(user);
  const tabs = [
    { id: "overview", label: "Overview", icon: UserIcon },
    { id: "personal", label: "Personal", icon: Mail },
    { id: "learning", label: "Learning", icon: GraduationCap },
    { id: "role", label: "Badges", icon: ShieldCheck },
    { id: "activity", label: "Activity", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const signOut = async () => {
    await auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <>
        <ProfileStyles />
        <ProfileSkeleton />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <ProfileStyles />
        <div className="stea-profile-shell">
          <EmptyState title="Profile unavailable" message="Sign in again to view your STEA profile." action={<button className="profile-primary-btn" onClick={() => navigate("/")}>Back home</button>} />
        </div>
      </>
    );
  }

  return (
    <>
      <ProfileStyles />
      <div className="stea-profile-shell">
        {error && <div className="profile-error">{error}</div>}

        <motion.section className="profile-hero" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <div className="profile-cover" style={user.coverURL ? { backgroundImage: `url(${user.coverURL})` } : undefined}>
            <CoverUploader user={user} onUploaded={(coverURL) => setUser((prev) => ({ ...prev, coverURL }))} />
          </div>

          <div className="profile-hero-body">
            <div className="profile-avatar-wrap">
              <ProfilePictureUpload
                userId={user.uid}
                currentPhotoURL={user.photoURL}
                onUpdate={(photoURL) => setUser((prev) => ({ ...prev, photoURL }))}
              />
            </div>

            <div className="profile-identity">
              <div className="profile-title-row">
                <div>
                  <span className="profile-kicker">STEA Profile</span>
                  <h1>{getDisplayName(user)}</h1>
                  <p>{user.bio || user.about || "Add a short bio to make your profile feel complete."}</p>
                </div>
                <div className="profile-actions">
                  <button className="profile-secondary-btn" onClick={signOut}><LogOut size={16} /> Logout</button>
                  <button className="profile-primary-btn" onClick={() => setEditOpen(true)}><Edit3 size={16} /> Edit profile</button>
                </div>
              </div>

              <div className="profile-badges">
                {badges.map((badge) => <Badge key={badge.label} badge={badge} />)}
              </div>

              <div className="profile-completion">
                <div>
                  <strong>{completion}% complete</strong>
                  <span>{completion < 100 ? "Add missing details to strengthen your account." : "Your profile is complete."}</span>
                </div>
                <div className="profile-progress"><span style={{ width: `${completion}%` }} /></div>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="profile-tabs" role="tablist">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} className={activeTab === tab.id ? "is-active" : ""} onClick={() => setActiveTab(tab.id)}>
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {activeTab === "overview" && (
              <div className="profile-grid">
                <section className="profile-panel profile-panel--wide">
                  <div className="profile-panel-head">
                    <h2>Profile Overview</h2>
                    <span>Joined {formatDate(user.createdAt || user.metadata?.creationTime)}</span>
                  </div>
                  <div className="profile-info-grid">
                    <InfoCard icon={Mail} label="Email" value={user.email} />
                    <InfoCard icon={Phone} label="Phone" value={user.phone || user.phoneNumber} />
                    <InfoCard icon={MapPin} label="Location" value={[user.city, user.country].filter(Boolean).join(", ") || user.location} />
                    <InfoCard icon={Globe} label="Website" value={user.website || user.socialLinks?.website} />
                  </div>
                </section>

                <section className="profile-panel">
                  <div className="profile-panel-head"><h2>Account Role</h2></div>
                  <div className="profile-role-card">
                    <ShieldCheck size={22} />
                    <strong>{getRole(user).replace("_", " ")}</strong>
                    <span>Protected account role managed by STEA admins.</span>
                  </div>
                </section>
              </div>
            )}

            {activeTab === "personal" && (
              <section className="profile-panel">
                <div className="profile-panel-head"><h2>Personal Info</h2><button onClick={() => setEditOpen(true)}>Edit <ChevronRight size={15} /></button></div>
                <div className="profile-info-grid">
                  <InfoCard icon={UserIcon} label="Full name" value={user.fullName || user.name || user.displayName} />
                  <InfoCard icon={UserIcon} label="Username" value={user.username} />
                  <InfoCard icon={Mail} label="Email" value={user.email} />
                  <InfoCard icon={Phone} label="Phone" value={user.phone || user.phoneNumber} />
                  <InfoCard icon={MapPin} label="Country" value={user.country} />
                  <InfoCard icon={MapPin} label="City" value={user.city} />
                  <InfoCard icon={BriefcaseBusiness} label="Organization" value={user.organization} />
                  <InfoCard icon={BookOpen} label="School" value={user.school} />
                </div>
              </section>
            )}

            {activeTab === "learning" && (
              <section className="profile-panel">
                <div className="profile-panel-head"><h2>Learning & Interests</h2><span>{user.educationLevel || user.education || "Education not set"}</span></div>
                <div className="profile-chip-section">
                  <h3>Skills</h3>
                  {skills.length ? <div className="profile-chip-list">{skills.map((item) => <span key={item}>{item}</span>)}</div> : <EmptyState icon={GraduationCap} title="No skills added" message="Add skills in edit profile." />}
                </div>
                <div className="profile-chip-section">
                  <h3>Interests</h3>
                  {interests.length ? <div className="profile-chip-list">{interests.map((item) => <span key={item}>{item}</span>)}</div> : <EmptyState icon={Sparkles} title="No interests added" message="Add interests so STEA can personalize your experience." />}
                </div>
              </section>
            )}

            {activeTab === "role" && (
              <section className="profile-panel">
                <div className="profile-panel-head"><h2>Account Role & Badges</h2></div>
                <div className="profile-badge-grid">
                  {badges.map((badge) => <div className="profile-badge-card" key={badge.label}><Badge badge={badge} /><span>Active on this account</span></div>)}
                </div>
                <div className="profile-protected-note">Role and permission changes are handled only by admin workflows.</div>
              </section>
            )}

            {activeTab === "activity" && (
              <div className="profile-grid">
                <section className="profile-panel">
                  <div className="profile-panel-head"><h2>Saved / Recent Activity</h2></div>
                  <EmptyState icon={History} title="No recent activity found" message="When saved items or order history are connected to this profile, they will appear here." />
                </section>
                <section className="profile-panel">
                  <div className="profile-panel-head"><h2>Downloads</h2></div>
                  <EmptyState icon={Package} title="No downloads yet" message="Digital purchases and downloads will show here when available." />
                </section>
              </div>
            )}

            {activeTab === "settings" && (
              <section className="profile-panel">
                <div className="profile-panel-head"><h2>Settings Shortcut</h2></div>
                <div className="profile-settings-list">
                  <button onClick={() => setEditOpen(true)}><Edit3 size={17} /> Edit personal details <ChevronRight size={16} /></button>
                  {user.website && <a href={user.website} target="_blank" rel="noreferrer"><ExternalLink size={17} /> Open website <ChevronRight size={16} /></a>}
                  <button onClick={signOut}><LogOut size={17} /> Logout <ChevronRight size={16} /></button>
                </div>
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {editOpen && <EditProfileModal user={user} onClose={() => setEditOpen(false)} onSaved={setUser} />}
      </AnimatePresence>
    </>
  );
}

function ProfileStyles() {
  return (
    <style>{`
      .stea-profile-shell{width:min(1180px,100%);margin:0 auto;padding:18px 14px 44px;color:#fff;font-family:'Instrument Sans',system-ui,sans-serif}.profile-error{border:1px solid rgba(248,113,113,.3);background:rgba(248,113,113,.08);color:#fecaca;border-radius:8px;padding:12px 14px;margin-bottom:14px;font-weight:800;font-size:13px}.profile-hero,.profile-panel{border:1px solid rgba(255,255,255,.08);border-radius:8px;background:linear-gradient(180deg,rgba(255,255,255,.052),rgba(255,255,255,.025));box-shadow:0 20px 70px rgba(0,0,0,.22)}.profile-hero{overflow:hidden;margin-bottom:14px}.profile-cover{height:190px;background:radial-gradient(circle at 25% 15%,rgba(245,166,35,.32),transparent 28%),linear-gradient(135deg,#10131b,#05060a 70%);background-size:cover;background-position:center;position:relative}.profile-cover:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.08),rgba(5,6,10,.82))}.profile-cover-upload{position:absolute;right:14px;top:14px;z-index:2;height:38px;padding:0 12px;border-radius:8px;background:rgba(5,6,10,.78);border:1px solid rgba(255,255,255,.12);color:#fff;display:flex;align-items:center;gap:8px;font-size:12px;font-weight:900;cursor:pointer;backdrop-filter:blur(12px)}.profile-cover-upload input{display:none}.profile-hero-body{display:grid;grid-template-columns:auto minmax(0,1fr);gap:18px;padding:0 22px 22px}.profile-avatar-wrap{margin-top:-52px;z-index:2}.profile-identity{padding-top:18px}.profile-title-row{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}.profile-kicker,.profile-modal-head span{font-size:11px;color:${G};text-transform:uppercase;letter-spacing:.13em;font-weight:950}.profile-title-row h1{font-size:clamp(28px,4vw,46px);line-height:1;margin:6px 0 9px}.profile-title-row p{margin:0;color:rgba(255,255,255,.58);line-height:1.6;max-width:720px}.profile-actions{display:flex;gap:9px;flex-wrap:wrap;justify-content:flex-end}.profile-primary-btn,.profile-secondary-btn{height:40px;border-radius:8px;padding:0 13px;font-weight:950;display:inline-flex;align-items:center;justify-content:center;gap:8px;cursor:pointer}.profile-primary-btn{border:0;background:linear-gradient(135deg,${G},${G2});color:#111}.profile-secondary-btn{border:1px solid rgba(255,255,255,.11);background:rgba(255,255,255,.045);color:#fff}.profile-badges{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.profile-badge{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:7px 10px;font-size:11px;font-weight:950;text-transform:capitalize;border:1px solid rgba(255,255,255,.1)}.profile-badge--gold{background:rgba(245,166,35,.12);color:#ffd17c;border-color:rgba(245,166,35,.25)}.profile-badge--green{background:rgba(34,197,94,.1);color:#86efac;border-color:rgba(34,197,94,.22)}.profile-badge--blue{background:rgba(59,130,246,.1);color:#93c5fd;border-color:rgba(59,130,246,.22)}.profile-badge--purple{background:rgba(168,85,247,.1);color:#d8b4fe;border-color:rgba(168,85,247,.22)}.profile-badge--muted{background:rgba(255,255,255,.05);color:rgba(255,255,255,.65)}.profile-completion{margin-top:18px;border:1px solid rgba(255,255,255,.07);background:rgba(0,0,0,.16);border-radius:8px;padding:13px}.profile-completion div:first-child{display:flex;justify-content:space-between;gap:12px;margin-bottom:10px}.profile-completion strong{font-size:13px}.profile-completion span{font-size:12px;color:rgba(255,255,255,.45)}.profile-progress{height:7px;background:rgba(255,255,255,.08);border-radius:999px;overflow:hidden}.profile-progress span{display:block;height:100%;background:linear-gradient(90deg,${G},${G2})}
      .profile-tabs{display:flex;gap:8px;overflow-x:auto;padding:4px;margin-bottom:14px}.profile-tabs button{height:39px;border:1px solid rgba(255,255,255,.08);border-radius:8px;background:rgba(255,255,255,.035);color:rgba(255,255,255,.58);font-weight:900;display:flex;align-items:center;gap:8px;padding:0 12px;white-space:nowrap;cursor:pointer}.profile-tabs button.is-active{background:linear-gradient(135deg,${G},${G2});color:#111;border-color:transparent}.profile-grid{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:14px}.profile-panel{padding:18px}.profile-panel--wide{grid-column:auto}.profile-panel-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.profile-panel-head h2{font-size:18px;margin:0}.profile-panel-head span{font-size:12px;color:rgba(255,255,255,.45);font-weight:800}.profile-panel-head button{height:34px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.045);color:#fff;font-weight:900;display:flex;align-items:center;gap:5px;cursor:pointer}.profile-info-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.profile-info-card{border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.035);border-radius:8px;padding:13px;display:flex;gap:11px;align-items:flex-start;min-width:0}.profile-info-icon{width:36px;height:36px;border-radius:8px;background:rgba(245,166,35,.1);color:${G};display:grid;place-items:center;flex-shrink:0}.profile-info-card span{display:block;font-size:11px;color:rgba(255,255,255,.43);font-weight:900;text-transform:uppercase;letter-spacing:.07em}.profile-info-card strong{display:block;font-size:14px;margin-top:4px;overflow-wrap:anywhere}.profile-role-card{border:1px solid rgba(245,166,35,.16);background:rgba(245,166,35,.06);border-radius:8px;padding:16px;display:grid;gap:8px;color:#ffd17c}.profile-role-card strong{font-size:22px;text-transform:capitalize}.profile-role-card span{color:rgba(255,255,255,.54);line-height:1.5}.profile-chip-section{display:grid;gap:10px;margin-top:14px}.profile-chip-section h3{margin:0;font-size:14px;color:rgba(255,255,255,.76)}.profile-chip-list{display:flex;flex-wrap:wrap;gap:8px}.profile-chip-list span{border:1px solid rgba(245,166,35,.18);background:rgba(245,166,35,.07);color:#ffd17c;border-radius:999px;padding:8px 11px;font-size:12px;font-weight:900}.profile-badge-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px}.profile-badge-card{border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.035);border-radius:8px;padding:14px;display:grid;gap:10px}.profile-badge-card span:last-child{font-size:12px;color:rgba(255,255,255,.45)}.profile-settings-list{display:grid;gap:9px}.profile-settings-list button,.profile-settings-list a{height:46px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.035);color:#fff;border-radius:8px;padding:0 13px;display:flex;align-items:center;gap:10px;font-weight:900;text-decoration:none;cursor:pointer}.profile-settings-list svg:last-child{margin-left:auto}.profile-empty{border:1px dashed rgba(255,255,255,.14);border-radius:8px;padding:26px;display:grid;place-items:center;text-align:center;gap:8px;color:rgba(255,255,255,.47)}.profile-empty strong{color:#fff}.profile-empty span{max-width:430px;line-height:1.5}
      .profile-modal-backdrop{position:fixed;inset:0;z-index:5000;background:rgba(0,0,0,.76);backdrop-filter:blur(18px);display:grid;place-items:center;padding:14px}.profile-modal{width:min(920px,100%);max-height:min(88vh,860px);overflow:auto;border:1px solid rgba(255,255,255,.1);border-radius:8px;background:#090b10;color:#fff;box-shadow:0 40px 120px rgba(0,0,0,.62)}.profile-modal-head{position:sticky;top:0;z-index:2;background:rgba(9,11,16,.94);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,.08);padding:18px;display:flex;justify-content:space-between;align-items:center;gap:12px}.profile-modal-head h2{margin:3px 0 0;font-size:22px}.profile-modal-head button{width:38px;height:38px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.045);color:#fff;display:grid;place-items:center;cursor:pointer}.profile-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;padding:18px}.profile-field{display:grid;gap:6px}.profile-field--wide{grid-column:1/-1}.profile-field span{font-size:12px;color:rgba(255,255,255,.48);font-weight:900}.profile-field input,.profile-field textarea{width:100%;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:#fff;border-radius:8px;padding:11px;outline:none}.profile-field input[readonly]{color:rgba(255,255,255,.45)}.profile-field textarea{min-height:94px;resize:vertical}.profile-protected-note{margin:0 18px 18px;border:1px solid rgba(245,166,35,.16);background:rgba(245,166,35,.06);color:#ffd17c;border-radius:8px;padding:11px 12px;font-size:12px;font-weight:800;line-height:1.5}.profile-modal-actions{position:sticky;bottom:0;background:rgba(9,11,16,.94);border-top:1px solid rgba(255,255,255,.08);padding:14px 18px;display:flex;justify-content:flex-end;align-items:center;gap:10px}.profile-save-status{margin-right:auto;font-size:12px;font-weight:900}.profile-save-status--success{color:#86efac}.profile-save-status--error{color:#fca5a5}.profile-save-status--loading{color:#ffd17c}.profile-spin{animation:profileSpin 1s linear infinite}@keyframes profileSpin{to{transform:rotate(360deg)}}.profile-skeleton{border-radius:8px;background:linear-gradient(90deg,rgba(255,255,255,.04),rgba(255,255,255,.08),rgba(255,255,255,.04));background-size:200% 100%;animation:profileShimmer 1.4s infinite}.profile-skeleton.hero{height:330px;margin-bottom:14px}.profile-skeleton.card{height:170px}@keyframes profileShimmer{to{background-position:-200% 0}}
      @media(max-width:900px){.profile-grid{grid-template-columns:1fr}.profile-hero-body{grid-template-columns:1fr}.profile-avatar-wrap{margin-top:-58px}.profile-title-row{flex-direction:column}.profile-actions{justify-content:flex-start}.profile-info-grid{grid-template-columns:1fr 1fr}.profile-cover{height:160px}}@media(max-width:600px){.stea-profile-shell{padding:12px 10px 34px}.profile-hero-body{padding:0 14px 16px}.profile-info-grid,.profile-form-grid{grid-template-columns:1fr}.profile-panel{padding:14px}.profile-modal-actions{flex-wrap:wrap}.profile-save-status{width:100%;margin-right:0}.profile-primary-btn,.profile-secondary-btn{width:100%}.profile-completion div:first-child{display:grid}.profile-cover-upload{right:10px;top:10px}}
    `}</style>
  );
}
