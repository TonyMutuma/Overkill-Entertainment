import React, { useState, useRef, useEffect } from 'react';
import { useCurrency, CURRENCY_CONFIGS, CurrencyCode } from '../context/CurrencyContext';
import { MapPin, ChevronDown, Check, RefreshCw } from 'lucide-react';

interface CurrencySelectorProps {
  variant?: 'compact' | 'banner' | 'inline';
  className?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  variant = 'compact',
  className = ''
}) => {
  const { currency, currencyConfig, locationInfo, setCurrency, resetToAutoDetected, refreshLocation } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const availableCurrencies: CurrencyCode[] = ['KES','USD','EUR','GBP','ZAR','AED','CAD','AUD','TZS','UGX'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRefreshing(true);
    await refreshLocation();
    setTimeout(() => setIsRefreshing(false), 600);
  };
  const handleSelect = (code: CurrencyCode) => { setCurrency(code); setIsOpen(false); };

  if (variant === 'banner') {
    return (
      <div ref={dropdownRef} className={`w-full bg-[#0b0f17] border border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${className}`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0"><MapPin className="w-5 h-5" /></div>
          <div className="min-w-0">
            <p className="font-sans text-sm text-white font-medium mt-0.5 truncate">
              Prices displayed in <span className="text-blue-400 font-bold">{currencyConfig.name} ({currencyConfig.code})</span>
            </p>
          </div>
        </div>
        <div className="relative w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#04060a] text-white border border-slate-800 hover:border-slate-700 font-mono text-xs font-semibold flex items-center justify-between gap-3 transition-colors cursor-pointer">
              <div className="flex items-center gap-2"><span className="text-base">{currencyConfig.flag}</span><span className="text-white font-bold">{currencyConfig.code}</span><span className="text-slate-500 text-[11px]">({currencyConfig.symbol.trim()})</span></div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#0b0f17] border border-slate-800 shadow-2xl z-50 p-2 max-h-80 overflow-y-auto">
              <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between items-center"><span>SELECT CURRENCY</span><button onClick={resetToAutoDetected} className="text-blue-500 hover:underline cursor-pointer text-[10px] font-bold">Reset</button></div>
              <div className="space-y-1 py-1">
                {availableCurrencies.map((code) => {
                  const cfg = CURRENCY_CONFIGS[code];
                  const isSelected = currency === code;
                  const isDetected = locationInfo.currency === code;
                  return (
                    <button key={code} type="button" onClick={() => handleSelect(code)} className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer border ${isSelected ? 'bg-white text-black border-white font-bold' : 'text-white hover:bg-white/5 border-transparent'}`}>
                      <div className="flex items-center gap-2.5"><span className="text-base">{cfg.flag}</span><div><div className="font-mono font-semibold flex items-center gap-1.5">{cfg.code}{isDetected && <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1 py-0.5 border border-blue-500/20">Auto</span>}</div><div className="text-[11px] text-slate-500 font-sans">{cfg.name} ({cfg.symbol.trim()})</div></div></div>
                      {isSelected && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="px-2.5 py-1.5 bg-[#0b0f17] text-white border border-slate-800 hover:border-slate-700 font-mono text-xs flex items-center gap-2 transition-colors cursor-pointer">
        <span className="text-sm">{currencyConfig.flag}</span>
        <span className="font-bold">{currencyConfig.code}</span>
        <span className="text-[10px] text-slate-500 hidden sm:inline">{currencyConfig.symbol.trim()}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#0b0f17] border border-slate-800 shadow-2xl z-50 p-2 max-h-80 overflow-y-auto">
          <div className="px-3 py-2 border-b border-slate-800 text-[10px] font-mono text-slate-400 flex justify-between items-center">
            <div className="flex items-center gap-1 text-blue-500"><MapPin className="w-3 h-3" /><span className="truncate max-w-[120px]">{locationInfo.countryName}</span></div>
            <button onClick={resetToAutoDetected} className="text-blue-500 hover:underline cursor-pointer text-[10px] font-bold">Reset</button>
          </div>
          <div className="space-y-1 py-1">
            {availableCurrencies.map((code) => {
              const cfg = CURRENCY_CONFIGS[code];
              const isSelected = currency === code;
              const isDetected = locationInfo.currency === code;
              return (
                <button key={code} type="button" onClick={() => handleSelect(code)} className={`w-full px-2.5 py-1.5 text-left text-xs flex items-center justify-between transition-colors cursor-pointer border ${isSelected ? 'bg-white text-black border-white font-bold' : 'text-white hover:bg-white/5 border-transparent'}`}>
                  <div className="flex items-center gap-2"><span className="text-sm">{cfg.flag}</span><span className="font-mono font-semibold">{cfg.code}</span><span className="text-[10px] text-slate-500">({cfg.symbol.trim()})</span>{isDetected && <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1 border border-blue-500/20">Auto</span>}</div>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
