console.log('Main.jsx starting...');

// Global error catcher for module loading errors
window.addEventListener('error', (e) => {
  console.error('GLOBAL RUNTIME ERROR:', e.message, e.filename, e.lineno);
});
window.addEventListener('unhandledrejection', (e) => {
  console.error('UNHANDLED PROMISE REJECTION:', e.reason);
});

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'react-easy-crop/react-easy-crop.css'
import './index.css'

console.log('Main.jsx dependencies loaded');

// Safe console overrides to prevent "Converting circular structure to JSON"
const safeArgsMap = (args) => args.map(arg => {
  if (arg instanceof Error) return arg.message;
  if (arg && typeof arg === 'object') {
    try { JSON.stringify(arg); return arg; }
    catch { return String(arg); }
  }
  return arg;
});
const originalConsoleError = console.error;
console.error = (...args) => originalConsoleError.apply(console, safeArgsMap(args));
const originalConsoleLog = console.log;
console.log = (...args) => originalConsoleLog.apply(console, safeArgsMap(args));
const originalConsoleWarn = console.warn;
console.warn = (...args) => originalConsoleWarn.apply(console, safeArgsMap(args));

import { BrowserRouter } from 'react-router-dom'

console.log('Rendering App...');

try {
  const container = document.getElementById('root');
  if (!container) throw new Error('Root container not found');
  
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
  console.log('App render initiated');
} catch (err) {
  console.error('Fatal error during React root creation:', err);
}

// Emergency cleanup: If app doesn't signal ready within 5 seconds, remove loader anyway
// This ensures the user at least sees *something* (even if broken) instead of a stuck loader.
setTimeout(() => {
  console.log('Emergency loader removal check...');
  const loader = document.getElementById('app-loader');
  if (loader) {
    console.warn('Splash loader still present after 5s - forcing removal.');
    if (typeof window.__removeSplash === 'function') window.__removeSplash();
  }
}, 5000);

// Normal removal path
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    console.log('React finished first paint. Removing splash...');
    if (typeof window.__removeSplash === 'function') window.__removeSplash();
  });
});
