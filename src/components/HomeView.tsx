import React from 'react';
import { NavTab, MixTrack } from '../types';
import { TRUST_VENUES, COMPARISON_TABLE, DJ_ASSETS } from '../data/mockData';
import { X, CheckCircle2, Sliders, Zap, ShieldCheck, ArrowUpRight, Music, Calendar, Users, Volume2 } from 'lucide-react';

interface HomeViewProps {
  setActiveTab?: (tab: NavTab) => void;
  onNavigateToBooking?: () => void;
  onNavigateToMixes?: () => void;
  onNavigateToServices?: () => void;
  onNavigateToCalendar?: () => void;
  onPlayFeaturedMix?: (track: MixTrack) => void;
  currentPlayingId?: string | null;
  onOpenBooking?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  onNavigateToBooking,
  onNavigateToMixes,
  onNavigateToServices,
  onNavigateToCalendar,
  onOpenBooking
}) => {
  const navigate = (tab: NavTab) => {
    if (tab === 'calendar' && onNavigateToCalendar) {
      onNavigateToCalendar();
    } else if (tab === 'mixes' && onNavigateToMixes) {
      onNavigateToMixes();
    } else if (tab === 'services' && onNavigateToServices) {
      onNavigateToServices();
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
      setActiveTab('calendar');
    }
  };

  return (
    <div className="w-full bg-[#070b11] text-white selection:bg-red-600 selection:text-white overflow-x-hidden">
      {/* 1. Mobile-First Hero Section */}
      <section className="relative min-h-[calc(100vh-70px)] flex items-end md:items-center overflow-hidden px-4 sm:px-8 md:px-12 lg:px-16 pt-16 pb-12">
        
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

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 xl:col-span-7 flex flex-col items-start text-left">
            
            {/* Red Eyebrow Label */}
            <span className="text-red-500 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] font-extrabold mb-2 sm:mb-3 drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]">
              OVERKILL ENTERTAINMENT
            </span>

            {/* Headline - Dynamically scaled down for smaller screens */}
            <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] sm:leading-[1.1] tracking-tight mb-3 sm:mb-4 text-white max-w-2xl drop-shadow-md">
              We Don&apos;t Gamble With Your Event&apos;s Atmosphere
            </h1>

            {/* Subtitle - Mobile optimized spacing */}
            <p className="font-sans text-slate-200 text-xs sm:text-base md:text-lg max-w-xl mb-6 sm:mb-8 leading-relaxed font-medium">
              Professional DJ services, premium sound, and seamless entertainment for events that leave a lasting impression.
            </p>

            {/* Hero CTAs - Full width buttons on small mobile */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-12 w-full sm:w-auto">
              <button
                onClick={handleBooking}
                className="bg-white text-black font-bold text-xs sm:text-sm px-6 py-3.5 rounded-none hover:bg-slate-200 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg"
              >
                Book Your Date
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('mixes')}
                className="text-white font-bold text-xs sm:text-sm px-4 py-3 hover:text-red-500 transition-colors duration-200 cursor-pointer uppercase tracking-wider underline underline-offset-8 text-center"
              >
                Explore Mixes
              </button>
            </div>

            {/* Stat Counters Grid - Optimized 2x2 for mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 border-t border-slate-800/80 w-full max-w-2xl">
              <div className="flex items-center gap-2.5">
                <Music className="w-4 h-4 text-red-500 shrink-0" />
                <div>
                  <p className="text-base sm:text-lg font-bold font-serif text-white leading-none">100+</p>
                  <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-1 font-bold">Mixes Recorded</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-red-500 shrink-0" />
                <div>
                  <p className="text-base sm:text-lg font-bold font-serif text-white leading-none">200+</p>
                  <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-1 font-bold">Events Powered</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-red-500 shrink-0" />
                <div>
                  <p className="text-base sm:text-lg font-bold font-serif text-white leading-none">150+</p>
                  <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-1 font-bold">Happy Clients</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-red-500 shrink-0" />
                <div>
                  <p className="text-base sm:text-lg font-bold font-serif text-white leading-none">PREMIUM</p>
                  <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-1 font-bold">Sound & Rig</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Bar ("TRUSTED BY") */}
      <section className="bg-[#04060a] py-8 sm:py-10 border-t border-slate-900 relative z-10">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16 text-center">
          <p className="font-mono text-[10px] sm:text-xs text-slate-500 uppercase tracking-[0.25em] mb-4 sm:mb-6 font-bold">
            TRUSTED BY
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 md:gap-14 opacity-60">
            {TRUST_VENUES.map((venue, idx) => (
              <div key={idx} className="text-center group">
                <span className="font-serif text-base sm:text-lg md:text-xl font-bold tracking-widest text-slate-300 group-hover:text-white transition-colors uppercase">
                  {venue.name}
                </span>
                {venue.location && (
                  <span className="block font-mono text-[9px] sm:text-[10px] text-slate-500 mt-0.5 font-bold">
                    {venue.location}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Problem / Solution Comparison */}
      <section className="py-12 sm:py-20 px-4 md:px-16 max-w-[1280px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="font-mono text-[10px] sm:text-xs text-red-500 uppercase tracking-[0.2em] mb-2 block font-bold">
            THE OVERKILL DIFFERENCE
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white tracking-tight font-bold capitalize">
            why your event&apos;s odds are at stake.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Problem Card */}
          <div className="bg-[#0b0f17] p-6 sm:p-8 border border-slate-800/60 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-900" />
            <span className="font-mono text-[10px] sm:text-xs text-red-400 uppercase tracking-wider block mb-2 font-bold">
              The Reality
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold mb-3 text-white">
              The Problem
            </h3>
            <p className="font-sans text-slate-400 mb-5 leading-relaxed font-normal text-xs sm:text-sm">
              Most DJs play for themselves, not the crowd. They ignore the vibe, kill the momentum, and leave your guests checking their watches.
            </p>
            <ul className="space-y-3 font-sans text-xs sm:text-sm text-slate-300 font-medium">
              <li className="flex items-center gap-3">
                <X className="w-4 h-4 text-red-500 shrink-0" />
                <span>Awkward, jarring track transitions & trainwrecks</span>
              </li>
              <li className="flex items-center gap-3">
                <X className="w-4 h-4 text-red-500 shrink-0" />
                <span>Ignoring the room&apos;s shifting demographics & energy</span>
              </li>
              <li className="flex items-center gap-3">
                <X className="w-4 h-4 text-red-500 shrink-0" />
                <span>Unreliable equipment, bad audio cables & amateur attitudes</span>
              </li>
            </ul>
          </div>

          {/* Solution Card */}
          <div className="bg-[#0b0f17] p-6 sm:p-8 border border-slate-700 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />
            <span className="font-mono text-[10px] sm:text-xs text-red-500 uppercase tracking-wider block mb-2 font-bold">
              The Standard
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold mb-3 text-white">
              The Solution
            </h3>
            <p className="font-sans text-slate-300 mb-5 leading-relaxed font-normal text-xs sm:text-sm">
              DJ Wolverine engineers the perfect atmosphere. From the first track to the encore, every beat is calculated to keep the floor moving.
            </p>
            <ul className="space-y-3 font-sans text-xs sm:text-sm text-slate-200 font-medium">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Seamless, high-energy mixing with custom club VIP edits</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Master crowd-reading ability calibrated in top clubs</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
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
            <span className="font-mono text-[10px] sm:text-xs text-red-500 uppercase tracking-[0.2em] mb-2 block font-bold">
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
            <div className="md:col-span-2 bg-[#0b0f17] p-6 sm:p-8 border border-slate-800">
              <Sliders className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mb-3 sm:mb-4" />
              <h3 className="font-serif text-lg sm:text-xl font-bold mb-2 text-white">
                Sonic Precision
              </h3>
              <p className="font-sans text-slate-400 font-normal text-xs sm:text-sm leading-relaxed">
                Every transition is flawless. We utilize industry-standard Pioneer CDJ-3000s & DJM-V10 mixers to ensure absolute audio clarity, harmonic key matching, and immense bass impact on any sound system.
              </p>
            </div>

            <div className="bg-[#0b0f17] p-6 sm:p-8 border border-slate-800">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mb-3 sm:mb-4" />
              <h3 className="font-serif text-lg sm:text-xl font-bold mb-2 text-white">
                Raw Energy
              </h3>
              <p className="font-sans text-slate-400 font-normal text-xs sm:text-sm leading-relaxed">
                We bring the intense, magnetic vibe of an underground club directly to your private party, wedding, or corporate stage.
              </p>
            </div>

            <div className="bg-[#0b0f17] p-6 sm:p-8 border border-slate-800">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mb-3 sm:mb-4" />
              <h3 className="font-serif text-lg sm:text-xl font-bold mb-2 text-white">
                Ironclad Reliability
              </h3>
              <p className="font-sans text-slate-400 font-normal text-xs sm:text-sm leading-relaxed">
                Punctual, fully insured, and prepared with dual backup hardware. We over-deliver because &apos;good enough&apos; is not in our vocabulary.
              </p>
            </div>

            <div className="md:col-span-2 bg-[#0b0f17] border border-slate-800 relative min-h-[160px] sm:min-h-[180px] flex items-center p-6 sm:p-8 overflow-hidden">
              <img
                src={DJ_ASSETS.djMixerGear}
                alt="DJ Wolverine Rig Setup"
                className="absolute inset-0 w-full h-full object-cover opacity-20"
              />
              <div className="relative z-10 max-w-lg">
                <span className="text-red-500 font-mono text-[10px] uppercase tracking-widest block mb-1.5 font-bold">
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
          <span className="font-mono text-[10px] sm:text-xs text-red-500 uppercase tracking-[0.2em] mb-2 block font-bold">
            DIRECT COMPARISON
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
            The Overkill Standard
          </h2>
          <p className="font-sans text-slate-400 font-normal text-xs sm:text-sm">
            See how DJ Wolverine compares against average options and standard playlist operators.
          </p>
        </div>

        <div className="overflow-x-auto border border-slate-800 bg-[#0b0f17]">
          <table className="w-full text-left border-collapse min-w-[500px] sm:min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="p-4 sm:p-5 font-serif text-xs sm:text-base text-slate-300 w-1/3 font-bold">Feature</th>
                <th className="p-4 sm:p-5 font-serif text-xs sm:text-base text-slate-500 w-1/3 text-center font-bold">
                  Playlist Apps / Average DJs
                </th>
                <th className="p-4 sm:p-5 font-serif text-xs sm:text-base text-red-500 w-1/3 text-center bg-red-950/20 border-x border-slate-800 font-bold">
                  Overkill (DJ Wolverine)
                </th>
              </tr>
            </thead>
            <tbody className="font-sans text-[11px] sm:text-sm">
              {COMPARISON_TABLE.map((row, i) => (
                <tr key={i} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-900/30 transition-colors">
                  <td className="p-4 sm:p-5 text-slate-200 font-semibold">{row.feature}</td>
                  <td className="p-4 sm:p-5 text-center text-slate-500 font-medium">{row.standardDjs}</td>
                  <td className="p-4 sm:p-5 text-center text-white bg-red-950/10 border-x border-slate-800 font-bold">
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
            className="w-full sm:w-auto bg-white text-black font-bold text-xs sm:text-sm px-8 py-4 rounded-none hover:bg-slate-200 transition-all duration-200 cursor-pointer uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-lg"
          >
            Secure Your Date With DJ Wolverine
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
