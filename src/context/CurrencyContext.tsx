import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode =
  | 'KES'
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'ZAR'
  | 'AED'
  | 'CAD'
  | 'AUD'
  | 'TZS'
  | 'UGX';

export interface CurrencyConfig {
  code: CurrencyCode;
  name: string;
  symbol: string;
  rateFromUSD: number;
  flag: string;
  roundStep: number;
}

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  KES: {
    code: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh ',
    rateFromUSD: 130,
    flag: '🇰🇪',
    roundStep: 1000
  },
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    rateFromUSD: 1.0,
    flag: '🇺🇸',
    roundStep: 1
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    rateFromUSD: 0.92,
    flag: '🇪🇺',
    roundStep: 5
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    rateFromUSD: 0.79,
    flag: '🇬🇧',
    roundStep: 5
  },
  ZAR: {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R ',
    rateFromUSD: 18.5,
    flag: '🇿🇦',
    roundStep: 100
  },
  AED: {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED ',
    rateFromUSD: 3.67,
    flag: '🇦🇪',
    roundStep: 10
  },
  CAD: {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'CA$',
    rateFromUSD: 1.36,
    flag: '🇨🇦',
    roundStep: 5
  },
  AUD: {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'AU$',
    rateFromUSD: 1.52,
    flag: '🇦🇺',
    roundStep: 5
  },
  TZS: {
    code: 'TZS',
    name: 'Tanzanian Shilling',
    symbol: 'TSh ',
    rateFromUSD: 2600,
    flag: '🇹🇿',
    roundStep: 10000
  },
  UGX: {
    code: 'UGX',
    name: 'Ugandan Shilling',
    symbol: 'USh ',
    rateFromUSD: 3700,
    flag: '🇺🇬',
    roundStep: 10000
  }
};

export interface LocationInfo {
  ip: string;
  countryCode: string;
  countryName: string;
  city: string;
  region?: string;
  currency: CurrencyCode;
  isAutoDetected: boolean;
  isLoading: boolean;
  source: 'ip' | 'timezone' | 'manual';
}

