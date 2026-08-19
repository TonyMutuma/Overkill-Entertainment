import React, { useState } from 'react';
import { DJ_ASSETS } from '../data/mockData';
import { ChevronLeft, ChevronRight, CheckCircle2, Lock, HelpCircle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

interface CalendarViewProps {
  onSelectDateForBooking: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onSelectDateForBooking }) => {
  // Calendar state
  const [currentMonthIndex, setCurrentMonthIndex] = useState(10); // 10 = Nov
  const [currentYear, setCurrentYear] = useState(2024);
  const [selectedDay, setSelectedDay] = useState<number>(15);
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Booked days mapping for realistic simulation
  const bookedDaysByMonth: Record<number, number[]> = {
    9: [4, 5, 11, 12, 18, 19, 25, 26], // Oct
    10: [2, 8, 9, 16, 23, 28], // Nov (matches design screenshot)
    11: [6, 7, 13, 14, 20, 21, 24, 25, 31], // Dec
    0: [1, 10, 11, 17, 18, 24, 25] // Jan
  };

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const totalDays = daysInMonth(currentMonthIndex, currentYear);
  const startDay = firstDayOfMonth(currentMonthIndex, currentYear);
  const prevMonthTotalDays = daysInMonth(currentMonthIndex === 0 ? 11 : currentMonthIndex - 1, currentYear);

  const bookedList = bookedDaysByMonth[currentMonthIndex] || [2, 8, 9, 16, 23];

  const getDayOfWeekName = (day: number) => {
    const d = new Date(currentYear, currentMonthIndex, day);
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const selectedDateFormatted = `${getDayOfWeekName(selectedDay)}, ${months[currentMonthIndex].slice(0, 3)} ${selectedDay}`;
  const isSelectedDayBooked = bookedList.includes(selectedDay);

  const handleDayClick = (dayNum: number, isBooked: boolean) => {
    if (isBooked) return;
    setSelectedDay(dayNum);
  };

  const handleRequestDate = () => {
    const dateFormatted = `${months[currentMonthIndex]} ${selectedDay}, ${currentYear}`;
    onSelectDateForBooking(dateFormatted);
  };

  return (
    <div className="w-full pt-28 pb-24 md:pb-32 px-6 md:px-16 max-w-[1280px] mx-auto">
      {/* 1. Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#201f1f] border border-white/10 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#00daf8] animate-pulse" />
          <span className="font-mono-jb text-xs text-[#baf2ff] uppercase tracking-widest font-semibold">
            Live Availability
          </span>
        </div>

        <h1 className="font-sora text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold text-[#e5e2e1] mb-6 leading-tight">
          Is DJ Wolverine Available for Your Date?
        </h1>

        <p className="font-hanken text-lg text-[#bac9cd] max-w-2xl mx-auto">
          Check real-time availability and secure your booking. High-demand dates are marked and fill up months in advance.
        </p>
      </div>

      {/* 2. Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Left Column: Calendar Widget */}
        <div className="lg:col-span-7 glass-panel rounded-xl p-6 md:p-8 relative overflow-hidden group">
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00daf8]/40 rounded-tl-xl opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00daf8]/40 rounded-tr-xl opacity-50 group-hover:opacity-100 transition-opacity" />

          {/* Month Controls */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handlePrevMonth}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#201f1f] hover:bg-[#353534] border border-white/5 text-[#bac9cd] hover:text-[#00daf8] transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center">
              <h3 className="font-sora text-2xl font-bold text-[#e5e2e1] tracking-tight">
                {months[currentMonthIndex]} {currentYear}
              </h3>
              <p className="font-mono-jb text-xs text-[#00daf8] mt-1 font-semibold">
                Eastern / Pacific Tour Route
              </p>
            </div>

            <button
              onClick={handleNextMonth}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#201f1f] hover:bg-[#353534] border border-white/5 text-[#bac9cd] hover:text-[#00daf8] transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
              <div
                key={d}
                className="text-center text-[#bac9cd]/70 font-mono-jb text-xs font-semibold py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {/* Previous month filler */}
            {[...Array(startDay)].map((_, i) => {
              const day = prevMonthTotalDays - startDay + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  className="aspect-square flex items-center justify-center rounded bg-[#353534]/20 border border-white/5 font-mono-jb text-sm text-[#bac9cd]/25 pointer-events-none"
                >
                  {day}
                </div>
              );
            })}

            {/* Current month days */}
            {[...Array(totalDays)].map((_, i) => {
              const dayNum = i + 1;
              const isBooked = bookedList.includes(dayNum);
              const isSelected = selectedDay === dayNum && !isBooked;

              return (
                <button
                  key={`day-${dayNum}`}
                  onClick={() => handleDayClick(dayNum, isBooked)}
                  disabled={isBooked}
                  className={`aspect-square flex flex-col items-center justify-center rounded relative font-mono-jb text-sm transition-all duration-200 cursor-pointer ${
                    isBooked
                      ? 'text-[#555657] bg-[#1c1b1b]/50 line-through cursor-not-allowed border border-transparent'
                      : isSelected
                      ? 'bg-[#00daf8]/20 border border-[#00daf8] text-[#baf2ff] shadow-[inset_0_0_15px_rgba(0,218,248,0.3)] font-bold'
                      : 'bg-[#353534]/30 border border-white/5 text-[#e5e2e1] hover:bg-[#baf2ff]/10 hover:border-[#00daf8]/40'
                  }`}
                >
                  <span>{dayNum}</span>
                  {!isBooked && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                        isSelected ? 'bg-[#baf2ff]' : 'bg-[#00daf8] shadow-[0_0_8px_#00daf8]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-8 pt-4 border-t border-white/5 font-mono-jb text-xs text-[#bac9cd]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#00daf8] shadow-[0_0_8px_#00daf8]" />
              <span>Available for Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#353534] border border-white/10" />
              <span className="line-through text-[#bac9cd]/60">Booked / Reserved</span>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Date Action & FAQ */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Selected Date Card */}
          <div className="glass-panel rounded-xl p-6 md:p-8 border border-[#00daf8]/30 relative overflow-hidden shadow-[0_0_30px_rgba(0,218,248,0.1)]">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#00daf8]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="mb-6">
              <p className="font-mono-jb text-xs text-[#00daf8] uppercase tracking-wider mb-2 font-semibold">
                Selected Date
              </p>
              <h2 className="font-sora text-3xl font-extrabold text-[#e5e2e1] mb-2">
                {selectedDateFormatted}
              </h2>
              {isSelectedDayBooked ? (
                <p className="font-hanken text-sm text-red-400 flex items-center gap-2">
                  This date is currently reserved. Please choose another date.
                </p>
              ) : (
                <p className="font-hanken text-sm text-[#bac9cd] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00daf8]" />
                  Date is currently open for private/club booking
                </p>
              )}
            </div>

            {/* Deposit notice */}
            <div className="bg-[#2a2a2a]/90 rounded-lg p-4 mb-6 border border-white/5">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-[#c6c6c7] shrink-0 mt-0.5" />
                <div>
                  <p className="font-sora text-sm font-bold text-[#e5e2e1] mb-1">
                    Deposit Required to Lock Date
                  </p>
                  <p className="font-hanken text-xs text-[#bac9cd] leading-relaxed">
                    A 50% deposit secures this date on DJ Wolverine&apos;s master tour schedule. Dates are not held without contract execution and confirmed deposit.
                  </p>
                </div>
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={handleRequestDate}
              disabled={isSelectedDayBooked}
              className="w-full py-4 bg-[#00e0ff] text-[#00363f] font-sora text-base font-bold rounded hover:shadow-[0_0_25px_rgba(0,224,255,0.6)] hover:scale-[1.02] transition-all duration-300 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Request This Date
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Booking FAQ Accordion */}
          <div className="glass-panel rounded-xl p-6 flex-grow flex flex-col justify-center">
            <h3 className="font-sora text-lg font-bold text-[#e5e2e1] mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#00daf8]" />
              Booking Protocols
            </h3>

            <div className="space-y-3 font-hanken">
              {/* FAQ Item 1 */}
              <div className="border-b border-white/10 pb-3">
                <button
                  onClick={() => setOpenFaqId(openFaqId === 1 ? null : 1)}
                  className="w-full flex justify-between items-center text-left py-1 text-[#e5e2e1] hover:text-[#00daf8] transition-colors cursor-pointer text-sm font-semibold"
                >
                  <span>How Far in Advance Should I Book?</span>
                  {openFaqId === 1 ? <ChevronUp className="w-4 h-4 text-[#00daf8]" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openFaqId === 1 && (
                  <div className="pt-2 text-xs text-[#bac9cd] leading-relaxed animate-in fade-in duration-150">
                    For prime weekend dates (Friday/Saturday) during peak seasons, we recommend securing your date 4–10 months in advance. Weekday or off-peak dates can frequently be accommodated on shorter turnaround.
                  </div>
                )}
              </div>

              {/* FAQ Item 2 */}
              <div className="border-b border-white/10 pb-3">
                <button
                  onClick={() => setOpenFaqId(openFaqId === 2 ? null : 2)}
                  className="w-full flex justify-between items-center text-left py-1 text-[#e5e2e1] hover:text-[#00daf8] transition-colors cursor-pointer text-sm font-semibold"
                >
                  <span>What Happens After I Submit?</span>
                  {openFaqId === 2 ? <ChevronUp className="w-4 h-4 text-[#00daf8]" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openFaqId === 2 && (
                  <div className="pt-2 text-xs text-[#bac9cd] leading-relaxed animate-in fade-in duration-150">
                    Our tour management team verifies venue technical compatibility within 24 hours, issues the contract rider, and sends a secure deposit link to lock the calendar.
                  </div>
                )}
              </div>

              {/* FAQ Item 3 */}
              <div>
                <button
                  onClick={() => setOpenFaqId(openFaqId === 3 ? null : 3)}
                  className="w-full flex justify-between items-center text-left py-1 text-[#e5e2e1] hover:text-[#00daf8] transition-colors cursor-pointer text-sm font-semibold"
                >
                  <span>Multi-City & Tour Dates?</span>
                  {openFaqId === 3 ? <ChevronUp className="w-4 h-4 text-[#00daf8]" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openFaqId === 3 && (
                  <div className="pt-2 text-xs text-[#bac9cd] leading-relaxed animate-in fade-in duration-150">
                    We routinely handle multi-city corporate roadshows, festival tours, and destination luxury weddings with full flight & logistics management.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Ambient DJ Gear Banner */}
      <div className="w-full h-72 rounded-xl overflow-hidden relative border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent z-10" />
        <img
          src={DJ_ASSETS.djMixerGear}
          alt="DJ Wolverine Pioneer Hardware Setup"
          className="w-full h-full object-cover opacity-50 mix-blend-luminosity hover:opacity-75 transition-opacity duration-700"
        />
        <div className="absolute bottom-6 left-6 z-20 max-w-lg">
          <span className="font-mono-jb text-[11px] text-[#00daf8] uppercase tracking-wider block mb-1">
            Production Quality
          </span>
          <p className="font-sora text-lg font-bold text-[#e5e2e1]">
            Standard Rig: Dual Pioneer CDJ-3000s + DJM-V10 Mixer + High-Definition Active Line Arrays
          </p>
        </div>
      </div>
    </div>
  );
};
