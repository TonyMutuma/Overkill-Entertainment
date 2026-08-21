const API_BASE = 'http://localhost:4000/api';

export const api = {
  getMixTracks: async () => {
    const res = await fetch(`${API_BASE}/mix-tracks`);
    return res.json();
  },
  getMixTrackById: async (id:string) => {
    const res = await fetch(`${API_BASE}/mix-tracks/${id}`);
    return res.json();
  },
  createMixTrack: async (data:any) => {
    const res = await fetch(`${API_BASE}/mix-tracks`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
    return res.json();
  },
  updateMixTrack: async (id:string, data:any) => {
    const res = await fetch(`${API_BASE}/mix-tracks/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
    return res.json();
  },
  deleteMixTrack: async (id:string) => {
    const res = await fetch(`${API_BASE}/mix-tracks/${id}`, { method:'DELETE'});
    return res.json();
  },
  getServicePackages: async () => {
    const res = await fetch(`${API_BASE}/service-packages`);
    return res.json();
  },
  getServicePackageById: async (id:string) => {
    const res = await fetch(`${API_BASE}/service-packages/${id}`);
    return res.json();
  },
  getAddOnItems: async () => {
    const res = await fetch(`${API_BASE}/add-ons`);
    return res.json();
  },
  getFaqItems: async () => {
    const res = await fetch(`${API_BASE}/faqs`);
    return res.json();
  },
  submitBooking: async (bookingData:any) => {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    return res.json();
  },
  getCMSData: async () => {
    const res = await fetch(`${API_BASE}/dashboard/cms`);
    return res.json();
  },
};
