import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, CheckCircle, Sparkles, Music2, ArrowRight, Check, Info } from 'lucide-react';
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

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialPackageId = 'corporate',
  initialDate,
  initialAddOns = [],
}) => {
  const { formatAmount } = useCurrency();
  const { servicePackages, addOnItems, addBookingInquiry } = useCMS();
  const [selectedPkgId, setSelectedPkgId] = useState<string>(initialPackageId);
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || '');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(initialAddOns);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [venue, setVenue] = useState('');
  const [guestCount, setGuestCount] = useState('150');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (isOpen) {
      setSelectedPkgId(initialPackageId);
      setSelectedDate(initialDate || '');
      setSelectedAddOns(initialAddOns);
      setIsSubmitted(false);
    }
  }, [isOpen, initialPackageId, initialDate, initialAddOns]);

  if (!isOpen) return null;

  const currentPkg = servicePackages.find((p) => p.id === selectedPkgId) || servicePackages[0] || { id: 'custom', name: 'Custom Session', price: 1500, features: [], pricePeriod: '/event' };
  const addOnsTotal = selectedAddOns.reduce((sum, addOnId) => {
    const item = addOnItems.find((a) => a.id === addOnId);
    return sum + (item ? item.price : 0);
  }, 0);
  const totalCost = currentPkg.price + addOnsTotal;
  const deposit = Math.round(totalCost * 0.5);

  const toggleAddOn = (id: string) => {
    if (selectedAddOns.includes(id)) setSelectedAddOns(selectedAddOns.filter((item) => item !== id));
    else setSelectedAddOns([...selectedAddOns, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      clientName: name || 'Direct Web Client',
      email: email || 'booking@overkill.co',
      phone: phone || '+254 700 000000',
      eventType: currentPkg.name,
      eventDate: selectedDate,
      venueName: venue || 'Private Venue',
      venueCity: venue || 'Nairobi',
      guestCount: parseInt(guestCount, 10) || 150,
      selectedPackage: currentPkg.id,
      selectedAddOns: selectedAddOns,
      estimatedTotal: totalCost,
      specialRequests: notes || 'Submitted via public booking interface'
    };
    try {
      // Persist to remote Cloudflare D1 (source of truth)
      await api.submitBooking(payload).catch(() => {});
      // Local admin dashboard feedback
      addBookingInquiry(payload as any);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => { setIsSubmitted(false); onClose(); };

  const inputClass = "w-full bg-[#04060a] border-2 border-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition-colors rounded-xl";
  const labelClass = "block font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-1.5 font-bold";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-10">
      <div onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div className="vertex-card relative w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto bg-[#0b0f17] border-2 border-slate-800 p-5 sm:p-8 shadow-2xl text-white">
        <VertexCorners variant="white" size={24} thickness={2.6} />
        <button onClick={onClose} className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 bg-[#04060a] border-2 border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-colors cursor-pointer rounded-xl"><X className="w-5 h-5" /></button>

        {isSubmitted ? (
          <div className="text-center py-8 sm:py-10">
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6 rounded-2xl"><CheckCircle className="w-8 h-8 text-blue-500" /></div>
            <div className="inline-block px-3 py-1 bg-blue-500/10 font-mono text-xs text-blue-400 uppercase tracking-widest font-bold mb-3 border border-blue-500/20 rounded-full">Request Authenticated</div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mb-3">Date Hold Initiated</h2>
            <p className="font-sans text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">Thank you, <span className="text-white font-semibold">{name || 'Client'}</span>. Request for <span className="text-blue-400 font-semibold">{selectedDate}</span> received. Contract & deposit link incoming.</p>
            <div className="vertex-card p-4 bg-[#04060a] border-2 border-slate-800 max-w-sm mx-auto mb-8 text-left text-xs font-mono space-y-2">
              <VertexCorners variant="blue" size={14} />
              <div className="flex justify-between text-slate-400"><span>Package:</span><span className="text-blue-400">{currentPkg.name}</span></div>
              {selectedAddOns.length > 0 && <div className="flex justify-between text-slate-400"><span>Add-ons:</span><span className="text-white">{selectedAddOns.length}</span></div>}
              <div className="flex justify-between text-slate-400"><span>Date:</span><span className="text-white">{selectedDate}</span></div>
              <div className="flex justify-between text-slate-400"><span>Investment:</span><span className="text-white font-bold">{formatAmount(totalCost)}</span></div>
              <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-2"><span>50% Deposit:</span><span className="text-blue-400 font-bold">{formatAmount(deposit)}</span></div>
            </div>
            <button onClick={handleResetAndClose} className="px-8 py-3 bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors cursor-pointer uppercase tracking-wider rounded-xl">Back to Overview</button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2"><Sparkles className="w-5 h-5 text-blue-500" /><span className="font-mono text-xs text-blue-500 uppercase tracking-widest font-bold">Direct Booking Portal</span></div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mb-2">Secure DJ Wolverine</h2>
            <p className="font-sans text-sm text-slate-400 mb-6">Lock in your date. Premium sound systems and zero-compromise performance.</p>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* 1. Tier */}
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-2 font-bold">1. Select Experience Tier</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  {servicePackages.map((pkg) => {
                    const isSel = selectedPkgId === pkg.id;
                    return (
                      <button key={pkg.id} type="button" onClick={() => setSelectedPkgId(pkg.id)} className={`p-3 border text-left transition-all cursor-pointer rounded-xl ${isSel ? 'bg-white text-black border-white shadow-[0_8px_24px_rgba(255,255,255,0.12)]' : 'bg-[#04060a] border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'}`}>
                        <div className="font-serif text-sm font-bold truncate flex items-center gap-1.5">{isSel && <Check className="w-3.5 h-3.5" />}{pkg.name}</div>
                        <div className={`font-mono text-xs mt-1 ${isSel ? 'text-slate-700' : 'text-blue-400'}`}>{formatAmount(pkg.price)}<span className="text-[10px] opacity-70">{pkg.pricePeriod}</span></div>
                      </button>
                    );
                  })}
                </div>
                {/* Selected package features */}
                {currentPkg.features && currentPkg.features.length > 0 && (
                  <div className="mt-3 p-3 bg-[#04060a] border border-slate-800 rounded-xl">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-bold">What's Included</div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                      {currentPkg.features.map((f: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300 font-sans"><Check className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" /><span>{f}</span></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Date + Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`${labelClass} flex items-center gap-1.5`}><Calendar className="w-3.5 h-3.5 text-blue-500" />Event Date *</label>
                  <input type="date" required min={todayStr} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={`${labelClass} flex items-center gap-1.5`}><MapPin className="w-3.5 h-3.5 text-blue-500" />Venue / City *</label>
                  <input type="text" required placeholder="e.g. The Alchemist, Westlands" value={venue} onChange={(e) => setVenue(e.target.value)} className={inputClass} />
                </div>
              </div>

              {/* 2. Add-ons — ALL */}
              <div>
                <label className={`${labelClass} flex items-center gap-1.5`}><Music2 className="w-3.5 h-3.5 text-blue-500" />2. Optional Add-ons</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {addOnItems.map((addon) => {
                    const isSelected = selectedAddOns.includes(addon.id);
                    return (
                      <button key={addon.id} type="button" onClick={() => toggleAddOn(addon.id)} className={`p-2.5 border text-left text-xs flex justify-between items-center transition-all cursor-pointer rounded-xl ${isSelected ? 'bg-white text-black border-white' : 'bg-[#04060a] border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                        <span className="truncate pr-2 font-sans font-medium flex items-center gap-1.5">{isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}{addon.name}</span>
                        <span className={`font-mono shrink-0 font-bold ${isSelected ? 'text-slate-700' : 'text-blue-400'}`}>+{formatAmount(addon.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={labelClass}>Your Full Name *</label><input type="text" required placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Email Address *</label><input type="email" required placeholder="jane@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={labelClass}>Phone Number</label><input type="tel" placeholder="+254 700 000000" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} /></div>
                <div><label className={`${labelClass} flex items-center gap-1.5`}><Users className="w-3.5 h-3.5 text-blue-500" />Guest Count</label><input type="number" placeholder="150" value={guestCount} onChange={(e) => setGuestCount(e.target.value)} className={inputClass} /></div>
              </div>

              {/* Notes */}
              <div>
                <label className={labelClass}>Special Requests / Notes</label>
                <textarea rows={3} placeholder="Track requests, vibe brief, logistics, accessibility..." value={notes} onChange={(e) => setNotes(e.target.value)} className={`${inputClass} resize-none font-sans`} />
              </div>

              {/* Total + Submit */}
              <div className="vertex-card p-4 bg-[#04060a] border-2 border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                <VertexCorners variant="slate" size={14} />
                <div>
                  <div className="font-mono text-xs text-slate-500 uppercase tracking-wider font-bold">Calculated Investment:</div>
                  <div className="font-serif text-2xl font-extrabold text-white">{formatAmount(totalCost)}</div>
                  <div className="font-mono text-[10px] text-blue-400/80 mt-0.5">50% deposit {formatAmount(deposit)} to lock date</div>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl shadow-[0_8px_24px_rgba(255,255,255,0.10)] disabled:opacity-60">
                  {isSubmitting ? 'Securing...' : <>Confirm & Lock In Date <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>

              <div className="flex items-start gap-2 text-[11px] text-slate-500 font-sans">
                <Info className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                <span>No payment is taken now. A 50% refundable deposit secures your date. You'll receive a contract & custom rider within 24h.</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
