import React, { useState } from 'react';
import { MixTrack, NavTab } from '../types';
import { Play, Pause, Headphones, Calendar as CalendarIcon, ChevronDown, ChevronUp, Music, ArrowUpRight, Youtube, ExternalLink, Volume2, VolumeX } from 'lucide-react';
import { MIX_TRACKS } from '../data/mockData';
import { getYoutubeEmbedUrl, getYoutubeField, extractYoutubeId } from '../utils/youtube';
import { VertexCorners } from './VertexCorners';

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
  // YouTube links stay in code — static MIX_TRACKS from mockData, no DB/API
  const mixTracks: MixTrack[] = MIX_TRACKS;
  const [activeYoutubeId, setActiveYoutubeId] = useState<string | null>(null);
  const [pinnedYoutubeId, setPinnedYoutubeId] = useState<string | null>(null);
  const [unmutedIds, setUnmutedIds] = useState<Record<string, boolean>>({});
  const iframeRefs = React.useRef<Record<string, HTMLIFrameElement | null>>({});

  const navigate = (tab: NavTab) => {
    if (tab === 'calendar' && onNavigateToCalendar) onNavigateToCalendar();
    else if (tab === 'services' && onNavigateToServices) onNavigateToServices();
    else if (setActiveTab) setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    { id: 'all', label: 'All Sets' },
    { id: 'corporate', label: 'Corporate' },
    { id: 'wedding', label: 'Wedding' },
    { id: 'club', label: 'Club' },
    { id: 'festival', label: 'Festival' },
    { id: 'private', label: 'Private Party' }
  ];

  const filteredMixes = selectedCategory === 'all' ? mixTracks : mixTracks.filter((m) => m.category === selectedCategory);
  const toggleTracklist = (id: string) => setExpandedTracklistId(expandedTracklistId === id ? null : id);
  const handleUnmute = (id: string) => {
    const iframe = iframeRefs.current[id];
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*');
      iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }), '*');
      iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
    }
    setUnmutedIds(prev => ({ ...prev, [id]: true }));
    setPinnedYoutubeId(id);
    setActiveYoutubeId(id);
    setTimeout(() => document.getElementById(`mix-card-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  };
  const handleMute = (id: string) => {
    const iframe = iframeRefs.current[id];
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'mute', args: [] }), '*');
    }
    setUnmutedIds(prev => ({ ...prev, [id]: false }));
  };
  const handleCloseYoutube = (id: string) => {
    setActiveYoutubeId(prev => prev === id ? null : prev);
    setPinnedYoutubeId(prev => prev === id ? null : prev);
    setUnmutedIds(prev => { const c={...prev}; delete c[id]; return c; });
  };

  return (
    <div className="w-full bg-[#070b11] text-white">
      <section className="relative overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=1600&auto=format&fit=crop" alt="DJ Wolverine" className="w-full h-full object-cover object-center opacity-[0.10]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b11] via-[#070b11]/92 to-[#070b11]/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b11]/40 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b11] via-transparent to-transparent" />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-28 sm:pt-32 pb-12 sm:pb-16">
          <span className="inline-block font-mono text-[10px] sm:text-xs tracking-[0.2em] text-blue-500 uppercase font-bold mb-3">Sonic Portfolio</span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-[1.05] tracking-tight max-w-3xl">
            Want to Hear DJ Wolverine Before You Book? <span className="text-blue-500">Start Here.</span>
          </h1>
          <p className="font-sans text-sm sm:text-base md:text-lg text-slate-300 max-w-xl mt-4 leading-relaxed">
            Real live club & event sets, not sterile studio edits. Experience the raw energy and seamless transitions that define the OVERKILL standard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full sm:w-auto">
            <button onClick={() => navigate('calendar')} className="bg-white text-black font-bold text-xs sm:text-sm px-6 sm:px-8 py-3.5 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(255,255,255,0.10)]">
              Check Availability <ArrowUpRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate('services')} className="border-2 border-white/15 text-white font-bold text-xs sm:text-sm px-6 sm:px-8 py-3.5 rounded-xl hover:bg-white hover:text-black transition-colors cursor-pointer uppercase tracking-wider">
              View Rates & Packages
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8 border-b border-slate-900">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold mr-1 hidden sm:inline">Filter Vibe:</span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-4 sm:px-5 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors cursor-pointer border rounded-full ${isSelected ? 'bg-white text-black border-white font-bold shadow-md' : 'bg-[#0b0f17] text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'}`}>
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12 pb-20 sm:pb-28">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 sm:mb-8">
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-3"><span className="w-8 h-[3px] bg-blue-500 block" /> Latest Sets</h2>
          <span className="font-mono text-xs text-slate-500">Showing {filteredMixes.length} live sets • {filteredMixes.filter(m=>getYoutubeField(m)).length} with video</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredMixes.map((mix) => {
            const isCurrent = currentPlayingTrack?.id === mix.id || currentPlayingId === mix.id;
            const isThisPlaying = isCurrent && Boolean(isPlaying);
            const isExpanded = expandedTracklistId === mix.id;
            const youtubeField = getYoutubeField(mix);
            const youtubeId = youtubeField ? extractYoutubeId(youtubeField) : null;
            const baseEmbedUrl = youtubeField ? getYoutubeEmbedUrl(youtubeField) : null;
            const embedUrl = baseEmbedUrl ? `${baseEmbedUrl}${baseEmbedUrl.includes('?') ? '&' : '?'}autoplay=1&mute=1&enablejsapi=1` : null;
            const isYoutubeActive = activeYoutubeId === mix.id && !!embedUrl;
            const isPinned = pinnedYoutubeId === mix.id;
            const isUnmuted = !!unmutedIds[mix.id];
            const isEnlarged = isUnmuted && isYoutubeActive;
            return (
              <article id={`mix-card-${mix.id}`} key={mix.id} onMouseEnter={() => { if (youtubeId && !isEnlarged) setActiveYoutubeId(mix.id); }} onMouseLeave={() => { if (activeYoutubeId === mix.id && pinnedYoutubeId !== mix.id) setActiveYoutubeId(null); }} className={`vertex-card vertex-card--hover bg-[#0b0f17] border flex flex-col overflow-hidden transition-all duration-500 ease-in-out group ${isEnlarged ? 'sm:col-span-2 lg:col-span-2 border-blue-500 shadow-[0_12px_40px_rgba(37,99,235,.28)] z-20 scale-[1.01]' : isYoutubeActive ? 'border-slate-700' : isThisPlaying ? 'border-blue-500 shadow-[0_0_30px_rgba(37,99,235,.15)]' : 'border-slate-800 hover:border-slate-700'}`}><VertexCorners variant={isEnlarged || isThisPlaying ? 'blue' : 'white'} size={18} thickness={2.2} />
                <div className={`relative overflow-hidden bg-[#04060a] ${isEnlarged ? 'aspect-[16/10] sm:aspect-video' : 'aspect-video'}`} onClick={() => { if (isYoutubeActive) setPinnedYoutubeId(mix.id); }}>
                  {isYoutubeActive && embedUrl ? (
                    <>
                      <iframe ref={el => { iframeRefs.current[mix.id] = el; }} src={embedUrl} title={mix.title} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
                      <div className="absolute bottom-2 left-2 right-12 flex items-center gap-2">
                        {!isUnmuted ? (
                          <button onClick={(e) => { e.stopPropagation(); handleUnmute(mix.id); }} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors cursor-pointer">
                            <VolumeX className="w-3.5 h-3.5" /> Tap to Unmute — continues
                          </button>
                        ) : (
                          <button onClick={(e) => { e.stopPropagation(); handleMute(mix.id); }} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/70 backdrop-blur text-white font-mono text-[10px] font-bold uppercase tracking-wider border-2 border-white/20 hover:bg-black transition-colors cursor-pointer">
                            <Volume2 className="w-3.5 h-3.5" /> Mute
                          </button>
                        )}
                        {isPinned && <span className="px-2 py-1 bg-white text-black font-mono text-[9px] font-bold uppercase">Pinned — keeps playing</span>}
                      </div>
                    </>
                  ) : (
                    <>
                      <img src={mix.imageUrl} alt={mix.title} className="w-full h-full object-cover opacity-[0.55]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/60 to-black/10" />
                      <div className="absolute bottom-3 left-3 flex gap-2">
                        <span className="px-2.5 py-1 bg-[#070b11]/90 font-mono text-[10px] text-blue-400 uppercase border-2 border-white/10 font-bold">{mix.categoryLabel}</span>
                        <span className="px-2.5 py-1 bg-[#070b11]/90 font-mono text-[10px] text-white uppercase border-2 border-white/10">{mix.duration}</span>
                      </div>
                      {youtubeId && <span className="absolute top-3 right-3 px-2 py-1 bg-blue-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1"><Youtube className="w-3 h-3" /> YouTube</span>}
                      <div className="absolute inset-0 flex items-center justify-center gap-2 sm:gap-3">
                        <button onClick={() => onPlayMix(mix)} className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border rounded-xl transition-all cursor-pointer ${isThisPlaying ? 'bg-blue-500 text-white border-blue-500 scale-110 shadow-[0_0_25px_rgba(37,99,235,.6)]' : 'bg-white text-black border-white hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:scale-110'}`} title={isThisPlaying ? 'Pause' : 'Play Mix'}>
                          {isThisPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5" />}
                        </button>
                        {youtubeId && !isYoutubeActive && (
                          <button onClick={() => setActiveYoutubeId(mix.id)} className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0b0f17]/90 backdrop-blur border-2 border-white/20 text-white hover:bg-blue-600 hover:border-blue-600 hover:text-white flex items-center justify-center transition-all cursor-pointer rounded-xl" title="Play YouTube video">
                            <Youtube className="w-5 h-5 sm:w-6 sm:h-6" />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                  {isYoutubeActive && (
                    <button onClick={(e) => { e.stopPropagation(); handleCloseYoutube(mix.id); }} className="absolute top-2 right-2 w-7 h-7 bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer text-xs">✕</button>
                  )}
                </div>
                <div className="p-5 sm:p-6 flex flex-col flex-grow">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">{mix.title}</h3>
                    <span className="font-mono text-[10px] text-blue-400 bg-blue-500/10 px-2 py-1 border border-blue-500/20 shrink-0">{mix.bpm} BPM</span>
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-slate-400 mb-3 line-clamp-2 leading-relaxed flex-grow">{mix.description}</p>
                  {youtubeId && (
                    <div className="flex gap-2 mb-3">
                      <button onClick={() => {
                        if (isYoutubeActive) handleCloseYoutube(mix.id);
                        else { setActiveYoutubeId(mix.id); setPinnedYoutubeId(mix.id); }
                      }} className={`flex-1 py-2 px-3 font-mono text-[11px] uppercase tracking-wider font-bold border rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${isYoutubeActive ? 'bg-blue-600 border-blue-600 text-white' : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-600'}`}>
                        <Youtube className="w-3.5 h-3.5" /> {isYoutubeActive ? 'Hide Video' : 'Watch on YouTube'}
                      </button>
                      <a href={`https://www.youtube.com/watch?v=${youtubeId}`} target="_blank" rel="noreferrer" className="px-3 py-2 bg-[#04060a] border-2 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 flex items-center justify-center transition-colors rounded-xl">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-4 border-t border-slate-800 mb-3">
                    <span className="flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5 text-blue-500" />{mix.date}</span>
                    <span className="flex items-center gap-1.5"><Headphones className="w-3.5 h-3.5 text-blue-500" />{mix.plays}</span>
                  </div>
                  <button onClick={() => toggleTracklist(mix.id)} className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 hover:text-white py-2 px-2 border-2 border-slate-800 hover:border-slate-700 hover:bg-white/[0.03] transition-colors cursor-pointer uppercase tracking-wider rounded-xl">
                    <span className="flex items-center gap-1.5"><Music className="w-3.5 h-3.5" />{isExpanded ? 'Hide Tracklist' : 'View Tracklist'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {isExpanded && (
                    <div className="mt-3 p-3 bg-[#04060a] border-2 border-slate-800 text-xs font-mono text-slate-400 space-y-1.5">
                      {mix.tracklistSnippet.map((track, tIdx) => <div key={tIdx} className="truncate text-slate-300">{track}</div>)}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        {filteredMixes.length === 0 && (
          <div className="text-center py-16 border-2 border-slate-800 bg-[#0b0f17] mt-8">
            <Youtube className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="font-serif text-lg font-bold text-white">No mixes in this category yet</p>
            <p className="font-sans text-sm text-slate-500">YouTube links are in code — edit src/data/mockData.ts → MIX_TRACKS</p>
          </div>
        )}
      </section>
    </div>
  );
};
