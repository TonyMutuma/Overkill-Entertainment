import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { X, Lock, ShieldCheck, Key, AlertCircle, Sparkles, Disc3 } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useCMS();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Please enter both username and password');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await login(username, password);
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
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#ef4444] via-[#fecaca] to-[#ef4444]" />
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#bac9cd]/70 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="p-8">
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
                Admin Login
              </h2>
            </div>
          </div>
          <p className="font-hanken text-sm text-[#bac9cd]/70 mb-6">
            Enter your crew credentials to continue.
          </p>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300 font-hanken">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="block font-mono-jb text-xs text-[#bac9cd] mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Crew ID"
                autoComplete="username"
                className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e5e2e1] focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] outline-none font-hanken"
              />
            </div>

            <div>
              <label className="font-mono-jb text-xs text-[#bac9cd] mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
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
                  Enter Dashboard
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 flex items-center text-[11px] font-mono-jb text-[#bac9cd]/50">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Secure session
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
