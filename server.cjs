const express = require('express');
const path = require('path');
require('dotenv').config();
const app = express();
app.use(express.json());
const SUPA_URL = process.env.SUPABASE_URL || 'https://rxswzexcmfrtsmsykgmk.supabase.co';
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET || process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_P1lQ0Q0FJXgm-dFKTeQ8Lw_yogcNukI';
async function supaFetch(supaPath, init = {}) {
  const res = await fetch(`${SUPA_URL}/rest/v1/${supaPath}`, {
    ...init,
    headers: { 'apikey': SUPA_KEY, 'Authorization': `Bearer ${SUPA_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation', ...(init.headers || {}) }
  });
  const text = await res.text();
  let data; try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) throw new Error(data?.message || JSON.stringify(data));
  return data;
}
app.get('/api/mix-tracks', async (req, res) => { try { const data = await supaFetch('mix_tracks?order=created_at.desc'); res.json(data || []); } catch (err) { res.status(500).json({ error: err.message }); } });
app.post('/api/mix-tracks', async (req, res) => {
  try {
    const b = req.body;
    const row = { id: b.id || `mix-${Date.now()}`, title: b.title, category: b.category, category_label: b.category_label || b.categoryLabel, duration: b.duration, recorded_at: b.recorded_at || b.recordedAt, description: b.description, date: b.date, plays: b.plays, bpm: b.bpm, image_url: b.image_url || b.imageUrl, audio_key: b.audio_key || b.audioKey, tags: typeof b.tags === 'string' ? b.tags : JSON.stringify(b.tags || []), tracklist_snippet: typeof b.tracklist_snippet === 'string' ? b.tracklist_snippet : JSON.stringify(b.tracklist_snippet || b.tracklistSnippet || []), youtube_url: b.youtube_url || b.youtubeUrl, youtube_id: b.youtube_id || b.youtubeId };
    if (!row.title) return res.status(400).json({ error: 'title required' });
    const data = await supaFetch('mix_tracks', { method: 'POST', body: JSON.stringify(row) });
    res.json(data?.[0] || { id: row.id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/mix-tracks/:id', async (req, res) => {
  try {
    const b = req.body; const fields = {};
    if (b.title !== undefined) fields.title = b.title;
    if (b.category !== undefined) fields.category = b.category;
    if (b.category_label !== undefined || b.categoryLabel !== undefined) fields.category_label = b.category_label || b.categoryLabel;
    if (b.duration !== undefined) fields.duration = b.duration;
    if (b.recorded_at !== undefined || b.recordedAt !== undefined) fields.recorded_at = b.recorded_at || b.recordedAt;
    if (b.description !== undefined) fields.description = b.description;
    if (b.date !== undefined) fields.date = b.date;
    if (b.plays !== undefined) fields.plays = b.plays;
    if (b.bpm !== undefined) fields.bpm = b.bpm;
    if (b.image_url !== undefined || b.imageUrl !== undefined) fields.image_url = b.image_url || b.imageUrl;
    if (b.audio_key !== undefined || b.audioKey !== undefined) fields.audio_key = b.audio_key || b.audioKey;
    if (b.tags !== undefined) fields.tags = typeof b.tags === 'string' ? b.tags : JSON.stringify(b.tags);
    if (b.tracklist_snippet !== undefined || b.tracklistSnippet !== undefined) fields.tracklist_snippet = typeof (b.tracklist_snippet || b.tracklistSnippet) === 'string' ? (b.tracklist_snippet || b.tracklistSnippet) : JSON.stringify(b.tracklist_snippet || b.tracklistSnippet);
    if (b.youtube_url !== undefined || b.youtubeUrl !== undefined) fields.youtube_url = b.youtube_url || b.youtubeUrl;
    if (b.youtube_id !== undefined || b.youtubeId !== undefined) fields.youtube_id = b.youtube_id || b.youtubeId;
    fields.updated_at = new Date().toISOString();
    await supaFetch(`mix_tracks?id=eq.${req.params.id}`, { method: 'PATCH', body: JSON.stringify(fields) });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/mix-tracks/:id', async (req, res) => { try { await supaFetch(`mix_tracks?id=eq.${req.params.id}`, { method: 'DELETE' }); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); } });
app.get('/api/service-packages', async (req, res) => { try { const data = await supaFetch('service_packages?order=created_at.desc'); res.json(data || []); } catch (err) { res.status(500).json({ error: err.message }); } });
app.get('/api/add-ons', async (req, res) => { try { const data = await supaFetch('add_on_items?order=created_at.desc'); res.json(data || []); } catch (err) { res.status(500).json({ error: err.message }); } });
app.get('/api/faqs', async (req, res) => { try { const data = await supaFetch('faq_items?order=created_at.desc'); res.json(data || []); } catch (err) { res.status(500).json({ error: err.message }); } });
app.get('/api/instagram-previews', async (req, res) => { try { const data = await supaFetch('instagram_previews?order=created_at.desc'); res.json(data || []); } catch (err) { res.status(500).json({ error: err.message }); } });
app.post('/api/instagram-previews', async (req, res) => { try { const { url } = req.body; if (!url) return res.status(400).json({ error: 'url required' }); const id = `ig-${Date.now()}`; const data = await supaFetch('instagram_previews', { method: 'POST', body: JSON.stringify({ id, url }) }); res.json(data?.[0] || { id, url }); } catch (err) { res.status(500).json({ error: err.message }); } });
app.put('/api/instagram-previews/:id', async (req, res) => { try { await supaFetch(`instagram_previews?id=eq.${req.params.id}`, { method: 'PATCH', body: JSON.stringify({ url: req.body.url }) }); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); } });
app.delete('/api/instagram-previews/:id', async (req, res) => { try { await supaFetch(`instagram_previews?id=eq.${req.params.id}`, { method: 'DELETE' }); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); } });
app.get('/api/youtube-previews', async (req, res) => { try { const data = await supaFetch('youtube_previews?order=created_at.desc'); res.json(data || []); } catch (err) { res.status(500).json({ error: err.message }); } });
app.post('/api/youtube-previews', async (req, res) => { try { const { url } = req.body; if (!url) return res.status(400).json({ error: 'url required' }); const id = `yt-${Date.now()}`; const data = await supaFetch('youtube_previews', { method: 'POST', body: JSON.stringify({ id, url }) }); res.json(data?.[0] || { id, url }); } catch (err) { res.status(500).json({ error: err.message }); } });
app.put('/api/youtube-previews/:id', async (req, res) => { try { await supaFetch(`youtube_previews?id=eq.${req.params.id}`, { method: 'PATCH', body: JSON.stringify({ url: req.body.url }) }); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); } });
app.delete('/api/youtube-previews/:id', async (req, res) => { try { await supaFetch(`youtube_previews?id=eq.${req.params.id}`, { method: 'DELETE' }); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); } });
function mapBookingRow(r) { return { id: r.id, clientName: r.client_name, email: r.email, phone: r.phone || '', eventType: r.event_type || '', eventDate: r.event_date || '', venueName: r.venue_name || '', venueCity: r.venue_city || '', guestCount: r.guest_count ?? 0, selectedPackage: r.selected_package || '', selectedAddOns: r.selected_add_ons ? JSON.parse(r.selected_add_ons) : [], specialRequests: r.special_requests || '', estimatedTotal: r.estimated_total ?? 0, submittedAt: r.submitted_at, status: r.status || 'new', notes: r.notes || '' }; }
app.get('/api/bookings', async (req, res) => { try { const data = await supaFetch('booking_inquiries?order=submitted_at.desc'); res.json((data || []).map(mapBookingRow)); } catch (err) { res.status(500).json({ error: err.message }); } });
app.post('/api/bookings', async (req, res) => { try { const b = req.body; const id = b.id || `inq-${Date.now()}`; if (!(b.clientName || b.client_name) || !b.email) return res.status(400).json({ error: 'clientName and email required' }); const row = { id, client_name: b.clientName || b.client_name, email: b.email, phone: b.phone || '', event_type: b.eventType || b.event_type || '', event_date: b.eventDate || b.event_date || '', venue_name: b.venueName || b.venue_name || '', venue_city: b.venueCity || b.venue_city || '', guest_count: b.guestCount ?? b.guest_count ?? 0, selected_package: b.selectedPackage || b.selected_package || '', selected_add_ons: JSON.stringify(b.selectedAddOns || b.selected_add_ons || []), special_requests: b.specialRequests || b.special_requests || '', estimated_total: b.estimatedTotal ?? b.estimated_total ?? 0, submitted_at: b.submittedAt || b.submitted_at || new Date().toISOString().replace('T',' ').slice(0,19), status: b.status || 'new', notes: b.notes || '' }; const data = await supaFetch('booking_inquiries', { method: 'POST', body: JSON.stringify(row) }); res.json(data?.[0] ? mapBookingRow(data[0]) : { id }); } catch (err) { res.status(500).json({ error: err.message }); } });
app.put('/api/bookings/:id', async (req, res) => { try { const fields = {}; if (req.body.status !== undefined) fields.status = req.body.status; if (req.body.notes !== undefined) fields.notes = req.body.notes; if (req.body.clientName !== undefined) fields.client_name = req.body.clientName; if (req.body.email !== undefined) fields.email = req.body.email; if (req.body.phone !== undefined) fields.phone = req.body.phone; await supaFetch(`booking_inquiries?id=eq.${req.params.id}`, { method: 'PATCH', body: JSON.stringify(fields) }); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); } });
app.delete('/api/bookings/:id', async (req, res) => { try { await supaFetch(`booking_inquiries?id=eq.${req.params.id}`, { method: 'DELETE' }); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); } });
app.get('*', (req, res) => { if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' }); res.sendFile(path.join(__dirname, 'dist', 'index.html')); });
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} (Supabase: ${SUPA_URL})`));
