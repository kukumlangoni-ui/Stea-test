import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const gold = '#F5A623';
const goldSoft = '#FFD17C';

export default function STEAAppSplash({ onComplete }) {
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    // Ensure at least 2 seconds
    const timer = setTimeout(() => {
      setComplete(true);
      if (onComplete) onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!complete && (
        <motion.div
           exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeOut" } }}
           style={{
             position: 'fixed', inset: 0, zIndex: 10000,
             background: `
               radial-gradient(circle at 50% 36%, rgba(245,166,35,0.14), transparent 30%),
               radial-gradient(circle at 18% 20%, rgba(255,209,124,0.08), transparent 32%),
               radial-gradient(circle at 82% 78%, rgba(128,88,26,0.16), transparent 36%),
               linear-gradient(145deg, #151515 0%, #090a0d 46%, #010101 100%)
             `,
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             justifyContent: 'center',
             padding: '32px 20px',
             overflow: 'hidden',
             fontFamily: "'Instrument Sans', system-ui, sans-serif"
           }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `
                linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.035) 42%, transparent 64%),
                repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 90px)
              `,
              opacity: 0.45,
              pointerEvents: 'none'
            }}
          />

          <motion.div
            aria-hidden="true"
            animate={{ opacity: [0.45, 0.75, 0.45], scale: [0.98, 1.05, 0.98] }}
            transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              width: 'min(62vw, 320px)',
              aspectRatio: '1',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245,166,35,0.25), transparent 66%)',
              filter: 'blur(18px)'
            }}
          />

          <motion.div
            initial={{ scale: 0.86, opacity: 0, y: 10 }}
            animate={{ scale: [1, 1.025, 1], opacity: 1, y: 0 }}
            transition={{
              scale: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
              opacity: { duration: 0.45 },
              y: { duration: 0.45 }
            }}
            style={{
              width: 'clamp(88px, 22vw, 118px)',
              height: 'clamp(88px, 22vw, 118px)',
              borderRadius: 28,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.11), rgba(255,255,255,0.035))',
              border: '1px solid rgba(245,166,35,0.24)',
              boxShadow: '0 24px 70px rgba(0,0,0,0.58), 0 0 56px rgba(245,166,35,0.24)',
              position: 'relative'
            }}
          >
            <img src="/android-chrome-512x512.png" alt="STEA" style={{ width: '76%', height: '76%', objectFit: 'contain', mixBlendMode: 'screen' }} />
          </motion.div>
          
          <motion.h1
            style={{
              color: '#fff',
              fontSize: 'clamp(28px, 8vw, 40px)',
              fontWeight: 900,
              letterSpacing: '0.12em',
              margin: '22px 0 0',
              lineHeight: 1,
              textShadow: '0 0 28px rgba(245,166,35,0.18)',
              position: 'relative'
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.45 }}
          >
            STEA
          </motion.h1>
          
          <motion.p
            style={{
              color: goldSoft,
              fontSize: 'clamp(11px, 3vw, 13px)',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              margin: "10px 0 28px",
              position: 'relative'
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45 }}
          >
            LEARN. BUILD. EARN.
          </motion.p>
          
          <div style={{ display: "flex", gap: 10, alignItems: 'center', position: 'relative' }}>
            {[0, 1, 2].map((i) => (
               <motion.span
                 key={i}
                 animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0], scale: [1, 1.25, 1] }}
                 transition={{ repeat: Infinity, duration: 1.35, ease: "easeInOut", delay: i * 0.18 }}
                 style={{
                   width: 7,
                   height: 7,
                   borderRadius: "50%",
                   background: `linear-gradient(180deg, ${goldSoft}, ${gold})`,
                   boxShadow: '0 0 16px rgba(245,166,35,0.55)'
                 }}
               />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
