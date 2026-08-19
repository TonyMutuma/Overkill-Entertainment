import React from 'react';
import { NavTab } from '../types';
import { TRUST_VENUES, COMPARISON_TABLE, DJ_ASSETS } from '../data/mockData';
import { X, CheckCircle2, Sliders, Zap, ShieldCheck, ArrowRight, Play, Sparkles } from 'lucide-react';

interface HomeViewProps {
  setActiveTab: (tab: NavTab) => void;
  onOpenBooking: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setActiveTab, onOpenBooking }) => {
  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-6 md:px-16 pt-28 pb-16 md:py-32">
        {/* Atmospheric Background Image & Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src={DJ_ASSETS.heroBg}
            alt="DJ Wolverine Performance Background"
            className="w-full h-full object-cover opacity-35 mix-blend-luminosity scale-105"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/75 to-[#131313]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-transparent to-[#131313]" />
          {/* Electric Glow Orbs */}
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#00daf8]/10 rounded-full blur-[140px] pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1040px] mx-auto text-center flex flex-col items-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-[#00e0ff]/10 border border-[#00daf8]/30 px-4 py-1.5 rounded-full mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#00daf8] animate-pulse" />
            <span className="font-mono-jb text-xs text-[#baf2ff] uppercase tracking-widest font-semibold">
              Resident Selector: DJ Wolverine
            </span>
          </div>

          {/* Massive Display Heading */}
          <h1 className="font-sora text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-extrabold text-[#e5e2e1] leading-[1.08] tracking-[-0.035em] mb-6 max-w-4xl">
            Need a DJ Who Can{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#baf2ff] via-[#00daf8] to-[#00e0ff] text-glow">
              Read the Room
            </span>{' '}
            and Keep the Floor Full All Night?
          </h1>

          {/* Subheading */}
          <p className="font-hanken text-lg sm:text-xl md:text-2xl text-[#bac9cd] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            That&apos;s DJ Wolverine. Elite sound selection. Uncompromising energy. Professional execution.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('calendar')}
              className="w-full sm:w-auto bg-[#00e0ff] text-[#00363f] font-sora text-base font-bold px-8 py-4 rounded-lg hover:shadow-[0_0_30px_rgba(0,224,255,0.6)] hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              Check Available Dates
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('mixes')}
              className="w-full sm:w-auto border-2 border-[#00daf8]/50 text-[#baf2ff] font-sora text-base font-bold px-8 py-4 rounded-lg hover:border-[#00daf8] hover:bg-[#00daf8]/10 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Listen to Live Sets
            </button>
          </div>
        </div>
      </section>

      {/* 2. Trust Bar ("AS HEARD AT") */}
      <section className="bg-[#201f1f]/70 py-10 border-y border-white/5 relative z-10 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 text-center">
          <p className="font-mono-jb text-xs text-[#bac9cd]/70 uppercase tracking-widest mb-6">
            As Heard At Premier Venues & Festivals
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
            {TRUST_VENUES.map((venue, idx) => (
              <div key={idx} className="group text-center">
                <span className="font-sora text-lg md:text-2xl font-bold tracking-tight text-[#e5e2e1] group-hover:text-[#00daf8] transition-colors">
                  {venue.name}
                </span>
                <span className="block font-mono-jb text-[10px] text-[#bac9cd]/50 mt-0.5">
                  {venue.location}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Problem / Solution Comparison */}
      <section className="py-24 md:py-32 px-6 md:px-16 max-w-[1280px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono-jb text-xs text-[#00daf8] uppercase tracking-widest mb-2 block">
            The Overkill Difference
          </span>
          <h2 className="font-sora text-3xl md:text-5xl font-bold text-[#e5e2e1] tracking-tight">
            Stop Gambling With Your Event&apos;s Atmosphere
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Problem Card */}
          <div className="bg-[#201f1f]/80 p-8 md:p-12 rounded-xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#93000a]" />
            <span className="font-mono-jb text-xs text-[#ffb4ab] uppercase tracking-wider block mb-2">
              The Reality
            </span>
            <h3 className="font-sora text-2xl md:text-3xl font-bold mb-4 text-[#ffdad6]">
              The Problem
            </h3>
            <p className="font-hanken text-base md:text-lg text-[#bac9cd] mb-6 leading-relaxed">
              Most DJs play for themselves, not the crowd. They ignore the vibe, kill the momentum, and leave your guests checking their watches.
            </p>
            <ul className="space-y-4 font-hanken text-base text-[#bac9cd]/90">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-red-950/80 flex items-center justify-center text-[#ffb4ab] shrink-0">
                  <X className="w-4 h-4" />
                </div>
                <span>Awkward, jarring track transitions & trainwrecks</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-red-950/80 flex items-center justify-center text-[#ffb4ab] shrink-0">
                  <X className="w-4 h-4" />
                </div>
                <span>Ignoring the room&apos;s shifting demographics & energy</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-red-950/80 flex items-center justify-center text-[#ffb4ab] shrink-0">
                  <X className="w-4 h-4" />
                </div>
                <span>Unreliable equipment, bad audio cables & amateur attitudes</span>
              </li>
            </ul>
          </div>

          {/* Solution Card */}
          <div className="bg-[#1c1b1b] p-8 md:p-12 rounded-xl border border-[#00daf8]/30 relative overflow-hidden shadow-[0_0_40px_rgba(0,218,248,0.1)] group">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#00e0ff]" />
            <span className="font-mono-jb text-xs text-[#00daf8] uppercase tracking-wider block mb-2">
              The Standard
            </span>
            <h3 className="font-sora text-2xl md:text-3xl font-bold mb-4 text-[#baf2ff]">
              The Solution
            </h3>
            <p className="font-hanken text-base md:text-lg text-[#e5e2e1] mb-6 leading-relaxed">
              DJ Wolverine engineers the perfect atmosphere. From the first track to the encore, every beat is calculated to keep the floor moving.
            </p>
            <ul className="space-y-4 font-hanken text-base text-[#e5e2e1]">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#00daf8]/20 flex items-center justify-center text-[#00daf8] shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>Seamless, high-energy mixing with custom club VIP edits</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#00daf8]/20 flex items-center justify-center text-[#00daf8] shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>Master crowd-reading ability calibrated in top clubs</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#00daf8]/20 flex items-center justify-center text-[#00daf8] shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>Elite-tier professional reliability & concert audio gear</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. "Why Choose Overkill?" Bento Grid */}
      <section className="py-24 bg-[#0e0e0e] border-y border-white/5">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16">
          <div className="text-center mb-16">
            <span className="font-mono-jb text-xs text-[#00daf8] uppercase tracking-widest mb-2 block">
              Core Principles
            </span>
            <h2 className="font-sora text-3xl md:text-5xl font-extrabold text-[#e5e2e1] mb-4">
              Why Choose Overkill?
            </h2>
            <p className="font-hanken text-lg text-[#bac9cd] max-w-xl mx-auto">
              We don&apos;t just play music; we curate high-octane sonic experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento 1: Sonic Precision */}
            <div className="md:col-span-2 bg-[#201f1f]/90 p-8 rounded-xl border border-white/5 relative group overflow-hidden glow-hover">
              <div className="w-12 h-12 rounded-lg bg-[#00daf8]/15 text-[#00daf8] flex items-center justify-center mb-6">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="font-sora text-2xl font-bold mb-3 text-[#e5e2e1]">
                Sonic Precision
              </h3>
              <p className="font-hanken text-base text-[#bac9cd] leading-relaxed max-w-xl">
                Every transition is flawless. We utilize industry-standard Pioneer CDJ-3000s & DJM-V10 mixers to ensure absolute audio clarity, harmonic key matching, and immense bass impact on any sound system.
              </p>
            </div>

            {/* Bento 2: Raw Energy */}
            <div className="bg-[#201f1f]/90 p-8 rounded-xl border border-white/5 relative group overflow-hidden glow-hover">
              <div className="w-12 h-12 rounded-lg bg-[#00daf8]/15 text-[#00daf8] flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-sora text-2xl font-bold mb-3 text-[#e5e2e1]">
                Raw Energy
              </h3>
              <p className="font-hanken text-base text-[#bac9cd] leading-relaxed">
                We bring the intense, magnetic vibe of an underground club directly to your private party, wedding, or corporate stage.
              </p>
            </div>

            {/* Bento 3: Ironclad Reliability */}
            <div className="bg-[#201f1f]/90 p-8 rounded-xl border border-white/5 relative group overflow-hidden glow-hover">
              <div className="w-12 h-12 rounded-lg bg-[#00daf8]/15 text-[#00daf8] flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-sora text-2xl font-bold mb-3 text-[#e5e2e1]">
                Ironclad Reliability
              </h3>
              <p className="font-hanken text-base text-[#bac9cd] leading-relaxed">
                Punctual, fully insured, and prepared with dual backup hardware. We over-deliver because &apos;good enough&apos; is not in our vocabulary.
              </p>
            </div>

            {/* Bento 4: The Setup */}
            <div className="md:col-span-2 rounded-xl border border-white/10 relative group overflow-hidden min-h-[260px] flex items-center p-8 md:p-10">
              <img
                src={DJ_ASSETS.djMixerGear}
                alt="DJ Wolverine Rig Setup"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-40 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/90 to-transparent" />
              <div className="relative z-10 max-w-lg">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#00daf8]/20 text-[#00daf8] font-mono-jb text-[11px] uppercase mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Hardware & Rig
                </div>
                <h3 className="font-sora text-2xl md:text-3xl font-bold mb-2 text-[#e5e2e1]">
                  Concert-Tier Setup
                </h3>
                <p className="font-hanken text-base text-[#bac9cd] leading-relaxed">
                  State-of-the-art QSC active audio line arrays, Shure dual digital wireless microphones, and dynamic DMX-controlled lighting designed to elevate the venue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. The Overkill Standard Comparison Table */}
      <section className="py-24 md:py-32 px-6 md:px-16 max-w-[1280px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono-jb text-xs text-[#00daf8] uppercase tracking-widest mb-2 block">
            Direct Comparison
          </span>
          <h2 className="font-sora text-3xl md:text-5xl font-extrabold text-[#e5e2e1] mb-4">
            The Overkill Standard
          </h2>
          <p className="font-hanken text-lg text-[#bac9cd]">
            See how DJ Wolverine compares against average options and standard playlist operators.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#1c1b1b]/80 shadow-2xl">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-6 font-sora text-lg text-[#bac9cd] w-1/3">Feature</th>
                <th className="p-6 font-sora text-lg text-[#bac9cd]/70 w-1/3 text-center">
                  Playlist Apps / Average DJs
                </th>
                <th className="p-6 font-sora text-lg text-[#00daf8] w-1/3 text-center bg-[#00daf8]/10 border-x border-[#00daf8]/30">
                  Overkill (DJ Wolverine)
                </th>
              </tr>
            </thead>
            <tbody className="font-hanken text-base">
              {COMPARISON_TABLE.map((row, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="p-6 font-semibold text-[#e5e2e1]">{row.feature}</td>
                  <td className="p-6 text-center text-[#bac9cd]/60">{row.standardDjs}</td>
                  <td className="p-6 text-center text-[#baf2ff] bg-[#00daf8]/5 border-x border-[#00daf8]/30 font-semibold">
                    {row.overkill}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Button */}
        <div className="mt-14 text-center">
          <button
            onClick={onOpenBooking}
            className="bg-[#00e0ff] text-[#00363f] font-sora text-lg font-bold px-10 py-5 rounded-lg hover:scale-105 hover:shadow-[0_0_35px_rgba(0,224,255,0.5)] transition-all duration-300 cursor-pointer uppercase tracking-wider inline-flex items-center gap-3"
          >
            Secure Your Date With DJ Wolverine
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};
