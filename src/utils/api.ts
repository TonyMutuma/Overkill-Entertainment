const API_BASE = 'http://localhost:4000/api';

export const api = {
  // Mix Tracks
  getMixTracks: async () => {
    const res = await fetch(`${API_BASE}/mix-tracks`);
    return res.json();
  },
  getMixTrackById: async (id) => {
    const res = await fetch(`${API_BASE}/mix-tracks/${id}`);
    return res.json();
  },

  // Service Packages
  getServicePackages: async () => {
    const res = await fetch(`${API_BASE}/service-packages`);
    return res.json();
  },
  getServicePackageById: async (id) => {
    const res = await fetch(`${API_BASE}/service-packages/${id}`);
    return res.json();
  },

  // Add-ons
  getAddOnItems: async () => {
    const res = await fetch(`${API_BASE}/add-ons`);
    return res.json();
  },

  // FAQ Items
  getFaqItems: async () => {
    const res = await fetch(`${API_BASE}/faqs`);
    return res.json();
  },

  // Bookings
  submitBooking: async (bookingData) => {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    return res.json();
  },

  // Dashboard/CMS
  getCMSData: async () => {
    const res = await fetch(`${API_BASE}/dashboard/cms`);
    return res.json();
  },
};