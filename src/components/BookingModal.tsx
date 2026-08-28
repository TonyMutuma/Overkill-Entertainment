import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Music2, Sparkles, Mail, Check, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, Info, Clock, CheckCircle } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { useCurrency } from '../context/CurrencyContext';
import { VertexCorners } from './VertexCorners';
import { api } from '../utils/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPackageId?: string;
  initialDate?: string;
  initialAddOns?: string[];
}

const TIME_SLOTS = ['16:00', '18:00', '20:00', '22:00'];
const STEP_LABELS = ['Date', 'Time', 'Location', 'Event Type', 'Contact'];

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialPackageId = 'corporate',
  initialDate,
  initialAddOns = [],
}) => {
  const { formatAmount } = useCurrency();
  const { servicePackages, addBookingInquiry } = useCMS();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const [selectedDate, setSelectedDate] = useState(initialDate || '');
  const [selectedTime, setSelectedTime] = useState('');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [selectedPkgId, setSelectedPkgId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [viewYear, setViewYear] = useState(
    initialDate ? new Date(initialDate).getFullYear() : today.getFullYear()
  );
  const [viewMonthIdx, setViewMonthIdx] = useState(
    initialDate ? new Date(initialDate).getMonth() : today.getMonth()
  );

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setDirection('next');
      setSelectedDate(initialDate || '');
      setSelectedTime('');
      setVenue('');
      setCity('');
      setSelectedPkgId('');
      setName('');
      setEmail('');
      setIsSubmitted(false);
      setViewYear(initialDate ? new Date(initialDate).getFullYear() : today.getFullYear());
      setViewMonthIdx(initialDate ? new Date(initialDate).getMonth() : today.getMonth());
    }
  }, [isOpen, initialDate]);

  if (!isOpen) return null;

  const currentPkg =
    servicePackages.find((p) => p.id === selectedPkgId) ||
    servicePackages[0] || { id: 'custom', name: 'Custom Session', price: 1500, features: [], pricePeriod: '/event' };
  const totalCost = currentPkg.price;
  const deposit = Math.round(totalCost * 0.5);

  // ── Calendar helpers ──
  const firstDay = new Date(viewYear, viewMonthIdx, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonthIdx + 1, 0).getDate();
  const monthLabel = new Date(viewYear, viewMonthIdx, 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });
  const prevDisabled =
    viewYear < today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonthIdx <= today.getMonth());

  const changeMonth = (delta: number) => {
    let m = viewMonthIdx + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    else if (m > 11) { m = 0; y += 1; }
    if (y < today.getFullYear() || (y === today.getFullYear() && m < today.getMonth())) return;
    setViewMonthIdx(m);
    setViewYear(y);
  };

  const isPast = (d: number) => new Date(viewYear, viewMonthIdx, d) < today;
  const cellDate = (d: number) => `${viewYear}-${pad(viewMonthIdx + 1)}-${pad(d)}`;

  // ── Validation per step ──
  const stepValid =
    step === 0 ? !!selectedDate :
    step === 1 ? !!selectedTime :
    step === 2 ? !!(venue.trim() && city.trim()) :
    step === 3 ? !!selectedPkgId :
    step === 4 ? /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()) :
    false;

  const goNext = () => {
    if (!stepValid) return;
    setDirection('next');
    setStep((s) => Math.min(s + 1, 4));
  };
  const goBack = () => {
    setDirection('prev');
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stepValid) return;
    setIsSubmitting(true);
    const payload = {
      clientName: name.trim() || 'Direct Web Client',
      email: email.trim(),
      phone: '',
      eventType: currentPkg.name,
      eventDate: `${selectedDate} @ ${selectedTime}`,
      venueName: venue.trim(),
      venueCity: city.trim(),
      guestCount: 150,
      selectedPackage: selectedPkgId,
      selectedAddOns: initialAddOns,
      specialRequests: `Preferred time: ${selectedTime}. Submitted via public multi-step wizard.`,
      estimatedTotal: totalCost,
    };
    try {
      await api.submitBooking(payload).catch(() => {});
      addBookingInquiry(payload as any);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => { setIsSubmitted(false); onClose(); };

  const inputClass =
    'w-full bg-[#04060a] border-2 border-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition-colors rounded-xl';
  const labelClass =
    'block font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-1.5 font-bold';

  const stepAnim = `booking-step-${direction === 'next' ? 'next' : 'prev'}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-10">
      <div onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div className="vertex-card relative w-full max-w-xl max-h-[92vh] sm:max-h-[90vh] flex flex-col bg-[#0b0f17] border-2 border-slate-800 shadow-2xl text-white">
        <VertexCorners variant="white" size={24} thickness={2.6} />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 bg-[#04060a] border-2 border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-colors cursor-pointer rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="overflow-y-auto p-5 sm:p-8">
          <div className="text-center py-8 sm:py-10">
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6 rounded-2xl">
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
            <div className="inline-block px-3 py-1 bg-blue-500/10 font-mono text-xs text-blue-400 uppercase tracking-widest font-bold mb-3 border border-blue-500/20 rounded-full">
              Request Authenticated
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mb-3">Date Hold Initiated</h2>
            <p className="font-sans text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
              Thank you, <span className="text-white font-semibold">{name || 'Client'}</span>. Request for{' '}
              <span className="text-blue-400 font-semibold">{selectedDate} @ {selectedTime}</span> received. Contract & deposit link incoming.
            </p>
            <div className="vertex-card p-4 bg-[#04060a] border-2 border-slate-800 max-w-sm mx-auto mb-8 text-left text-xs font-mono space-y-2">
              <VertexCorners variant="blue" size={14} />
              <div className="flex justify-between text-slate-400"><span>Event:</span><span className="text-blue-400">{currentPkg.name}</span></div>
              <div className="flex justify-between text-slate-400"><span>Venue:</span><span className="text-white">{venue}, {city}</span></div>
              <div className="flex justify-between text-slate-400"><span>Date:</span><span className="text-white">{selectedDate} @ {selectedTime}</span></div>
              <div className="flex justify-between text-slate-400"><span>Email:</span><span className="text-white">{email}</span></div>
              <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-2"><span>50% Deposit:</span><span className="text-blue-400 font-bold">{formatAmount(deposit)}</span></div>
            </div>
            <button
              onClick={handleResetAndClose}
              className="px-8 py-3 bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors cursor-pointer uppercase tracking-wider rounded-xl"
            >
              Back to Overview
            </button>
          </div>
          </div>
        ) : (
          <>
          <div className="overflow-y-auto p-5 sm:p-8 min-h-0">
            {/* Header + progress */}
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <span className="font-mono text-xs text-blue-500 uppercase tracking-widest font-bold">Direct Booking Portal</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mb-1">Secure DJ Wolverine</h2>
            <p className="font-sans text-sm text-slate-400 mb-5">A few quick steps to lock in your date.</p>

            <div className="flex items-center gap-2 mb-6">
              {STEP_LABELS.map((label, i) => (
                <div key={label} className="flex-1">
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                      style={{ width: i <= step ? '100%' : '0%' }}
                    />
                  </div>
                  <div className={`mt-1.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider font-bold ${i === step ? 'text-blue-400' : i < step ? 'text-slate-400' : 'text-slate-600'}`}>
                    {i + 1}. {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Animated step body */}
            <div key={step} className={stepAnim}>
              {step === 0 && (
                <div>
                  <label className={`${labelClass} flex items-center gap-1.5`}>
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />Select a free date *
                  </label>
                  <div className="bg-[#04060a] border-2 border-slate-800 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-3">
                      <button
                        type="button"
                        onClick={() => changeMonth(-1)}
                        disabled={prevDisabled}
                        className="p-1.5 bg-[#0b0f17] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer rounded-xl"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="font-serif text-sm sm:text-base font-bold text-white">{monthLabel}</span>
                      <button
                        type="button"
                        onClick={() => changeMonth(1)}
                        className="p-1.5 bg-[#0b0f17] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 transition-colors cursor-pointer rounded-xl"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-slate-500 mb-1">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                        <div key={d}>{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`b${i}`} />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const d = i + 1;
                        const dateStr = cellDate(d);
                        const past = isPast(d);
                        const sel = selectedDate === dateStr;
                        return (
                          <button
                            key={d}
                            type="button"
                            disabled={past}
                            onClick={() => setSelectedDate(dateStr)}
                            className={`aspect-square rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                              sel
                                ? 'bg-white text-black'
                                : past
                                ? 'text-slate-700 cursor-not-allowed'
                                : 'text-slate-200 bg-[#0b0f17] border border-slate-800 hover:border-blue-500/60 hover:text-white'
                            }`}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <label className={`${labelClass} flex items-center gap-1.5`}>
                    <Clock className="w-3.5 h-3.5 text-blue-500" />Preferred start time for {selectedDate} *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    {TIME_SLOTS.map((t) => {
                      const sel = selectedTime === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTime(t)}
                          className={`py-3 border text-center font-mono text-sm font-bold transition-all cursor-pointer rounded-xl ${
                            sel ? 'bg-white text-black border-white shadow-[0_8px_24px_rgba(255,255,255,0.12)]' : 'bg-[#04060a] border-slate-800 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className={`${labelClass} flex items-center gap-1.5`}>
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />Venue name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. The Alchemist"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={`${labelClass} flex items-center gap-1.5`}>
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Westlands, Nairobi"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <label className={`${labelClass} flex items-center gap-1.5`}>
                    <Music2 className="w-3.5 h-3.5 text-blue-500" />What type of event? *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {(servicePackages.length ? servicePackages : [{ id: 'custom', name: 'Custom Session', price: 1500, features: [], pricePeriod: '/event' }]).map((pkg) => {
                      const isSel = selectedPkgId === pkg.id;
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setSelectedPkgId(pkg.id)}
                          className={`p-3 border text-left transition-all cursor-pointer rounded-xl ${
                            isSel ? 'bg-white text-black border-white shadow-[0_8px_24px_rgba(255,255,255,0.12)]' : 'bg-[#04060a] border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          <div className="font-serif text-sm font-bold flex items-center gap-1.5">
                            {isSel && <Check className="w-3.5 h-3.5" />}
                            {pkg.name}
                          </div>
                          <div className={`font-mono text-xs mt-1 ${isSel ? 'text-slate-700' : 'text-blue-400'}`}>
                            {formatAmount(pkg.price)}<span className="text-[10px] opacity-70">{pkg.pricePeriod}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <label className={`${labelClass} flex items-center gap-1.5`}>
                      <Mail className="w-3.5 h-3.5 text-blue-500" />Email address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Your full name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex items-start gap-2 text-[11px] text-slate-500 font-sans">
                    <Info className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                    <span>We'll send your contract & custom rider here. No payment is taken now — a 50% refundable deposit secures the date.</span>
                  </div>
                </div>
              )}
            </div>
            </div>

            {/* Wizard nav - fixed footer */}
            <div className="shrink-0 flex items-center justify-between gap-3 bg-[#0b0f17] border-t border-slate-800 px-5 sm:px-8 py-4">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center gap-1.5 px-4 py-3 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 transition-colors cursor-pointer rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  <ArrowLeft className="w-4 h-4" />Back
                </button>
              ) : (
                <span />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!stepValid}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors cursor-pointer uppercase tracking-wider rounded-xl shadow-[0_8px_24px_rgba(255,255,255,0.12)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue<ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!stepValid || isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors cursor-pointer uppercase tracking-wider rounded-xl shadow-[0_8px_24px_rgba(255,255,255,0.12)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Securing...' : <>Confirm & Lock Date<ArrowRight className="w-4 h-4" /></>}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
