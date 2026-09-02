import React, { useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { VertexCorners } from './VertexCorners';

declare global { interface Window { instgrm?: { Embeds: { process: () => void } } } }

export const InstagramPreviews: React.FC = () => {
  const { instagramPreviews } = useCMS();
  useEffect(() => {
    const existing = document.querySelector('script[src="//www.instagram.com/embed.js"]') as HTMLScriptElement | null;
    if (!existing) {
      const s = document.createElement('script');
      s.async = true;
      s.src = '//www.instagram.com/embed.js';
      document.body.appendChild(s);
      s.onload = () => window.instgrm?.Embeds.process();
    } else {
      window.instgrm?.Embeds.process();
    }
    const t = setTimeout(() => window.instgrm?.Embeds.process(), 800);
    return () => clearTimeout(t);
  }, [instagramPreviews]);

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
              <blockquote
                className="instagram-media w-full"
                data-instgrm-permalink={p.url.includes('?') ? p.url : `${p.url.replace(/\/$/, '')}/?utm_source=ig_embed&utm_campaign=loading`}
                data-instgrm-version="14"
                style={{ background: '#FFF', border: 0, borderRadius: 3, margin: 1, maxWidth: 658, minWidth: 326, width: '100%' } as any}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
