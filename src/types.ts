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
