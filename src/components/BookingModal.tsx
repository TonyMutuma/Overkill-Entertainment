import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Users, CheckCircle, Sparkles, Music2, ArrowRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { useCurrency } from '../context/CurrencyContext';

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
  const [selectedDate, setSelectedDate] = useState<string>(
    initialDate || new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]
  );
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(initialAddOns);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [venue, setVenue] = useState('');
  const [guestCount, setGuestCount] = useState('150');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (initialPackageId) setSelectedPkgId(initialPackageId);
    if (initialDate) setSelectedDate(initialDate);
    if (initialAddOns) setSelectedAddOns(initialAddOns);
  }, [initialPackageId, initialDate, initialAddOns, isOpen]);

  if (!isOpen) return null;

  const currentPkg = servicePackages.find((p) => p.id === selectedPkgId) || servicePackages[0] || {
    id: 'custom',
    name: 'Custom Session',
    tier: 'CUSTOM',
    price: 1500,
    features: []
  };

  const addOnsTotal = selectedAddOns.reduce((sum, addOnId) => {
    const item = addOnItems.find((a) => a.id === addOnId);
    return sum + (item ? item.price : 0);
  }, 0);
  const totalCost = currentPkg.price + addOnsTotal;

  const toggleAddOn = (id: string) => {
    if (selectedAddOns.includes(id)) {
      setSelectedAddOns(selectedAddOns.filter((item) => item !== id));
    } else {
      setSelectedAddOns([...selectedAddOns, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBookingInquiry({
      clientName: name || 'Direct Web Client',
      clientEmail: email || 'booking@overkill.co',
      clientPhone: phone || '+254 700 000000',
      eventType: currentPkg.name,
      eventDate: selectedDate,
      venueCity: venue || 'Nairobi',
      venueName: venue || 'Private Venue',
      guestCount: parseInt(guestCount, 10) || 150,
      selectedPackageId: currentPkg.id,
      selectedAddOns: selectedAddOns,
      estimatedTotal: totalCost,
      status: 'new',
      notes: notes || 'Submitted via public booking interface'
    });
    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#171616] border border-[#00daf8]/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,218,248,0.2)] text-[#e5e2e1]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#201f1f] text-[#bac9cd] hover:text-[#00daf8] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-full bg-[#00daf8]/20 border-2 border-[#00daf8] flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-[#00daf8]" />
            </div>

            <div className="inline-block px-3 py-1 bg-[#00daf8]/10 rounded-full font-mono-jb text-xs text-[#00daf8] uppercase tracking-widest font-bold mb-3">
              Request Authenticated
            </div>

            <h2 className="font-sora text-3xl font-extrabold text-[#e5e2e1] mb-3">
              Date Hold Initiated
            </h2>

            <p className="font-hanken text-base text-[#bac9cd] max-w-md mx-auto mb-6">
              Thank you, <span className="text-[#00daf8] font-semibold">{name || 'Client'}</span>. DJ Wolverine&apos;s management has received your request for{' '}
              <span className="text-[#baf2ff] font-semibold">{selectedDate}</span>. An official rider contract &amp; deposit link will arrive in your inbox shortly.
            </p>

            <div className="p-4 bg-[#201f1f] rounded-xl border border-white/5 max-w-sm mx-auto mb-8 text-left text-xs font-mono-jb space-y-2">
              <div className="flex justify-between text-[#bac9cd]">
                <span>Package:</span>
                <span className="text-[#00daf8]">{currentPkg.name}</span>
              </div>
              <div className="flex justify-between text-[#bac9cd]">
                <span>Date Reserved:</span>
                <span className="text-[#e5e2e1]">{selectedDate}</span>
              </div>
              <div className="flex justify-between text-[#bac9cd]">
                <span>Estimated Investment:</span>
                <span className="text-[#00daf8] font-bold">{formatAmount(totalCost)}</span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="px-8 py-3 bg-[#00daf8] text-[#00363f] font-sora font-bold text-sm rounded hover:bg-[#00e0ff] hover:shadow-[0_0_20px_#00daf8] transition-all cursor-pointer uppercase tracking-wider"
            >
              Back to Overview
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#00daf8]" />
              <span className="font-mono-jb text-xs text-[#00daf8] uppercase tracking-wider font-semibold">
                Direct Booking Portal
              </span>
            </div>

            <h2 className="font-sora text-2xl sm:text-3xl font-extrabold text-[#e5e2e1] mb-2">
              Secure DJ Wolverine
            </h2>

            <p className="font-hanken text-sm text-[#bac9cd] mb-6">
              Lock in your date. High-tier sound systems, pristine Pioneer rider setups, and zero-compromise live performance.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Package Selection */}
              <div>
                <label className="block font-mono-jb text-xs uppercase tracking-wider text-[#bac9cd] mb-2">
                  1. Select Experience Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  {servicePackages.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPkgId(pkg.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedPkgId === pkg.id
                          ? 'bg-[#00daf8]/15 border-[#00daf8] shadow-[0_0_15px_rgba(0,218,248,0.25)]'
                          : 'bg-[#201f1f] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="font-sora text-sm font-bold text-[#e5e2e1]">{pkg.name}</div>
                      <div className="font-mono-jb text-xs text-[#00daf8] mt-1">{formatAmount(pkg.price)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Date & Venue Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono-jb text-xs uppercase tracking-wider text-[#bac9cd] mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#00daf8]" />
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-[#201f1f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#00daf8]"
                  />
                </div>

                <div>
                  <label className="block font-mono-jb text-xs uppercase tracking-wider text-[#bac9cd] mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#00daf8]" />
                    Venue / City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Alchemist, Westlands, Nairobi"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full bg-[#201f1f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#e5e2e1] placeholder-[#859397] focus:outline-none focus:border-[#00daf8]"
                  />
                </div>
              </div>

              {/* 3. Add-ons selector */}
              <div>
                <label className="block font-mono-jb text-xs uppercase tracking-wider text-[#bac9cd] mb-2 flex items-center gap-1.5">
                  <Music2 className="w-3.5 h-3.5 text-[#00daf8]" />
                  2. Optional Add-ons &amp; Production Gear
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {addOnItems.slice(0, 4).map((addon) => {
                    const isSelected = selectedAddOns.includes(addon.id);
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => toggleAddOn(addon.id)}
                        className={`p-2.5 rounded-lg border text-left text-xs flex justify-between items-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#00daf8]/15 border-[#00daf8] text-[#e5e2e1]'
                            : 'bg-[#201f1f] border-white/5 text-[#bac9cd] hover:border-white/20'
                        }`}
                      >
                        <span className="truncate pr-2">{addon.name}</span>
                        <span className="font-mono-jb text-[#00daf8] shrink-0">+{formatAmount(addon.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono-jb text-xs uppercase tracking-wider text-[#bac9cd] mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#201f1f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#e5e2e1] placeholder-[#859397] focus:outline-none focus:border-[#00daf8]"
                  />
                </div>

                <div>
                  <label className="block font-mono-jb text-xs uppercase tracking-wider text-[#bac9cd] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#201f1f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#e5e2e1] placeholder-[#859397] focus:outline-none focus:border-[#00daf8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono-jb text-xs uppercase tracking-wider text-[#bac9cd] mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#201f1f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#e5e2e1] placeholder-[#859397] focus:outline-none focus:border-[#00daf8]"
                  />
                </div>

                <div>
                  <label className="block font-mono-jb text-xs uppercase tracking-wider text-[#bac9cd] mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#00daf8]" />
                    Estimated Guest Count
                  </label>
                  <input
                    type="number"
                    placeholder="150"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full bg-[#201f1f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#e5e2e1] placeholder-[#859397] focus:outline-none focus:border-[#00daf8]"
                  />
                </div>
              </div>

              {/* 5. Pricing Summary and Submission */}
              <div className="p-4 bg-[#201f1f] rounded-xl border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <div className="font-mono-jb text-xs text-[#bac9cd]">Calculated Investment:</div>
                  <div className="font-sora text-2xl font-extrabold text-[#00daf8] text-glow">
                    {formatAmount(totalCost)}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#00daf8] text-[#00363f] font-sora font-bold text-sm rounded hover:bg-[#00e0ff] hover:shadow-[0_0_25px_#00daf8] transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  Confirm &amp; Lock In Date
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
