import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AdminUser,
  PageVisibilityConfig,
  SiteSettings,
  DJAssets,
  MixTrack,
  ServicePackage,
  AddOnItem,
  FaqItem,
  VenueItem,
  InstagramPreviewItem,
  StoredBookingInquiry,
  BookingSubmission
} from '../types';
import {
  DJ_ASSETS,
  MIX_TRACKS,
  SERVICE_PACKAGES,
  ADD_ON_ITEMS,
  FAQ_ITEMS,
  TRUST_VENUES
} from '../data/mockData';
import { api } from '../utils/api';

export const CREW_USERS: AdminUser[] = [
  {
    id: 'user-admin',
    name: 'admin',
    email: 'admin',
    role: 'superadmin',
    roleTitle: 'Administrator',
    avatar: DJ_ASSETS.djPortraitStudio,
    badgeColor: '#ef4444'
  },
];

const DEFAULT_PAGE_VISIBILITY: PageVisibilityConfig = {
  pages: {
    home: true,
    mixes: true,
    faq: true
  },
  sections: {
    hero: true,
    trustVenues: true,
    liveAudioTeaser: true,
    statsTicker: true,
    featuredMix: true,
    ctaBanner: true,
    addOnsBuilder: true,
    currencyBanner: true,
    audioPlayerBar: true,
    heroMediaStrip: true
  }
};

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandName: 'OVERKILL',
  djName: 'DJ Wolverine',
  tagline: 'High-Octane Sonic Precision. Uncompromising Energy.',
  bio: 'DJ Wolverine is Nairobi’s premier high-energy selector, blending underground tech-house, Afro-tech rhythms, peak-hour club bangers, and stadium-level production discipline across East Africa and international tour stages.',
  location: 'Nairobi, Kenya & Global Tour Stages',
  heroTitle: 'UNCOMPROMISING SONIC CURATION',
  heroSubtitle: 'A decade behind the decks crafting unforgettable atmospheres for club nights, festival mainstages, luxury weddings, and high-stakes corporate galas — reading the room and delivering the perfect vibe every single time.',
  heroCtaText: 'REQUEST CLEARANCE & BOOKING',
  contactEmail: 'bookings@overkill.dj',
  contactPhone: '+254 700 892 411',
  whatsappNumber: '+254700892411',
  instagramUrl: 'https://www.instagram.com/wolverine__dj/',
  twitterUrl: 'https://x.com/djwolverine_ke',
  youtubeUrl: 'https://youtube.com',
  stats: {
    showsCount: '250+',
    playsCount: '80K+',
    countriesCount: '12',
    satisfactionRate: '100%'
  }
};

const INITIAL_VENUES: VenueItem[] = TRUST_VENUES.map((v, i) => ({
  id: `venue-${i + 1}`,
  name: v.name,
  location: v.location,
  logo: v.logo
}));

const INITIAL_INSTAGRAM_PREVIEWS: InstagramPreviewItem[] = [
  { id: 'ig-1', url: 'https://www.instagram.com/p/DbIywH0izjv/' }
];

const INITIAL_INQUIRIES: StoredBookingInquiry[] = [
  {
    id: 'inq-101',
    clientName: 'Safaricom Innovation Gala 2026',
    email: 'events@safaricom.co.ke',
    phone: '+254 722 000 111',
    eventType: 'Corporate Gala / Tech Summit',
    eventDate: '2026-09-18',
    venueName: 'Sarit Expo Centre, Westlands',
    venueCity: 'Nairobi',
    guestCount: 450,
    selectedPackage: 'corporate',
    selectedAddOns: ['lighting-rig', 'second-zone'],
    specialRequests: 'Need custom walk-up audio cues for C-suite executive awards and seamless live mic ducking.',
    estimatedTotal: 3950,
    submittedAt: '2026-08-18 14:32:00',
    status: 'confirmed',
    notes: '50% deposit cleared. Soundcheck scheduled for 3:00 PM.'
  },
  {
    id: 'inq-102',
    clientName: 'Wanjiku & Adrian Luxury Wedding',
    email: 'adrian.w@gmail.com',
    phone: '+254 711 456 789',
    eventType: 'Luxury Destination Wedding',
    eventDate: '2026-10-24',
    venueName: 'Enashipai Resort & Spa',
    venueCity: 'Naivasha',
    guestCount: 280,
    selectedPackage: 'wedding',
    selectedAddOns: ['sax-accompaniment', 'lighting-rig', 'co2-cannons'],
    specialRequests: 'Live Saxophone player required for sunset cocktail hour. Bride requested 90s RnB and Amapiano blend for the afterparty.',
    estimatedTotal: 5800,
    submittedAt: '2026-08-19 09:15:00',
    status: 'reviewed',
    notes: 'Tour rider sent to wedding planner for logistics sign-off.'
  }
];

