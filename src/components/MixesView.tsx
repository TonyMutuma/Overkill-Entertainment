import React, { useState } from 'react';
import { NavTab } from '../types';
import { ArrowUpRight, Youtube, ExternalLink, Volume2, VolumeX } from 'lucide-react';
import { getYoutubeEmbedUrl, extractYoutubeId } from '../utils/youtube';
import { VertexCorners } from './VertexCorners';
import { useCMS } from '../context/CMSContext';

export const MixesView: React.FC<{ setActiveTab?: (tab: NavTab) => void; onPlayMix?: any; currentPlayingTrack?: any; currentPlayingId?: string | null; isPlaying?: boolean }> = ({ setActiveTab }) => {
  const { youtubePreviews } = useCMS();
  const youtubeIds = youtubePreviews.map((p) => ({ id: p.id, url: p.url, videoId: extractYoutubeId(p.url) })).filter((x) => !!x.videoId) as { id: string; url: string; videoId: string }[];
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [unmutedIds, setUnmutedIds] = useState<Record<string, boolean>>({});
  const iframeRefs = React.useRef<Record<string, HTMLIFrameElement | null>>({});
  const navigate = (tab: NavTab) => { if (setActiveTab) setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleUnmute = (id: string) => {
    const iframe = iframeRefs.current[id];
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'unMute', args: [] }), 'https://www.youtube.com');
      iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }), 'https://www.youtube.com');
      iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), 'https://www.youtube.com');
    }
    setUnmutedIds((p) => ({ ...p, [id]: true })); setPinnedId(id); setActiveId(id);
  };
  const handleMute = (id: string) => {
    const iframe = iframeRefs.current[id];
    if (iframe?.contentWindow) iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'mute', args: [] }), 'https://www.youtube.com');
    setUnmutedIds((p) => ({ ...p, [id]: false }));
  };
  const handleClose = (id: string) => { setActiveId((p) => (p === id ? null : p)); setPinnedId((p) => (p === id ? null : p)); setUnmutedIds((p) => { const c = { ...p }; delete c[id]; return c; }); };
  return (
    <div className="w-full bg-[#070b11] text-white">
      <section className="relative overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=1600&auto=format&fit=crop" alt="DJ Wolverine" className="w-full h-full object-cover object-center opacity-[0.10]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b11] via-[#070b11]/92 to-[#070b11]/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b11]/40 via-transparent to-transparent" />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-28 sm:pt-32 pb-12 sm:pb-16">
          <span className="inline-block font-mono text-[10px] sm:text-xs tracking-[0.2em] text-blue-500 uppercase font-bold mb-3">Sonic Portfolio</span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-[1.05] tracking-tight max-w-3xl">Want to Hear DJ Wolverine Before You Book? <span className="text-blue-500">Start Here.</span></h1>
          <p className="font-sans text-sm sm:text-base md:text-lg text-slate-300 max-w-xl mt-4 leading-relaxed">All mixes are YouTube videos managed in Supabase via CMS — no mock data.</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full sm:w-auto">
            <button onClick={() => navigate('home')} className="bg-white text-black font-bold text-xs sm:text-sm px-6 sm:px-8 py-3.5 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(255,255,255,0.10)]">Back to Home <ArrowUpRight className="w-4 h-4" /></button>
          </div>
        </div>
      </section>
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12 pb-20 sm:pb-28">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 sm:mb-8">
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-3"><span className="w-8 h-[3px] bg-blue-500 block" /> YouTube Vault</h2>
          <span className="font-mono text-xs text-slate-500">Showing {youtubeIds.length} YouTube mixes from Supabase</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {youtubeIds.map(({ id, url, videoId }) => {
            const baseEmbed = getYoutubeEmbedUrl(url);
            const embedUrl = baseEmbed ? `${baseEmbed}${baseEmbed.includes('?') ? '&' : '?'}autoplay=1&mute=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}` : null;
            const isActive = activeId === id && !!embedUrl;
            const isPinned = pinnedId === id;
            const isUnmuted = !!unmutedIds[id];
            const isEnlarged = isUnmuted && isActive;
            return (
              <article key={id} id={`mix-card-${id}`} className={`vertex-card bg-[#0b0f17] border flex flex-col overflow-hidden transition-all duration-500 ${isEnlarged ? 'sm:col-span-2 lg:col-span-2 border-blue-500 shadow-[0_12px_40px_rgba(37,99,235,.28)] scale-[1.01]' : isActive ? 'border-slate-700' : 'border-slate-800 hover:border-slate-700'}`}>
                <VertexCorners variant={isEnlarged ? 'blue' : 'white'} size={18} thickness={2.2} />
                <div className={`relative overflow-hidden bg-[#04060a] ${isEnlarged ? 'aspect-[16/10] sm:aspect-video' : 'aspect-video'}`}>
                  {isActive && embedUrl ? (
                    <>
                      <iframe ref={(el) => { iframeRefs.current[id] = el; }} src={embedUrl} title={url} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
                      <div className="absolute bottom-2 left-2 right-12 flex items-center gap-2">
                        {!isUnmuted ? (
                          <button onClick={(e) => { e.stopPropagation(); handleUnmute(id); }} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 cursor-pointer"><VolumeX className="w-3.5 h-3.5" /> Tap to Unmute</button>
                        ) : (
                          <button onClick={(e) => { e.stopPropagation(); handleMute(id); }} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/70 text-white font-mono text-[10px] font-bold uppercase border-2 border-white/20 cursor-pointer"><Volume2 className="w-3.5 h-3.5" /> Mute</button>
                        )}
                        {isPinned && <span className="px-2 py-1 bg-white text-black font-mono text-[9px] font-bold uppercase">Pinned</span>}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleClose(id); }} className="absolute top-2 right-2 w-7 h-7 bg-black/70 text-white flex items-center justify-center hover:bg-black cursor-pointer text-xs">✕</button>
                    </>
                  ) : (
                    <>
                      <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt={url} className="w-full h-full object-cover opacity-70" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-transparent to-black/10" />
                      <span className="absolute top-3 right-3 px-2 py-1 bg-blue-600 text-white font-mono text-[9px] font-bold uppercase flex items-center gap-1"><Youtube className="w-3 h-3" /> YouTube</span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button onClick={() => { setActiveId(id); setPinnedId(id); }} className="w-14 h-14 bg-[#0b0f17]/90 border-2 border-white/20 text-white hover:bg-blue-600 hover:border-blue-600 flex items-center justify-center rounded-xl cursor-pointer"><Youtube className="w-6 h-6" /></button>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-4 flex items-center justify-between gap-2">
                  <a href={url} target="_blank" rel="noreferrer" className="font-mono text-xs text-blue-400 truncate hover:text-white flex items-center gap-1">{url} <ExternalLink className="w-3 h-3 shrink-0" /></a>
                  {!isActive && <button onClick={() => { setActiveId(id); setPinnedId(id); }} className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white text-[11px] font-bold uppercase rounded-full cursor-pointer">Watch</button>}
                  {isActive && <button onClick={() => handleClose(id)} className="px-3 py-1.5 bg-blue-600 text-white text-[11px] font-bold uppercase rounded-full cursor-pointer">Hide</button>}
                </div>
              </article>
            );
          })}
        </div>
        {youtubeIds.length === 0 && (
          <div className="text-center py-16 border-2 border-slate-800 bg-[#0b0f17] mt-8">
            <Youtube className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="font-serif text-lg font-bold text-white">No YouTube mixes yet</p>
            <p className="font-sans text-sm text-slate-500">Add YouTube links via Admin → YouTube Previews (Supabase)</p>
          </div>
        )}
      </section>
    </div>
  );
};
