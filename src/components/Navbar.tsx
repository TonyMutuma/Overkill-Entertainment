import React, { useState, useEffect, useRef } from 'react';
import { NavTab } from '../types';
import { Activity, Disc3, Sliders, X } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { VertexCorners } from './VertexCorners';

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
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on click outside / ESC — premium dropdown behavior
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || buttonRef.current?.contains(t)) return;
      setMobileMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileMenuOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    // lock scroll subtly without jank
    const prev = document.body.style.overflow;
    // don't lock fully — dropdown is narrow, allow page scroll, just prevent horizontal shift
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  if (isAdminOpen) return null;
  const hasTopBar = !!currentUser;

  const allNavItems: { id: NavTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'mixes', label: 'Mixes' },
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
          <span className="uppercase">OVERKILL ENTERTAINMENT</span>
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
          <button onClick={onOpenBooking} className="hidden md:inline-flex items-center justify-center bg-white text-black font-bold text-xs px-5 lg:px-6 py-2.5 rounded-full hover:bg-slate-200 transition-colors cursor-pointer uppercase tracking-wider shadow-[0_4px_16px_rgba(255,255,255,0.12)]">
            Book Now
          </button>
          <button ref={buttonRef} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-expanded={mobileMenuOpen} aria-label="Toggle menu" className={`md:hidden relative w-11 h-11 bg-[#0b0f17]/80 backdrop-blur-md border flex flex-col items-center justify-center gap-[5px] transition-all duration-300 cursor-pointer group ${mobileMenuOpen ? 'border-blue-500/50 bg-blue-600/10 shadow-[0_0_20px_rgba(37,99,235,0.25)]' : 'border-white/10 hover:border-blue-500/30 hover:bg-white/[0.06]'}`}>
            <span className={`block w-5 h-[2px] transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[7px] bg-blue-500' : 'bg-white group-hover:bg-blue-400'}`} />
            <span className={`block w-5 h-[2px] bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-0' : 'group-hover:bg-blue-400'}`} />
            <span className={`block w-5 h-[2px] transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px] bg-blue-500' : 'bg-white group-hover:bg-blue-400'}`} />
            <span className={`absolute -top-1 -right-1 w-2 h-2 bg-blue-600 border border-[#070b11] transition-opacity ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
          </button>
        </div>
      </div>

      {/* ── PREMIUM NARROW GLASS DROPDOWN ── */}
      <div className={`md:hidden absolute right-3 sm:right-8 ${hasTopBar ? 'top-[78px]' : 'top-[78px]'} w-[min(286px,calc(100vw-1.5rem))] z-20 transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)] ${mobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-3 pointer-events-none'}`}>
        {/* subtle scrim — only behind dropdown, not full screen */}
        <div ref={menuRef} className="vertex-card vertex-card--burger relative overflow-hidden bg-[#0b0f17]/75 backdrop-blur-2xl backdrop-saturate-150 border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.55),0_1px_0_rgba(255,255,255,0.06)_inset] max-h-[min(72vh,520px)] overflow-y-auto">
          <VertexCorners variant="white" size={14} thickness={1.8} />
          {/* glass highlight */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
          <div className="pointer-events-none absolute -top-20 -right-20 w-40 h-40 bg-blue-600/15 blur-[40px] rounded-full" />

          {/* header mini */}
          <div className="relative flex items-center justify-between px-4 pt-3.5 pb-3 border-b border-white/[0.06]">
            <span className="font-mono text-[10px] tracking-[0.18em] text-white/50 uppercase font-bold">Navigate</span>
            <button onClick={() => setMobileMenuOpen(false)} className="w-7 h-7 flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.10] border border-white/10 text-white/60 hover:text-white transition-colors cursor-pointer" aria-label="Close menu">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative p-2.5 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const isHidden = !pageVisibility?.pages?.[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`group w-full text-left font-navbar text-[11px] uppercase tracking-[0.14em] py-[11px] px-3 flex items-center justify-between transition-all cursor-pointer border ${isActive ? 'bg-white text-black border-white font-bold shadow-[0_4px_20px_rgba(255,255,255,0.15)]' : 'bg-white/[0.04] backdrop-blur text-white/80 border-white/[0.06] hover:bg-white hover:text-black hover:border-white'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className={`w-[3px] self-stretch min-h-[14px] transition-colors ${isActive ? 'bg-blue-600' : 'bg-white/15 group-hover:bg-blue-600'}`} />
                    {item.label}
                  </span>
                  <span className="flex items-center gap-1.5">
                    {currentUser && isHidden && <span className="text-[8px] px-1.5 py-0.5 bg-amber-500/15 text-amber-300 border border-amber-500/25 font-mono">HIDDEN</span>}
                    <span className={`w-1.5 h-1.5 transition-colors ${isActive ? 'bg-blue-600' : 'bg-white/20 group-hover:bg-black/40'}`} />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative p-2.5 pt-0">
            <button onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }} className="w-full py-3 bg-white text-black font-bold text-[12px] uppercase tracking-[0.12em] hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(255,255,255,0.12)]">
              Book Now <span className="w-1.5 h-1.5 bg-blue-600" />
            </button>
            <p className="text-center font-mono text-[9px] tracking-widest text-white/30 uppercase mt-2.5">Overkill Entertainment • Nairobi</p>
          </div>
        </div>
      </div>
      {/* FULL-SCREEN GLASSMORPHISM BACKDROP — frosts rest of page for focus & easy viewing */}
      {mobileMenuOpen && (
        <>
          <button
            aria-label="Close menu backdrop"
            onClick={() => setMobileMenuOpen(false)}
            className={`md:hidden fixed inset-x-0 bottom-0 z-10 w-screen cursor-default
                       bg-[#070b11]/72 backdrop-blur-[30px] backdrop-saturate-150
                       supports-[backdrop-filter]:bg-[#070b11]/64 transition-all duration-300
                       ${hasTopBar ? 'top-[114px] h-[calc(100vh-114px)]' : 'top-[70px] h-[calc(100vh-70px)]'}`}
          />
          {/* extra depth: subtle vignette + hairline at top */}
          <div className={`md:hidden pointer-events-none fixed inset-x-0 bottom-0 z-10 bg-gradient-to-b from-black/35 via-black/10 to-black/45 ${hasTopBar ? 'top-[114px]' : 'top-[70px]'}`} />
          <div className={`md:hidden pointer-events-none fixed inset-x-0 z-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent ${hasTopBar ? 'top-[114px]' : 'top-[70px]'}`} />
        </>
      )}
    </header>
  );
};
