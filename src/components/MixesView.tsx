import React, { useState, useEffect } from 'react';
import { NavTab } from '../types';
import { Play, ArrowUpRight, Youtube } from 'lucide-react';
import youtubeBrand from 'thesvg/youtube';
import { VertexCorners } from './VertexCorners';
import { useCMS } from '../context/CMSContext';
import { extractYoutubeId } from '../utils/youtube';

interface ChannelVideoCardProps { videoId: string; size: string; hasFeatured: boolean; pinnedVideoId: string | null; onRequestPin: (videoId: string) => void; onStop: () => void; }
const ChannelVideoCard: React.FC<ChannelVideoCardProps> = ({ videoId, size, hasFeatured, pinnedVideoId, onRequestPin, onStop }) => {
  const [active, setActive] = useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
  const isPinned = pinnedVideoId === videoId;
  const blockedByOtherPin = pinnedVideoId !== null && !isPinned;
  const isFeatured = size === 'featured';
  const shouldAutoplay = isFeatured && !blockedByOtherPin;
  const enlarged = (isFeatured && !blockedByOtherPin) || (active && !blockedByOtherPin && !isPinned && !hasFeatured);
  const showIframe = shouldAutoplay || (active && !blockedByOtherPin && !isPinned && !hasFeatured);
  const handleEnter = () => {
    if (hasFeatured) return;
    setActive(true);
    if (blockedByOtherPin) return;
    setTimeout(() => { const iframe = iframeRef.current; if (iframe?.contentWindow) iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), 'https://www.youtube.com'); }, 250);
  };
  const handleLeave = () => {
    if (hasFeatured || isFeatured) return;
    if (isPinned) return;
    const iframe = iframeRef.current;
    if (iframe?.contentWindow && showIframe && !shouldAutoplay) iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), 'https://www.youtube.com');
    setActive(false);
  };
  return (
    <article onMouseEnter={handleEnter} onMouseLeave={handleLeave} className={`vertex-card vertex-card--hover bg-[#0b0f17] border flex flex-col overflow-hidden transition-all duration-500 ease-in-out group ${enlarged || isFeatured ? 'sm:col-span-2 lg:col-span-2 border-blue-500 shadow-[0_12px_40px_rgba(37,99,235,.28)] z-10' : 'border-slate-800 hover:border-slate-700'}`}>
      <VertexCorners variant={enlarged || isFeatured ? 'blue' : 'white'} size={18} thickness={2.2} />
      <div className={`relative overflow-hidden bg-[#04060a] ${enlarged || isFeatured ? 'aspect-[16/10] sm:aspect-video' : 'aspect-video'}`}>
        {showIframe || shouldAutoplay ? (
          <>
            <iframe ref={(el) => { iframeRef.current = el; }} src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&autoplay=1&mute=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`} title="DJ Wolverine live mix" className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
            <div className="absolute bottom-2 left-2 right-12 flex items-center gap-2">
              {!isPinned && !isFeatured ? <button onClick={(e) => { e.stopPropagation(); onRequestPin(videoId); }} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 cursor-pointer"><Play className="w-3.5 h-3.5" /> Continue Playing</button> : isFeatured ? <span className="px-2 py-1 bg-amber-500 text-black font-mono text-[9px] font-bold uppercase">Featured • Autoplay</span> : <span className="px-2 py-1 bg-white text-black font-mono text-[9px] font-bold uppercase">Pinned — keeps playing</span>}
            </div>
            {(isPinned || isFeatured) && !isFeatured && <button onClick={(e) => { e.stopPropagation(); onStop(); }} className="absolute top-2 right-2 w-7 h-7 bg-black/70 text-white flex items-center justify-center hover:bg-black cursor-pointer text-xs">✕</button>}
          </>
        ) : isPinned ? (
          <div className="relative w-full h-full">
            <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="DJ Wolverine live mix" loading="lazy" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/40 to-black/20" />
            <div className="absolute inset-0 flex items-center justify-center"><span className="px-3 py-1.5 bg-blue-600 text-white font-mono text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Now Playing — at the top</span></div>
          </div>
        ) : blockedByOtherPin ? (
          <div className="relative w-full h-full">
            <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="DJ Wolverine live mix" loading="lazy" className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-transparent to-black/10" />
            <div className="absolute inset-0 flex items-center justify-center"><button type="button" onClick={(e) => { e.stopPropagation(); onRequestPin(videoId); }} className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-600/90 text-white group-hover:scale-110 group-hover:bg-blue-500 transition-all duration-300 shadow-[0_0_25px_rgba(37,99,235,.5)] cursor-pointer"><Play className="w-6 h-6 fill-current ml-0.5" /></button></div>
            <button onClick={(e) => { e.stopPropagation(); onRequestPin(videoId); }} className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 cursor-pointer"><Play className="w-3.5 h-3.5" /> Continue Playing</button>
          </div>
        ) : (
          <button type="button" onClick={(e) => { e.stopPropagation(); onRequestPin(videoId); }} className="relative w-full h-full block cursor-pointer text-left">
            <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="DJ Wolverine live mix" loading="lazy" className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-transparent to-black/10" />
            <div className="absolute inset-0 flex items-center justify-center"><span className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-600/90 text-white group-hover:scale-110 group-hover:bg-blue-500 transition-all duration-300 shadow-[0_0_25px_rgba(37,99,235,.5)]"><Play className="w-6 h-6 fill-current ml-0.5" /></span></div>
            <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-[#070b11]/90 font-mono text-[10px] text-blue-400 uppercase border-2 border-white/10 font-bold flex items-center gap-1"><Youtube className="w-3 h-3" /> DJ Wolverine</span>
          </button>
        )}
      </div>
    </article>
  );
};
const NowPlayingPlayer: React.FC<{ videoId: string }> = ({ videoId }) => (
  <div id="pinned-player" className="relative w-full aspect-video sm:aspect-[2.1/1] bg-black border-2 border-blue-500 overflow-hidden vertex-card shadow-[0_0_60px_rgba(37,99,235,.30)] scroll-mt-24">
    <VertexCorners variant="blue" size={20} thickness={2.4} />
    <iframe src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&autoplay=1&mute=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`} title="DJ Wolverine live mix" className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
  </div>
);

export const MixesView: React.FC<{ setActiveTab?: (tab: NavTab) => void; onPlayMix?: any; currentPlayingTrack?: any; currentPlayingId?: string | null; isPlaying?: boolean }> = ({ setActiveTab }) => {
  const { youtubePreviews } = useCMS();
  const youtubeItems = youtubePreviews.map((p) => ({ id: p.id, url: p.url, videoId: extractYoutubeId(p.url) as string, size: (p.size as any) || 'normal', position: p.position ?? 0 })).filter((x) => !!x.videoId).sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  const hasFeatured = youtubeItems.some((x) => x.size === 'featured');
  const firstFeatured = youtubeItems.find((x) => x.size === 'featured') || youtubeItems[0];
  const gridItems = firstFeatured ? youtubeItems.filter((x) => x.id !== firstFeatured.id) : youtubeItems;
  const [pinnedVideoId, setPinnedVideoId] = useState<string | null>(null);
  const [pendingSwitchId, setPendingSwitchId] = useState<string | null>(null);
  const requestPinVideo = (videoId: string) => {
    if (pinnedVideoId && pinnedVideoId !== videoId) setPendingSwitchId(videoId);
    else {
      setPinnedVideoId(videoId);
      setTimeout(() => document.getElementById('pinned-player')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
  };
  const confirmSwitchVideo = () => {
    if (pendingSwitchId) {
      setPinnedVideoId(pendingSwitchId);
      setTimeout(() => document.getElementById('pinned-player')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
    setPendingSwitchId(null);
  };
  const cancelSwitchVideo = () => setPendingSwitchId(null);
  const navigate = (tab: NavTab) => { if (setActiveTab) setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@djwolverine_ke';
  useEffect(() => {
    if (pinnedVideoId) setTimeout(() => document.getElementById('pinned-player')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
  }, [pinnedVideoId]);
  return (
    <div className="w-full bg-[#070b11] text-white">
      <section className="relative overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=1600&auto=format&fit=crop" alt="DJ Wolverine" className="w-full h-full object-cover object-center opacity-[0.10]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b11] via-[#070b11]/92 to-[#070b11]/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b11]/40 via-transparent to-transparent" />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-28 sm:pt-32 pb-12 sm:pb-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block font-mono text-[10px] sm:text-xs tracking-[0.2em] text-blue-500 uppercase font-bold mb-3">Sonic Portfolio</span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-[1.05] tracking-tight max-w-3xl">Want to Hear DJ Wolverine Before You Book? <span className="text-blue-500">Start Here.</span></h1>
              <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full sm:w-auto"><button onClick={() => navigate('home')} className="bg-white text-black font-bold text-xs sm:text-sm px-6 sm:px-8 py-3.5 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(255,255,255,0.10)]">Back to Home <ArrowUpRight className="w-4 h-4" /></button></div>
            </div>
            {firstFeatured && (
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border-2 border-blue-500/40 shadow-[0_20px_60px_rgba(37,99,235,0.3)] vertex-card">
                <VertexCorners variant="blue" size={18} thickness={2.2} />
                <iframe src={`https://www.youtube.com/embed/${firstFeatured.videoId}?rel=0&modestbranding=1&playsinline=1&mute=1&autoplay=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`} title="Featured mix" className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-black font-mono text-[10px] font-bold uppercase tracking-wider rounded-full">Featured</span>
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12 border-b border-slate-900">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-5 sm:mb-6">
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-3"><span className="w-8 h-[3px] bg-blue-500 block" /> YouTube Vault</h2>
          <div className="flex items-center gap-2">
            {pinnedVideoId && <button onClick={() => setPinnedVideoId(null)} className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-white bg-black/70 border-2 border-white/20 hover:bg-black px-4 py-2 cursor-pointer">✕ Stop</button>}
            <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-blue-400 hover:text-white border-2 border-blue-500/30 hover:border-blue-500 bg-blue-500/10 hover:bg-blue-600 px-4 py-2 cursor-pointer"><span className="w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current" dangerouslySetInnerHTML={{ __html: youtubeBrand.variants.mono }} /> Open on YouTube</a>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3"><span className="font-mono text-xs text-slate-500">Listen in as much as you like</span></div>
        {pinnedVideoId && <div className="mb-6 sm:mb-8"><NowPlayingPlayer videoId={pinnedVideoId} /></div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 grid-flow-row-dense auto-rows-min items-start">
          {gridItems.map((item) => {
            const sizeClass = item.size === 'large' ? 'sm:col-span-2' : item.size === 'featured' ? 'sm:col-span-2 lg:col-span-2' : '';
            return (
              <div key={item.id} className={sizeClass}>
                <ChannelVideoCard videoId={item.videoId} size={item.size} hasFeatured={hasFeatured} pinnedVideoId={pinnedVideoId} onRequestPin={requestPinVideo} onStop={() => setPinnedVideoId(null)} />
              </div>
            );
          })}
        </div>
        {gridItems.length === 0 && (
          <div className="text-center py-16 border-2 border-slate-800 bg-[#0b0f17] mt-8">
            <Youtube className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="font-serif text-lg font-bold text-white">No YouTube mixes yet</p>
            <p className="font-sans text-sm text-slate-500">Add YouTube links via Admin → YouTube Previews (Supabase)</p>
          </div>
        )}
        {pendingSwitchId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={cancelSwitchVideo}>
            <div className="relative w-full max-w-md bg-[#0b0f17] border-2 border-blue-500/40 vertex-card p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
              <VertexCorners variant="blue" size={18} thickness={2.2} />
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">Another mix is already playing</h3>
              <p className="font-sans text-sm text-slate-400 mt-3 leading-relaxed">Only one set can play sound at a time. Switch to this mix, or cancel to keep the current one playing.</p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button onClick={confirmSwitchVideo} className="flex-1 bg-blue-600 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl hover:bg-blue-700 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"><Play className="w-4 h-4" /> Switch to this mix</button>
                <button onClick={cancelSwitchVideo} className="flex-1 border-2 border-white/15 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl hover:bg-white hover:text-black cursor-pointer uppercase tracking-wider">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