interface CMSContextType {
  // Auth
  currentUser: AdminUser | null;
  isAdminOpen: boolean;
  isLoggedIn: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  openAdmin: () => void;
  closeAdmin: () => void;
  switchUser: (userId: string) => void;

  // Page & section visibility
  pageVisibility: PageVisibilityConfig;
  togglePage: (page: keyof PageVisibilityConfig['pages']) => void;
  toggleSection: (section: keyof PageVisibilityConfig['sections']) => void;
  setAllPages: (val: boolean) => void;

  // Site general settings
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  // Images & Assets
  images: DJAssets;
  updateImage: (key: string, url: string) => void;
  resetImages: () => void;

  // Audio Mixes
  mixTracks: MixTrack[];
  addMixTrack: (track: Omit<MixTrack, 'id'>) => void;
  updateMixTrack: (id: string, track: Partial<MixTrack>) => void;
  deleteMixTrack: (id: string) => void;

  // Packages & Rates
  servicePackages: ServicePackage[];
  addPackage: (pkg: Omit<ServicePackage, 'id'>) => void;
  updatePackage: (id: string, pkg: Partial<ServicePackage>) => void;
  deletePackage: (id: string) => void;

  // Add Ons
  addOnItems: AddOnItem[];
  addAddOn: (addon: Omit<AddOnItem, 'id'>) => void;
  updateAddOn: (id: string, addon: Partial<AddOnItem>) => void;
  deleteAddOn: (id: string) => void;

  // Calendar
  calendarOverrides: Record<string, { status: 'available' | 'booked' | 'restricted'; notes?: string }>;
  setCalendarOverride: (dateStr: string, status: 'available' | 'booked' | 'restricted', notes?: string) => void;
  clearCalendarOverride: (dateStr: string) => void;

  // FAQs
  faqItems: FaqItem[];
  addFaqItem: (item: Omit<FaqItem, 'id'>) => void;
  updateFaqItem: (id: string, item: Partial<FaqItem>) => void;
  deleteFaqItem: (id: string) => void;

  // Venues
  trustVenues: VenueItem[];
  addVenue: (venue: Omit<VenueItem, 'id'>) => void;
  updateVenue: (id: string, venue: Partial<VenueItem>) => void;
  deleteVenue: (id: string) => void;

  // Instagram Previews
  instagramPreviews: InstagramPreviewItem[];
  addInstagramPreview: (url: string) => void;
  updateInstagramPreview: (id: string, url: string) => void;
  deleteInstagramPreview: (id: string) => void;

  // Booking Inquiries
  bookingInquiries: StoredBookingInquiry[];
  addBookingInquiry: (submission: BookingSubmission) => void;
  updateInquiryStatus: (id: string, status: StoredBookingInquiry['status'], notes?: string) => void;
  deleteInquiry: (id: string) => void;

