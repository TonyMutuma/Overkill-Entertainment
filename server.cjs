const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

const USE_REMOTE_D1 = !!process.env.CLOUDFLARE_D1_TOKEN;

async function executeQuery(sql, params = []) {
  if (USE_REMOTE_D1) {
    const url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${process.env.CLOUDFLARE_DATABASE_ID}/query`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${process.env.CLOUDFLARE_D1_TOKEN}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ sql, params })
    });
    const data = await res.json();
    if (!data.success) throw new Error(JSON.stringify(data.errors));
    return data.result[0].results; // D1 returns results array per query
  } else {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

// Routes
app.get('/api/mix-tracks', async (req, res) => {
  try {
    const rows = await executeQuery('SELECT * FROM mix_tracks ORDER BY created_at DESC');
    const mapped = (rows || []).map(r => ({
      ...r,
      tags: r.tags ? JSON.parse(r.tags) : [],
      tracklist_snippet: r.tracklist_snippet ? JSON.parse(r.tracklist_snippet) : [],
      tracklistSnippet: r.tracklist_snippet ? JSON.parse(r.tracklist_snippet) : []
    }));
    res.json(mapped);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/mix-tracks', async (req, res) => {
  const b = req.body;
  const id = b.id || `mix-${Date.now()}`;
  try {
    await executeQuery(
      `INSERT INTO mix_tracks (id, title, category, category_label, duration, recorded_at, description, date, plays, bpm, image_url, audio_key, tags, tracklist_snippet, youtube_url, youtube_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [id, b.title, b.category, b.category_label || b.categoryLabel, b.duration, b.recorded_at || b.recordedAt, b.description, b.date, b.plays, b.bpm, b.image_url || b.imageUrl, b.audio_key || b.audioKey, typeof b.tags === 'string' ? b.tags : JSON.stringify(b.tags||[]), typeof b.tracklist_snippet === 'string' ? b.tracklist_snippet : JSON.stringify(b.tracklist_snippet || b.tracklistSnippet || []), b.youtube_url || b.youtubeUrl, b.youtube_id || b.youtubeId]
    );
    const rows = await executeQuery('SELECT * FROM mix_tracks WHERE id=?', [id]);
    res.json(rows?.[0] || { id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/mix-tracks/:id', async (req, res) => {
  const b = req.body;
  try {
    const fields = [];
    const vals = [];
    const map = { title:'title', category:'category', category_label:'category_label', categoryLabel:'category_label', duration:'duration', recorded_at:'recorded_at', recordedAt:'recorded_at', description:'description', date:'date', plays:'plays', bpm:'bpm', image_url:'image_url', imageUrl:'image_url', audio_key:'audio_key', audioKey:'audio_key', tags:'tags', tracklist_snippet:'tracklist_snippet', tracklistSnippet:'tracklist_snippet', youtube_url:'youtube_url', youtubeUrl:'youtube_url', youtube_id:'youtube_id', youtubeId:'youtube_id' };
    for (const [k,v] of Object.entries(b)) {
      const col = map[k];
      if (!col) continue;
      if (fields.includes(`${col}=?`)) continue;
      let val = v;
      if (col==='tags' || col==='tracklist_snippet') val = typeof v==='string'?v:JSON.stringify(v);
      fields.push(`${col}=?`);
      vals.push(val);
    }
    if (!fields.length) return res.status(400).json({ error: 'no fields' });
    fields.push(`updated_at=?`);
    vals.push(new Date().toISOString());
    vals.push(req.params.id);
    await executeQuery(`UPDATE mix_tracks SET ${fields.join(', ')} WHERE id=?`, vals);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/mix-tracks/:id', async (req, res) => {
  try {
    await executeQuery('DELETE FROM mix_tracks WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/service-packages', async (req, res) => {
  try {
    const rows = await executeQuery('SELECT * FROM service_packages');
    res.json(rows || []);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/add-ons', async (req, res) => {
  try {
    const rows = await executeQuery('SELECT * FROM add_on_items');
    res.json(rows || []);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/faqs', async (req, res) => {
  try {
    const rows = await executeQuery('SELECT * FROM faq_items');
    res.json(rows || []);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/instagram-previews', async (req, res) => {
  try {
    const rows = await executeQuery('SELECT * FROM instagram_previews ORDER BY created_at DESC');
    res.json(rows || []);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/instagram-previews', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'url required' });
  const id = `ig-${Date.now()}`;
  try {
    await executeQuery('INSERT INTO instagram_previews (id, url) VALUES (?,?)', [id, url]);
    const rows = await executeQuery('SELECT * FROM instagram_previews WHERE id=?', [id]);
    res.json(rows?.[0] || { id, url });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/instagram-previews/:id', async (req, res) => {
  const { url } = req.body;
  try {
    await executeQuery('UPDATE instagram_previews SET url=? WHERE id=?', [url, req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/instagram-previews/:id', async (req, res) => {
  try {
    await executeQuery('DELETE FROM instagram_previews WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/youtube-previews', async (req, res) => {
  try {
    const rows = await executeQuery('SELECT * FROM youtube_previews ORDER BY created_at DESC');
    res.json(rows || []);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/youtube-previews', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'url required' });
  const id = `yt-${Date.now()}`;
  try {
    await executeQuery('INSERT INTO youtube_previews (id, url) VALUES (?,?)', [id, url]);
    const rows = await executeQuery('SELECT * FROM youtube_previews WHERE id=?', [id]);
    res.json(rows?.[0] || { id, url });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/youtube-previews/:id', async (req, res) => {
  const { url } = req.body;
  try {
    await executeQuery('UPDATE youtube_previews SET url=? WHERE id=?', [url, req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/youtube-previews/:id', async (req, res) => {
  try {
    await executeQuery('DELETE FROM youtube_previews WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

function mapBookingRow(r) {
  return {
    id: r.id,
    clientName: r.client_name,
    email: r.email,
    phone: r.phone || '',
    eventType: r.event_type || '',
    eventDate: r.event_date || '',
    venueName: r.venue_name || '',
    venueCity: r.venue_city || '',
    guestCount: r.guest_count ?? 0,
    selectedPackage: r.selected_package || '',
    selectedAddOns: r.selected_add_ons ? JSON.parse(r.selected_add_ons) : [],
    specialRequests: r.special_requests || '',
    estimatedTotal: r.estimated_total ?? 0,
    submittedAt: r.submitted_at,
    status: r.status || 'new',
    notes: r.notes || ''
  };
}
app.get('/api/bookings', async (req, res) => {
  try {
    const rows = await executeQuery('SELECT * FROM booking_inquiries ORDER BY submitted_at DESC');
    res.json((rows || []).map(mapBookingRow));
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/bookings', async (req, res) => {
  const b = req.body;
  const id = b.id || `inq-${Date.now()}`;
  const clientName = b.clientName || b.client_name;
  const email = b.email;
  if (!clientName || !email) return res.status(400).json({ error: 'clientName and email required' });
  try {
    await executeQuery(
      `INSERT INTO booking_inquiries (id, client_name, email, phone, event_type, event_date, venue_name, venue_city, guest_count, selected_package, selected_add_ons, special_requests, estimated_total, submitted_at, status, notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [id, clientName, email, b.phone || '', b.eventType || b.event_type || '', b.eventDate || b.event_date || '', b.venueName || b.venue_name || '', b.venueCity || b.venue_city || '', b.guestCount ?? b.guest_count ?? 0, b.selectedPackage || b.selected_package || '', JSON.stringify(b.selectedAddOns || b.selected_add_ons || []), b.specialRequests || b.special_requests || '', b.estimatedTotal ?? b.estimated_total ?? 0, b.submittedAt || b.submitted_at || new Date().toISOString().replace('T',' ').slice(0,19), b.status || 'new', b.notes || '']
    );
    const rows = await executeQuery('SELECT * FROM booking_inquiries WHERE id=?', [id]);
    res.json(rows?.[0] ? mapBookingRow(rows[0]) : { id, success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/bookings/:id', async (req, res) => {
  const { status, notes, clientName, email, phone } = req.body;
  try {
    const fields = [];
    const vals = [];
    if (status !== undefined) { fields.push('status=?'); vals.push(status); }
    if (notes !== undefined) { fields.push('notes=?'); vals.push(notes); }
    if (clientName !== undefined) { fields.push('client_name=?'); vals.push(clientName); }
    if (email !== undefined) { fields.push('email=?'); vals.push(email); }
    if (phone !== undefined) { fields.push('phone=?'); vals.push(phone); }
    if (!fields.length) return res.status(400).json({ error: 'no fields' });
    vals.push(req.params.id);
    await executeQuery(`UPDATE booking_inquiries SET ${fields.join(', ')} WHERE id=?`, vals);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    await executeQuery('DELETE FROM booking_inquiries WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Local DB fallback initialization
let db = null;
if (!USE_REMOTE_D1) {
  db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));
  console.log('Running in local SQLite mode');
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} (D1/Local Hybrid: ${USE_REMOTE_D1 ? 'REMOTE' : 'LOCAL'})`));
