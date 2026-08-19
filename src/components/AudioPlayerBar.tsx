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
  onClose: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onClose
}) => {
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(18);

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.4));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) setIsMuted(false);
    soundEngine.setVolume(val);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      soundEngine.setVolume(volume);
    } else {
      setIsMuted(true);
      soundEngine.setVolume(0);
    }
  };

  if (!currentTrack) return null;

  return (
    <aside aria-label="Audio stream player" className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1000px] z-50 bg-[#1c1b1b]/95 backdrop-blur-2xl border border-[#00daf8]/40 rounded-xl p-3 md:p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(0,218,248,0.2)] animate-in slide-in-from-bottom-6 duration-300">
      <div className="flex items-center justify-between gap-4">
        {/* Track info */}
        <div className="flex items-center gap-3 min-w-0 max-w-[280px] md:max-w-xs">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10 group">
            <img
              src={currentTrack.imageUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Radio className="w-5 h-5 text-[#00daf8] animate-pulse" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-jb uppercase px-1.5 py-0.5 rounded bg-[#00daf8]/15 text-[#00daf8] border border-[#00daf8]/30">
                {currentTrack.categoryLabel}
              </span>
              <span className="text-[11px] font-mono-jb text-[#bac9cd]/60">
                {currentTrack.bpm} BPM
              </span>
            </div>
            <h4 className="font-sora text-sm font-bold text-[#e5e2e1] truncate mt-0.5">
              {currentTrack.title}
            </h4>
            <p className="font-hanken text-[11px] text-[#bac9cd]/70 truncate">
              {currentTrack.recordedAt}
            </p>
          </div>
        </div>

        {/* Center: Controls and Waveform */}
        <div className="flex-1 max-w-md hidden sm:flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-4">
            <button
              onClick={onPrevTrack}
              className="text-[#bac9cd] hover:text-[#baf2ff] transition-colors p-1 cursor-pointer"
              title="Previous Mix"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => onTogglePlay(currentTrack)}
              className="w-10 h-10 rounded-full bg-[#00daf8] text-[#00363f] flex items-center justify-center hover:scale-105 hover:shadow-[0_0_15px_#00daf8] transition-all cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>
            <button
              onClick={onNextTrack}
              className="text-[#bac9cd] hover:text-[#baf2ff] transition-colors p-1 cursor-pointer"
              title="Next Mix"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Scrubber / Waveform animation */}
          <div className="w-full flex items-center gap-2">
            <span className="text-[10px] font-mono-jb text-[#bac9cd]/60">
              {Math.floor((progress * 105) / 100 / 60)}:
              {String(Math.floor((progress * 105) / 100) % 60).padStart(2, '0')}
            </span>

            {/* Animated Equalizer or scrub bar */}
            <div className="relative flex-1 h-3 flex items-center gap-1 px-1 cursor-pointer group">
              {isPlaying ? (
                <div className="w-full flex items-end justify-between h-4 gap-[2px]">
                  {[...Array(32)].map((_, i) => (
                    <span
                      key={i}
                      className="w-[2px] bg-[#00daf8] rounded-full transition-all duration-150"
                      style={{
                        height: `${Math.max(
                          3,
                          Math.sin(i * 0.5 + progress * 0.2) * 12 + 6
                        )}px`,
                        opacity: i / 32 <= progress / 100 ? 1 : 0.35
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00daf8] rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>

            <span className="text-[10px] font-mono-jb text-[#bac9cd]/60">
              {currentTrack.duration}
            </span>
          </div>
        </div>

        {/* Volume & Close */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-[#bac9cd] hover:text-[#00daf8] transition-colors cursor-pointer"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#00daf8]"
            />
          </div>

          <button
            onClick={() => onTogglePlay(currentTrack)}
            className="sm:hidden w-9 h-9 rounded-full bg-[#00daf8] text-[#00363f] flex items-center justify-center"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            onClick={onClose}
            className="text-[#bac9cd]/60 hover:text-white transition-colors p-1 cursor-pointer"
            title="Close Player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
