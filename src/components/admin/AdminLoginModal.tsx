import React, { useState } from 'react';
import { useCMS, CREW_USERS } from '../../context/CMSContext';
import { X, Lock, ShieldCheck, Key, UserCheck, AlertCircle, Sparkles, Disc3, ArrowRight } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { login, currentUser } = useCMS();
  const [activeTab, setActiveTab] = useState<'quick' | 'credentials'>('quick');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickLogin = async (userEmail: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await login(userEmail, 'overkill2026');
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await login(email, password);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message || 'Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#131313] border border-[#ef4444]/40 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.25)] overflow-hidden">
        {/* Glow Header */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#ef4444] via-[#fecaca] to-[#ef4444]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#bac9cd]/70 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {/* Header Title */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#ef4444]/15 border border-[#ef4444]/40 flex items-center justify-center text-[#ef4444]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-mono-jb text-[11px] uppercase tracking-widest text-[#ef4444] font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                RESTRICTED CREW PORTAL
              </div>
              <h2 className="font-sora text-xl md:text-2xl font-extrabold text-[#e5e2e1] tracking-tight">
                DJ Wolverine & Team Login
              </h2>
            </div>
          </div>
          <p className="font-hanken text-sm text-[#bac9cd]/70 mb-6">
            Authenticate to edit live website components, adjust pricing & packages, toggle page visibility, and manage mix tracks.
          </p>

          {/* Login Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-[#1c1b1b] p-1.5 rounded-xl border border-white/5 mb-6">
            <button
              onClick={() => {
                setActiveTab('quick');
                setErrorMsg(null);
              }}
              className={`py-2 px-3 rounded-lg font-sora text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'quick'
                  ? 'bg-[#ef4444] text-[white] shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : 'text-[#bac9cd] hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              1-Click Crew Profiles
            </button>
            <button
              onClick={() => {
                setActiveTab('credentials');
                setErrorMsg(null);
              }}
              className={`py-2 px-3 rounded-lg font-sora text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'credentials'
                  ? 'bg-[#ef4444] text-[white] shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : 'text-[#bac9cd] hover:text-white'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              Manual Credentials
            </button>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300 font-hanken">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Tab 1: Quick Crew Profiles */}
          {activeTab === 'quick' && (
            <div className="space-y-3">
              <div className="text-[11px] font-mono-jb uppercase text-[#bac9cd]/60 mb-2">
                Select your assigned role to access CMS:
              </div>
              {CREW_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleQuickLogin(user.email)}
                  disabled={isLoading}
                  className="w-full text-left p-3.5 rounded-xl bg-[#1c1b1b] hover:bg-[#252424] border border-white/10 hover:border-[#ef4444]/50 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-11 h-11 rounded-full object-cover border border-[#ef4444]/40 shrink-0"
                    />
                    <div>
                      <div className="font-sora text-sm font-bold text-[#e5e2e1] group-hover:text-[#fecaca] transition-colors flex items-center gap-2">
                        {user.name}
                        <span
                          className="font-mono-jb text-[9px] uppercase px-2 py-0.5 rounded-full font-semibold"
                          style={{
                            backgroundColor: `${user.badgeColor}20`,
                            color: user.badgeColor,
                            borderColor: `${user.badgeColor}40`,
                            borderWidth: 1
                          }}
                        >
                          {user.role.toUpperCase()}
                        </span>
                      </div>
                      <div className="font-hanken text-xs text-[#bac9cd]/70">{user.roleTitle}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#bac9cd]/40 group-hover:text-[#ef4444] group-hover:translate-x-1 transition-all shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* Tab 2: Manual Credentials */}
          {activeTab === 'credentials' && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block font-mono-jb text-xs text-[#bac9cd] mb-1.5">
                  Email Address / Crew ID
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. wolverine@overkill.dj"
                  className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e5e2e1] focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] outline-none font-hanken"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-mono-jb text-xs text-[#bac9cd]">Password</label>
                  <span className="font-mono-jb text-[10px] text-[#ef4444]/80">Demo: overkill2026</span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e5e2e1] focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] outline-none font-hanken"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#ef4444] text-[white] font-sora font-bold text-sm rounded-xl uppercase tracking-wider hover:bg-[#dc2626] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <Disc3 className="w-4 h-4 animate-spin" />
                    Verifying Access...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Enter DJ & Crew Dashboard
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer security notes */}
          <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono-jb text-[#bac9cd]/50">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AES-256 State Persistence
            </span>
            <span>Overkill OS v2.6</span>
          </div>
        </div>
      </div>
    </div>
  );
};
