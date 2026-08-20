import React, { useState, useEffect } from 'react';
import { CheckCircle2, Plus, Check, ArrowRight, Calculator, Sparkles } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencySelector } from './CurrencySelector';
import { api } from '../utils/api';

interface ServicesViewProps {
  onSelectPackageForBooking?: (packageId: string, addOns: string[], total: number) => void;
  onNavigateToCalendar?: () => void;
  setActiveTab?: (tab: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  onSelectPackageForBooking,
  onNavigateToCalendar,
  setActiveTab
}) => {
  const { formatAmount } = useCurrency();
  const [selectedPkgId, setSelectedPkgId] = useState<string>('corporate');
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [servicePackages, setServicePackages] = useState([]);
  const [addOnItems, setAddOnItems] = useState([]);

  useEffect(() => {
    api.getServicePackages().then((pkgs) => setServicePackages(pkgs));
    api.getAddOnItems().then((addons) => setAddOnItems(addons));
  }, []);

  const toggleAddOn = (id: string) => {
    if (selectedAddOnIds.includes(id)) {
      setSelectedAddOnIds(selectedAddOnIds.filter((item) => item !== id));
    } else {
      setSelectedAddOnIds([...selectedAddOnIds, id]);
    }
  };

  const currentPkg = servicePackages.find((p) => p.id === selectedPkgId) || servicePackages[1] || {
    id: 'corporate', name: 'Corporate', tag: 'MOST POPULAR', tagType: 'popular',
    price: 2800, pricePeriod: '/event', description: 'Sophisticated sonic branding for elite company events.',
    idealFor: 'Tech Summits, Product Launches, Galas & Award Banquets',
    features: ['Up to 6 Hours Coverage', 'Full QSC Premium Audio System (up to 300 guests)', 'Wireless Shure Microphones for Speeches', 'Brand-Aligned Playlist Curation']
  };

  const addOnsTotal = selectedAddOnIds.reduce((sum, addOnId) => {
    const addOn = addOnItems.find((a) => a.id === addOnId);
    return sum + (addOn ? addOn.price : 0);
  }, 0);

  const estimatedTotal = currentPkg.price + addOnsTotal;

  const handleSelectPackage = (pkgId: string) => {
    setSelectedPkgId(pkgId);
    const pkg = servicePackages.find((p) => p.id === pkgId);
    if (pkg && onSelectPackageForBooking) {
      const addOnsStr = selectedAddOnIds.join(',');
      onSelectPackageForBooking(pkg.id, addOnsStr, pkg.price + addOnsTotal);
    } else if (onNavigateToCalendar) {
      onNavigateToCalendar();
    } else if (setActiveTab) {
      setActiveTab('calendar');
    }
  };

  return (
    <div className="w-full pt-28 pb-24 md:pb-32 px-6 md:px-16 max-w-[1280px] mx-auto">
      {/* 1. Header Section */}
      <div className="max-w-3xl mb-16">
        <div className="inline-block px-3.5 py-1 bg-[#201f1f] rounded-full border border-[#00daf8]/30 mb-4">
          <span className="font-mono-jb text-xs text-[#00daf8] uppercase tracking-widest font-semibold">
            Transparent Pricing
          </span>
        </div>

        <h1 className="font-sora text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold text-[#e5e2e1] mb-6 leading-tight text-glow">
          What's Actually Included When You Book DJ Wolverine?
        </h1>

        <p className="font-hanken text-lg text-[#bac9cd] leading-relaxed">
          No hidden fees. No gear rental surprises. Just raw, unadulterated power. Transparent pricing for premium sonic experiences.
        </p>
      </div>

      {/* Geolocation & Currency Notice Banner */}
      <CurrencySelector variant="banner" className="mb-12" />

      {/* 2. Packages Grid (Matching Mockup 1 exactly) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-stretch">
        {servicePackages.map((pkg) => {
          const isHighlighted = pkg.isPopular;

          return (
            <div
              key={pkg.id}
              className={`glass-panel p-6 md:p-8 rounded-xl flex flex-col transition-all duration-300 relative ${
                isHighlighted
                  ? 'border-[#00daf8]/40 md:-translate-y-3 shadow-[0_0_40px_rgba(0,218,248,0.15)] bg-[#1c1b1b]'
                  : 'glow-hover'
              }`}
            >
              {/* Highlight Top Strip */}
              {isHighlighted && (
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#00daf8] to-[#baf2ff] rounded-t-xl" />
              )}

              {/* Tag & Title */}
              <div className="mb-6">
                <span
                  className={`font-mono-jb text-[11px] uppercase tracking-wider mb-2.5 inline-block font-semibold px-2.5 py-0.5 rounded ${
                    isHighlighted
                      ? 'bg-[#00daf8]/20 text-[#00daf8] border border-[#00daf8]/30'
                      : 'text-[#00daf8]'
                  }`}
                >
                  {pkg.tag}
                </span>

                <h3 className="font-sora text-2xl md:text-3xl font-bold text-[#e5e2e1] mb-2">
                  {pkg.name}
                </h3>

                <p className="font-hanken text-sm text-[#bac9cd] mb-6 leading-relaxed">
                  {pkg.description}
                </p>

                {/* Price Display */}
                <div className="font-sora text-3xl lg:text-4xl font-extrabold text-[#baf2ff] tracking-tight">
                  {formatAmount(pkg.price)}
                  <span className="font-hanken text-sm text-[#bac9cd] font-normal ml-1">
                    {pkg.pricePeriod}
                  </span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8 flex-grow">
                {pkg.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#00daf8] shrink-0 mt-0.5" />
                    <span className="font-hanken text-sm text-[#e5e2e1] leading-snug">
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Select Button */}
              {isHighlighted ? (
                <button
                  onClick={() => handleSelectPackage(pkg.id)}
                  className="w-full bg-[#00e0ff] text-[#00363f] font-sora font-bold text-sm md:text-base py-3.5 rounded hover:shadow-[0_0_25px_rgba(0,224,255,0.6)] hover:scale-[1.02] transition-all duration-300 cursor-pointer uppercase tracking-wider"
                >
                  Select {pkg.name}
                </button>
              ) : (
                <button
                  onClick={() => handleSelectPackage(pkg.id)}
                  className="w-full bg-transparent border-2 border-[#00daf8] text-[#baf2ff] font-sora font-bold text-sm md:text-base py-3.5 rounded hover:bg-[#00daf8]/15 hover:shadow-[0_0_20px_rgba(0,218,248,0.3)] transition-all duration-300 cursor-pointer uppercase tracking-wider"
                >
                  Select {pkg.name}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Interactive Customizer & Add-Ons Calculator */}
      <section className="bg-[#1c1b1b]/80 border border-white/10 rounded-2xl p-6 md:p-10 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Add-ons Left */}
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#00daf8]" />
              <span className="font-mono-jb text-xs text-[#00daf8] uppercase tracking-wider font-semibold">
                Production Enhancements
              </span>
            </div>
            <h2 className="font-sora text-2xl md:text-3xl font-bold text-[#e5e2e1] mb-2">
              Bespoke Add-Ons & Tech Upgrades
            </h2>
            <p className="font-hanken text-sm text-[#bac9cd] mb-6">
              Tailor the performance with concert-grade visual effects, live musicians, and multi-zone coverage.
            </p>

            <div className="space-y-3">
              {addOnItems.map((addon) => {
                const isSelected = selectedAddOnIds.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddOn(addon.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-[#00daf8]/10 border-[#00daf8] shadow-[0_0_15px_rgba(0,218,248,0.2)]'
                        : 'bg-[#201f1f]/60 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#00daf8] text-[#00363f]'
                            : 'border border-white/20 text-transparent'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <div>
                        <h4 className="font-sora text-sm font-bold text-[#e5e2e1]">
                          {addon.name}
                        </h4>
                        <p className="font-hanken text-xs text-[#bac9cd]/70">
                          {addon.description}
                        </p>
                      </div>
                    </div>

                    <div className="font-mono-jb text-sm font-bold text-[#baf2ff] shrink-0">
                      +{formatAmount(addon.price)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calculator Right Summary */}
          <div className="w-full lg:w-96 bg-[#2a2a2a]/90 rounded-xl p-6 border border-[#00daf8]/30 shrink-0">
            <div className="flex items-center gap-2 mb-4 font-mono-jb text-xs text-[#00daf8] uppercase font-bold">
              <Calculator className="w-4 h-4" />
              Live Quote Estimate
            </div>

            <div className="space-y-3 border-b border-white/10 pb-4 mb-4 text-sm font-hanken">
              <div className="flex justify-between items-center text-[#e5e2e1]">
                <span>Base ({currentPkg.name})</span>
                <span className="font-mono-jb font-bold">{formatAmount(currentPkg.price)}</span>
              </div>

              {selectedAddOnIds.map((addOnId) => {
                const addOn = addOnItems.find((a) => a.id === addOnId);
                if (!addOn) return null;
                return (
                  <div key={addOnId} className="flex justify-between items-center text-xs text-[#bac9cd]">
                    <span className="truncate pr-2">+ {addOn.name}</span>
                    <span className="font-mono-jb shrink-0">{formatAmount(addOn.price)}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-baseline mb-6">
              <span className="font-sora text-base font-bold text-[#e5e2e1]">Estimated Total</span>
              <div className="text-right">
                <div className="font-sora text-2xl lg:text-3xl font-extrabold text-[#00daf8] text-glow">
                  {formatAmount(estimatedTotal)}
                </div>
                <span className="font-mono-jb text-[10px] text-[#bac9cd]/60">
                  Includes full Pioneer CDJ/DJM gear
                </span>
              </div>
            </div>

            <button
              onClick={() => handleSelectPackage(selectedPkgId)}
              className="w-full py-3.5 bg-[#00daf8] text-[#00363f] font-sora font-bold text-sm rounded hover:bg-[#00e0ff] hover:shadow-[0_0_20px_#00daf8] transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
            >
              Proceed With Quote
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};