import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Globe, ChevronDown, ArrowRight, MessageCircle,
  Smartphone, Laptop, Monitor, Zap, CheckCircle, Check,
  HelpCircle, BookOpen, Star, AlertTriangle,
  Wifi, Eye, Info, CreditCard, PlayCircle, Loader2
} from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";
import { db, doc, getDoc, collection, getDocs, addDoc, serverTimestamp, auth } from "../firebase";

const G    = "#F5A623";
const G2   = "#FFD17C";
const DARK = "#05060a";
const CARD = "#0d0f1a";
const BORDER = "rgba(255,255,255,0.07)";
const BLUE = "#3B82F6";

const W = ({ children, style = {} }) => (
  <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px,4vw,40px)", ...style }}>
    {children}
  </div>
);

function SectionLabel({ children, color = G }) {
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"6px 16px", borderRadius:999, background:`${color}12`, border:`1px solid ${color}25`, color, fontSize:11, fontWeight:900, textTransform:"uppercase", letterSpacing:".1em", marginBottom:20 }}>
      {children}
    </div>
  );
}

function GoldButton({ href, onClick, children, outline, disabled }) {
  const s = {
    display:"inline-flex", alignItems:"center", gap:10, justifyContent: "center",
    padding:"14px 28px", borderRadius:14, fontWeight:900, fontSize:15,
    cursor: disabled ? "not-allowed" : "pointer", textDecoration:"none", border:"none", transition:"all .2s",
    opacity: disabled ? 0.5 : 1,
    ...(outline
      ? { background:"transparent", color:G, border:`1.5px solid ${G}50` }
      : { background:`linear-gradient(135deg,${G},${G2})`, color:"#111", boxShadow:`0 6px 20px ${G}35` }
    ),
  };
  if (href) return <a href={href} target="_blank" rel="noreferrer" style={s}>{children}</a>;
  return <button disabled={disabled} onClick={onClick} style={s}>{children}</button>;
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border:`1px solid ${open ? `${G}40` : BORDER}`, borderRadius:14, overflow:"hidden", transition:"border-color .2s" }}>
      <button onClick={() => setOpen(v => !v)}
        style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 22px", background:"none", border:"none", color:"#fff", fontWeight:700, fontSize:15, textAlign:"left", cursor:"pointer", gap:16 }}>
        <span>{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration:.2 }}>
          <ChevronDown size={17} color={G}/>
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:.22 }} style={{ overflow:"hidden" }}>
            <div style={{ padding:"0 22px 20px", color:"rgba(255,255,255,.65)", lineHeight:1.75, fontSize:14 }}>{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function VpnHelpPage() {
  const { t } = useSettings();
  const [activeGuide, setActiveGuide] = useState(null);

  // Settings State
  const [plans, setPlans] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [vpnInstructions, setVpnInstructions] = useState({});
  const [loadingConfig, setLoadingConfig] = useState(true);

  const [checkoutStep, setCheckoutStep] = useState(1);

  // Checkout State
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [userEmail, setUserEmail] = useState(auth.currentUser?.email || "");
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const vpnSettingsDoc = await getDoc(doc(db, "adminSettings", "vpn"));
        if (vpnSettingsDoc.exists()) {
          const data = vpnSettingsDoc.data();
          setPlans(data.dataPlans?.filter(p => p.active !== false) || []);
        }

        const pmSnap = await getDocs(collection(db, "paymentSettings"));
        setPaymentMethods(pmSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(m => m.enabled));

        const instSnap = await getDocs(collection(db, "vpnInstructions"));
        const instData = {};
        instSnap.forEach(d => { instData[d.id] = d.data(); });
        setVpnInstructions(instData);
      } catch (err) {
        console.error("Error fetching config:", err);
      } finally {
        setLoadingConfig(false);
      }
    };
    fetchConfig();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "stea_unsigned");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/do87mivyq/image/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setScreenshotUrl(data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload screenshot. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const WA_LINK = "https://wa.me/255757053354?text=" + encodeURIComponent(
    "Habari STEA! Nahitaji msaada wa VPN. Ninaenda [eleza hali yako]."
  );
  const WA_SETUP = "https://wa.me/255757053354?text=" + encodeURIComponent(
    "Habari STEA! Nahitaji setup help ya VPN. Kifaa changu ni [eleza] na ninaenda [nchi]."
  );

  const COUNTRIES = [
    { flag:"🇨🇳", name:"China",            color:"#ef4444", urgent:true,
      problem: t('vpn_china_problem'),
      note: t('vpn_china_note') },
    { flag:"🇦🇪", name:"Dubai / UAE",       color:"#f59e0b",
      problem: t('vpn_uae_problem'),
      note: t('vpn_uae_note') },
    { flag:"🇮🇳", name:"India",             color:"#f97316",
      problem: t('vpn_india_problem'),
      note: t('vpn_india_note') },
    { flag:"🇸🇦", name:"Saudi Arabia",      color:"#10b981",
      problem: t('vpn_saudi_problem'),
      note: t('vpn_saudi_note') },
    { flag:"🇶🇦", name:"Qatar",             color:"#8b5cf6",
      problem: t('vpn_qatar_problem'),
      note: t('vpn_qatar_note') },
    { flag:"🌍", name: t('vpn_other_countries'),       color:BLUE,
      problem: t('vpn_other_problem'),
      note: t('vpn_other_note') },
  ];

  const handleSubscribe = async () => {
    if (!selectedPlan || !selectedPaymentMethod || !userEmail || (!transactionId && !screenshotUrl)) {
      alert("Please select a plan, payment method, provide your email, and either a transaction ID or payment screenshot.");
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "payments"), {
        service: "vpn",
        planType: selectedPlan.id,
        planName: selectedPlan.name,
        amountPaid: selectedPaymentMethod.name.includes('WeChat') || selectedPaymentMethod.name.includes('Alipay') 
          ? `¥ ${selectedPlan.priceYuan}` 
          : `Tsh ${selectedPlan.priceTsh}`,
        paymentMethod: selectedPaymentMethod.name,
        transactionId: transactionId,
        screenshotUrl: screenshotUrl,
        userEmail: userEmail,
        whatsappPhone: whatsappPhone,
        userId: auth.currentUser?.uid || null,
        status: "pending",
        submittedAt: serverTimestamp()
      });
      setSubmitSuccess(true);
    } catch (err) {
      console.error("Subscription err:", err);
      alert("Failed to submit subscription. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const DEVICES = [
    { id: "android", icon: <Smartphone size={24}/>, name: "Android", color: "#10b981" },
    { id: "iphone", icon: <Smartphone size={24}/>, name: "iPhone (iOS)", color: BLUE },
    { id: "windows", icon: <Monitor size={24}/>, name: "Windows", color: G },
    { id: "mac", icon: <Laptop size={24}/>, name: "MacBook", color: "#a855f7" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:DARK, color:"#fff", overflowX:"hidden", fontFamily:"'Instrument Sans',system-ui,sans-serif" }}>

      {/* ── HERO ── */}
      <section style={{ padding:"100px 20px 80px", background:"radial-gradient(ellipse at 60% -10%, rgba(59,130,246,.16) 0%, transparent 55%), radial-gradient(ellipse at 10% 80%, rgba(245,166,35,.08) 0%, transparent 50%)", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:.07 }}>
          <svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
            <circle cx="400" cy="250" r="180" fill="none" stroke={BLUE} strokeWidth="1"/>
            <circle cx="400" cy="250" r="280" fill="none" stroke={BLUE} strokeWidth=".5"/>
            <circle cx="400" cy="250" r="380" fill="none" stroke={BLUE} strokeWidth=".3"/>
            <line x1="0" y1="250" x2="800" y2="250" stroke={BLUE} strokeWidth=".5"/>
            <line x1="400" y1="0" x2="400" y2="500" stroke={BLUE} strokeWidth=".5"/>
          </svg>
        </div>

        <motion.div initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 18px", background:"rgba(59,130,246,.12)", border:"1px solid rgba(59,130,246,.2)", borderRadius:20, color:"#93c5fd", fontSize:13, fontWeight:700, marginBottom:28 }}>
            <Globe size={15}/> 🚀 STEA Fast & Secure VPN
          </div>

          <h1 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:"clamp(36px,6vw,68px)", fontWeight:900, lineHeight:1.08, letterSpacing:"-.04em", marginBottom:22 }}>
            Unblock the World <br/><span style={{ color: G }}>from Anywhere.</span>
          </h1>

          <p style={{ color:"rgba(255,255,255,.6)", maxWidth:580, margin:"0 auto 40px", fontSize:17, lineHeight:1.75 }}>
            Whether you're in China, Dubai, or any heavily restricted network, STEA VPN provides unbreakable connections, zero logs, and blazing fast speeds.
          </p>

          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginBottom: 40 }}>
            <GoldButton onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior:"smooth" })}>
              <Zap size={18}/> Get STEA VPN
            </GoldButton>
            <GoldButton outline onClick={() => document.getElementById("instructions")?.scrollIntoView({ behavior:"smooth" })}>
              <BookOpen size={16}/> Setup Guide
            </GoldButton>
          </div>
        </motion.div>
      </section>

      {/* ── PRICING SECTION ── */}
      <section id="pricing" style={{ padding:"80px 0", background: "rgba(255,255,255,0.01)" }}>
        <W>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <SectionLabel color={G}><CreditCard size={13}/> Pricing Plans</SectionLabel>
            <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:"clamp(26px,4vw,40px)", fontWeight:900, lineHeight:1.1, letterSpacing:"-.03em", marginBottom:12 }}>
              Choose Your Freedom
            </h2>
            <p style={{ color:"rgba(255,255,255,.5)", fontSize:16, maxWidth:500, margin:"0 auto" }}>
              Affordable access perfectly tailored for students and expats.
            </p>
          </div>

          {loadingConfig ? (
            <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.5)" }}>
              <Loader2 className="animate-spin" size={32} style={{ margin: "0 auto", marginBottom: 12, color: G }} />
              Loading plans...
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {checkoutStep === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))", gap:24, marginBottom: 48 }}
                >
                  {plans.map((plan) => (
                    <div key={plan.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 24, padding: "32px 24px", position: "relative", color: "#fff" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                        <h3 style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>{plan.dataAmount}G data</h3>
                        <div style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", padding: "6px 12px", borderRadius: 999, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                          <CheckCircle size={14} /> Plenty in Stock
                        </div>
                      </div>
                      
                      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>MONTHLY DATA ALLOWANCE</div>
                          <div style={{ fontSize: 48, fontWeight: 900, color: "#ec4899", lineHeight: 1 }}>
                            {plan.dataAmount} <span style={{ fontSize: 20, color: "rgba(255,255,255,0.7)" }}>GB</span>
                          </div>
                        </div>
                        <div style={{ flex: 1.2, background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.15)", borderRadius: 16, padding: "16px 12px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>GLOBAL PREMIUM REGIONS</div>
                          <div style={{ fontSize: 32, fontWeight: 900, color: "#06b6d4" }}>70+</div>
                        </div>
                      </div>

                      <div style={{ display: "grid", gap: 12, marginBottom: 32 }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "center", background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)", padding: "12px 16px", borderRadius: 12 }}>
                          <Globe size={24} color="#3b82f6" />
                          <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.8)", lineHeight: 1.4 }}>Rare IPs from Antarctica, Iceland, and other regions; native IPs; residential IPs</div>
                        </div>

                        <div style={{ display: "inline-flex", width: "fit-content", alignItems: "center", gap: 6, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#93c5fd", padding: "8px 12px", borderRadius: 8, fontSize: 13, fontWeight: 700 }}>
                          <PlayCircle size={14} /> 4K video plays instantly during peak hours
                        </div>
                        
                        <div style={{ display: "flex", gap: 8 }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(219,39,119,0.1)", border: "1px solid rgba(219,39,119,0.2)", color: "#fbcfe8", padding: "8px 12px", borderRadius: 8, fontSize: 13, fontWeight: 700 }}>
                            ✦ Unlock: Netflix, ChatGPT, Gemini, etc.
                          </div>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.2)", color: "#bbf7d0", padding: "8px 12px", borderRadius: 8, fontSize: 13, fontWeight: 700 }}>
                            🚀 Unlimited internet speed
                          </div>
                        </div>

                        <div style={{ display: "inline-flex", width: "fit-content", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.9)", padding: "8px 12px", borderRadius: 8, fontSize: 13, fontWeight: 700 }}>
                          📱 No limit on the number of devices online simultaneously
                        </div>
                        
                        <div style={{ display: "inline-flex", width: "fit-content", marginLeft: "auto", alignItems: "center", gap: 6, background: "rgba(219,39,119,0.1)", border: "1px solid rgba(219,39,119,0.2)", color: "#fbcfe8", padding: "8px 12px", borderRadius: 8, fontSize: 13, fontWeight: 700 }}>
                          🎵 Can modify TikTok IP and Xiaohongshu IP
                        </div>
                      </div>

                      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 4, height: 16, background: "#0ea5e9", borderRadius: 4 }} />
                        <h4 style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>Select Billing Cycle</h4>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                        {plan.cycles?.map((cycle) => {
                          const isSelected = selectedPlan?.planId === plan.id && selectedPlan?.cycleId === cycle.id;
                          return (
                            <motion.div 
                              key={cycle.id}
                              whileHover={{ y: -4, scale: 1.02 }}
                              whileTap={{ scale: 0.96 }}
                              onClick={() => {
                                setSelectedPlan({
                                  id: `${plan.id}_${cycle.id}`,
                                  planId: plan.id,
                                  cycleId: cycle.id,
                                  name: `${plan.dataAmount}GB - ${cycle.id.charAt(0).toUpperCase() + cycle.id.slice(1)}`,
                                  priceTsh: cycle.priceTsh,
                                  priceYuan: cycle.priceYuan,
                                  price: "", // will be computed based on payment method
                                  durationDays: cycle.durationDays
                                });
                                setTimeout(() => {
                                  setCheckoutStep(2);
                                  setTimeout(() => {
                                    document.getElementById("checkout-form")?.scrollIntoView({ behavior:"smooth", block:"start" });
                                  }, 100);
                                }, 400); // short delay to show the selected state animation
                              }}
                              style={{ 
                                background: isSelected ? "rgba(14,165,233,0.1)" : "rgba(255,255,255,0.03)", 
                                border: `2px solid ${isSelected ? "#0ea5e9" : "rgba(255,255,255,0.05)"}`, 
                                borderRadius: 16, 
                                padding: "16px 12px", 
                                textAlign: "center", 
                                cursor: "pointer",
                                transition: "background 0.2s, border 0.2s"
                              }}
                            >
                              <div style={{ fontSize: 14, fontWeight: 700, color: isSelected ? "#fff" : "rgba(255,255,255,0.7)", marginBottom: 8, textTransform: "capitalize" }}>{cycle.id}</div>
                              
                              <div style={{ color: "#3b82f6", fontSize: 13, fontWeight: 800 }}>Tsh {cycle.priceTsh || '0'}</div>
                              <div style={{ color: "#38bdf8", marginTop: 4 }}>
                                <span style={{ fontSize: 13, fontWeight: 800 }}>¥ </span>
                                <span style={{ fontSize: 20, fontWeight: 900 }}>{cycle.priceYuan || '0.00'}</span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                    </div>
                  ))}
                </motion.div>
              )}

              {checkoutStep === 2 && selectedPlan && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 20 }}
                  id="checkout-form" 
                  style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 24, padding: "40px clamp(24px, 5vw, 40px)", maxWidth: 700, margin: "0 auto" }}
                >
                  <button onClick={() => { setCheckoutStep(1); setTimeout(() => document.getElementById("pricing")?.scrollIntoView({ behavior:"smooth", block:"start" }), 100); }} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 24, padding: 0 }}>
                    ← Back to Plans
                  </button>
                  <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24 }}>Complete Your Order</h3>
                  
                  {submitSuccess ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <div style={{ width: 64, height: 64, background: "rgba(16,185,129,0.1)", color: "#10b981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                        <CheckCircle size={32} />
                      </div>
                      <h4 style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>Order Submitted Successfully!</h4>
                      <div style={{ background: "rgba(245,166,35,0.05)", border: "1px solid rgba(245,166,35,0.1)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                        <p style={{ color: G, fontWeight: 700, margin: 0, fontSize: 15 }}>
                          ⚠️ IMPORTANT: VPN processing will take up to less than 30 minutes due to a high volume of customers. 
                        </p>
                        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 8, marginBottom: 0 }}>
                          Please be patient. Your configuration will be active shortly.
                        </p>
                      </div>
                      <button onClick={() => { setSubmitSuccess(false); setCheckoutStep(1); setSelectedPlan(null); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ marginTop: 8, background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 12, cursor: "pointer", fontWeight: 700 }}>Back to Plans</button>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gap: 24 }}>
                      
                      {/* User Info */}
                      <div style={{ display: "grid", gap: 16 }}>
                        <div>
                          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Email Address *</label>
                          <input type="email" value={userEmail} onChange={e => setUserEmail(e.target.value)} required style={{ width: "100%", padding: 14, borderRadius: 12, background: "rgba(0,0,0,0.2)", border: `1px solid ${BORDER}`, color: "#fff", outline: "none", transition: "0.2s" }} />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>WhatsApp / Phone Number</label>
                          <input type="text" value={whatsappPhone} onChange={e => setWhatsappPhone(e.target.value)} placeholder="+255..." style={{ width: "100%", padding: 14, borderRadius: 12, background: "rgba(0,0,0,0.2)", border: `1px solid ${BORDER}`, color: "#fff", outline: "none" }} />
                        </div>
                      </div>

                      {/* Payment Methods */}
                      <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>Select Payment Method *</label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
                          {paymentMethods.map(method => (
                            <div key={method.id} onClick={() => setSelectedPaymentMethod(method)} style={{ padding: 16, borderRadius: 12, border: `2px solid ${selectedPaymentMethod?.id === method.id ? G : BORDER}`, background: selectedPaymentMethod?.id === method.id ? "rgba(245,166,35,0.05)" : "rgba(0,0,0,0.2)", cursor: "pointer", textAlign: "center", fontWeight: 700, transition: "0.2s" }}>
                              {method.name}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Instructions */}
                      <AnimatePresence>
                        {selectedPaymentMethod && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} style={{ overflow: "hidden" }}>
                            <div style={{ padding: 24, background: "rgba(255,255,255,0.03)", borderRadius: 16, border: `1px solid ${BORDER}` }}>
                              <h4 style={{ fontWeight: 800, marginBottom: 12, color: G }}>How to pay with {selectedPaymentMethod.name}</h4>
                              <div style={{ padding: 12, background: "rgba(255,255,255,0.05)", borderRadius: 8, marginBottom: 16 }}>
                                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>Total Amount to Pay:</div>
                                <div style={{ fontSize: 28, fontWeight: 900, color: G }}>
                                  {(selectedPaymentMethod.name.includes('WeChat') || selectedPaymentMethod.name.includes('Alipay'))
                                    ? `¥ ${selectedPlan?.priceYuan || '0.00'}`
                                    : `Tsh ${selectedPlan?.priceTsh || '0'}`
                                  }
                                </div>
                              </div>
                              {selectedPaymentMethod.phoneNumber && (
                                <div style={{ fontSize: 15, marginBottom: 16 }}>
                                  Send the amount above to: <br/>
                                  <span style={{ fontSize: 24, fontWeight: 900, color: "#fff", display: "inline-block", marginTop: 8 }}>{selectedPaymentMethod.phoneNumber}</span>
                                </div>
                              )}
                              {selectedPaymentMethod.accountNumber && (
                                <div style={{ fontSize: 15, marginBottom: 16 }}>
                                  Deposit the amount above to: <br/>
                                  <span style={{ fontSize: 20, fontWeight: 900, color: "#fff", display: "inline-block", marginTop: 8 }}>{selectedPaymentMethod.accountNumber}</span>
                                </div>
                              )}
                              {selectedPaymentMethod.qrImage && (
                                <div style={{ textAlign: "center", marginBottom: 16 }}>
                                  <img src={selectedPaymentMethod.qrImage} alt="QR Code" style={{ maxWidth: 200, borderRadius: 12, border: `4px solid #fff` }} />
                                  <div style={{ marginTop: 8, fontSize: 14, color: "rgba(255,255,255,0.6)" }}>Scan to pay amount above</div>
                                </div>
                              )}
                              
                              <div style={{ marginTop: 24 }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Transaction ID / Order Number</label>
                                <input type="text" value={transactionId} onChange={e => setTransactionId(e.target.value)} placeholder="e.g. 5G4T8H9K..." style={{ width: "100%", padding: 14, borderRadius: 12, background: "rgba(0,0,0,0.5)", border: `1px solid ${BORDER}`, color: "#fff", outline: "none", borderColor: G }} />
                              </div>

                              <div style={{ marginTop: 24 }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Or Upload Payment Screenshot *</label>
                                <div style={{ border: `1px dashed ${BORDER}`, borderRadius: 12, padding: 24, textAlign: "center", position: "relative" }}>
                                  {uploadingImage ? (
                                    <div style={{ color: G, fontWeight: 700 }}><Loader2 className="animate-spin" size={20} style={{ display: "inline-block", marginRight: 8, verticalAlign: "middle" }} /> Uploading...</div>
                                  ) : screenshotUrl ? (
                                    <div>
                                      <img src={screenshotUrl} alt="Screenshot" style={{ maxHeight: 120, borderRadius: 8, border: `1px solid ${BORDER}` }} />
                                      <button type="button" onClick={() => setScreenshotUrl("")} style={{ display: "block", margin: "12px auto 0", background: "none", border: "none", color: "#ef4444", fontWeight: 700, cursor: "pointer" }}>Remove</button>
                                    </div>
                                  ) : (
                                    <label style={{ cursor: "pointer", color: "rgba(255,255,255,0.7)", fontWeight: 700 }}>
                                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                                      📸 Tap to upload screenshot
                                    </label>
                                  )}
                                </div>
                                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>Please provide either a Transaction ID or a Screenshot.</div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <GoldButton onClick={handleSubscribe} disabled={!selectedPlan || !selectedPaymentMethod || !userEmail || (!transactionId && !screenshotUrl) || isSubmitting || uploadingImage} style={{ width: "100%", marginTop: 12 }}>
                        {isSubmitting ? <Loader2 className="animate-spin" /> : <><Shield size={18}/> Submit Subscription</>}
                      </GoldButton>
                      
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </W>
      </section>

      {/* ── CONNECTION INSTRUCTIONS ── */}
      <section id="instructions" style={{ padding:"80px 0" }}>
        <W>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <SectionLabel color={BLUE}><BookOpen size={13}/> Connection Guide</SectionLabel>
            <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:"clamp(26px,4vw,40px)", fontWeight:900, lineHeight:1.1, letterSpacing:"-.03em", marginBottom:12 }}>
              How to Connect
            </h2>
            <p style={{ color:"rgba(255,255,255,.5)", fontSize:16, maxWidth:500, margin:"0 auto" }}>
              Easy step-by-step instructions for all your devices.
            </p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:16 }}>
            {DEVICES.map((d, i) => {
              const inst = vpnInstructions[d.id] || { appName: "App Name", steps: ["Follow guide inside."] };
              return (
                <div key={i} style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:20, padding: "20px", position:"relative", overflow:"hidden" }}>
                   <div style={{ color:d.color, marginBottom:16, display:"flex" }}>
                     <div style={{ background: `${d.color}15`, padding: 12, borderRadius: 12 }}>{d.icon}</div>
                   </div>
                   <h3 style={{ fontWeight:900, fontSize:18, marginBottom:10 }}>{d.name}</h3>
                   {inst.appName && (
                     <div style={{ display: "inline-block", background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700, marginBottom: 16, border: `1px solid ${BORDER}` }}>
                       App: {inst.appName}
                     </div>
                   )}
                   
                   <ul style={{ paddingLeft: 20, margin: 0, fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, display: "grid", gap: 8 }}>
                     {inst.steps?.filter(s => s.trim() !== "").map((step, idx) => (
                       <li key={idx}>{step}</li>
                     ))}
                   </ul>

                   {inst.appLink && (
                     <div style={{ marginTop: 24 }}>
                       <a href={inst.appLink} target="_blank" rel="noreferrer" style={{ color: d.color, fontSize: 13, fontWeight: 800, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                         Download App <ExternalLink size={14} />
                       </a>
                     </div>
                   )}
                   {inst.videoLink && (
                     <div style={{ marginTop: 12 }}>
                       <a href={inst.videoLink} target="_blank" rel="noreferrer" style={{ color: "#ef4444", fontSize: 13, fontWeight: 800, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                         <PlayCircle size={14} /> Watch Video Guide
                       </a>
                     </div>
                   )}
                </div>
              );
            })}
          </div>
        </W>
      </section>

      {/* ── SECTION 2: COUNTRIES ── */}
      <section style={{ padding:"80px 0", borderTop: `1px solid ${BORDER}` }}>
        <W>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <SectionLabel color={BLUE}><Globe size={13}/> Supported Regions</SectionLabel>
            <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:"clamp(26px,4vw,40px)", fontWeight:900, lineHeight:1.1, letterSpacing:"-.03em", marginBottom:12 }}>
              Built for Tough Networks
            </h2>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:14, marginBottom:28 }}>
            {COUNTRIES.map((c, i) => (
              <motion.div key={i}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*.07 }}
                style={{ background:CARD, border:`1px solid ${c.urgent ? `${c.color}30` : BORDER}`, borderRadius:16, padding:"16px 20px", position:"relative", overflow:"hidden" }}>
                {c.urgent && <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${c.color},${c.color}80)` }}/>}
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                  <div style={{ fontSize:24 }}>{c.flag}</div>
                  <div>
                    <div style={{ fontWeight:900, fontSize:16 }}>{c.name}</div>
                    {c.urgent && <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, fontWeight:900, color:c.color, textTransform:"uppercase", letterSpacing:".06em" }}><AlertTriangle size={10}/> STRICT RESTRICTIONS</div>}
                  </div>
                </div>
                <p style={{ fontSize:13.5, color:"rgba(255,255,255,.65)", lineHeight:1.65, marginBottom:12 }}>{c.problem}</p>
              </motion.div>
            ))}
          </div>
        </W>
      </section>

    </div>
  );
}

// simple inline icon
function ExternalLink({size=16}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  );
}

