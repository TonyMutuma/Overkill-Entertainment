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
  YoutubePreviewItem,
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
import { supabase } from '../lib/supabase';

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

const INITIAL_YOUTUBE_PREVIEWS: YoutubePreviewItem[] = [
  { id: 'yt-1', url: 'https://www.youtube.com/watch?v=5qap5aO4i9A' }
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
  mixSaving: boolean;
  mixError: string | null;
  addMixTrack: (track: Omit<MixTrack, 'id'>) => Promise<{ success: boolean; error?: string }>;
  updateMixTrack: (id: string, track: Partial<MixTrack>) => Promise<{ success: boolean; error?: string }>;
  deleteMixTrack: (id: string) => Promise<{ success: boolean; error?: string }>;
  refreshMixTracks: () => Promise<void>;

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
  instagramSaving: boolean;
  instagramError: string | null;
  instagramLastSavedAt: string | null;
  addInstagramPreview: (url: string) => Promise<{ success: boolean; error?: string }>;
  updateInstagramPreview: (id: string, url: string) => Promise<{ success: boolean; error?: string }>;
  deleteInstagramPreview: (id: string) => Promise<{ success: boolean; error?: string }>;
  refreshInstagramPreviews: () => Promise<void>;

  // Youtube Previews
  youtubePreviews: YoutubePreviewItem[];
  youtubeSaving: boolean;
  youtubeError: string | null;
  youtubeLastSavedAt: string | null;
  addYoutubePreview: (url: string) => Promise<{ success: boolean; error?: string }>;
  updateYoutubePreview: (id: string, url: string) => Promise<{ success: boolean; error?: string }>;
  deleteYoutubePreview: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateYoutubeSize: (id: string, size: YoutubePreviewItem['size']) => Promise<{ success: boolean; error?: string }>;
  reorderYoutubePreviews: (orderedIds: string[]) => Promise<{ success: boolean; error?: string }>;
  moveYoutubePreview: (id: string, direction: 'up' | 'down') => Promise<{ success: boolean; error?: string }>;
  refreshYoutubePreviews: () => Promise<void>;

  // Booking Inquiries
  bookingInquiries: StoredBookingInquiry[];
  bookingSaving: boolean;
  bookingError: string | null;
  addBookingInquiry: (submission: BookingSubmission) => Promise<{ success: boolean; error?: string }>;
  updateInquiryStatus: (id: string, status: StoredBookingInquiry['status'], notes?: string) => Promise<{ success: boolean; error?: string }>;
  deleteInquiry: (id: string) => Promise<{ success: boolean; error?: string }>;
  refreshBookings: () => Promise<void>;

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
  YOUTUBE: 'overkill_youtube_v2',
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
  const [mixSaving, setMixSaving] = useState(false);
  const [mixError, setMixError] = useState<string | null>(null);
  const mapMixRow = (r: any): MixTrack => ({
    id: r.id,
    title: r.title,
    category: r.category,
    categoryLabel: (r.category_label ?? r.categoryLabel ?? r.category) as string,
    duration: r.duration || '',
    recordedAt: (r.recorded_at ?? r.recordedAt) || '',
    description: r.description || '',
    date: r.date || '',
    plays: r.plays || '',
    bpm: Number(r.bpm) || 0,
    imageUrl: (r.image_url ?? r.imageUrl) || '',
    audioKey: (r.audio_key ?? r.audioKey) || '',
    tags: typeof r.tags === 'string' ? JSON.parse(r.tags) : (r.tags ?? []),
    tracklistSnippet: typeof r.tracklist_snippet === 'string' ? JSON.parse(r.tracklist_snippet) : ((r.tracklistSnippet ?? r.tracklist_snippet) ?? []),
    youtubeUrl: r.youtube_url ?? r.youtubeUrl,
    youtubeId: r.youtube_id ?? r.youtubeId,
  });
  const refreshMixTracks = async () => {
    setMixSaving(true);
    setMixError(null);
    try {
      const { data, error } = await supabase.from('mix_tracks').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data) && data.length) {
        setMixTracks(data.map(mapMixRow));
        setMixSaving(false);
        return;
      }
      if (error && !error.message.includes('Could not find the table')) throw error;
    } catch (e: any) {
      setMixError(e.message || 'Failed to fetch mixes');
    }
    try {
      const rows: any = await api.getMixTracks();
      if (Array.isArray(rows) && rows.length) setMixTracks(rows.map(mapMixRow));
    } catch {}
    finally { setMixSaving(false); }
  };
  useEffect(() => {
    refreshMixTracks();
    const channel = supabase.channel('mix-tracks-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'mix_tracks' }, () => refreshMixTracks()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

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
  const [instagramSaving, setInstagramSaving] = useState(false);
  const [instagramError, setInstagramError] = useState<string | null>(null);
  const [instagramLastSavedAt, setInstagramLastSavedAt] = useState<string | null>(null);
  const refreshInstagramPreviews = async () => {
    setInstagramSaving(true);
    setInstagramError(null);
    try {
      const { data, error } = await supabase.from('instagram_previews').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (Array.isArray(data)) {
        if (data.length) setInstagramPreviews(data.map((r: any) => ({ id: r.id, url: r.url })));
        else {
          const local = localStorage.getItem(STORAGE_KEYS.INSTAGRAM);
          if (!local) setInstagramPreviews([]);
        }
        setInstagramLastSavedAt(new Date().toLocaleTimeString());
      }
    } catch (e: any) {
      setInstagramError(e.message || 'Failed to fetch from Supabase');
      try {
        const rows: any = await api.getInstagramPreviews();
        if (Array.isArray(rows) && rows.length) setInstagramPreviews(rows.map((r: any) => ({ id: r.id, url: r.url })));
      } catch {}
    } finally {
      setInstagramSaving(false);
    }
  };
  useEffect(() => {
    refreshInstagramPreviews();
    const channel = supabase.channel('instagram-previews-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'instagram_previews' }, () => refreshInstagramPreviews()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Youtube previews
  const [youtubePreviews, setYoutubePreviews] = useState<YoutubePreviewItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.YOUTUBE);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_YOUTUBE_PREVIEWS;
  });
  const [youtubeSaving, setYoutubeSaving] = useState(false);
  const [youtubeError, setYoutubeError] = useState<string | null>(null);
  const [youtubeLastSavedAt, setYoutubeLastSavedAt] = useState<string | null>(null);
  const refreshYoutubePreviews = async () => {
    setYoutubeSaving(true);
    setYoutubeError(null);
    try {
      const { data, error } = await supabase.from('youtube_previews').select('*').order('position', { ascending: true }).order('created_at', { ascending: false });
      if (error) throw error;
      if (Array.isArray(data)) {
        if (data.length) setYoutubePreviews(data.map((r: any) => ({ id: r.id, url: r.url, position: r.position ?? 0, size: (r.size as any) || 'normal' })));
        else {
          const local = localStorage.getItem(STORAGE_KEYS.YOUTUBE);
          if (!local) setYoutubePreviews([]);
        }
        setYoutubeLastSavedAt(new Date().toLocaleTimeString());
      }
    } catch (e: any) {
      setYoutubeError(e.message || 'Failed to fetch from Supabase');
      try {
        const rows: any = await api.getYoutubePreviews();
        if (Array.isArray(rows) && rows.length) setYoutubePreviews(rows.map((r: any) => ({ id: r.id, url: r.url, position: r.position ?? 0, size: (r.size as any) || 'normal' })).sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0)));
      } catch {}
    } finally {
      setYoutubeSaving(false);
    }
  };
  useEffect(() => {
    refreshYoutubePreviews();
    const channel = supabase.channel('youtube-previews-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'youtube_previews' }, () => refreshYoutubePreviews()).subscribe();
    return () => { supabase.removeChannel(channel); };
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
    localStorage.setItem(STORAGE_KEYS.YOUTUBE, JSON.stringify(youtubePreviews));
  }, [youtubePreviews]);

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

  // Mixes - persisted to Supabase via /api/mix-tracks
  const toDbPayload = (t: Partial<MixTrack> & { id?: string }) => ({
    id: t.id,
    title: t.title,
    category: t.category,
    category_label: (t as any).categoryLabel ?? (t as any).category_label,
    duration: t.duration,
    recorded_at: (t as any).recordedAt ?? (t as any).recorded_at,
    description: t.description,
    date: t.date,
    plays: t.plays,
    bpm: t.bpm,
    image_url: (t as any).imageUrl ?? (t as any).image_url,
    audio_key: (t as any).audioKey ?? (t as any).audio_key,
    tags: t.tags ? JSON.stringify(t.tags) : undefined,
    tracklist_snippet: (t as any).tracklistSnippet ? JSON.stringify((t as any).tracklistSnippet) : ((t as any).tracklist_snippet ? JSON.stringify((t as any).tracklist_snippet) : undefined),
    youtube_url: (t as any).youtubeUrl ?? (t as any).youtube_url,
    youtube_id: (t as any).youtubeId ?? (t as any).youtube_id,
  });
  const addMixTrack = async (trackData: Omit<MixTrack, 'id'>) => {
    const tempId = `mix-${Date.now()}`;
    const newTrack: MixTrack = { ...trackData, id: tempId } as MixTrack;
    setMixTracks((prev) => [newTrack, ...prev]);
    setMixSaving(true);
    setMixError(null);
    try {
      const payload = toDbPayload({ ...trackData, id: tempId });
      const saved: any = await api.createMixTrack(payload);
      if (saved?.id) setMixTracks((prev) => prev.map((m) => m.id === tempId ? mapMixRow(saved) : m));
      return { success: true };
    } catch (e: any) {
      const msg = e.message || 'Failed to save mix to Supabase';
      setMixError(msg);
      setMixTracks((prev) => prev.filter((m) => m.id !== tempId));
      return { success: false, error: msg };
    } finally { setMixSaving(false); }
  };
  const updateMixTrack = async (id: string, updated: Partial<MixTrack>) => {
    const prev = mixTracks.find((m) => m.id === id);
    setMixTracks((cur) => cur.map((m) => (m.id === id ? { ...m, ...updated } : m)));
    setMixSaving(true);
    setMixError(null);
    try {
      await api.updateMixTrack(id, toDbPayload(updated));
      return { success: true };
    } catch (e: any) {
      const msg = e.message || 'Failed to update mix';
      setMixError(msg);
      if (prev) setMixTracks((cur) => cur.map((m) => (m.id === id ? prev : m)));
      return { success: false, error: msg };
    } finally { setMixSaving(false); }
  };
  const deleteMixTrack = async (id: string) => {
    const prev = mixTracks;
    setMixTracks((cur) => cur.filter((m) => m.id !== id));
    setMixSaving(true);
    setMixError(null);
    try {
      await api.deleteMixTrack(id);
      return { success: true };
    } catch (e: any) {
      const msg = e.message || 'Failed to delete mix';
      setMixError(msg);
      setMixTracks(prev);
      return { success: false, error: msg };
    } finally { setMixSaving(false); }
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
  const addInstagramPreview = async (url: string) => {
    const clean = url.trim();
    if (!clean) return { success: false, error: 'Empty URL' };
    const tempId = `ig-${Date.now()}`;
    const tempItem: InstagramPreviewItem = { id: tempId, url: clean };
    setInstagramPreviews((prev) => [...prev, tempItem]);
    setInstagramSaving(true);
    setInstagramError(null);
    try {
      const saved: any = await api.createInstagramPreview({ url: clean });
      if (saved?.id) setInstagramPreviews((prev) => prev.map((p) => p.id === tempId ? { id: saved.id, url: saved.url } : p));
      setInstagramLastSavedAt(new Date().toLocaleTimeString());
      return { success: true };
    } catch (e: any) {
      const msg = e.message || 'Failed to save to Supabase';
      setInstagramError(msg);
      setInstagramPreviews((prev) => prev.filter((p) => p.id !== tempId));
      return { success: false, error: msg };
    } finally {
      setInstagramSaving(false);
    }
  };
  const updateInstagramPreview = async (id: string, url: string) => {
    const prev = instagramPreviews.find((p) => p.id === id);
    setInstagramPreviews((cur) => cur.map((p) => (p.id === id ? { ...p, url } : p)));
    setInstagramSaving(true);
    setInstagramError(null);
    try {
      await api.updateInstagramPreview(id, { url });
      setInstagramLastSavedAt(new Date().toLocaleTimeString());
      return { success: true };
    } catch (e: any) {
      const msg = e.message || 'Failed to update Supabase';
      setInstagramError(msg);
      if (prev) setInstagramPreviews((cur) => cur.map((p) => (p.id === id ? prev : p)));
      return { success: false, error: msg };
    } finally {
      setInstagramSaving(false);
    }
  };
  const deleteInstagramPreview = async (id: string) => {
    const prev = instagramPreviews;
    setInstagramPreviews((cur) => cur.filter((p) => p.id !== id));
    setInstagramSaving(true);
    setInstagramError(null);
    try {
      await api.deleteInstagramPreview(id);
      setInstagramLastSavedAt(new Date().toLocaleTimeString());
      return { success: true };
    } catch (e: any) {
      const msg = e.message || 'Failed to delete from Supabase';
      setInstagramError(msg);
      setInstagramPreviews(prev);
      return { success: false, error: msg };
    } finally {
      setInstagramSaving(false);
    }
  };

  // Youtube previews
  const addYoutubePreview = async (url: string) => {
    const clean = url.trim();
    if (!clean) return { success: false, error: 'Empty URL' };
    const tempId = `yt-${Date.now()}`;
    const maxPos = Math.max(0, ...youtubePreviews.map((p) => p.position ?? 0));
    const tempItem: YoutubePreviewItem = { id: tempId, url: clean, position: maxPos + 1, size: 'normal' };
    setYoutubePreviews((prev) => [...prev, tempItem]);
    setYoutubeSaving(true);
    setYoutubeError(null);
    try {
      const saved: any = await api.createYoutubePreview({ url: clean, position: maxPos + 1, size: 'normal' });
      if (saved?.id) setYoutubePreviews((prev) => prev.map((p) => p.id === tempId ? { id: saved.id, url: saved.url, position: saved.position ?? maxPos + 1, size: (saved.size as any) || 'normal' } : p));
      setYoutubeLastSavedAt(new Date().toLocaleTimeString());
      return { success: true };
    } catch (e: any) {
      const msg = e.message || 'Failed to save to Supabase';
      setYoutubeError(msg);
      setYoutubePreviews((prev) => prev.filter((p) => p.id !== tempId));
      return { success: false, error: msg };
    } finally {
      setYoutubeSaving(false);
    }
  };
  const updateYoutubePreview = async (id: string, url: string) => {
    const prev = youtubePreviews.find((p) => p.id === id);
    setYoutubePreviews((cur) => cur.map((p) => (p.id === id ? { ...p, url } : p)));
    setYoutubeSaving(true);
    setYoutubeError(null);
    try {
      await api.updateYoutubePreview(id, { url });
      setYoutubeLastSavedAt(new Date().toLocaleTimeString());
      return { success: true };
    } catch (e: any) {
      const msg = e.message || 'Failed to update Supabase';
      setYoutubeError(msg);
      if (prev) setYoutubePreviews((cur) => cur.map((p) => (p.id === id ? prev : p)));
      return { success: false, error: msg };
    } finally {
      setYoutubeSaving(false);
    }
  };
  const deleteYoutubePreview = async (id: string) => {
    const prev = youtubePreviews;
    setYoutubePreviews((cur) => cur.filter((p) => p.id !== id));
    setYoutubeSaving(true);
    setYoutubeError(null);
    try {
      await api.deleteYoutubePreview(id);
      setYoutubeLastSavedAt(new Date().toLocaleTimeString());
      return { success: true };
    } catch (e: any) {
      const msg = e.message || 'Failed to delete from Supabase';
      setYoutubeError(msg);
      setYoutubePreviews(prev);
      return { success: false, error: msg };
    } finally {
      setYoutubeSaving(false);
    }
  };
  const updateYoutubeSize = async (id: string, size: YoutubePreviewItem['size']) => {
    const prev = youtubePreviews.find((p) => p.id === id);
    setYoutubePreviews((cur) => cur.map((p) => (p.id === id ? { ...p, size } : p)));
    setYoutubeSaving(true);
    setYoutubeError(null);
    try {
      await api.updateYoutubePreview(id, { size });
      setYoutubeLastSavedAt(new Date().toLocaleTimeString());
      return { success: true };
    } catch (e: any) {
      const msg = e.message || 'Failed to update size';
      setYoutubeError(msg);
      if (prev) setYoutubePreviews((cur) => cur.map((p) => (p.id === id ? prev : p)));
      return { success: false, error: msg };
    } finally {
      setYoutubeSaving(false);
    }
  };
  const reorderYoutubePreviews = async (orderedIds: string[]) => {
    const prev = [...youtubePreviews];
    const idToItem = new Map(prev.map((p) => [p.id, p]));
    const reordered = orderedIds.map((id, idx) => ({ ...(idToItem.get(id) as YoutubePreviewItem), position: idx })).filter((x) => x.id);
    setYoutubePreviews(reordered);
    setYoutubeSaving(true);
    setYoutubeError(null);
    try {
      await Promise.all(reordered.map((item) => api.updateYoutubePreview(item.id, { position: item.position })));
      setYoutubeLastSavedAt(new Date().toLocaleTimeString());
      return { success: true };
    } catch (e: any) {
      const msg = e.message || 'Failed to reorder';
      setYoutubeError(msg);
      setYoutubePreviews(prev);
      return { success: false, error: msg };
    } finally {
      setYoutubeSaving(false);
    }
  };
  const moveYoutubePreview = async (id: string, direction: 'up' | 'down') => {
    const idx = youtubePreviews.findIndex((p) => p.id === id);
    if (idx === -1) return { success: false, error: 'Not found' };
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= youtubePreviews.length) return { success: false, error: 'Out of bounds' };
    const newOrder = [...youtubePreviews];
    const [moved] = newOrder.splice(idx, 1);
    newOrder.splice(targetIdx, 0, moved);
    return reorderYoutubePreviews(newOrder.map((p) => p.id));
  };

  // Inquiries - persisted to Supabase via /api/bookings
  const [bookingSaving, setBookingSaving] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const refreshBookings = async () => {
    setBookingSaving(true);
    setBookingError(null);
    try {
      const { data, error } = await supabase.from('booking_inquiries').select('*').order('submitted_at', { ascending: false });
      if (!error && Array.isArray(data) && data.length) {
        setBookingInquiries(data.map((r: any) => ({
          id: r.id,
          clientName: r.client_name ?? r.clientName,
          email: r.email,
          phone: r.phone || '',
          eventType: (r.event_type ?? r.eventType) || '',
          eventDate: (r.event_date ?? r.eventDate) || '',
          venueName: (r.venue_name ?? r.venueName) || '',
          venueCity: (r.venue_city ?? r.venueCity) || '',
          guestCount: r.guest_count ?? r.guestCount ?? 0,
          selectedPackage: (r.selected_package ?? r.selectedPackage) || '',
          selectedAddOns: typeof r.selected_add_ons === 'string' ? JSON.parse(r.selected_add_ons) : ((r.selected_add_ons ?? []) as any),
          specialRequests: (r.special_requests ?? r.specialRequests) || '',
          estimatedTotal: r.estimated_total ?? r.estimatedTotal ?? 0,
          submittedAt: r.submitted_at ?? r.submittedAt,
          status: r.status || 'new',
          notes: r.notes || ''
        })));
        return;
      }
      if (error) throw error;
    } catch (e: any) {
      setBookingError(e.message || 'Failed to fetch bookings');
    }
    try {
      const rows: any = await api.getBookingInquiries();
      if (Array.isArray(rows) && rows.length) setBookingInquiries(rows);
    } catch {}
    finally { setBookingSaving(false); }
  };
  useEffect(() => { refreshBookings(); }, []);
  const addBookingInquiry = async (submission: BookingSubmission) => {
    const tempId = `inq-${Date.now()}`;
    const newInquiry: StoredBookingInquiry = {
      ...submission,
      id: tempId,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'new'
    };
    setBookingInquiries((prev) => [newInquiry, ...prev]);
    setBookingSaving(true);
    setBookingError(null);
    try {
      const saved: any = await api.submitBooking(newInquiry);
      if (saved?.id) setBookingInquiries((prev) => prev.map((p) => p.id === tempId ? { ...p, id: saved.id, submittedAt: saved.submittedAt || p.submittedAt } : p));
      return { success: true };
    } catch (e: any) {
      const msg = e.message || 'Failed to save booking to Supabase';
      setBookingError(msg);
      return { success: false, error: msg };
    } finally { setBookingSaving(false); }
  };
  const updateInquiryStatus = async (id: string, status: StoredBookingInquiry['status'], notes?: string) => {
    const prev = bookingInquiries.find((p) => p.id === id);
    setBookingInquiries((cur) => cur.map((p) => (p.id === id ? { ...p, status, ...(notes !== undefined ? { notes } : {}) } : p)));
    setBookingSaving(true);
    setBookingError(null);
    try {
      await api.updateBookingInquiry(id, { status, ...(notes !== undefined ? { notes } : {}) });
      return { success: true };
    } catch (e: any) {
      const msg = e.message || 'Failed to update booking';
      setBookingError(msg);
      if (prev) setBookingInquiries((cur) => cur.map((p) => (p.id === id ? prev : p)));
      return { success: false, error: msg };
    } finally { setBookingSaving(false); }
  };
  const deleteInquiry = async (id: string) => {
    const prev = bookingInquiries;
    setBookingInquiries((cur) => cur.filter((p) => p.id !== id));
    setBookingSaving(true);
    setBookingError(null);
    try {
      await api.deleteBookingInquiry(id);
      return { success: true };
    } catch (e: any) {
      const msg = e.message || 'Failed to delete booking';
      setBookingError(msg);
      setBookingInquiries(prev);
      return { success: false, error: msg };
    } finally { setBookingSaving(false); }
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
    setYoutubePreviews(INITIAL_YOUTUBE_PREVIEWS);
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
      youtubePreviews,
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
      if (data.youtubePreviews) setYoutubePreviews(data.youtubePreviews);
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
        mixSaving,
        mixError,
        addMixTrack,
        updateMixTrack,
        deleteMixTrack,
        refreshMixTracks,

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
        instagramSaving,
        instagramError,
        instagramLastSavedAt,
        addInstagramPreview,
        updateInstagramPreview,
        deleteInstagramPreview,
        refreshInstagramPreviews,

        youtubePreviews,
        youtubeSaving,
        youtubeError,
        youtubeLastSavedAt,
        addYoutubePreview,
        updateYoutubePreview,
        deleteYoutubePreview,
        updateYoutubeSize,
        reorderYoutubePreviews,
        moveYoutubePreview,
        refreshYoutubePreviews,

        bookingInquiries,
        bookingSaving,
        bookingError,
        addBookingInquiry,
        updateInquiryStatus,
        deleteInquiry,
        refreshBookings,

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
