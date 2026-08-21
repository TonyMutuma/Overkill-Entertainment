import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Cookie } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('overkill_cookie_consent');
    if (!consent) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('overkill_cookie_consent', 'accepted');
    localStorage.setItem('overkill_cookie_consent_at', new Date().toISOString());
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('overkill_cookie_consent', 'declined');
    localStorage.setItem('overkill_cookie_consent_at', new Date().toISOString());
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-3 sm:bottom-6 left-3 right-3 sm:left-6 sm:right-auto sm:max-w-[420px] z-[80] animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-[#0b0f17] border border-slate-800 shadow-2xl p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-500 shrink-0">
              <Cookie className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-white">We value your privacy</h3>
          </div>
          <button onClick={handleDecline} className="text-slate-500 hover:text-white transition-colors p-1 -mr-1 -mt-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="font-sans text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
          We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking <span className="text-white font-semibold">Accept</span>, you consent to our use of cookies.
        </p>
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>Your data is never sold. See our Privacy Policy.</span>
        </div>
        <div className="flex gap-3">
          <button onClick={handleAccept} className="flex-1 bg-white text-black font-bold text-xs sm:text-sm py-3 hover:bg-slate-200 transition-colors cursor-pointer uppercase tracking-wider">
            Accept Cookies
          </button>
          <button onClick={handleDecline} className="flex-1 bg-transparent border border-slate-700 text-white font-bold text-xs sm:text-sm py-3 hover:bg-white hover:text-black transition-colors cursor-pointer uppercase tracking-wider">
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};
