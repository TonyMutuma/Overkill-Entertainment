import React from 'react';
import { NavTab } from '../types';
import { useCMS } from '../context/CMSContext';
import { ShieldCheck, Lock, Sliders, Sparkles } from 'lucide-react';

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
    if (onNavigate) {
      onNavigate(tab);
    } else if (setActiveTab) {
      setActiveTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactOrBooking = () => {
    if (onOpenBooking) {
      onOpenBooking();
    } else if (onOpenContact) {
      onOpenContact();
    } else if (onNavigate) {
      onNavigate('calendar');
    } else if (setActiveTab) {
      setActiveTab('calendar');
    }
  };

  const handleCrewAccess = () => {
    if (currentUser) {
      openAdmin();
    } else if (onOpenCrewLogin) {
      onOpenCrewLogin();
    }
  };

  return (
    <footer className="w-full py-12 md:py-16 border-t border-white/10 bg-[#1c1b1b]/90 relative z-10 font-hanken">
      <div className="max-w-[1280px] mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
        {/* Brand & Copyright */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <div 
            onClick={() => handleNav('home')}
            className="font-sora text-2xl font-bold tracking-tighter text-[#e5e2e1] cursor-pointer hover:text-[#baf2ff] transition-colors inline-block w-fit uppercase"
          >
            {siteSettings?.brandName || 'OVERKILL'}
          </div>
          <p className="text-xs text-[#bac9cd]/70 leading-relaxed max-w-md">
            © 2026 {siteSettings?.brandName || 'Overkill Entertainment'}. All Rights Reserved. Resident Selector: {siteSettings?.djName || 'DJ Wolverine'} ({siteSettings?.location || 'Nairobi, Kenya'}).
          </p>
          <div className="text-[11px] text-[#bac9cd]/50 font-mono-jb">
            Hardware: 2x Pioneer CDJ-3000 + DJM-V10 • Dual Shockproof Backup Stacks
          </div>
        </div>

        {/* Quick Nav */}
        <div className="flex flex-col gap-2 text-sm text-[#bac9cd]/70">
          <div className="text-xs font-mono-jb text-[#00daf8] uppercase font-semibold mb-1">Navigation</div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            <button 
              onClick={() => handleNav('services')}
              className="hover:text-[#baf2ff] transition-colors cursor-pointer text-left"
            >
              Packages & Rates
            </button>
            <button 
              onClick={() => handleNav('calendar')}
              className="hover:text-[#baf2ff] transition-colors cursor-pointer text-left"
            >
              2026 Tour Dates
            </button>
            <button 
              onClick={() => handleNav('mixes')}
              className="hover:text-[#baf2ff] transition-colors cursor-pointer text-left"
            >
              Live Mix Audio
            </button>
            <button 
              onClick={() => handleNav('faq')}
              className="hover:text-[#baf2ff] transition-colors cursor-pointer text-left"
            >
              Tech Rider & FAQ
            </button>
          </div>
        </div>

        {/* Crew Portal & Channels */}
        <div className="flex flex-col items-start md:items-end gap-3">
          <div className="flex items-center gap-4 text-xs text-[#bac9cd]/70">
            {siteSettings?.instagramUrl && (
              <a
                href={siteSettings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#baf2ff] transition-colors"
              >
                Instagram
              </a>
            )}
            {siteSettings?.soundcloudUrl && (
              <a
                href={siteSettings.soundcloudUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#baf2ff] transition-colors"
              >
                SoundCloud
              </a>
            )}
            <button
              onClick={handleContactOrBooking}
              className="hover:text-[#baf2ff] transition-colors cursor-pointer"
            >
              Rider Clearance
            </button>
          </div>

          {/* Dedicated Crew & DJ Login Button */}
          <button
            onClick={handleCrewAccess}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-[#00daf8]/15 border border-white/10 hover:border-[#00daf8]/50 text-[#bac9cd] hover:text-[#baf2ff] text-xs font-mono-jb transition-all cursor-pointer group"
          >
            {currentUser ? (
              <>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[#00daf8] font-bold">Crew: {currentUser.name}</span>
                <Sliders className="w-3.5 h-3.5 text-[#00daf8]" />
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-[#00daf8] group-hover:scale-110 transition-transform" />
                <span>DJ & Crew Backend Portal</span>
              </>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
};

