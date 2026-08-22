import React, { useState, useEffect } from 'react';
import { CheckCircle2, Check, ArrowRight, Calculator, Sparkles } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencySelector } from './CurrencySelector';
import { DJ_ASSETS } from '../data/mockData';
import { api } from '../utils/api';
import { VertexCorners } from './VertexCorners';

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
  const [servicePackages, setServicePackages] = useState<any[]>([]);
  const [addOnItems, setAddOnItems] = useState<any[]>([]);

  useEffect(() => {
    api.getServicePackages().then((pkgs) => setServicePackages(pkgs));
    api.getAddOnItems().then((addons) => setAddOnItems(addons));
  }, []);

  const toggleAddOn = (id: string) => {
    if (selectedAddOnIds.includes(id)) setSelectedAddOnIds(selectedAddOnIds.filter((item) => item !== id));
    else setSelectedAddOnIds([...selectedAddOnIds, id]);
  };

  const currentPkg = servicePackages.find((p) => p.id === selectedPkgId) || servicePackages[1] || {
    id: 'corporate', name: 'Corporate', tag: 'MOST POPULAR', price: 2800, pricePeriod: '/event', description: 'Sophisticated sonic branding for elite company events.', features: ['Up to 6 Hours Coverage', 'Full QSC Premium Audio System', 'Wireless Shure Microphones', 'Brand-Aligned Playlist Curation']
  };

  const addOnsTotal = selectedAddOnIds.reduce((sum, addOnId) => {
    const addOn = addOnItems.find((a) => a.id === addOnId);
    return sum + (addOn ? addOn.price : 0);
  }, 0);
  const estimatedTotal = currentPkg.price + addOnsTotal;

  const handleSelectPackage = (pkgId: string) => {
    setSelectedPkgId(pkgId);
    const pkg = servicePackages.find((p) => p.id === pkgId);
    if (pkg && onSelectPackageForBooking) onSelectPackageForBooking(pkg.id, selectedAddOnIds.join(',') as any, pkg.price + addOnsTotal);
    else if (onNavigateToCalendar) onNavigateToCalendar();
    else if (setActiveTab) setActiveTab('calendar');
  };

  return (
    <div className="w-full bg-[#070b11] text-white">
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-28 sm:pt-32 pb-8 sm:pb-12">
        <span className="inline-block font-mono text-[10px] sm:text-xs tracking-[0.2em] text-blue-500 uppercase font-bold mb-3">Transparent Pricing</span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-[1.05] tracking-tight max-w-3xl">
          What's Included When You Book <span className="text-blue-500">DJ Wolverine?</span>
        </h1>
        <p className="font-sans text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mt-4 leading-relaxed">No hidden fees. No gear rental surprises. Just raw, unadulterated power. Transparent pricing for premium sonic experiences.</p>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pb-6">
        <CurrencySelector variant="banner" className="mb-0" />
      </div>

      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pb-10 sm:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          {servicePackages.map((pkg) => {
            const isHighlighted = pkg.isPopular;
            const bgImg = pkg.id === 'club' ? DJ_ASSETS.clubLaser : pkg.id === 'wedding' ? DJ_ASSETS.luxuryWedding : DJ_ASSETS.corporateLounge;
            return (
              <div key={pkg.id} className={`vertex-card bg-[#0b0f17] border-2 p-6 sm:p-8 flex flex-col relative overflow-hidden ${isHighlighted ? 'border-blue-500 md:-translate-y-2 shadow-[0_0_40px_rgba(37,99,235,.18)]' : 'border-slate-700/60 hover:border-slate-600'}`}>
                <VertexCorners variant={isHighlighted ? 'blue' : 'white'} size={22} thickness={2.6} />
                <img src={bgImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.06] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0b0f17] via-[#0b0f17]/92 to-[#0b0f17]/60 pointer-events-none" />
                {isHighlighted && <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 z-10" />}
                <div className="relative z-10 flex flex-col flex-grow">
                <div className="mb-6">
                  <span className={`font-mono text-[10px] uppercase tracking-widest font-bold px-2 py-1 border inline-block mb-3 ${isHighlighted ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-white/5 text-slate-400 border-slate-800'}`}>{pkg.tag}</span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">{pkg.name}</h3>
                  <p className="font-sans text-sm text-slate-400 mb-5 leading-relaxed">{pkg.description}</p>
                  <div className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {formatAmount(pkg.price)} <span className="font-sans text-sm text-slate-500 font-normal ml-1">{pkg.pricePeriod}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {pkg.features.map((feat: string, fIdx: number) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span className="font-sans text-sm text-slate-300 leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleSelectPackage(pkg.id)} className={`w-full font-bold text-xs sm:text-sm py-3.5 uppercase tracking-wider transition-colors cursor-pointer rounded-xl ${isHighlighted ? 'bg-white text-black hover:bg-slate-200 shadow-[0_8px_24px_rgba(255,255,255,0.10)]' : 'bg-transparent border-2 border-white/20 text-white hover:bg-white hover:text-black'}`}>
                  Select {pkg.name}
                </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pb-20 sm:pb-28">
        <div className="vertex-card vertex-card--elevated bg-[#0b0f17] border-2 border-slate-700/60 p-6 sm:p-8 md:p-10">
            <VertexCorners variant="white" size={24} />
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <span className="font-mono text-[10px] sm:text-xs text-blue-500 uppercase tracking-widest font-bold">Production Enhancements</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">Bespoke Add-Ons & Tech Upgrades</h2>
              <p className="font-sans text-sm text-slate-400 mb-6">Tailor the performance with concert-grade visual effects, live musicians, and multi-zone coverage.</p>
              <div className="space-y-3">
                {addOnItems.map((addon) => {
                  const isSelected = selectedAddOnIds.includes(addon.id);
                  return (
                    <div key={addon.id} onClick={() => toggleAddOn(addon.id)} className={`vertex-card p-4 border flex items-center justify-between gap-4 cursor-pointer transition-colors ${isSelected ? 'bg-blue-500/10 border-blue-500/30' : 'bg-[#04060a] border-slate-700/60 hover:border-slate-600'}`}>
                      <VertexCorners variant={isSelected ? 'blue' : 'muted'} size={12} thickness={1.6} />
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-6 h-6 flex items-center justify-center shrink-0 border transition-colors ${isSelected ? 'bg-blue-500 text-white border-blue-500' : 'border-slate-700 text-transparent'}`}>
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif text-sm font-bold text-white truncate">{addon.name}</h4>
                          <p className="font-sans text-xs text-slate-500 truncate">{addon.description}</p>
                        </div>
                      </div>
                      <div className="font-mono text-sm font-bold text-white shrink-0">+{formatAmount(addon.price)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="vertex-card w-full lg:w-[380px] bg-[#04060a] border-2 border-slate-700/60 p-6 shrink-0">
              <VertexCorners variant="blue" size={18} thickness={2.2} />
              <div className="flex items-center gap-2 mb-4 font-mono text-[11px] text-blue-500 uppercase font-bold tracking-wider">
                <Calculator className="w-4 h-4" /> Live Quote Estimate
              </div>
              <div className="space-y-3 border-b border-slate-800 pb-4 mb-4 text-sm font-sans">
                <div className="flex justify-between items-center text-white">
                  <span>Base ({currentPkg.name})</span>
                  <span className="font-mono font-bold">{formatAmount(currentPkg.price)}</span>
                </div>
                {selectedAddOnIds.map((addOnId) => {
                  const addOn = addOnItems.find((a) => a.id === addOnId);
                  if (!addOn) return null;
                  return (
                    <div key={addOnId} className="flex justify-between items-center text-xs text-slate-400">
                      <span className="truncate pr-2">+ {addOn.name}</span>
                      <span className="font-mono shrink-0">{formatAmount(addOn.price)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-baseline mb-6">
                <span className="font-serif text-base font-bold text-white">Estimated Total</span>
                <div className="text-right">
                  <div className="font-serif text-2xl sm:text-3xl font-extrabold text-white">{formatAmount(estimatedTotal)}</div>
                  <span className="font-mono text-[10px] text-slate-500">Includes full Pioneer CDJ/DJM gear</span>
                </div>
              </div>
              <button onClick={() => handleSelectPackage(selectedPkgId)} className="w-full py-3.5 bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl shadow-[0_8px_24px_rgba(255,255,255,0.10)]">
                Proceed With Quote <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
