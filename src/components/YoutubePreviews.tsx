import React from 'react';
import { useCMS } from '../context/CMSContext';
import { VertexCorners } from './VertexCorners';
import { extractYoutubeId, getYoutubeEmbedUrl } from '../utils/youtube';

export const YoutubePreviews: React.FC = () => {
  const { youtubePreviews } = useCMS();
  if (!youtubePreviews.length) return null;
  return (
    <section className="py-12 sm:py-16 bg-[#0f0f13] border-y border-slate-900">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16">
        <div className="text-center mb-8">
          <span className="font-mono text-[10px] tracking-[0.2em] text-slate-500 uppercase font-bold">YouTube</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">On YouTube</h2>
          <p className="font-sans text-slate-400 text-sm mt-2">Latest videos from DJ Wolverine.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {youtubePreviews.map((p) => {
            const id = extractYoutubeId(p.url);
            const embed = getYoutubeEmbedUrl(p.url);
            return (
              <div key={p.id} className="vertex-card bg-[#0b0f17] border border-slate-800/60 overflow-hidden">
                <VertexCorners variant="muted" size={16} />
                {embed && id ? (
                  <iframe src={embed} title={p.url} className="w-full aspect-video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
                ) : (
                  <a href={p.url} target="_blank" rel="noreferrer" className="block p-4 text-sm text-blue-400 break-all">{p.url}</a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