  // Reset & Backup
  resetAllToDefaults: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => { success: boolean; error?: string };
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'overkill_admin_user',
  PAGE_VISIBILITY: 'overkill_page_visibility_v2',
  SITE_SETTINGS: 'overkill_site_settings_v2',
  IMAGES: 'overkill_images_v2',
  MIX_TRACKS: 'overkill_mix_tracks_v2',
  PACKAGES: 'overkill_packages_v2',
  ADDONS: 'overkill_addons_v2',
  FAQS: 'overkill_faqs_v2',
  VENUES: 'overkill_venues_v2',
  INSTAGRAM: 'overkill_instagram_v2',
  CALENDAR: 'overkill_calendar_overrides_v2',
  INQUIRIES: 'overkill_inquiries_v2',
};

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load admin user session', e);
    }
    return null;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Page visibility state
  const [pageVisibility, setPageVisibility] = useState<PageVisibilityConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAGE_VISIBILITY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_PAGE_VISIBILITY;
  });

  // Site settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SITE_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_SITE_SETTINGS;
  });

  // Images
  const [images, setImages] = useState<DJAssets>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.IMAGES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DJ_ASSETS;
  });

  // Mixes
  const [mixTracks, setMixTracks] = useState<MixTrack[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MIX_TRACKS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return MIX_TRACKS;
  });

  // Packages
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PACKAGES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return SERVICE_PACKAGES;
  });

  // Addons
  const [addOnItems, setAddOnItems] = useState<AddOnItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADDONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ADD_ON_ITEMS;
  });

  // FAQs
  const [faqItems, setFaqItems] = useState<FaqItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAQS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return FAQ_ITEMS;
  });

  // Venues
  const [trustVenues, setTrustVenues] = useState<VenueItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VENUES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_VENUES;
  });

  // Instagram previews
  const [instagramPreviews, setInstagramPreviews] = useState<InstagramPreviewItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INSTAGRAM);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_INSTAGRAM_PREVIEWS;
  });
  useEffect(() => {
    api.getInstagramPreviews().then((rows: any) => {
      if (Array.isArray(rows) && rows.length) {
        setInstagramPreviews(rows.map((r: any) => ({ id: r.id, url: r.url })));
      } else if (Array.isArray(rows) && rows.length === 0) {
        const local = localStorage.getItem(STORAGE_KEYS.INSTAGRAM);
        if (!local) setInstagramPreviews([]);
      }
    }).catch(() => {});
  }, []);

  // Calendar overrides
  const [calendarOverrides, setCalendarOverrides] = useState<Record<string, { status: 'available' | 'booked' | 'restricted'; notes?: string }>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CALENDAR);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      '2026-08-22': { status: 'booked', notes: 'Muze Club Westlands - Tech House Night' },
      '2026-08-29': { status: 'booked', notes: 'Private Rooftop Gala' },
      '2026-09-05': { status: 'restricted', notes: 'Reserved for Sarit Expo Corporate Tech Summit' },
      '2026-09-19': { status: 'booked', notes: 'The Alchemist Westlands' },
      '2026-10-10': { status: 'booked', notes: 'Beneath The Baobabs, Kilifi Coast' }
    };
  });

  // Booking Inquiries
  const [bookingInquiries, setBookingInquiries] = useState<StoredBookingInquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_INQUIRIES;
  });

  // Persist states automatically
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAGE_VISIBILITY, JSON.stringify(pageVisibility));
  }, [pageVisibility]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(images));
  }, [images]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MIX_TRACKS, JSON.stringify(mixTracks));
  }, [mixTracks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(servicePackages));
  }, [servicePackages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADDONS, JSON.stringify(addOnItems));
  }, [addOnItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(faqItems));
  }, [faqItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VENUES, JSON.stringify(trustVenues));
  }, [trustVenues]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INSTAGRAM, JSON.stringify(instagramPreviews));
  }, [instagramPreviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(calendarOverrides));
  }, [calendarOverrides]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(bookingInquiries));
  }, [bookingInquiries]);

  // Auth methods - hardcoded admin / admin365, no quick profiles
  const login = async (email: string, pass: string) => {
    const cleanUser = email.trim();
    const cleanPass = pass.trim();

    if (cleanUser === 'admin' && cleanPass === 'admin365') {
      const adminUser = CREW_USERS[0];
      setCurrentUser(adminUser);
      setIsAdminOpen(true);
      return { success: true };
    }

    return {
      success: false,
      message: 'Invalid credentials.'
    };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdminOpen(false);
  };

  const openAdmin = () => setIsAdminOpen(true);
  const closeAdmin = () => setIsAdminOpen(false);

  const switchUser = (userId: string) => {
    const target = CREW_USERS.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  // Visibility toggles
  const togglePage = (page: keyof PageVisibilityConfig['pages']) => {
    setPageVisibility((prev) => ({
      ...prev,
      pages: {
        ...prev.pages,
        [page]: !prev.pages[page]
      }
    }));
  };

  const toggleSection = (section: keyof PageVisibilityConfig['sections']) => {
    setPageVisibility((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: !prev.sections[section]
      }
    }));
  };

  const setAllPages = (val: boolean) => {
    setPageVisibility((prev) => ({
      ...prev,
      pages: {
        home: val,
        mixes: val,
        faq: val
      }
    }));
  };

  // Settings
  const updateSiteSettings = (newSettings: Partial<SiteSettings>) => {
    setSiteSettings((prev) => ({
      ...prev,
      ...newSettings,
      stats: {
        ...prev.stats,
        ...(newSettings.stats || {})
      }
    }));
  };

  // Images
  const updateImage = (key: string, url: string) => {
    setImages((prev) => ({
      ...prev,
      [key]: url
    }));
  };

  const resetImages = () => {
    setImages(DJ_ASSETS);
  };

  // Mixes
  const addMixTrack = (trackData: Omit<MixTrack, 'id'>) => {
    const newTrack: MixTrack = {
      ...trackData,
      id: `mix-${Date.now()}`
    };
    setMixTracks((prev) => [newTrack, ...prev]);
  };

  const updateMixTrack = (id: string, updated: Partial<MixTrack>) => {
    setMixTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  const deleteMixTrack = (id: string) => {
    setMixTracks((prev) => prev.filter((t) => t.id !== id));
  };

  // Packages
  const addPackage = (pkgData: Omit<ServicePackage, 'id'>) => {
    const newPkg: ServicePackage = {
      ...pkgData,
      id: `pkg-${Date.now()}`
    };
    setServicePackages((prev) => [...prev, newPkg]);
  };

  const updatePackage = (id: string, updated: Partial<ServicePackage>) => {
    setServicePackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
  };

  const deletePackage = (id: string) => {
    setServicePackages((prev) => prev.filter((p) => p.id !== id));
  };

  // Addons
  const addAddOn = (addonData: Omit<AddOnItem, 'id'>) => {
    const newAddon: AddOnItem = {
      ...addonData,
      id: `addon-${Date.now()}`
    };
    setAddOnItems((prev) => [...prev, newAddon]);
  };

  const updateAddOn = (id: string, updated: Partial<AddOnItem>) => {
    setAddOnItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
    );
  };

  const deleteAddOn = (id: string) => {
    setAddOnItems((prev) => prev.filter((a) => a.id !== id));
  };

  // Calendar
  const setCalendarOverride = (
    dateStr: string,
    status: 'available' | 'booked' | 'restricted',
    notes?: string
  ) => {
    setCalendarOverrides((prev) => ({
      ...prev,
      [dateStr]: { status, notes }
    }));
  };

  const clearCalendarOverride = (dateStr: string) => {
    setCalendarOverrides((prev) => {
      const copy = { ...prev };
      delete copy[dateStr];
      return copy;
    });
  };

  // FAQs
  const addFaqItem = (itemData: Omit<FaqItem, 'id'>) => {
    const newItem: FaqItem = {
      ...itemData,
      id: `faq-${Date.now()}`
    };
    setFaqItems((prev) => [...prev, newItem]);
  };

  const updateFaqItem = (id: string, updated: Partial<FaqItem>) => {
    setFaqItems((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updated } : f))
    );
  };

  const deleteFaqItem = (id: string) => {
    setFaqItems((prev) => prev.filter((f) => f.id !== id));
  };

  // Venues
  const addVenue = (venueData: Omit<VenueItem, 'id'>) => {
    const newVenue: VenueItem = {
      ...venueData,
      id: `venue-${Date.now()}`
    };
    setTrustVenues((prev) => [...prev, newVenue]);
  };

  const updateVenue = (id: string, updated: Partial<VenueItem>) => {
    setTrustVenues((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updated } : v))
    );
  };

  const deleteVenue = (id: string) => {
    setTrustVenues((prev) => prev.filter((v) => v.id !== id));
  };

  // Instagram previews
  const addInstagramPreview = (url: string) => {
    const clean = url.trim();
    if (!clean) return;
    const newItem: InstagramPreviewItem = { id: `ig-${Date.now()}`, url: clean };
    setInstagramPreviews((prev) => [...prev, newItem]);
    api.createInstagramPreview({ url: clean }).then((saved: any) => {
      if (saved?.id) setInstagramPreviews((prev) => prev.map((p) => p.id === newItem.id ? { id: saved.id, url: saved.url } : p));
    }).catch(() => {});
  };
  const updateInstagramPreview = (id: string, url: string) => {
    setInstagramPreviews((prev) => prev.map((p) => (p.id === id ? { ...p, url } : p)));
    api.updateInstagramPreview(id, { url }).catch(() => {});
  };
  const deleteInstagramPreview = (id: string) => {
    setInstagramPreviews((prev) => prev.filter((p) => p.id !== id));
    api.deleteInstagramPreview(id).catch(() => {});
  };

  // Inquiries
  const addBookingInquiry = (submission: BookingSubmission) => {
    const newInquiry: StoredBookingInquiry = {
      ...submission,
      id: `inq-${Date.now()}`,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'new'
    };
    setBookingInquiries((prev) => [newInquiry, ...prev]);
  };

  const updateInquiryStatus = (id: string, status: StoredBookingInquiry['status'], notes?: string) => {
    setBookingInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status, ...(notes !== undefined ? { notes } : {}) } : inq))
    );
  };

  const deleteInquiry = (id: string) => {
    setBookingInquiries((prev) => prev.filter((inq) => inq.id !== id));
  };

  // Reset & Backup
  const resetAllToDefaults = () => {
    setPageVisibility(DEFAULT_PAGE_VISIBILITY);
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    setImages(DJ_ASSETS);
    setMixTracks(MIX_TRACKS);
    setServicePackages(SERVICE_PACKAGES);
    setAddOnItems(ADD_ON_ITEMS);
    setFaqItems(FAQ_ITEMS);
    setTrustVenues(INITIAL_VENUES);
    setInstagramPreviews(INITIAL_INSTAGRAM_PREVIEWS);
    setCalendarOverrides({});
  };

  const exportDataJSON = () => {
    const payload = {
      siteSettings,
      pageVisibility,
      images,
      mixTracks,
      servicePackages,
      addOnItems,
      faqItems,
      trustVenues,
      instagramPreviews,
      calendarOverrides,
      bookingInquiries,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDataJSON = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.siteSettings) setSiteSettings(data.siteSettings);
      if (data.pageVisibility) setPageVisibility(data.pageVisibility);
      if (data.images) setImages(data.images);
      if (data.mixTracks) setMixTracks(data.mixTracks);
      if (data.servicePackages) setServicePackages(data.servicePackages);
      if (data.addOnItems) setAddOnItems(data.addOnItems);
      if (data.faqItems) setFaqItems(data.faqItems);
      if (data.trustVenues) setTrustVenues(data.trustVenues);
      if (data.instagramPreviews) setInstagramPreviews(data.instagramPreviews);
      if (data.calendarOverrides) setCalendarOverrides(data.calendarOverrides);
      if (data.bookingInquiries) setBookingInquiries(data.bookingInquiries);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Invalid JSON format' };
    }
  };

  return (
    <CMSContext.Provider
      value={{
        currentUser,
        isAdminOpen,
        isLoggedIn: !!currentUser,
        login,
        logout,
        openAdmin,
        closeAdmin,
        switchUser,

        pageVisibility,
        togglePage,
        toggleSection,
        setAllPages,

        siteSettings,
        updateSiteSettings,

        images,
        updateImage,
        resetImages,

        mixTracks,
        addMixTrack,
        updateMixTrack,
        deleteMixTrack,

        servicePackages,
        addPackage,
        updatePackage,
        deletePackage,

        addOnItems,
        addAddOn,
        updateAddOn,
        deleteAddOn,

        calendarOverrides,
        setCalendarOverride,
        clearCalendarOverride,

        faqItems,
        addFaqItem,
        updateFaqItem,
        deleteFaqItem,

        trustVenues,
        addVenue,
        updateVenue,
        deleteVenue,

        instagramPreviews,
        addInstagramPreview,
        updateInstagramPreview,
        deleteInstagramPreview,

        bookingInquiries,
        addBookingInquiry,
        updateInquiryStatus,
        deleteInquiry,

        resetAllToDefaults,
        exportDataJSON,
        importDataJSON
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
