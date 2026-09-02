import React from 'react';
import { NavTab, MixTrack } from '../types';
import { TRUST_VENUES, DJ_ASSETS } from '../data/mockData';
import { useCMS } from '../context/CMSContext';
import { X, CheckCircle2, Sliders, Zap, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { VertexCorners } from './VertexCorners';
import { InstagramPreviews } from './InstagramPreviews';
import instagram from 'thesvg/instagram';
import x from 'thesvg/x-formerly-twitter';
import youtube from 'thesvg/youtube';
import spotify from 'thesvg/spotify';
import tiktok from 'thesvg/tiktok';
import soundcloud from 'thesvg/soundcloud';
import applePodcasts from 'thesvg/apple-podcasts';
import mixcloud from 'thesvg/mixcloud';
import beatport from 'thesvg/beatport';

interface HomeViewProps {
  setActiveTab?: (tab: NavTab) => void;
  onNavigateToBooking?: () => void;
  onNavigateToMixes?: () => void;
  onPlayFeaturedMix?: (track: MixTrack) => void;
  currentPlayingId?: string | null;
  onOpenBooking?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  onNavigateToBooking,
  onNavigateToMixes,
  onOpenBooking
}) => {
  const { siteSettings } = useCMS();
  const navigate = (tab: NavTab) => {
    if (tab === 'mixes' && onNavigateToMixes) {
      onNavigateToMixes();
    } else if (setActiveTab) {
      setActiveTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBooking = () => {
    if (onOpenBooking) {
      onOpenBooking();
    } else if (onNavigateToBooking) {
      onNavigateToBooking();
    } else if (setActiveTab) {
      setActiveTab('home');
    }
  };

  return (
    <div className="w-full bg-[#18181B] text-[#A1A1A6] selection:bg-[#2563eb]/30 selection:text-white overflow-x-hidden">
      {/* 1. Mobile-First Hero Section */}
      <section className="relative min-h-[calc(100vh-70px)] flex items-end md:items-center overflow-hidden pt-20 sm:pt-24 pb-12">
        
        {/* Responsive Background Setup */}
        <div className="absolute inset-0 z-0">
          <img
            src={DJ_ASSETS.heroBg}
            alt="DJ Wolverine"
            /* Mobile: position DJ center-right with top placement; Desktop: standard right alignment */
            className="w-full h-full object-cover object-[70%_15%] md:object-[85%_center] opacity-60 md:opacity-80"
          />
          {/* Mobile Linear Gradients to guarantee text contrast & keep subject visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b11] via-[#070b11]/90 via-55% to-transparent md:hidden" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b11] via-[#070b11]/85 to-transparent hidden md:block" />
        </div>

        {/* Hero Content Container - aligned exactly to navbar logo X */}
        <div className="relative z-10 max-w-[1280px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 xl:col-span-7 flex flex-col items-start text-left">
            
            {/* Headline - FLUID premium: desktop stays 60px, mobile scales smoothly instead of breaking layout */}
            <h1
              className="tagline font-extrabold leading-[0.95] tracking-tight text-white drop-shadow-md"
              style={{ fontFamily: "'Krona One', sans-serif", fontSize: 'clamp(40px, 6vw, 61px)', maxWidth: '50vw', textWrap: 'balance' as any }}
            >
              We Don&apos;t Gamble<br /> With Your Event&apos;s<br /> Atmosphere
            </h1>

             {/* Hero CTAs - side by side, spanning the tagline width */}
            <div
              className="flex flex-row items-stretch justify-start gap-3 sm:gap-4 my-10 sm:my-14 w-full"
              style={{ maxWidth: '50vw' }}
            >
              <button
                onClick={handleBooking}
                className="bg-white text-black font-bold text-[10px] sm:text-xs md:text-sm px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl hover:bg-slate-200 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 uppercase tracking-wide sm:tracking-wider shadow-[0_8px_24px_rgba(255,255,255,0.12)] whitespace-nowrap"
              >
                <span className="sm:hidden">BOOK EVENT</span>
                <span className="hidden sm:inline">Book Your Date</span>
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              </button>

              <button
                onClick={() => navigate('mixes')}
                className="text-white font-bold text-[10px] sm:text-xs md:text-sm px-4 sm:px-4 py-3 sm:py-3 rounded-xl hover:text-[#A1A1A6] transition-colors duration-200 cursor-pointer uppercase tracking-wide sm:tracking-wider underline underline-offset-8 text-center border border-white/10 hover:border-white/15 hover:bg-white/[0.04] whitespace-nowrap"
              >
                <span className="sm:hidden">MIXES</span>
                <span className="hidden sm:inline">Explore Mixes</span>
              </button>
            </div>

            {/* Trusted By - full width on mobile/half screens, 50vw on desktop */}
                        <div className="w-full mr-auto max-w-full lg:max-w-[50vw]">
                          <p className="font-mono text-[10px] sm:text-xs text-slate-500 uppercase tracking-[0.25em] mb-3 sm:mb-4 font-bold text-left">
                            TRUSTED BY
                          </p>
              {(() => {
                const renderVenue = (venue, idx) => {
                  const isSquare = venue.name === 'Alchemist Lounge' || venue.name === 'Farenheit Lounge';
                  return (
                  <div key={idx} className="group flex items-center justify-center w-full">
                    {venue.logo ? (
                      <img
                        src={venue.logo}
                        alt={venue.name}
                        className={`w-auto max-w-full object-contain brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity ${isSquare ? 'h-14 sm:h-16' : 'h-12 sm:h-14'}`}
                      />
                    ) : (
                      <div className="text-left">
                        <span className="font-serif text-sm sm:text-base md:text-lg font-bold tracking-widest text-slate-300 group-hover:text-white transition-colors uppercase">
                          {venue.name}
                        </span>
                        {venue.location && (
                          <span className="block font-mono text-[9px] sm:text-[10px] text-slate-500 mt-0.5 font-bold">
                            {venue.location}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
                };
                const half = Math.ceil(TRUST_VENUES.length / 2);
                const rowOne = TRUST_VENUES.slice(0, half);
                const rowTwo = TRUST_VENUES.slice(half);
                return (
                  <>
                    <div className="grid grid-cols-4 items-center justify-items-center gap-x-1 sm:gap-x-2 gap-y-2 sm:gap-y-3 opacity-70 mb-2 sm:mb-3">
                      {rowOne.map(renderVenue)}
                    </div>
                    <div className="grid grid-cols-4 items-center justify-items-center gap-x-1 sm:gap-x-2 gap-y-2 sm:gap-y-3 opacity-70">
                      {rowTwo.map(renderVenue)}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* 2. DJ Profile */}
      <section className="py-12 sm:py-20 px-4 md:px-16 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Portrait */}
          <div className="relative vertex-card border-2 border-slate-700/60 overflow-hidden">
            <VertexCorners variant="blue" size={22} thickness={2.6} />
            <img
              src="/assets/DjWolverine.png"
              alt="DJ Wolverine"
              className="w-full h-[320px] sm:h-[440px] object-cover object-[50%_20%]"
            />
          </div>

          {/* Bio */}
          <div>
            <span className="font-mono text-[10px] sm:text-xs text-[#A1A1A6] uppercase tracking-[0.2em] mb-2 block font-bold">
              THE RESIDENT SELECTOR
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Meet {siteSettings?.djName || 'DJ Wolverine'}
            </h2>
            <p className="font-sans text-slate-400 font-normal text-sm sm:text-base leading-relaxed mb-6">
              With over a decade behind the decks, {siteSettings?.djName || 'DJ Wolverine'} has become one of East Africa&apos;s most in-demand selectors — crafting unforgettable atmospheres for club nights, festival mainstages, luxury weddings, and high-stakes corporate galas. He doesn&apos;t just play music; he reads the room and becomes part of the energy.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
              {[
                '10+ Years Behind The Decks',
                'Master Crowd Reader',
                'Versatile Across Genres',
                'Elite, Insured Professionalism'
              ].map((s) => (
                <div key={s} className="flex items-center gap-3 bg-[#0b0f17] border border-slate-700/60 px-4 py-3">
                  <CheckCircle2 className="w-4 h-4 text-[#A1A1A6] shrink-0" />
                  <span className="font-sans text-xs sm:text-sm text-slate-200 font-medium">{s}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {siteSettings?.instagramUrl && (
                <a href={siteSettings.instagramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-white text-black font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">
                  <span className="w-4 h-4 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current text-black" dangerouslySetInnerHTML={{ __html: instagram.variants.mono }} /> Instagram
                </a>
              )}
              {siteSettings?.twitterUrl && (
                <a href={siteSettings.twitterUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#0b0f17] border border-slate-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:border-white/40 transition-colors cursor-pointer">
                  <span className="w-4 h-4 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current" dangerouslySetInnerHTML={{ __html: x.variants.mono }} /> X / Twitter
                </a>
              )}
              <button
                onClick={handleBooking}
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Book {siteSettings?.djName?.split(' ').pop() || 'DJ Wolverine'}
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-slate-800/60">
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold">Listen on</span>
              <a href="https://youtube.com/@djwolverine_ke" target="_blank" rel="noreferrer" className="w-8 h-8 bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-white hover:[&>span]:text-black text-white transition-colors"><span className="w-4 h-4 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current" dangerouslySetInnerHTML={{ __html: youtube.variants.mono }} /></a>
              <a href="https://open.spotify.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-white hover:[&>span]:text-black text-white transition-colors"><span className="w-4 h-4 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current" dangerouslySetInnerHTML={{ __html: spotify.variants.mono }} /></a>
              <a href="https://podcasts.apple.com/ke/podcast/dj-wolverine-mixes/id1707262780" target="_blank" rel="noreferrer" className="w-8 h-8 bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-white hover:[&>span]:text-black text-white transition-colors"><span className="w-4 h-4 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current" dangerouslySetInnerHTML={{ __html: applePodcasts.variants.mono }} /></a>
              <a href="https://soundcloud.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-white hover:[&>span]:text-black text-white transition-colors"><span className="w-4 h-4 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current" dangerouslySetInnerHTML={{ __html: soundcloud.variants.mono }} /></a>
              <a href="https://mixcloud.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-white hover:[&>span]:text-black text-white transition-colors"><span className="w-4 h-4 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current" dangerouslySetInnerHTML={{ __html: mixcloud.variants.mono }} /></a>
              <a href="https://beatport.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-white hover:[&>span]:text-black text-white transition-colors"><span className="w-4 h-4 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current" dangerouslySetInnerHTML={{ __html: beatport.variants.mono }} /></a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-white hover:[&>span]:text-black text-white transition-colors"><span className="w-4 h-4 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current" dangerouslySetInnerHTML={{ __html: tiktok.variants.mono }} /></a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Apple Podcasts Playlist - Preview */}
      <section className="py-12 sm:py-20 bg-[#0f0f13] border-y border-slate-900">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-flex items-center justify-center gap-2 font-mono text-[10px] sm:text-xs text-slate-500 uppercase tracking-[0.2em] mb-3 font-bold">
              <span className="w-4 h-4 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current text-[#A1A1A6]" dangerouslySetInnerHTML={{ __html: applePodcasts.variants.mono }} />
              Apple Podcasts
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              DJ Wolverine Mixes
            </h2>
            <p className="font-sans text-slate-400 max-w-xl mx-auto text-xs sm:text-sm font-normal mt-2">
              Listen in to audio mixes — handcrafted sets across club nights, festivals, and special events.
            </p>
          </div>

          <a href="https://podcasts.apple.com/ke/podcast/dj-wolverine-mixes/id1707262780" target="_blank" rel="noreferrer" className="vertex-card bg-[#0b0f17] border-2 border-slate-700/60 overflow-hidden max-w-3xl mx-auto relative block hover:border-slate-600 transition-colors cursor-pointer group">
            <VertexCorners variant="muted" size={20} />
            <img src="/assets/applepodcastpreview.png" alt="DJ Wolverine Apple Podcasts Preview" className="w-full h-auto object-contain block group-hover:scale-[1.01] transition-transform duration-300" />
            <div className="p-6 sm:p-8 text-center border-t border-slate-800/60 bg-[#0b0f17]">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.06] border border-white/10 rounded-full mb-4">
                <span className="w-4 h-4 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current text-white" dangerouslySetInnerHTML={{ __html: applePodcasts.variants.mono }} />
                <span className="font-mono text-[10px] tracking-widest text-slate-300 uppercase font-bold">Available on Apple Podcasts</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-6">Listen in to Audio Mixes</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <span className="inline-flex items-center gap-2 bg-white text-black font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl group-hover:bg-slate-200 transition-colors">
                  <span className="w-4 h-4 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current" dangerouslySetInnerHTML={{ __html: applePodcasts.variants.mono }} />
                  Listen on Apple Podcasts
                  <ArrowUpRight className="w-4 h-4" />
                </span>
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate('mixes'); }} className="inline-flex items-center gap-2 bg-[#0b0f17] border border-slate-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:border-white/40 hover:bg-white/[0.04] transition-colors cursor-pointer">
                  Explore All Mixes
                </button>
              </div>
            </div>
          </a>
        </div>
      </section>

      <InstagramPreviews />

      {/* 4. Problem / Solution */}
      <section className="py-12 sm:py-20 px-4 md:px-16 max-w-[1280px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="font-mono text-[10px] sm:text-xs text-[#A1A1A6] uppercase tracking-[0.2em] mb-2 block font-bold">
            THE OVERKILL DIFFERENCE
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white tracking-tight font-bold capitalize">
            what makes the night unforgettable.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Problem Card */}
          <div className="vertex-card bg-[#0b0f17] p-6 sm:p-8 border-2 border-slate-700/60 relative overflow-hidden">
            <VertexCorners variant="slate" size={20} />
            <img src={DJ_ASSETS.djPerformingCrowd} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.06] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0b0f17] via-[#0b0f17]/92 to-[#0b0f17]/55 pointer-events-none" />
            <div className="absolute inset-0 bg-[#0b0f17]/20 pointer-events-none" />
            <div className="absolute top-0 left-0 w-1 h-full bg-white/15 z-10" />
            <span className="font-mono text-[10px] sm:text-xs text-blue-400 uppercase tracking-wider block mb-2 font-bold relative z-10">
              The Reality
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold mb-3 text-white relative z-10">
              The Problem
            </h3>
            <p className="font-sans text-slate-400 mb-5 leading-relaxed font-normal text-xs sm:text-sm relative z-10">
              A flat set kills the mood. When the music misses the moment, the energy dips, the dancefloor empties, and the night never quite lands.
            </p>
            <ul className="space-y-3 font-sans text-xs sm:text-sm text-slate-300 font-medium relative z-10">
              <li className="flex items-center gap-3">
                <X className="w-4 h-4 text-[#A1A1A6] shrink-0" />
                <span>Music that clashes with the room&apos;s shifting energy</span>
              </li>
              <li className="flex items-center gap-3">
                <X className="w-4 h-4 text-[#A1A1A6] shrink-0" />
                <span>Gaps in momentum that kill the vibe</span>
              </li>
              <li className="flex items-center gap-3">
                <X className="w-4 h-4 text-[#A1A1A6] shrink-0" />
                <span>A soundtrack that feels generic instead of unforgettable</span>
              </li>
            </ul>
          </div>

          {/* Solution Card */}
          <div className="vertex-card bg-[#0b0f17] p-6 sm:p-8 border-2 border-blue-600/30 relative overflow-hidden">
            <VertexCorners variant="blue" size={22} thickness={2.6} />
            <img src={DJ_ASSETS.heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.07] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-[#0b0f17]/88 to-[#0b0f17]/60 pointer-events-none" />
            <div className="absolute inset-0 bg-[#070b11]/15 pointer-events-none" />
            <div className="absolute top-0 left-0 w-1 h-full bg-white/15 z-10" />
            <span className="font-mono text-[10px] sm:text-xs text-[#A1A1A6] uppercase tracking-wider block mb-2 font-bold relative z-10">
              The Standard
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold mb-3 text-white relative z-10">
              The Solution
            </h3>
            <p className="font-sans text-slate-300 mb-5 leading-relaxed font-normal text-xs sm:text-sm relative z-10">
              DJ Wolverine engineers the perfect atmosphere. From the first track to the encore, every beat is calculated to keep the floor moving.
            </p>
            <ul className="space-y-3 font-sans text-xs sm:text-sm text-slate-200 font-medium relative z-10">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#A1A1A6] shrink-0" />
                <span>Seamless, high-energy mixing with custom club VIP edits</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#A1A1A6] shrink-0" />
                <span>Master crowd-reading ability calibrated in top clubs</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#A1A1A6] shrink-0" />
                <span>Elite-tier professional reliability & magnetic showmanship</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Bento Grid */}
      <section className="py-12 sm:py-20 bg-[#04060a] border-y border-slate-900">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16">
          <div className="text-center mb-10 sm:mb-12">
            <span className="font-mono text-[10px] sm:text-xs text-[#A1A1A6] uppercase tracking-[0.2em] mb-2 block font-bold">
              CORE PRINCIPLES
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
              Why Choose Overkill?
            </h2>
            <p className="font-sans text-slate-400 max-w-xl mx-auto text-xs sm:text-sm font-normal">
              We don&apos;t just play music; we curate high-octane sonic experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="vertex-card md:col-span-2 bg-[#0b0f17] p-6 sm:p-8 border-2 border-slate-700/60 relative overflow-hidden">
              <VertexCorners variant="white" size={20} />
              <img src={DJ_ASSETS.clubLaser} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.07] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0b0f17] via-[#0b0f17]/90 to-[#0b0f17]/50 pointer-events-none" />
              <Sliders className="w-5 h-5 sm:w-6 sm:h-6 text-[#A1A1A6] mb-3 sm:mb-4 relative z-10" />
              <h3 className="font-serif text-lg sm:text-xl font-bold mb-2 text-white relative z-10">
                Sonic Precision
              </h3>
                <p className="font-sans text-slate-400 font-normal text-xs sm:text-sm leading-relaxed relative z-10">
                  Every transition is flawless. DJ Wolverine reads the room and blends the perfect harmonic mix to keep the floor locked in — whether it&apos;s deep house, Amapiano, Afro-tech, or timeless 90s RnB.
                </p>
            </div>

            <div className="vertex-card bg-[#0b0f17] p-6 sm:p-8 border-2 border-slate-700/60 relative overflow-hidden">
              <VertexCorners variant="white" size={18} />
              <img src={DJ_ASSETS.festivalStage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.07] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0b0f17] via-[#0b0f17]/90 to-[#0b0f17]/50 pointer-events-none" />
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#A1A1A6] mb-3 sm:mb-4 relative z-10" />
              <h3 className="font-serif text-lg sm:text-xl font-bold mb-2 text-white relative z-10">
                Raw Energy
              </h3>
              <p className="font-sans text-slate-400 font-normal text-xs sm:text-sm leading-relaxed relative z-10">
                We bring the intense, magnetic vibe of an underground club directly to your private party, wedding, or corporate stage.
              </p>
            </div>

            <div className="vertex-card bg-[#0b0f17] p-6 sm:p-8 border-2 border-slate-700/60 relative overflow-hidden">
              <VertexCorners variant="white" size={18} />
              <img src={DJ_ASSETS.rooftopSunset} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.07] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0b0f17] via-[#0b0f17]/90 to-[#0b0f17]/50 pointer-events-none" />
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#A1A1A6] mb-3 sm:mb-4 relative z-10" />
              <h3 className="font-serif text-lg sm:text-xl font-bold mb-2 text-white relative z-10">
                Ironclad Reliability
              </h3>
                <p className="font-sans text-slate-400 font-normal text-xs sm:text-sm leading-relaxed relative z-10">
                  Punctual, fully insured, and always fully prepared with backup plans. We over-deliver because &apos;good enough&apos; is not in our vocabulary.
                </p>
            </div>

            <div className="vertex-card md:col-span-2 bg-[#0b0f17] border-2 border-slate-700/60 relative min-h-[160px] sm:min-h-[180px] flex items-center p-6 sm:p-8 overflow-hidden">
              <VertexCorners variant="muted" size={20} />
              <img
                src={DJ_ASSETS.djPerformingCrowd}
                alt="DJ Wolverine performing for the crowd"
                className="absolute inset-0 w-full h-full object-cover opacity-[0.08]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f17] via-[#0b0f17]/85 to-[#0b0f17]/40 pointer-events-none" />
              <div className="relative z-10 max-w-lg">
                <span className="text-[#A1A1A6] font-mono text-[10px] uppercase tracking-widest block mb-1.5 font-bold">
                  The Connection
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold mb-2 text-white">
                  He Doesn&apos;t Just Play — He Reads The Room
                </h3>
                <p className="font-sans text-slate-400 font-normal text-xs sm:text-sm leading-relaxed">
                  A decade of reading crowds across clubs, festivals, and private stages means DJ Wolverine becomes part of the energy — lifting the room exactly when it needs it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
