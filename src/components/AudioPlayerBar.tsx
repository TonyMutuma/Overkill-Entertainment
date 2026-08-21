import React, { useState, useEffect } from 'react';
import { MixTrack } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, X, Radio } from 'lucide-react';

interface AudioPlayerBarProps {
  currentTrack: MixTrack | null;
  isPlaying: boolean;
  onTogglePlay: (track: MixTrack) => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onClose?: () => void;
  onClosePlayer?: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onClose,
  onClosePlayer
}) => {
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(18);

  const handleClose = () => { if (onClose) onClose(); if (onClosePlayer) onClosePlayer(); };

  useEffect(() => {
    let interval: number;
    if (isPlaying) interval = window.setInterval(() => setProgress((prev) => (prev >= 100 ? 0 : prev + 0.4)), 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) setIsMuted(false);
    soundEngine.setVolume(val);
  };
  const toggleMute = () => {
    if (isMuted) { setIsMuted(false); soundEngine.setVolume(volume); }
    else { setIsMuted(true); soundEngine.setVolume(0); }
  };
  if (!currentTrack) return null;
  return (
    <aside aria-label="Audio stream player" className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1000px] z-50 bg-[#0b0f17] border-2 border-slate-800 p-3 sm:p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial sm:max-w-xs">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 overflow-hidden shrink-0 border-2 border-slate-800">
            <img src={currentTrack.imageUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
            {isPlaying && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Radio className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 animate-pulse" /></div>}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase px-1 sm:px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">{currentTrack.categoryLabel}</span>
              <span className="text-[10px] sm:text-[11px] font-mono text-slate-500 hidden sm:inline">{currentTrack.bpm} BPM</span>
            </div>
            <h4 className="font-serif text-xs sm:text-sm font-bold text-white truncate mt-0.5">{currentTrack.title}</h4>
            <p className="font-sans text-[10px] sm:text-[11px] text-slate-500 truncate hidden sm:block">{currentTrack.recordedAt}</p>
          </div>
        </div>
        <div className="flex-1 max-w-md hidden sm:flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-4">
            <button onClick={onPrevTrack} className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"><SkipBack className="w-4 h-4" /></button>
            <button onClick={() => onTogglePlay(currentTrack)} className="w-10 h-10 bg-white text-black flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer">
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
            <button onClick={onNextTrack} className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"><SkipForward className="w-4 h-4" /></button>
          </div>
          <div className="w-full flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500">{Math.floor((progress * 105) / 100 / 60)}:{String(Math.floor((progress * 105) / 100) % 60).padStart(2, '0')}</span>
            <div className="relative flex-1 h-3 flex items-center gap-1 px-1">
              {isPlaying ? (
                <div className="w-full flex items-end justify-between h-4 gap-[2px]">
                  {[...Array(32)].map((_, i) => <span key={i} className="w-[2px] bg-blue-500" style={{ height: `${Math.max(3, Math.sin(i * 0.5 + progress * 0.2) * 12 + 6)}px`, opacity: i / 32 <= progress / 100 ? 1 : 0.35 }} />)}
                </div>
              ) : <div className="w-full h-1 bg-slate-800 overflow-hidden"><div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} /></div>}
            </div>
            <span className="text-[10px] font-mono text-slate-500">{currentTrack.duration}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2">
            <button onClick={toggleMute} className="text-slate-400 hover:text-white transition-colors cursor-pointer">{isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-blue-400" /> : <Volume2 className="w-4 h-4" />}</button>
            <input type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="w-16 h-1 bg-slate-800 appearance-none cursor-pointer accent-blue-500" />
          </div>
          <button onClick={() => onTogglePlay(currentTrack)} className="sm:hidden w-9 h-9 bg-white text-black flex items-center justify-center cursor-pointer">{isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}</button>
          <button onClick={handleClose} className="text-slate-500 hover:text-white transition-colors p-1 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
      </div>
    </aside>
  );
};
