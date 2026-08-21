import React, { useState } from 'react';
import { DJ_ASSETS } from '../data/mockData';
import { ChevronLeft, ChevronRight, CheckCircle2, Lock, HelpCircle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

interface CalendarViewProps {
  onSelectDateForBooking?: (dateStr: string) => void;
  onNavigateToBooking?: () => void;
  onNavigateToServices?: () => void;
  onNavigateToFaq?: () => void;
  setActiveTab?: (tab: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  onSelectDateForBooking,
  onNavigateToBooking,
  onNavigateToServices,
  onNavigateToFaq,
  setActiveTab
}) => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(10);
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState<number>(15);
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const bookedDaysByMonth: Record<number, number[]> = { 9:[4,5,11,12,18,19,25,26], 10:[2,8,9,16,23,28], 11:[6,7,13,14,20,21,24,25,31], 0:[1,10,11,17,18,24,25] };

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) { setCurrentMonthIndex(11); setCurrentYear(currentYear - 1); } else setCurrentMonthIndex(currentMonthIndex - 1);
  };
  const handleNextMonth = () => {
    if (currentMonthIndex === 11) { setCurrentMonthIndex(0); setCurrentYear(currentYear + 1); } else setCurrentMonthIndex(currentMonthIndex + 1);
  };

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();
  const totalDays = daysInMonth(currentMonthIndex, currentYear);
  const startDay = firstDayOfMonth(currentMonthIndex, currentYear);
  const prevMonthTotalDays = daysInMonth(currentMonthIndex === 0 ? 11 : currentMonthIndex - 1, currentYear);
  const bookedList = bookedDaysByMonth[currentMonthIndex] || [2,8,9,16,23];
  const getDayOfWeekName = (day: number) => new Date(currentYear, currentMonthIndex, day).toLocaleDateString('en-US', { weekday: 'long' });
  const selectedDateFormatted = `${getDayOfWeekName(selectedDay)}, ${months[currentMonthIndex].slice(0,3)} ${selectedDay}`;
  const isSelectedDayBooked = bookedList.includes(selectedDay);
  const handleDayClick = (dayNum: number, isBooked: boolean) => { if (isBooked) return; setSelectedDay(dayNum); };
  const handleRequestDate = () => {
    const dateFormatted = `${months[currentMonthIndex]} ${selectedDay}, ${currentYear}`;
    if (onSelectDateForBooking) onSelectDateForBooking(dateFormatted);
    else if (onNavigateToBooking) onNavigateToBooking();
    else if (setActiveTab) setActiveTab('services');
  };

  return (
    <div className="w-full bg-[#070b11] text-white">
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-28 sm:pt-32 pb-8 sm:pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0b0f17] border-2 border-slate-700/60 mb-6">
          <span className="w-2 h-2 bg-blue-500 animate-pulse" />
          <span className="font-mono text-[10px] sm:text-xs text-white uppercase tracking-widest font-bold">Live Availability</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-[1.05] tracking-tight max-w-3xl mx-auto">
          Is DJ Wolverine Available for <span className="text-blue-500">Your Date?</span>
        </h1>
        <p className="font-sans text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto mt-4">Check real-time availability and secure your booking. High-demand dates are marked and fill up months in advance.</p>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pb-10 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="lg:col-span-7 bg-[#0b0f17] border-2 border-slate-700/60 p-4 sm:p-6 md:p-8 relative overflow-hidden">
            <img src={DJ_ASSETS.rooftopSunset} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.06] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0b0f17] via-[#0b0f17]/85 to-transparent pointer-events-none" />
            <div className="flex justify-between items-center mb-6 sm:mb-8 relative">
              <button onClick={handlePrevMonth} className="w-10 h-10 flex items-center justify-center bg-[#04060a] border-2 border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"><ChevronLeft className="w-5 h-5" /></button>
              <div className="text-center">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">{months[currentMonthIndex]} {currentYear}</h3>
                <p className="font-mono text-[10px] sm:text-xs text-blue-500 mt-1 font-bold uppercase tracking-widest">Nairobi & Regional Tour Route</p>
              </div>
              <button onClick={handleNextMonth} className="w-10 h-10 flex items-center justify-center bg-[#04060a] border-2 border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"><ChevronRight className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3">
              {['SUN','MON','TUE','WED','THU','FRI','SAT'].map((d) => <div key={d} className="text-center text-slate-500 font-mono text-[10px] sm:text-xs font-bold py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-6">
              {[...Array(startDay)].map((_, i) => {
                const day = prevMonthTotalDays - startDay + i + 1;
                return <div key={`prev-${i}`} className="aspect-square flex items-center justify-center bg-[#04060a] border-2 border-slate-700/30 font-mono text-xs sm:text-sm text-slate-600">{day}</div>;
              })}
              {[...Array(totalDays)].map((_, i) => {
                const dayNum = i + 1;
                const isBooked = bookedList.includes(dayNum);
                const isSelected = selectedDay === dayNum && !isBooked;
                return (
                  <button key={`day-${dayNum}`} onClick={() => handleDayClick(dayNum, isBooked)} disabled={isBooked} className={`aspect-square flex flex-col items-center justify-center font-mono text-xs sm:text-sm transition-colors cursor-pointer border ${isBooked ? 'text-slate-600 bg-[#04060a] border-slate-700/30 line-through cursor-not-allowed' : isSelected ? 'bg-white text-black border-white font-bold' : 'bg-[#04060a] border-slate-700/60 text-white hover:bg-white hover:text-black'}`}>
                    <span>{dayNum}</span>
                    {!isBooked && <span className={`w-1 h-1 mt-1 ${isSelected ? 'bg-black' : 'bg-blue-500'}`} />}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-4 border-t border-slate-700/60 font-mono text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-bold">
              <div className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-500" /> Available</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 bg-slate-700" /> <span className="line-through">Booked / Reserved</span></div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6">
            <div className="bg-[#0b0f17] border-2 border-slate-700/60 p-6 sm:p-8 relative overflow-hidden">
              <img src={DJ_ASSETS.luxuryWedding} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.07] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0b0f17] via-[#0b0f17]/85 to-transparent pointer-events-none" />
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/10 blur-2xl pointer-events-none" />
              <p className="font-mono text-[10px] sm:text-xs text-blue-500 uppercase tracking-widest mb-2 font-bold relative">Selected Date</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mb-2">{selectedDateFormatted}</h2>
              {isSelectedDayBooked ? <p className="font-sans text-sm text-blue-400 flex items-center gap-2">This date is currently reserved.</p> : <p className="font-sans text-sm text-slate-400 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />Date is currently open for booking</p>}
              <div className="bg-[#04060a] border-2 border-slate-700/60 p-4 mt-6 mb-6">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-serif text-sm font-bold text-white mb-1">Deposit Required to Lock Date</p>
                    <p className="font-sans text-xs text-slate-400 leading-relaxed">A 50% deposit secures this date on DJ Wolverine's master tour schedule. Dates are not held without contract and confirmed deposit.</p>
                  </div>
                </div>
              </div>
              <button onClick={handleRequestDate} disabled={isSelectedDayBooked} className="w-full py-4 bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                Request This Date <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#0b0f17] border-2 border-slate-700/60 p-6 relative overflow-hidden">
              <img src={DJ_ASSETS.corporateLounge} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.07] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0b0f17] via-[#0b0f17]/90 to-transparent pointer-events-none" />
              <h3 className="font-serif text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2 relative"><HelpCircle className="w-5 h-5 text-blue-500" /> Booking Protocols</h3>
              <div className="space-y-3 font-sans">
                {[
                  { id:1, q:'How Far in Advance Should I Book?', a:'For prime weekend dates (Friday/Saturday) during peak seasons, secure your date 4–10 months in advance. Weekday dates can often be accommodated faster.' },
                  { id:2, q:'What Happens After I Submit?', a:'Our tour management verifies venue tech compatibility within 24 hours, issues the contract rider, and sends a secure deposit link.' },
                  { id:3, q:'Multi-City & Tour Dates?', a:'We routinely handle multi-city corporate roadshows, festival tours, and destination luxury weddings with full logistics management.' },
                ].map((faq)=>(
                  <div key={faq.id} className="border-b border-slate-700/60 last:border-0 pb-3 last:pb-0">
                    <button onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)} className="w-full flex justify-between items-center text-left py-1 text-white hover:text-blue-400 transition-colors cursor-pointer text-sm font-semibold">
                      <span>{faq.q}</span>{openFaqId === faq.id ? <ChevronUp className="w-4 h-4 text-blue-500 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                    </button>
                    {openFaqId === faq.id && <div className="pt-2 text-xs text-slate-400 leading-relaxed">{faq.a}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pb-20 sm:pb-28">
        <div className="w-full h-56 sm:h-72 overflow-hidden relative border-2 border-slate-700/60">
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b11] via-transparent to-transparent z-10" />
          <img src={DJ_ASSETS.djMixerGear} alt="DJ Hardware" className="w-full h-full object-cover opacity-40" />
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 z-20 max-w-lg pr-4">
            <span className="font-mono text-[10px] text-blue-500 uppercase tracking-widest font-bold block mb-1">Production Quality</span>
            <p className="font-serif text-base sm:text-lg font-bold text-white">Standard Rig: Dual Pioneer CDJ-3000s + DJM-V10 Mixer + High-Definition Active Line Arrays</p>
          </div>
        </div>
      </section>
    </div>
  );
};
