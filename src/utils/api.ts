import { MixTrack } from '../types';

// In production (Cloudflare Pages) fetch hits Functions at /api/* -> D1 binding
// In local dev, Vite proxies /api to Express server.cjs (localhost:4000) which now ALSO talks to remote D1
// So both envs read/write the SAME remote table.

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

async function req(path: string, init?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, { headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) }, ...init });
  if (!res.ok) {
    const text = await res.text().catch(()=>'');
    throw new Error(text || `API ${res.status}`);
  }
  return res.json();
}

export const api = {
  getMixTracks: () => req('/mix-tracks'),
  getMixTrackById: (id:string) => req(`/mix-tracks/${id}`),
  createMixTrack: (data:any) => req('/mix-tracks', { method:'POST', body: JSON.stringify(data)}),
  updateMixTrack: (id:string, data:any) => req(`/mix-tracks/${id}`, { method:'PUT', body: JSON.stringify(data)}),
  deleteMixTrack: (id:string) => req(`/mix-tracks/${id}`, { method:'DELETE'}),
  getServicePackages: () => req('/service-packages'),
  getServicePackageById: (id:string) => req(`/service-packages/${id}`),
  getAddOnItems: () => req('/add-ons'),
  getFaqItems: () => req('/faqs'),
  getVenues: () => req('/venues'),
  getComparison: () => req('/comparison'),
  getCalendarOverrides: () => req('/calendar-overrides'),
  getSiteSettings: () => req('/site-settings'),
  getPageVisibility: () => req('/page-visibility'),
  submitBooking: (bookingData:any) => req('/bookings', { method:'POST', body: JSON.stringify(bookingData)}),
  getBookings: () => req('/bookings'),
  getCMSData: () => req('/dashboard/cms'),
};
