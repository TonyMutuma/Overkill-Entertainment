import React from 'react';
import { useCMS } from '../context/CMSContext';
import { VertexCorners } from './VertexCorners';

const toInstagramEmbedUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/^\/(p|reel|tv)\/([^/]+)/i);
    if (match) return `https://www.instagram.com/${match[1].toLowerCase()}/${match[2]}/embed/`;
  } catch {}
  return url;
};

export const InstagramPreviews: React.FC = () => {
  const { instagramPreviews } = useCMS();
  if (!instagramPreviews.length) return null;

  return (
    <section className="py-12 sm:py-16 bg-[#0f0f13] border-y border-slate-900">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16">
        <div className="text-center mb-8">
          <span className="font-mono text-[10px] tracking-[0.2em] text-slate-500 uppercase font-bold">Instagram</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">On the Gram</h2>
          <p className="font-sans text-slate-400 text-sm mt-2">Latest moments from DJ Wolverine.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {instagramPreviews.map((p) => (
            <div key={p.id} className="vertex-card bg-[#0b0f17] border border-slate-800/60 overflow-hidden p-2 sm:p-3 flex justify-center">
              <VertexCorners variant="muted" size={16} />
              <div className="w-full min-w-0 bg-white rounded-[3px] overflow-hidden" style={{ minHeight: 520 }}>
                <iframe
                  title="Instagram post"
                  src={toInstagramEmbedUrl(p.url)}
                  className="block w-full border-0"
                  style={{ height: 540, border: 0 }}
                  scrolling="no"
                  allow="encrypted-media; fullscreen; picture-in-picture"
                  loading="eager"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
