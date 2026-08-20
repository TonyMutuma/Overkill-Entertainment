import React from 'react';
import { NavTab, MixTrack } from '../types';
import { TRUST_VENUES, COMPARISON_TABLE, DJ_ASSETS, MIX_TRACKS } from '../data/mockData';
import { X, CheckCircle2, Sliders, Zap, ShieldCheck, ArrowUpRight, Play, Music, Calendar, Users, Volume2 } from 'lucide-react';

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
  onPlayFeaturedMix,
  currentPlayingId,
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
    <div className="w-full bg-[#070b11] text-white selection:bg-red-600 selection:text-white">
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden px-5 sm:px-8 md:px-16 pt-12 pb-16">
        {/* Background Image & Color Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src={DJ_ASSETS.heroBg}
            alt="DJ Wolverine"
            className="w-full h-full object-cover object-[75%_center] sm:object-right opacity-80"
          />
          {/* Responsive gradients: Darker on mobile for strong text legibility over DJ portrait */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b11] via-[#070b11]/90 sm:via-[#070b11]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b11] via-[#070b11]/40 to-transparent sm:hidden" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-[1280px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Red Eyebrow Label - Bold Mono Nightlife Badge */}
            <span className="text-red-500 font-mono text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] font-extrabold mb-3 sm:mb-4 drop-shadow-[0_0_12px_rgba(239,68,68,0.4)]">
              OVERKILL ENTERTAINMENT
            </span>

            {/* Main Headline Punchline - Bold, Premium Serif Display Font (Fluid Mobile Sizing) */}
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold leading-[1.1] sm:leading-[1.05] tracking-tight mb-5 sm:mb-6 text-white max-w-2xl drop-shadow-lg">
              Premium Sounds and Vibes on another level.
            </h1>

            {/* Subtitle - Bold Sans with Premium Contrast */}
            <p className="font-sans text-slate-100 text-base sm:text-lg md:text-xl max-w-lg mb-8 sm:mb-10 leading-relaxed font-bold tracking-wide">
              Professional DJ services, premium sound, and seamless entertainment for events that leave a lasting impression.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 mb-12 sm:mb-16 w-full sm:w-auto">
              <button
                onClick={handleBooking}
                className="bg-white text-black font-bold text-sm px-7 py-4 rounded-none hover:bg-slate-200 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg"
              >
                Book Your Date
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('mixes')}
                className="text-white font-bold text-sm px-4 py-3 sm:py-4 hover:text-red-500 transition-colors duration-200 cursor-pointer uppercase tracking-wider underline underline-offset-8 text-center"
              >
                Explore Mixes
              </button>
            </div>

            {/* Stat Counters Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 pt-8 border-t border-slate-800/80 w-full max-w-2xl">
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <p className="text-xl font-bold font-serif text-white leading-none">100+</p>
                  <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-slate-400 mt-1 font-bold">Mixes Recorded</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <p className="text-xl font-bold font-serif text-white leading-none">200+</p>
                  <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-slate-400 mt-1 font-bold">Events Powered</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <p className="text-xl font-bold font-serif text-white leading-none">150+</p>
                  <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-slate-400 mt-1 font-bold">Happy Clients</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <p className="text-xl font-bold font-serif text-white leading-none">PREMIUM</p>
                  <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-slate-400 mt-1 font-bold">Sound & Equipment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Bar ("TRUSTED BY") */}
      <section className="bg-[#04060a] py-12 border-t border-slate-900 relative z-10">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 text-center">
          <p className="font-mono text-xs text-slate-500 uppercase tracking-[0.3em] mb-8 font-bold">
            TRUSTED BY
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-60">
            {TRUST_VENUES.map((venue, idx) => (
              <div key={idx} className="text-center group">
                <span className="font-serif text-xl md:text-2xl font-bold tracking-widest text-slate-300 group-hover:text-white transition-colors uppercase">
                  {venue.name}
                </span>
                {venue.location && (
                  <span className="block font-mono text-[10px] text-slate-500 mt-1 font-bold">
                    {venue.location}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Problem / Solution Comparison */}
      <section className="py-24 px-6 md:px-16 max-w-[1280px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs text-red-500 uppercase tracking-[0.25em] mb-2 block font-bold">
            THE OVERKILL DIFFERENCE
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-white tracking-tight font-bold">
            Stop Gambling With Your Event&apos;s Atmosphere
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Problem Card */}
          <div className="bg-[#0b0f17] p-8 md:p-12 border border-slate-800/60 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-900" />
            <span className="font-mono text-xs text-red-400 uppercase tracking-wider block mb-2 font-bold">
              The Reality
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4 text-white">
              The Problem
            </h3>
            <p className="font-sans text-slate-400 mb-6 leading-relaxed font-normal">
              Most DJs play for themselves, not the crowd. They ignore the vibe, kill the momentum, and leave your guests checking their watches.
            </p>
            <ul className="space-y-4 font-sans text-sm text-slate-300 font-medium">
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
          <div className="bg-[#0b0f17] p-8 md:p-12 border border-slate-700 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />
            <span className="font-mono text-xs text-red-500 uppercase tracking-wider block mb-2 font-bold">
              The Standard
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4 text-white">
              The Solution
            </h3>
            <p className="font-sans text-slate-300 mb-6 leading-relaxed font-normal">
              DJ Wolverine engineers the perfect atmosphere. From the first track to the encore, every beat is calculated to keep the floor moving.
            </p>
            <ul className="space-y-4 font-sans text-sm text-slate-200 font-medium">
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
      <section className="py-24 bg-[#04060a] border-y border-slate-900">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16">
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-red-500 uppercase tracking-[0.25em] mb-2 block font-bold">
              CORE PRINCIPLES
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">
              Why Choose Overkill?
            </h2>
            <p className="font-sans text-slate-400 max-w-xl mx-auto font-normal">
              We don&apos;t just play music; we curate high-octane sonic experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-[#0b0f17] p-8 border border-slate-800">
              <Sliders className="w-6 h-6 text-red-500 mb-6" />
              <h3 className="font-serif text-2xl font-bold mb-3 text-white">
                Sonic Precision
              </h3>
              <p className="font-sans text-slate-400 font-normal leading-relaxed">
                Every transition is flawless. We utilize industry-standard Pioneer CDJ-3000s & DJM-V10 mixers to ensure absolute audio clarity, harmonic key matching, and immense bass impact on any sound system.
              </p>
            </div>

            <div className="bg-[#0b0f17] p-8 border border-slate-800">
              <Zap className="w-6 h-6 text-red-500 mb-6" />
              <h3 className="font-serif text-2xl font-bold mb-3 text-white">
                Raw Energy
              </h3>
              <p className="font-sans text-slate-400 font-normal leading-relaxed">
                We bring the intense, magnetic vibe of an underground club directly to your private party, wedding, or corporate stage.
              </p>
            </div>

            <div className="bg-[#0b0f17] p-8 border border-slate-800">
              <ShieldCheck className="w-6 h-6 text-red-500 mb-6" />
              <h3 className="font-serif text-2xl font-bold mb-3 text-white">
                Ironclad Reliability
              </h3>
              <p className="font-sans text-slate-400 font-normal leading-relaxed">
                Punctual, fully insured, and prepared with dual backup hardware. We over-deliver because &apos;good enough&apos; is not in our vocabulary.
              </p>
            </div>

            <div className="md:col-span-2 bg-[#0b0f17] border border-slate-800 relative min-h-[220px] flex items-center p-8 overflow-hidden">
              <img
                src={DJ_ASSETS.djMixerGear}
                alt="DJ Wolverine Rig Setup"
                className="absolute inset-0 w-full h-full object-cover opacity-20"
              />
              <div className="relative z-10 max-w-lg">
                <span className="text-red-500 font-mono text-[11px] uppercase tracking-widest block mb-2 font-bold">
                  Hardware & Rig
                </span>
                <h3 className="font-serif text-2xl font-bold mb-2 text-white">
                  Concert-Tier Setup
                </h3>
                <p className="font-sans text-slate-400 font-normal text-sm leading-relaxed">
                  State-of-the-art QSC active audio line arrays, Shure dual digital wireless microphones, and dynamic DMX-controlled lighting designed to elevate the venue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Comparison Table */}
      <section className="py-24 px-6 md:px-16 max-w-[1280px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs text-red-500 uppercase tracking-[0.25em] mb-2 block font-bold">
            DIRECT COMPARISON
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">
            The Overkill Standard
          </h2>
          <p className="font-sans text-slate-400 font-normal">
            See how DJ Wolverine compares against average options and standard playlist operators.
          </p>
        </div>

        <div className="overflow-x-auto border border-slate-800 bg-[#0b0f17]">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="p-6 font-serif text-lg text-slate-300 w-1/3 font-bold">Feature</th>
                <th className="p-6 font-serif text-lg text-slate-500 w-1/3 text-center font-bold">
                  Playlist Apps / Average DJs
                </th>
                <th className="p-6 font-serif text-lg text-red-500 w-1/3 text-center bg-red-950/20 border-x border-slate-800 font-bold">
                  Overkill (DJ Wolverine)
                </th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm">
              {COMPARISON_TABLE.map((row, i) => (
                <tr key={i} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-900/30 transition-colors">
                  <td className="p-6 text-slate-200 font-semibold">{row.feature}</td>
                  <td className="p-6 text-center text-slate-500 font-medium">{row.standardDjs}</td>
                  <td className="p-6 text-center text-white bg-red-950/10 border-x border-slate-800 font-bold">
                    {row.overkill}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-14 text-center">
          <button
            onClick={handleBooking}
            className="bg-white text-black font-bold text-sm px-8 py-4 rounded-none hover:bg-slate-200 transition-all duration-200 cursor-pointer uppercase tracking-wider inline-flex items-center gap-2 shadow-lg"
          >
            Secure Your Date With DJ Wolverine
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
