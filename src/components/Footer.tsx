import React, { useState } from 'react';
import { NavTab } from '../types';
import { useCMS } from '../context/CMSContext';
import { Lock, Sliders, Copy, Check, Mail } from 'lucide-react';
import instagram from 'thesvg/instagram';
import x from 'thesvg/x';
import youtube from 'thesvg/youtube';
import applePodcasts from 'thesvg/apple-podcasts';
import mixcloud from 'thesvg/mixcloud';
import hearthis from 'thesvg/hearthisdotat';

interface FooterProps {
  setActiveTab?: (tab: NavTab) => void;
  onNavigate?: (tab: NavTab) => void;
  onOpenContact?: () => void;
  onOpenBooking?: () => void;
  onOpenCrewLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  onNavigate,
  onOpenContact,
  onOpenBooking,
  onOpenCrewLogin
}) => {
  const { siteSettings, currentUser, openAdmin } = useCMS();
  const handleNav = (tab: NavTab) => {
    if (onNavigate) onNavigate(tab);
    else if (setActiveTab) setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleContactOrBooking = () => {
    if (onOpenBooking) onOpenBooking();
    else if (onOpenContact) onOpenContact();
    else if (onNavigate) onNavigate('mixes');
    else if (setActiveTab) setActiveTab('mixes');
  };
  const handleCrewAccess = () => {
    if (currentUser) openAdmin();
    else if (onOpenCrewLogin) onOpenCrewLogin();
  };
  const [copied, setCopied] = useState(false);
  const email = 'ask.overkillentertainment@gmail.com';
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(email); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { window.location.href = `mailto:${email}`; }
  };
  return (
    <footer className="w-full py-10 sm:py-14 border-t border-slate-800 bg-[#04060a] relative z-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 items-start">
        <div className="md:col-span-6 flex flex-col gap-3">
          <button onClick={() => handleNav('home')} className="cursor-pointer hover:opacity-90 transition-opacity text-left">
            <img src="/assets/overkill-logo.png" alt={siteSettings?.brandName || 'OVERKILL'} className="h-10 sm:h-12 w-auto object-contain" />
          </button>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md font-sans">
            © 2026 {siteSettings?.brandName || 'Overkill Entertainment'}. All Rights Reserved. Resident Selector: {siteSettings?.djName || 'DJ Wolverine'} ({siteSettings?.location || 'Nairobi, Kenya'}).
          </p>
          <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{siteSettings?.location || 'Nairobi, Kenya'}</div>
        </div>
        <div className="md:col-span-3 flex flex-col gap-3">
          <div className="font-mono text-[10px] text-blue-500 uppercase tracking-[0.2em] font-bold">Navigation</div>
          <div className="flex flex-col gap-2 text-sm text-slate-400 font-sans">
            <button onClick={() => handleNav('mixes')} className="hover:text-white transition-colors cursor-pointer text-left">Video Playlist</button>
            <button onClick={() => handleNav('faq')} className="hover:text-white transition-colors cursor-pointer text-left">FAQ</button>
            <a href="/about.html" className="hover:text-white transition-colors">About</a>
            <a href="/contact.html" className="hover:text-white transition-colors">Contact</a>
            <a href="/privacy.html" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
        <div className="md:col-span-3 flex flex-col items-start md:items-end gap-4">
          <div className="flex flex-col items-start md:items-end gap-2 text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-1.5 flex-wrap justify-start md:justify-end">
              <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 hover:text-white transition-colors font-bold"><Mail className="w-3.5 h-3.5" /> Email us</a>
              <button onClick={handleCopy} aria-label="Copy email" className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-700 bg-white/[0.04] hover:bg-white hover:text-black transition-colors text-[10px] font-bold uppercase tracking-wider">{copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}</button>
            </div>
            <div className="font-mono text-[10px] text-blue-500 uppercase tracking-[0.2em] font-bold mb-1 mt-2">Connect</div>
            {siteSettings?.instagramUrl && <a href={siteSettings.instagramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition-colors uppercase tracking-wider font-bold"><span className="w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current" dangerouslySetInnerHTML={{ __html: instagram.variants.mono }} />Instagram</a>}
            {siteSettings?.twitterUrl && <a href={siteSettings.twitterUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition-colors uppercase tracking-wider font-bold"><span className="w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current" dangerouslySetInnerHTML={{ __html: x.variants.mono }} />X</a>}
            <a href={siteSettings?.youtubeUrl || 'https://youtube.com'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition-colors uppercase tracking-wider font-bold"><span className="w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current" dangerouslySetInnerHTML={{ __html: youtube.variants.mono }} />YouTube</a>
            <div className="font-mono text-[10px] text-blue-500 uppercase tracking-[0.2em] font-bold mt-3 mb-1">Listen</div>
            <a href="https://hearthis.at/dj-wolverine/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition-colors uppercase tracking-wider font-bold"><span className="w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current" dangerouslySetInnerHTML={{ __html: hearthis.variants.mono }} />HearThis</a>
            <a href="https://www.mixcloud.com/djwolverine_ke/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition-colors uppercase tracking-wider font-bold"><span className="w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current" dangerouslySetInnerHTML={{ __html: mixcloud.variants.mono }} />Mixcloud</a>
            <a href="https://podcasts.apple.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition-colors uppercase tracking-wider font-bold"><span className="w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current" dangerouslySetInnerHTML={{ __html: applePodcasts.variants.mono }} />Podcasts</a>
            <button onClick={handleContactOrBooking} className="hover:text-white transition-colors cursor-pointer uppercase tracking-wider font-bold mt-2 pt-2 border-t border-slate-800 w-full text-left md:text-right">Book Now</button>
          </div>
          <button onClick={handleCrewAccess} className="flex items-center gap-2 px-4 py-2 bg-[#0b0f17] border-2 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer">
            {currentUser ? <><span className="w-2 h-2 bg-emerald-400 animate-pulse" /><span className="text-white font-bold">Crew: {currentUser.name}</span><Sliders className="w-3.5 h-3.5" /></> : <><Lock className="w-3.5 h-3.5 text-blue-500" /><span>DJ & Crew Portal</span></>}
          </button>
        </div>
      </div>
    </footer>
  );
};
