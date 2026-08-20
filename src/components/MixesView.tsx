import React, { useState } from 'react';
import { MixTrack, NavTab } from '../types';
import { MIX_TRACKS } from '../data/mockData';
import { Play, Pause, Headphones, Calendar as CalendarIcon, ChevronDown, ChevronUp, Music } from 'lucide-react';

interface MixesViewProps {
  setActiveTab?: (tab: NavTab) => void;
  onNavigateToCalendar?: () => void;
  onNavigateToServices?: () => void;
  onPlayMix: (track: MixTrack) => void;
  currentPlayingTrack?: MixTrack | null;
  currentPlayingId?: string | null;
  isPlaying?: boolean;
}

export const MixesView: React.FC<MixesViewProps> = ({
  setActiveTab,
  onNavigateToCalendar,
  onNavigateToServices,
  onPlayMix,
  currentPlayingTrack,
  currentPlayingId,
  isPlaying = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTracklistId, setExpandedTracklistId] = useState<string | null>(null);

  const navigate = (tab: NavTab) => {
    if (tab === 'calendar' && onNavigateToCalendar) {
      onNavigateToCalendar();
    } else if (tab === 'services' && onNavigateToServices) {
      onNavigateToServices();
    } else if (setActiveTab) {
      setActiveTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    { id: 'all', label: 'All Sets' },
    { id: 'corporate', label: 'Corporate' },
    { id: 'wedding', label: 'Wedding' },
    { id: 'club', label: 'Club' },
    { id: 'private', label: 'Private Party' }
  ];

  const filteredMixes =
    selectedCategory === 'all'
      ? MIX_TRACKS
      : MIX_TRACKS.filter((m) => m.category === selectedCategory);

  const toggleTracklist = (id: string) => {
    setExpandedTracklistId(expandedTracklistId === id ? null : id);
  };

  return (
    <div className="w-full pt-28 pb-24 md:pb-32 px-6 md:px-16 max-w-[1280px] mx-auto">
      {/* 1. Hero Section */}
      <section className="relative min-h-[55vh] flex items-center mb-16 rounded-2xl overflow-hidden p-8 md:p-14 border border-white/5 bg-[#1c1b1b]/50">
        {/* Background DJ photo */}
        <div className="absolute inset-0 z-0 right-0 w-full md:w-1/2 ml-auto opacity-30 md:opacity-60 mix-blend-luminosity">
          <img
            src="https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=1200&auto=format&fit=crop"
            alt="DJ Wolverine Live Selector"
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient blends */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full md:w-2/3 max-w-3xl">
          <div className="inline-block px-3.5 py-1.5 bg-[#201f1f] rounded-full border border-[#00daf8]/30 mb-6">
            <span className="font-mono-jb text-xs text-[#00daf8] tracking-widest uppercase font-semibold">
              Sonic Portfolio
            </span>
          </div>

          <h1 className="font-sora text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold text-[#e5e2e1] leading-[1.1] tracking-tight mb-6">
            Want to Hear DJ Wolverine Before You Book?{' '}
            <span className="text-[#00daf8] block text-glow">Start Here.</span>
          </h1>

          <p className="font-hanken text-base sm:text-lg md:text-xl text-[#bac9cd] mb-10 max-w-xl leading-relaxed">
            Real live club & event sets, not sterile studio edits. Experience the raw energy and seamless transitions that define the OVERKILL standard.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('calendar')}
              className="bg-[#00daf8] text-[#00363f] font-sora font-bold text-sm md:text-base px-8 py-3.5 rounded hover:scale-105 hover:shadow-[0_0_25px_rgba(0,218,248,0.5)] transition-all duration-300 cursor-pointer uppercase tracking-wider"
            >
              Check Availability
            </button>
            <button
              onClick={() => navigate('services')}
              className="border-2 border-[#00daf8]/50 text-[#baf2ff] font-sora font-bold text-sm md:text-base px-8 py-3.5 rounded hover:border-[#00daf8] hover:bg-[#00daf8]/10 transition-colors duration-300 cursor-pointer uppercase tracking-wider"
            >
              View Rates & Packages
            </button>
          </div>
        </div>
      </section>

      {/* 2. Filters Section */}
      <section className="mb-12">
        <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-white/10">
          <span className="font-mono-jb text-xs text-[#bac9cd]/70 uppercase tracking-wider mr-2">
            Filter Vibe:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2 rounded-full font-mono-jb text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border border-[#00daf8] text-[#baf2ff] bg-[#00daf8]/20 shadow-[0_0_12px_rgba(0,218,248,0.25)] font-bold'
                    : 'border border-white/10 text-[#bac9cd] hover:text-[#e5e2e1] hover:border-white/30 bg-[#1c1b1b]/50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Mixes Grid */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-sora text-2xl md:text-3xl font-bold text-[#e5e2e1] flex items-center gap-3">
            <span className="w-8 h-[3px] bg-[#00daf8] block rounded-full shadow-[0_0_8px_#00daf8]" />
            Latest Sets
          </h2>
          <span className="font-mono-jb text-xs text-[#bac9cd]/60">
            Showing {filteredMixes.length} live sets
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMixes.map((mix) => {
            const isCurrent = currentPlayingTrack?.id === mix.id || currentPlayingId === mix.id;
            const isThisPlaying = isCurrent && Boolean(isPlaying);
            const isExpanded = expandedTracklistId === mix.id;

            return (
              <article
                key={mix.id}
                className={`glass-card rounded-xl overflow-hidden group transition-all duration-300 flex flex-col ${
                  isThisPlaying
                    ? 'border-[#00daf8] shadow-[0_0_30px_rgba(0,218,248,0.3)] ring-1 ring-[#00daf8]/40'
                    : 'hover:border-[#00daf8]/50 hover:shadow-[0_0_20px_rgba(0,218,248,0.15)]'
                }`}
              >
                {/* Image Cover & Play trigger */}
                <div className="h-52 relative overflow-hidden bg-[#2a2a2a]">
                  <img
                    src={mix.imageUrl}
                    alt={mix.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 mix-blend-luminosity group-hover:opacity-100 group-hover:mix-blend-normal"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#201f1f] via-transparent to-black/30" />

                  {/* Badges on bottom */}
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-[#131313]/90 backdrop-blur font-mono-jb text-[10px] text-[#00daf8] uppercase rounded border border-white/10 font-bold">
                      {mix.categoryLabel}
                    </span>
                    <span className="px-3 py-1 bg-[#131313]/90 backdrop-blur font-mono-jb text-[10px] text-[#e5e2e1] uppercase rounded border border-white/10">
                      {mix.duration}
                    </span>
                  </div>

                  {/* Centered Play Button */}
                  <button
                    onClick={() => onPlayMix(mix)}
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 backdrop-blur rounded-full flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                      isThisPlaying
                        ? 'bg-[#00daf8] text-[#00363f] scale-110 shadow-[0_0_25px_#00daf8] border-[#00daf8]'
                        : 'bg-[#00daf8]/25 text-[#e5e2e1] border-[#00daf8]/50 group-hover:bg-[#00daf8] group-hover:text-[#00363f] group-hover:scale-110'
                    }`}
                    title={isThisPlaying ? 'Pause Mix' : 'Play Mix Stream'}
                  >
                    {isThisPlaying ? (
                      <Pause className="w-8 h-8 fill-current" />
                    ) : (
                      <Play className="w-8 h-8 fill-current ml-1" />
                    )}
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-sora text-xl font-bold text-[#e5e2e1] group-hover:text-[#baf2ff] transition-colors">
                      {mix.title}
                    </h3>
                    <span className="font-mono-jb text-[11px] text-[#00daf8] bg-[#00daf8]/10 px-2 py-0.5 rounded border border-[#00daf8]/20 shrink-0">
                      {mix.bpm} BPM
                    </span>
                  </div>

                  <p className="font-hanken text-sm text-[#bac9cd] mb-4 line-clamp-2 leading-relaxed flex-grow">
                    {mix.description}
                  </p>

                  {/* Meta stats */}
                  <div className="flex items-center justify-between text-xs font-mono-jb text-[#bac9cd]/60 pt-4 border-t border-white/5 mb-4">
                    <span className="flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#00daf8]" />
                      {mix.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Headphones className="w-3.5 h-3.5 text-[#00daf8]" />
                      {mix.plays}
                    </span>
                  </div>

                  {/* Tracklist Toggle */}
                  <div className="pt-2">
                    <button
                      onClick={() => toggleTracklist(mix.id)}
                      className="w-full flex items-center justify-between text-xs font-mono-jb text-[#00daf8] hover:text-[#baf2ff] py-1.5 px-2 rounded hover:bg-[#00daf8]/5 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Music className="w-3.5 h-3.5" />
                        {isExpanded ? 'Hide Tracklist' : 'View Tracklist Snippet'}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {/* Accordion content */}
                    {isExpanded && (
                      <div className="mt-3 p-3 rounded bg-[#131313] border border-white/10 text-xs font-mono-jb text-[#bac9cd] space-y-1.5 animate-in fade-in duration-200">
                        {mix.tracklistSnippet.map((track, tIdx) => (
                          <div key={tIdx} className="truncate text-[#e5e2e1]/90">
                            {track}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
