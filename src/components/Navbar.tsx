import React, { useState } from 'react';
import { NavTab } from '../types';
import { Activity, Disc3, Sliders } from 'lucide-react';
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
  const { siteSettings, pageVisibility, currentUser } = useCMS();
  const isAdminOpen = (useCMS() as any).isAdminOpen as boolean | undefined;
  if (isAdminOpen) return null;
  const hasTopBar = !!currentUser;

  const allNavItems: { id: NavTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'mixes', label: 'Mixes' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'services', label: 'Services' },
    { id: 'faq', label: 'FAQ' }
  ];

  const navItems = allNavItems.filter((item) => {
    if (pageVisibility?.pages?.[item.id] !== undefined) {
      return pageVisibility.pages[item.id] || !!currentUser;
    }
    return true;
  });

  const handleNavClick = (tab: NavTab) => {
    if (setActiveTab) setActiveTab(tab);
    else if (onSelectTab) onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`fixed w-full z-40 bg-[#070b11]/90 backdrop-blur-xl border-b border-slate-800/60 ${hasTopBar ? 'top-11' : 'top-0'}`}>
      <div className="flex justify-between items-center h-[70px] px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1280px] mx-auto">
        <button
          onClick={() => handleNavClick('home')}
          className="font-navbar-brand text-2xl sm:text-[28px] font-normal tracking-[0.06em] text-white flex items-center gap-2.5 group text-left cursor-pointer"
        >
          <div className="w-8 h-8 bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-500 group-hover:border-blue-400/50 transition-colors">
            {isPlayingMix ? <Disc3 className="w-4 h-4 animate-spin text-blue-500" /> : <Activity className="w-4 h-4" />}
          </div>
          <span className="uppercase">{siteSettings?.brandName || 'OVERKILL'}</span>
        </button>

        <nav className="hidden md:flex items-center gap-7 lg:gap-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const isHidden = !pageVisibility?.pages?.[item.id];
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`font-navbar text-[11px] uppercase font-bold transition-colors relative py-1 cursor-pointer flex items-center gap-1.5 ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {item.label}
                {currentUser && isHidden && <span className="text-[8px] px-1 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30">OFF</span>}
                {isActive && <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-blue-600" />}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser && (
            <button onClick={() => (useCMS() as any).openAdmin?.()} className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/15 border border-blue-500/30 text-blue-400 font-navbar text-[11px] font-bold hover:bg-blue-600/20 transition-colors cursor-pointer uppercase">
              <Sliders className="w-3.5 h-3.5" /> CMS
            </button>
          )}
          <button onClick={onOpenBooking} className="hidden md:inline-flex items-center justify-center bg-white text-black font-bold text-xs px-5 lg:px-6 py-2.5 hover:bg-slate-200 transition-colors cursor-pointer uppercase tracking-wider">
            Book Now
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden relative w-11 h-11 bg-[#0b0f17] border-2 border-slate-700/60 flex flex-col items-center justify-center gap-[5px] hover:border-blue-500/40 hover:bg-blue-600/10 hover:shadow-[0_0_20px_rgba(37,99,235,0.15)] transition-all duration-300 cursor-pointer group" aria-label="Toggle menu">
            <span className={`block w-5 h-[2px] bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[7px] bg-blue-500' : 'group-hover:bg-blue-400'}`} />
            <span className={`block w-5 h-[2px] bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-0' : 'group-hover:bg-blue-400'}`} />
            <span className={`block w-5 h-[2px] bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px] bg-blue-500' : 'group-hover:bg-blue-400'}`} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 border border-[#070b11] opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#04060a] border-t border-slate-800 px-4 py-6 space-y-4">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left text-sm font-navbar uppercase tracking-wider py-3 px-3 transition-colors flex items-center justify-between ${activeTab === item.id ? 'bg-white text-black font-bold' : 'text-slate-300 border border-slate-800 bg-[#0b0f17]'}`}
              >
                <span>{item.label}</span>
                {currentUser && !pageVisibility?.pages?.[item.id] && <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30">HIDDEN</span>}
              </button>
            ))}
          </div>
          <button onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }} className="w-full py-3.5 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-slate-200 transition-colors cursor-pointer">
            Book Now
          </button>
        </div>
      )}
    </header>
  );
};
