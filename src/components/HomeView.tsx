import React from 'react';
import { NavTab, MixTrack } from '../types';
import { TRUST_VENUES, COMPARISON_TABLE, DJ_ASSETS } from '../data/mockData';
import { X, CheckCircle2, Sliders, Zap, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { VertexCorners } from './VertexCorners';

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
    <div className="w-full bg-[#070b11] text-white selection:bg-blue-600 selection:text-white overflow-x-hidden">
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
              className="font-serif font-extrabold leading-[0.95] tracking-tight text-white drop-shadow-md"
              style={{ fontSize: 'clamp(40px, 6vw, 68px)', maxWidth: '50vw', textWrap: 'balance' as any }}
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
                className="text-white font-bold text-[10px] sm:text-xs md:text-sm px-4 sm:px-4 py-3 sm:py-3 rounded-xl hover:text-blue-500 transition-colors duration-200 cursor-pointer uppercase tracking-wide sm:tracking-wider underline underline-offset-8 text-center border border-white/10 hover:border-white/15 hover:bg-white/[0.04] whitespace-nowrap"
              >
                <span className="sm:hidden">MIXES</span>
                <span className="hidden sm:inline">Explore Mixes</span>
              </button>
            </div>

            {/* Trusted By - replaces stats, aligned to logo X */}
              <div className="w-full max-w-2xl mr-auto lg:-ml-[max(0px,calc((100vw_-_1280px)_/_2))]">
              <p className="font-mono text-[10px] sm:text-xs text-slate-500 uppercase tracking-[0.25em] mb-3 sm:mb-4 font-bold text-center">
                TRUSTED BY
              </p>
              {(() => {
                const renderVenue = (venue, idx) => {
                  const fileName = venue.logo?.split('/').pop() || '';
                  const isLarger = ['quiver lounge.png', 'milan lounge.png', 'Farenheit lounge.png'].includes(fileName);
                  const isXLarge = fileName === 'Farenheit lounge.png';
                  const isTopRow = ['Milan Lounge', 'Konqa'].includes(venue.name);
                  return (
                    <div key={idx} className="group flex items-center">
                      {venue.logo ? (
                        <img
                          src={venue.logo}
                          alt={venue.name}
                          className={`w-auto object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity ${isTopRow ? 'h-16 sm:h-20' : isXLarge ? 'h-20 sm:h-28' : isLarger ? 'h-14 sm:h-16' : 'h-11 sm:h-14'}`}
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
                const rowOne = ['Milan Lounge', 'Konqa']
                  .map((n) => TRUST_VENUES.find((v) => v.name === n))
                  .filter(Boolean);
                const rowTwo = ['Cavalli Lounge', 'Farenheit Lounge', 'Quiver Lounge']
                  .map((n) => TRUST_VENUES.find((v) => v.name === n))
                  .filter(Boolean);
                return (
                  <>
                    <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 opacity-70 mb-6 sm:mb-8">
                      {rowOne.map(renderVenue)}
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 opacity-70">
                      {rowTwo.map(renderVenue)}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Problem / Solution Comparison */}
      <section className="py-12 sm:py-20 px-4 md:px-16 max-w-[1280px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="font-mono text-[10px] sm:text-xs text-blue-500 uppercase tracking-[0.2em] mb-2 block font-bold">
            THE OVERKILL DIFFERENCE
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white tracking-tight font-bold capitalize">
            why your event&apos;s odds are at stake.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Problem Card */}
          <div className="vertex-card bg-[#0b0f17] p-6 sm:p-8 border-2 border-slate-700/60 relative overflow-hidden">
            <VertexCorners variant="slate" size={20} />
            <img src={DJ_ASSETS.djPerformingCrowd} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.06] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0b0f17] via-[#0b0f17]/92 to-[#0b0f17]/55 pointer-events-none" />
            <div className="absolute inset-0 bg-[#0b0f17]/20 pointer-events-none" />
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-900 z-10" />
            <span className="font-mono text-[10px] sm:text-xs text-blue-400 uppercase tracking-wider block mb-2 font-bold relative z-10">
              The Reality
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold mb-3 text-white relative z-10">
              The Problem
            </h3>
            <p className="font-sans text-slate-400 mb-5 leading-relaxed font-normal text-xs sm:text-sm relative z-10">
              Most DJs play for themselves, not the crowd. They ignore the vibe, kill the momentum, and leave your guests checking their watches.
            </p>
            <ul className="space-y-3 font-sans text-xs sm:text-sm text-slate-300 font-medium relative z-10">
              <li className="flex items-center gap-3">
                <X className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Awkward, jarring track transitions & trainwrecks</span>
              </li>
              <li className="flex items-center gap-3">
                <X className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Ignoring the room&apos;s shifting demographics & energy</span>
              </li>
              <li className="flex items-center gap-3">
                <X className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Unreliable equipment, bad audio cables & amateur attitudes</span>
              </li>
            </ul>
          </div>

          {/* Solution Card */}
          <div className="vertex-card bg-[#0b0f17] p-6 sm:p-8 border-2 border-blue-600/30 relative overflow-hidden">
            <VertexCorners variant="blue" size={22} thickness={2.6} />
            <img src={DJ_ASSETS.heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.07] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-[#0b0f17]/88 to-[#0b0f17]/60 pointer-events-none" />
            <div className="absolute inset-0 bg-[#070b11]/15 pointer-events-none" />
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 z-10" />
            <span className="font-mono text-[10px] sm:text-xs text-blue-500 uppercase tracking-wider block mb-2 font-bold relative z-10">
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
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Seamless, high-energy mixing with custom club VIP edits</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Master crowd-reading ability calibrated in top clubs</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Elite-tier professional reliability & concert audio gear</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Bento Grid */}
      <section className="py-12 sm:py-20 bg-[#04060a] border-y border-slate-900">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16">
          <div className="text-center mb-10 sm:mb-12">
            <span className="font-mono text-[10px] sm:text-xs text-blue-500 uppercase tracking-[0.2em] mb-2 block font-bold">
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
              <Sliders className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mb-3 sm:mb-4 relative z-10" />
              <h3 className="font-serif text-lg sm:text-xl font-bold mb-2 text-white relative z-10">
                Sonic Precision
              </h3>
              <p className="font-sans text-slate-400 font-normal text-xs sm:text-sm leading-relaxed relative z-10">
                Every transition is flawless. We run on Rane Twelve motorized controller decks to ensure absolute audio clarity, harmonic key matching, and immense bass impact on any sound system. DJ Wolverine is proficient on most industry-standard decks.
              </p>
            </div>

            <div className="vertex-card bg-[#0b0f17] p-6 sm:p-8 border-2 border-slate-700/60 relative overflow-hidden">
              <VertexCorners variant="white" size={18} />
              <img src={DJ_ASSETS.festivalStage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.07] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0b0f17] via-[#0b0f17]/90 to-[#0b0f17]/50 pointer-events-none" />
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mb-3 sm:mb-4 relative z-10" />
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
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mb-3 sm:mb-4 relative z-10" />
              <h3 className="font-serif text-lg sm:text-xl font-bold mb-2 text-white relative z-10">
                Ironclad Reliability
              </h3>
              <p className="font-sans text-slate-400 font-normal text-xs sm:text-sm leading-relaxed relative z-10">
                Punctual, fully insured, and prepared with dual backup hardware. We over-deliver because &apos;good enough&apos; is not in our vocabulary.
              </p>
            </div>

            <div className="vertex-card md:col-span-2 bg-[#0b0f17] border-2 border-slate-700/60 relative min-h-[160px] sm:min-h-[180px] flex items-center p-6 sm:p-8 overflow-hidden">
              <VertexCorners variant="muted" size={20} />
              <img
                src={DJ_ASSETS.djMixerGear}
                alt="DJ Wolverine Rig Setup"
                className="absolute inset-0 w-full h-full object-cover opacity-[0.08]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f17] via-[#0b0f17]/85 to-[#0b0f17]/40 pointer-events-none" />
              <div className="relative z-10 max-w-lg">
                <span className="text-blue-500 font-mono text-[10px] uppercase tracking-widest block mb-1.5 font-bold">
                  Hardware & Rig
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold mb-2 text-white">
                  Concert-Tier Setup
                </h3>
                <p className="font-sans text-slate-400 font-normal text-xs sm:text-sm leading-relaxed">
                  State-of-the-art QSC active audio line arrays, Shure dual digital wireless microphones, and dynamic DMX-controlled lighting designed to elevate the venue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Comparison Table */}
      <section className="py-12 sm:py-20 px-4 md:px-16 max-w-[1280px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <span className="font-mono text-[10px] sm:text-xs text-blue-500 uppercase tracking-[0.2em] mb-2 block font-bold">
            DIRECT COMPARISON
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
            The Overkill Standard
          </h2>
          <p className="font-sans text-slate-400 font-normal text-xs sm:text-sm">
            See how DJ Wolverine compares against average options and standard playlist operators.
          </p>
        </div>

        <div className="vertex-card overflow-x-auto border-2 border-slate-800 bg-[#0b0f17]"><VertexCorners variant="slate" size={18} />
          <table className="w-full text-left border-collapse min-w-[500px] sm:min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="p-4 sm:p-5 font-serif text-xs sm:text-base text-slate-300 w-1/3 font-bold">Feature</th>
                <th className="p-4 sm:p-5 font-serif text-xs sm:text-base text-slate-500 w-1/3 text-center font-bold">
                  Playlist Apps / Average DJs
                </th>
                <th className="p-4 sm:p-5 font-serif text-xs sm:text-base text-blue-500 w-1/3 text-center bg-blue-950/20 border-x border-slate-800 font-bold">
                  Overkill (DJ Wolverine)
                </th>
              </tr>
            </thead>
            <tbody className="font-sans text-[11px] sm:text-sm">
              {COMPARISON_TABLE.map((row, i) => (
                <tr key={i} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-900/30 transition-colors">
                  <td className="p-4 sm:p-5 text-slate-200 font-semibold">{row.feature}</td>
                  <td className="p-4 sm:p-5 text-center text-slate-500 font-medium">{row.standardDjs}</td>
                  <td className="p-4 sm:p-5 text-center text-white bg-blue-950/10 border-x border-slate-800 font-bold">
                    {row.overkill}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <button
            onClick={handleBooking}
            className="w-full sm:w-auto bg-white text-black font-bold text-xs sm:text-sm px-8 py-4 rounded-xl hover:bg-slate-200 transition-all duration-200 cursor-pointer uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(255,255,255,0.12)]"
          >
            Secure Your Date With DJ Wolverine
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
