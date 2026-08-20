export type NavTab = 'home' | 'mixes' | 'calendar' | 'services' | 'faq';

export type EventCategory = 'all' | 'club' | 'corporate' | 'wedding' | 'festival' | 'private';

export interface MixTrack {
  id: string;
  title: string;
  category: 'club' | 'corporate' | 'wedding' | 'festival' | 'private';
  categoryLabel: string;
  duration: string;
  recordedAt: string;
  description: string;
  date: string;
  plays: string;
  bpm: number;
  imageUrl: string;
  audioKey: string;
  tags: string[];
  tracklistSnippet: string[];
}

export interface CalendarDay {
  dayNumber: number;
  dateString: string; // YYYY-MM-DD
  isCurrentMonth: boolean;
  status: 'available' | 'booked' | 'restricted';
  notes?: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  tag: string;
  tagType: 'energy' | 'popular' | 'elegance';
  price: number;
  pricePeriod: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  idealFor: string;
}

export interface AddOnItem {
  id: string;
  name: string;
  price: number;
  description: string;
  iconName: string;
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface BookingSubmission {
  clientName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  venueName: string;
  venueCity: string;
  guestCount: number;
  selectedPackage: string;
  selectedAddOns: string[];
  specialRequests: string;
  estimatedTotal: number;
}

export interface StoredBookingInquiry extends BookingSubmission {
  id: string;
  submittedAt: string;
  status: 'new' | 'reviewed' | 'confirmed' | 'archived';
  notes?: string;
}

export type AdminRole = 'superadmin' | 'manager' | 'editor';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  roleTitle: string;
  avatar: string;
  badgeColor: string;
}

export interface PageVisibilityConfig {
  pages: {
    home: boolean;
    mixes: boolean;
    calendar: boolean;
    services: boolean;
    faq: boolean;
  };
  sections: {
    hero: boolean;
    trustVenues: boolean;
    liveAudioTeaser: boolean;
    statsTicker: boolean;
    featuredMix: boolean;
    ctaBanner: boolean;
    comparisonTable: boolean;
    addOnsBuilder: boolean;
    currencyBanner: boolean;
    audioPlayerBar: boolean;
    heroMediaStrip: boolean;
  };
}

export interface SiteSettings {
  brandName: string;
  djName: string;
  tagline: string;
  bio: string;
  location: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  instagramUrl: string;
  soundcloudUrl: string;
  youtubeUrl: string;
  stats: {
    showsCount: string;
    playsCount: string;
    countriesCount: string;
    satisfactionRate: string;
  };
}

export interface DJAssets {
  heroBg: string;
  djPortraitStudio: string;
  djPerformingCrowd: string;
  djMixerGear: string;
  clubLaser: string;
  corporateLounge: string;
  festivalStage: string;
  rooftopSunset: string;
  luxuryWedding: string;
  [key: string]: string;
}

export interface VenueItem {
  id: string;
  name: string;
  location: string;
}

export interface ComparisonRow {
  id: string;
  feature: string;
  standardDjs: string;
  overkill: string;
}