interface CurrencyContextType {
  currency: CurrencyCode;
  currencyConfig: CurrencyConfig;
  locationInfo: LocationInfo;
  setCurrency: (code: CurrencyCode) => void;
  formatAmount: (
    usdAmount: number,
    options?: { hideSymbol?: boolean; includeCode?: boolean }
  ) => string;
  convertAmount: (usdAmount: number) => number;
  resetToAutoDetected: () => void;
  refreshLocation: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = 'overkill_preferred_currency';

// Country code to default currency mapping
function mapCountryToCurrency(countryCode: string): CurrencyCode {
  const code = (countryCode || '').toUpperCase();
  switch (code) {
    case 'KE':
      return 'KES';
    case 'GB':
    case 'UK':
      return 'GBP';
    case 'DE':
    case 'FR':
    case 'IT':
    case 'ES':
    case 'NL':
    case 'BE':
    case 'AT':
    case 'IE':
    case 'PT':
    case 'FI':
    case 'GR':
      return 'EUR';
    case 'ZA':
      return 'ZAR';
    case 'AE':
      return 'AED';
    case 'CA':
      return 'CAD';
    case 'AU':
    case 'NZ':
      return 'AUD';
    case 'TZ':
      return 'TZS';
    case 'UG':
      return 'UGX';
    case 'US':
    default:
      return 'USD';
  }
}

// Fallback timezone based inference
function inferCurrencyFromTimezone(): { countryCode: string; countryName: string; city: string; currency: CurrencyCode } {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Nairobi') || tz.includes('Mombasa') || tz.includes('Kenya')) {
      return { countryCode: 'KE', countryName: 'Kenya', city: 'Nairobi', currency: 'KES' };
    }
    if (tz.includes('London')) {
      return { countryCode: 'GB', countryName: 'United Kingdom', city: 'London', currency: 'GBP' };
    }
    if (tz.includes('Johannesburg')) {
      return { countryCode: 'ZA', countryName: 'South Africa', city: 'Johannesburg', currency: 'ZAR' };
    }
    if (tz.includes('Dubai')) {
      return { countryCode: 'AE', countryName: 'United Arab Emirates', city: 'Dubai', currency: 'AED' };
    }
    if (tz.includes('Dar_es_Salaam')) {
      return { countryCode: 'TZ', countryName: 'Tanzania', city: 'Dar es Salaam', currency: 'TZS' };
    }
    if (tz.includes('Kampala')) {
      return { countryCode: 'UG', countryName: 'Uganda', city: 'Kampala', currency: 'UGX' };
    }
    if (tz.includes('Paris') || tz.includes('Berlin') || tz.includes('Rome') || tz.includes('Madrid') || tz.includes('Amsterdam')) {
      return { countryCode: 'EU', countryName: 'Europe', city: 'Central Europe', currency: 'EUR' };
    }
    if (tz.includes('Toronto') || tz.includes('Vancouver') || tz.includes('Montreal')) {
      return { countryCode: 'CA', countryName: 'Canada', city: 'Toronto', currency: 'CAD' };
    }
    if (tz.includes('Sydney') || tz.includes('Melbourne') || tz.includes('Brisbane')) {
      return { countryCode: 'AU', countryName: 'Australia', city: 'Sydney', currency: 'AUD' };
    }
  } catch {
    // ignore
  }
  return { countryCode: 'KE', countryName: 'Kenya', city: 'Nairobi', currency: 'KES' };
}

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('KES');
  const [locationInfo, setLocationInfo] = useState<LocationInfo>({
    ip: '',
    countryCode: 'KE',
    countryName: 'Kenya',
    city: 'Nairobi',
    currency: 'KES',
    isAutoDetected: false,
    isLoading: true,
    source: 'ip'
  });

  const detectLocationByIP = async () => {
    setLocationInfo((prev) => ({ ...prev, isLoading: true }));

    // Strategy 1: Freeipapi (very fast, reliable, CORS enabled)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch('https://freeipapi.com/api/json', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.countryCode) {
          const countryCode = data.countryCode;
          const countryName = data.countryName || 'Detected Region';
          const city = data.cityName || data.regionName || '';
          const ip = data.ipAddress || '';
          const autoCurrency = mapCountryToCurrency(countryCode);

          const savedCurrency = localStorage.getItem(STORAGE_KEY) as CurrencyCode;
          const finalCurrency = savedCurrency && CURRENCY_CONFIGS[savedCurrency] ? savedCurrency : autoCurrency;

          setLocationInfo({
            ip,
            countryCode,
            countryName,
            city,
            region: data.regionName,
            currency: autoCurrency,
            isAutoDetected: true,
            isLoading: false,
            source: 'ip'
          });

          setSelectedCurrency(finalCurrency);
          return;
        }
      }
    } catch {
      // Continue to next strategy
    }

    // Strategy 2: ipwho.is (CORS friendly fallback)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch('https://ipwho.is/', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.country_code) {
          const countryCode = data.country_code;
          const countryName = data.country || 'Detected Region';
          const city = data.city || '';
          const ip = data.ip || '';
          const autoCurrency = mapCountryToCurrency(countryCode);

          const savedCurrency = localStorage.getItem(STORAGE_KEY) as CurrencyCode;
          const finalCurrency = savedCurrency && CURRENCY_CONFIGS[savedCurrency] ? savedCurrency : autoCurrency;

          setLocationInfo({
            ip,
            countryCode,
            countryName,
            city,
            region: data.region,
            currency: autoCurrency,
            isAutoDetected: true,
            isLoading: false,
            source: 'ip'
          });

          setSelectedCurrency(finalCurrency);
          return;
        }
      }
    } catch {
      // Continue to fallback
    }

    // Strategy 3: Timezone & Locale Fallback
    const fallback = inferCurrencyFromTimezone();
    const savedCurrency = localStorage.getItem(STORAGE_KEY) as CurrencyCode;
    const finalCurrency = savedCurrency && CURRENCY_CONFIGS[savedCurrency] ? savedCurrency : fallback.currency;

    setLocationInfo({
      ip: 'Local IP',
      countryCode: fallback.countryCode,
      countryName: fallback.countryName,
      city: fallback.city,
      currency: fallback.currency,
      isAutoDetected: true,
      isLoading: false,
      source: 'timezone'
    });

    setSelectedCurrency(finalCurrency);
  };

  useEffect(() => {
    detectLocationByIP();
  }, []);

  const handleSetCurrency = (code: CurrencyCode) => {
    if (CURRENCY_CONFIGS[code]) {
      setSelectedCurrency(code);
      localStorage.setItem(STORAGE_KEY, code);
    }
  };

  const handleResetToAutoDetected = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSelectedCurrency(locationInfo.currency);
  };

  const currentConfig = CURRENCY_CONFIGS[selectedCurrency] || CURRENCY_CONFIGS.KES;

  const convertAmount = (usdAmount: number): number => {
    const rate = currentConfig.rateFromUSD;
    const raw = usdAmount * rate;

    // Rounding nicely based on currency step
    if (currentConfig.roundStep >= 1000) {
      return Math.round(raw / currentConfig.roundStep) * currentConfig.roundStep;
    } else if (currentConfig.roundStep >= 5) {
      return Math.round(raw / currentConfig.roundStep) * currentConfig.roundStep;
    }
    return Math.round(raw);
  };

  const formatAmount = (
    usdAmount: number,
    options?: { hideSymbol?: boolean; includeCode?: boolean }
  ): string => {
    const converted = convertAmount(usdAmount);
    const formattedNumber = converted.toLocaleString();

    if (options?.hideSymbol) {
      return formattedNumber;
    }

    const symbol = currentConfig.symbol;
    const codeSuffix = options?.includeCode ? ` ${currentConfig.code}` : '';

    return `${symbol}${formattedNumber}${codeSuffix}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency: selectedCurrency,
        currencyConfig: currentConfig,
        locationInfo,
        setCurrency: handleSetCurrency,
        formatAmount,
        convertAmount,
        resetToAutoDetected: handleResetToAutoDetected,
        refreshLocation: detectLocationByIP
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
