import React from 'react';
import { useCMS, CREW_USERS } from '../../context/CMSContext';
import { ShieldCheck, Sliders, LogOut, Layers, User, ChevronDown } from 'lucide-react';

interface AdminTopBarProps {
  onOpenDashboard: () => void;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({ onOpenDashboard }) => {
  const { currentUser, logout, pageVisibility, switchUser } = useCMS();

  if (!currentUser) return null;

  const activePagesCount = Object.values(pageVisibility.pages).filter(Boolean).length;
  const totalPagesCount = Object.keys(pageVisibility.pages).length;

  return (
    <aside aria-label="Crew management toolbar" className="fixed top-0 inset-x-0 z-[60] bg-[#0a0a0a]/95 border-b border-[#ef4444]/40 shadow-[0_4px_25px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all text-xs font-hanken">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 h-10 sm:h-11 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Crew Status */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-1.5 bg-[#ef4444]/15 border border-[#ef4444]/40 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[#ef4444] font-mono-jb text-[10px] sm:text-[11px] font-bold shrink-0">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#ef4444] animate-ping" />
            <span>CREW</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 text-[#e5e2e1] min-w-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-[#ef4444]/50 shrink-0"
            />
            <span className="font-sora font-semibold text-xs sm:text-[13px] truncate max-w-[100px] sm:max-w-[160px]">
              {currentUser.name}
            </span>
            <span className="hidden sm:inline-block font-mono-jb text-[10px] text-[#ef4444] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase shrink-0">
              {currentUser.role}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-[#bac9cd]/70 pl-2 border-l border-white/10 font-mono-jb text-[11px] shrink-0">
            <Layers className="w-3.5 h-3.5 text-[#ef4444]" />
            <span>
              Live: <strong className="text-[#fecaca]">{activePagesCount}/{totalPagesCount}</strong>
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Switch Crew Member (Dropdown) */}
          <div className="relative group hidden sm:block">
            <button className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#bac9cd] hover:text-white border border-white/10 text-[10px] sm:text-[11px] font-mono-jb transition-colors cursor-pointer">
              <User className="w-3 h-3 text-[#ef4444]" />
              <span className="hidden md:inline">Switch</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            <div className="absolute right-0 mt-1 w-56 bg-[#131313] border border-white/10 rounded-xl shadow-2xl p-1.5 hidden group-hover:block z-50 animate-in fade-in">
              <div className="text-[10px] font-mono-jb text-[#bac9cd]/60 px-2 py-1 uppercase">
                Select Active Profile
              </div>
              {CREW_USERS.map((u) => (
                <button
                  key={u.id}
                  onClick={() => switchUser(u.id)}
                  className={`w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                    currentUser.id === u.id
                      ? 'bg-[#ef4444]/15 text-[#ef4444] font-bold'
                      : 'text-[#e5e2e1] hover:bg-white/5'
                  }`}
                >
                  <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover shrink-0" />
                  <div className="truncate">
                    <div className="text-xs">{u.name}</div>
                    <div className="text-[10px] text-[#bac9cd]/60 font-mono-jb">{u.roleTitle}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Open Main CMS Dashboard */}
          <button
            onClick={onOpenDashboard}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 rounded-lg bg-[#ef4444] text-[#7f1d1d] hover:bg-[#dc2626] font-sora font-bold text-[11px] sm:text-xs shadow-[0_0_12px_rgba(239,68,68,0.4)] transition-all cursor-pointer shrink-0"
          >
            <Sliders className="w-3.5 h-3.5 shrink-0" />
            <span>CMS Portal</span>
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            title="Log out from crew mode"
            className="p-1 sm:p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-[#bac9cd] hover:text-rose-300 border border-white/10 hover:border-rose-500/40 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
