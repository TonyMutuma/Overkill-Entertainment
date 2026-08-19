import React from 'react';
import { NavTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: NavTab) => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenContact }) => {
  return (
    <footer className="w-full py-12 md:py-16 border-t border-white/10 bg-[#1c1b1b]/80 relative z-10">
      <div className="max-w-[1280px] mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Brand & Copyright */}
        <div className="flex flex-col gap-2">
          <div 
            onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="font-sora text-2xl font-bold tracking-tighter text-[#e5e2e1] cursor-pointer hover:text-[#baf2ff] transition-colors inline-block w-fit"
          >
            OVERKILL
          </div>
          <p className="font-hanken text-xs text-[#bac9cd]/60 leading-relaxed max-w-sm">
            © 2024 Overkill Entertainment. All Rights Reserved. Resident Selector: DJ Wolverine.
          </p>
        </div>

        {/* Quick Nav / Legal */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-start md:justify-center text-sm font-hanken text-[#bac9cd]/70">
          <button 
            onClick={() => { setActiveTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="hover:text-[#baf2ff] transition-colors cursor-pointer"
          >
            Packages
          </button>
          <button 
            onClick={() => { setActiveTab('calendar'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="hover:text-[#baf2ff] transition-colors cursor-pointer"
          >
            Availability
          </button>
          <button 
            onClick={() => { setActiveTab('faq'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="hover:text-[#baf2ff] transition-colors cursor-pointer"
          >
            Rider & FAQ
          </button>
          <button 
            onClick={onOpenContact}
            className="hover:text-[#baf2ff] transition-colors cursor-pointer"
          >
            Agency Clearance
          </button>
        </div>

        {/* Social / Direct channels */}
        <div className="flex flex-wrap gap-5 justify-start md:justify-end items-center text-sm font-hanken text-[#bac9cd]/70">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#baf2ff] transition-colors flex items-center gap-1.5"
          >
            Instagram
          </a>
          <a
            href="https://soundcloud.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#baf2ff] transition-colors flex items-center gap-1.5"
          >
            Soundcloud
          </a>
          <button
            onClick={onOpenContact}
            className="hover:text-[#baf2ff] transition-colors cursor-pointer"
          >
            Press Kit
          </button>
        </div>
      </div>
    </footer>
  );
};
