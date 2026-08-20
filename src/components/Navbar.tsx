import React, { useState } from 'react';
import { NavTab } from '../types';
import { Activity, Menu, X, Disc3, Sliders, ShieldCheck } from 'lucide-react';
import { CurrencySelector } from './CurrencySelector';
import { useCMS } from '../context/CMSContext';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab?: (tab: NavTab) => void;
  onSelectTab?: (tab: NavTab) => void;
  onOpenBooking: () => void;
  isPlayingMix?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSelectTab,
  onOpenBooking,
  isPlayingMix = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { siteSettings, pageVisibility, currentUser, openAdmin } = useCMS();

  const allNavItems: { id: NavTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'mixes', label: 'Mixes' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'services', label: 'Services' },
    { id: 'faq', label: 'FAQ' }
  ];

  // Filter out pages that are disabled in CMS, unless logged in as crew (where we can still see them with indicator)
  const navItems = allNavItems.filter((item) => {
    if (pageVisibility?.pages?.[item.id] !== undefined) {
      return pageVisibility.pages[item.id] || !!currentUser;
    }
    return true;
  });

  const handleNavClick = (tab: NavTab) => {
    if (setActiveTab) {
      setActiveTab(tab);
    } else if (onSelectTab) {
      onSelectTab(tab);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCurrentTabHidden = !pageVisibility?.pages?.[activeTab] && !currentUser;

  return (
    <header className="fixed top-0 w-full z-50 bg-[#131313]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300">
      <div className="flex justify-between items-center h-20 px-6 md:px-16 max-w-[1280px] mx-auto">
        {/* Brand */}
        <button
          onClick={() => handleNavClick('home')}
          className="font-sora text-2xl md:text-3xl font-extrabold tracking-tighter text-[#e5e2e1] flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded bg-[#baf2ff]/10 border border-[#00daf8]/30 flex items-center justify-center text-[#00daf8] group-hover:shadow-[0_0_15px_rgba(0,218,248,0.5)] transition-all">
            {isPlayingMix ? (
              <Disc3 className="w-5 h-5 animate-spin text-[#00daf8]" />
            ) : (
              <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
          </div>
          <span className="tracking-tight uppercase">{siteSettings?.brandName || 'OVERKILL'}</span>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const isHiddenFromPublic = !pageVisibility?.pages?.[item.id];
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`font-hanken text-[15px] font-medium transition-all duration-300 relative py-1 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#baf2ff] font-semibold'
                    : 'text-[#bac9cd]/80 hover:text-[#baf2ff]'
                }`}
              >
                <span>{item.label}</span>
                {currentUser && isHiddenFromPublic && (
                  <span className="text-[9px] font-mono-jb px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    OFF
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00daf8] shadow-[0_0_8px_#00daf8]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Trailing Action */}
        <div className="flex items-center gap-3">
          {/* Currency / Location Selector */}
          <CurrencySelector variant="compact" />

          {/* Quick CMS dashboard shortcut if logged in */}
          {currentUser && (
            <button
              onClick={openAdmin}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00daf8]/15 border border-[#00daf8]/40 text-[#00daf8] font-mono-jb text-xs font-bold hover:bg-[#00daf8]/25 transition-all cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>CMS</span>
            </button>
          )}

          <button
            onClick={onOpenBooking}
            className="hidden md:inline-flex items-center justify-center bg-[#baf2ff] text-[#00363f] font-sora text-[14px] font-bold px-6 py-2.5 rounded hover:bg-[#00e0ff] hover:shadow-[0_0_20px_rgba(0,218,248,0.4)] transition-all duration-300 cursor-pointer uppercase tracking-wider"
          >
            Book Now
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#e5e2e1] p-2 hover:text-[#00daf8] transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#131313]/95 border-b border-white/10 px-6 py-6 space-y-4 backdrop-blur-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left text-lg font-hanken py-2 px-3 rounded transition-colors flex items-center justify-between ${
                  activeTab === item.id
                    ? 'bg-[#00daf8]/15 text-[#baf2ff] font-bold border-l-4 border-[#00daf8]'
                    : 'text-[#bac9cd] hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
                {currentUser && !pageVisibility?.pages?.[item.id] && (
                  <span className="text-[10px] font-mono-jb px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    HIDDEN
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="font-mono-jb text-xs text-[#bac9cd]">CURRENCY / REGION:</span>
            <CurrencySelector variant="compact" />
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 bg-[#baf2ff] text-[#00363f] font-sora font-bold text-center rounded uppercase tracking-wider glow-btn"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

