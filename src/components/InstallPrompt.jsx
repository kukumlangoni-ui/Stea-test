import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, CheckCircle } from 'lucide-react';
import { usePWA } from '../contexts/PWAContext';
import { useMobile } from '../hooks/useMobile';

const G = "#F5A623";

export const InstallPrompt = () => {
  const { deferredPrompt, installApp, showInstallSuccess, isInstalled } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const isMobile = useMobile();

  // Detect iOS
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    // Show iOS hint for Safari users who haven't installed
    if (isIOS && !isInStandaloneMode) {
      const dismissed = localStorage.getItem('stea_ios_hint_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => setShowIOSHint(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isIOS, isInStandaloneMode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (deferredPrompt && !isInstalled) {
        // Check if dismissed recently (e.g., within 3 days instead of 7 to be more persistent)
        const dismissedAt = localStorage.getItem('stea_pwa_dismissed');
        if (dismissedAt) {
          const daysSinceDismissed = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
          if (daysSinceDismissed < 3) {
            setShowPrompt(false);
            return;
          }
        }
        setShowPrompt(true);
      } else {
        setShowPrompt(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [deferredPrompt, isInstalled]);

  const handleInstall = async () => {
    await installApp();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('stea_pwa_dismissed', Date.now().toString());
    setShowPrompt(false);
  };


  // iOS install hint
  if (showIOSHint && isIOS && !isInStandaloneMode) {
    return (
      <div style={{ position:"fixed", bottom:isMobile ? 68 : 80, left:isMobile ? 12 : 16, right:isMobile ? 12 : 16, zIndex:9999, background:"rgba(18,20,32,.97)", backdropFilter:"blur(20px)", border:"1px solid rgba(245,166,35,.3)", borderRadius:isMobile ? 16 : 20, padding:isMobile ? "12px 14px" : "18px 20px", boxShadow:"0 -4px 30px rgba(0,0,0,.55)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:isMobile ? 8 : 12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:isMobile ? 32 : 36, height:isMobile ? 32 : 36, borderRadius:10, background:"linear-gradient(135deg,#F5A623,#FFD17C)", display:"grid", placeItems:"center", fontWeight:900, color:"#111", fontSize:isMobile ? 16 : 18 }}>S</div>
            <div>
              <div style={{ fontWeight:900, fontSize:isMobile ? 13 : 14, color:"#fff" }}>Install STEA App</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.5)" }}>Add to your Home Screen</div>
            </div>
          </div>
          <button onClick={() => { setShowIOSHint(false); localStorage.setItem('stea_ios_hint_dismissed','1'); }} style={{ background:"none", border:"none", color:"rgba(255,255,255,.4)", cursor:"pointer", fontSize:18, lineHeight:1 }}>✕</button>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:isMobile ? "8px 10px" : "10px 14px", borderRadius:12, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)" }}>
          <span style={{ fontSize:isMobile ? 11.5 : 13, color:"rgba(255,255,255,.7)", lineHeight:1.45 }}>
            Tap <strong style={{ color:"#F5A623" }}>Share</strong> <span style={{ fontSize:16 }}>⎙</span> then <strong style={{ color:"#F5A623" }}>Add to Home Screen</strong> <span style={{ fontSize:14 }}>＋</span> to install STEA as an app.
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showInstallSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: 80,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 100000,
              background: '#0a0c14',
              border: `1px solid ${G}40`,
              borderRadius: 16,
              padding: '12px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              color: '#fff',
              fontWeight: 600,
              fontSize: 14
            }}
          >
            <CheckCircle size={20} color={G} />
            App imewekwa kwenye simu yako
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed',
              bottom: isMobile ? 72 : 24,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              width: isMobile ? 'calc(100% - 24px)' : 'calc(100% - 32px)',
              maxWidth: isMobile ? 360 : 420,
              background: 'rgba(5,6,10,0.85)',
              backdropFilter: 'blur(20px)',
              borderRadius: isMobile ? 16 : 24,
              border: '1px solid rgba(245,166,35,0.2)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 30px rgba(245,166,35,0.1)',
              padding: isMobile ? '10px 12px' : '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? 10 : 16
            }}
          >
            <div style={{
              width: isMobile ? 34 : 44,
              height: isMobile ? 34 : 44,
              borderRadius: isMobile ? 10 : 12,
              background: `#000`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: `0 4px 12px ${G}40`,
              overflow: 'hidden'
            }}>
              <img src="/android-chrome-192x192.png" alt="STEA" style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'screen' }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: isMobile ? 13 : 15, fontWeight: 900, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Install STEA App
              </h3>
              <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.5)', fontSize: isMobile ? 11 : 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Quick access & offline support.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 10 }}>
              <button 
                onClick={handleInstall}
                style={{
                  background: G,
                  color: '#000',
                  padding: isMobile ? '8px 12px' : '10px 18px',
                  borderRadius: isMobile ? 10 : 12,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 900,
                  fontSize: isMobile ? 12 : 13,
                }}
              >
                Install
              </button>
              <button 
                onClick={handleDismiss}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.5)',
                  border: 'none',
                  borderRadius: isMobile ? 9 : 10,
                  width: isMobile ? 28 : 32,
                  height: isMobile ? 28 : 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
