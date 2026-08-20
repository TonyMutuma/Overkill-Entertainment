import React, { useState, useRef, useEffect } from 'react';
import { useCurrency, CURRENCY_CONFIGS, CurrencyCode } from '../context/CurrencyContext';
import { MapPin, Globe, ChevronDown, Check, RefreshCw, Sparkles } from 'lucide-react';

interface CurrencySelectorProps {
  variant?: 'compact' | 'banner' | 'inline';
  className?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  variant = 'compact',
  className = ''
}) => {
  const {
    currency,
    currencyConfig,
    locationInfo,
    setCurrency,
    resetToAutoDetected,
    refreshLocation
  } = useCurrency();

  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableCurrencies: CurrencyCode[] = [
    'KES',
    'USD',
    'EUR',
    'GBP',
    'ZAR',
    'AED',
    'CAD',
    'AUD',
    'TZS',
    'UGX'
  ];

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
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

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
  };

  // 1. BANNER VARIANT (Used at the top of ServicesView)
  if (variant === 'banner') {
    return (
      <div
        ref={dropdownRef}
        className={`w-full bg-[#1c1b1b]/90 border border-[#00daf8]/25 rounded-xl p-4 md:p-5 relative overflow-hidden backdrop-blur-md transition-all shadow-lg ${className}`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#00daf8]/15 border border-[#00daf8]/30 flex items-center justify-center text-[#00daf8] shrink-0">
              <MapPin className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono-jb text-[11px] uppercase tracking-wider text-[#00daf8] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00daf8] inline-block animate-ping" />
                  IP Geolocation Auto-Detected
                </span>
                {locationInfo.ip && (
                  <span className="font-mono-jb text-[10px] text-[#bac9cd]/50 bg-[#131313] px-2 py-0.5 rounded border border-white/5">
                    IP: {locationInfo.ip}
                  </span>
                )}
              </div>
              <p className="font-hanken text-sm text-[#e5e2e1] font-medium mt-0.5">
                Displaying prices for{' '}
                <span className="text-[#baf2ff] font-semibold">
                  {locationInfo.city ? `${locationInfo.city}, ` : ''}{locationInfo.countryName}
                </span>{' '}
                in{' '}
                <span className="text-[#00daf8] font-bold">
                  {currencyConfig.name} ({currencyConfig.code})
                </span>
              </p>
            </div>
          </div>

          {/* Selector Button with Dropdown */}
          <div className="relative w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#201f1f] hover:bg-[#282727] text-[#e5e2e1] border border-white/10 hover:border-[#00daf8]/40 rounded-lg font-mono-jb text-xs font-semibold flex items-center justify-between gap-3 transition-all cursor-pointer shadow-inner"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{currencyConfig.flag}</span>
                  <span className="text-[#00daf8] font-bold">{currencyConfig.code}</span>
                  <span className="text-[#bac9cd]/70 text-[11px]">({currencyConfig.symbol.trim()})</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#bac9cd] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleRefresh}
                title="Re-detect IP location"
                className="p-2.5 bg-[#201f1f] hover:bg-[#282727] text-[#bac9cd] hover:text-[#00daf8] border border-white/10 hover:border-[#00daf8]/30 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#00daf8]' : ''}`} />
              </button>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#1c1b1b] border border-[#00daf8]/30 rounded-xl shadow-2xl z-50 p-2 max-h-80 overflow-y-auto backdrop-blur-2xl">
                <div className="px-3 py-2 border-b border-white/10 text-[11px] font-mono-jb text-[#bac9cd] flex justify-between items-center">
                  <span>SELECT CURRENCY</span>
                  <button
                    onClick={resetToAutoDetected}
                    className="text-[#00daf8] hover:underline cursor-pointer text-[10px]"
                  >
                    Reset Auto
                  </button>
                </div>
                <div className="space-y-1 py-1">
                  {availableCurrencies.map((code) => {
                    const cfg = CURRENCY_CONFIGS[code];
                    const isSelected = currency === code;
                    const isDetected = locationInfo.currency === code;

                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleSelect(code)}
                        className={`w-full px-3 py-2 rounded-lg text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#00daf8]/15 text-[#00daf8] font-bold border border-[#00daf8]/30'
                            : 'text-[#e5e2e1] hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{cfg.flag}</span>
                          <div>
                            <div className="font-mono-jb font-semibold flex items-center gap-1.5">
                              {cfg.code}
                              {isDetected && (
                                <span className="text-[9px] bg-[#00daf8]/20 text-[#00daf8] px-1.5 py-0.2 rounded font-normal">
                                  IP
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#bac9cd]/70 font-hanken">
                              {cfg.name} ({cfg.symbol.trim()})
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#00daf8]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. COMPACT VARIANT (Navbar / Header)
  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1.5 bg-[#201f1f]/90 hover:bg-[#2a2929] text-[#e5e2e1] border border-white/10 hover:border-[#00daf8]/40 rounded-lg font-mono-jb text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm group"
        title={`IP Location: ${locationInfo.city ? locationInfo.city + ', ' : ''}${locationInfo.countryName} (${currency})`}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{currencyConfig.flag}</span>
          <span className="font-bold text-[#00daf8] group-hover:text-[#baf2ff]">{currencyConfig.code}</span>
        </div>
        <span className="text-[10px] text-[#bac9cd]/60 hidden sm:inline font-normal">
          {currencyConfig.symbol.trim()}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#bac9cd] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#1c1b1b] border border-[#00daf8]/30 rounded-xl shadow-2xl z-50 p-2 max-h-80 overflow-y-auto backdrop-blur-2xl">
          <div className="px-3 py-2 border-b border-white/10 text-[10px] font-mono-jb text-[#bac9cd] flex justify-between items-center">
            <div className="flex items-center gap-1 text-[#00daf8]">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-[120px]">
                {locationInfo.city || locationInfo.countryName}
              </span>
            </div>
            <button
              onClick={resetToAutoDetected}
              className="text-[#00daf8] hover:underline cursor-pointer text-[10px]"
            >
              Reset to IP
            </button>
          </div>

          <div className="space-y-1 py-1">
            {availableCurrencies.map((code) => {
              const cfg = CURRENCY_CONFIGS[code];
              const isSelected = currency === code;
              const isDetected = locationInfo.currency === code;

              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleSelect(code)}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#00daf8]/15 text-[#00daf8] font-bold border border-[#00daf8]/30'
                      : 'text-[#e5e2e1] hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{cfg.flag}</span>
                    <span className="font-mono-jb font-semibold">{cfg.code}</span>
                    <span className="text-[10px] text-[#bac9cd]/60">({cfg.symbol.trim()})</span>
                    {isDetected && (
                      <span className="text-[9px] bg-[#00daf8]/20 text-[#00daf8] px-1 rounded">
                        Auto
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#00daf8]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
