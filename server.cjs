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
    const rows = await executeQuery('SELECT * FROM mix_tracks');
    const mapped = (rows || []).map(r => ({
      ...r,
      tags: r.tags ? JSON.parse(r.tags) : [],
      tracklistSnippet: r.tracklist_snippet ? JSON.parse(r.tracklist_snippet) : []
    }));
    res.json(mapped);
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

app.post('/api/bookings', async (req, res) => {
  const { clientName, email, phone, venueName, venueCity, guestCount, selectedPackage, selectedAddOns, estimatedTotal, eventDate } = req.body;
  try {
    await executeQuery(
      `INSERT INTO booking_inquiries (id, client_name, email, phone, venue_name, venue_city, guest_count, selected_package, selected_add_ons, estimated_total, event_date) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [`inq-${Date.now()}`, clientName, email, phone, venueName, venueCity, guestCount, selectedPackage, JSON.stringify(selectedAddOns), estimatedTotal, eventDate]
    );
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
