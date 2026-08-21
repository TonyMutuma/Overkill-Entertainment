const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/mix-tracks', (req, res) => {
  db.all('SELECT * FROM mix_tracks', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      const mapped = (rows || []).map(r => ({
        ...r,
        tags: r.tags ? (()=>{try{return JSON.parse(r.tags)}catch{return []}})() : [],
        tracklistSnippet: r.tracklist_snippet ? (()=>{try{return JSON.parse(r.tracklist_snippet)}catch{return []}})() : (r.tracklistSnippet ? JSON.parse(r.tracklistSnippet) : []),
      }));
      res.json(mapped);
    }
  });
});

app.get('/api/mix-tracks/:id', (req, res) => {
  db.get('SELECT * FROM mix_tracks WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Track not found' });
    }
  });
});

app.get('/api/service-packages', (req, res) => {
  db.all('SELECT * FROM service_packages', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.get('/api/service-packages/:id', (req, res) => {
  db.get('SELECT * FROM service_packages WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Package not found' });
    }
  });
});

app.get('/api/add-ons', (req, res) => {
  db.all('SELECT * FROM add_on_items', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.get('/api/faqs', (req, res) => {
  db.all('SELECT * FROM faq_items', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

function extractYoutubeIdServer(url){
  if(!url) return null;
  const t=url.trim();
  if(/^[a-zA-Z0-9_-]{11}$/.test(t)) return t;
  try{ const u=new URL(t); if(u.hostname.includes('youtu.be')) return u.pathname.slice(1).split('/')[0]||null; if(u.searchParams.get('v')) return u.searchParams.get('v'); const p=u.pathname.split('/'); const e=p.indexOf('embed'); if(e!==-1&&p[e+1]) return p[e+1]; const s=p.indexOf('shorts'); if(s!==-1&&p[s+1]) return p[s+1]; }catch{}
  const m=t.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/); return m?m[1]:null;
}

app.post('/api/mix-tracks', (req, res) => {
  const { id, title, category, categoryLabel, category_label, duration, recordedAt, recorded_at, description, date, plays, bpm, imageUrl, image_url, audioKey, audio_key, youtubeUrl, youtube_url, youtubeId, youtube_id, tags, tracklistSnippet, tracklist_snippet } = req.body;
  if(!title) return res.status(400).json({error:'title required'});
  const nid = id || `mix-${Date.now()}`;
  const finalCategoryLabel = categoryLabel || category_label || category;
  const finalRecordedAt = recordedAt || recorded_at || '';
  const finalImageUrl = imageUrl || image_url || '';
  const finalAudioKey = audioKey || audio_key || 'tech-house';
  const rawYoutube = youtubeUrl || youtube_url || youtubeId || youtube_id || '';
  const yId = extractYoutubeIdServer(rawYoutube) || '';
  const yUrl = rawYoutube || '';
  const tagsStr = tags ? JSON.stringify(tags) : '[]';
  const snippetStr = tracklistSnippet ? JSON.stringify(tracklistSnippet) : (tracklist_snippet ? JSON.stringify(tracklist_snippet) : '[]');
  db.run(`INSERT INTO mix_tracks (id, title, category, category_label, duration, recorded_at, description, date, plays, bpm, image_url, audio_key, youtube_url, youtube_id, tags, tracklist_snippet) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [nid, title, category, finalCategoryLabel, duration, finalRecordedAt, description, date, plays, bpm, finalImageUrl, finalAudioKey, yUrl, yId, tagsStr, snippetStr],
    function(err){ if(err) res.status(500).json({error:err.message}); else res.json({success:true, id:nid}); }
  );
});

app.put('/api/mix-tracks/:id', (req, res) => {
  const { title, category, categoryLabel, duration, recordedAt, description, date, plays, bpm, imageUrl, audioKey, youtubeUrl, youtubeId, tags, tracklistSnippet } = req.body;
  const rawYoutube = youtubeUrl || youtubeId || '';
  const yId = rawYoutube ? (extractYoutubeIdServer(rawYoutube) || '') : undefined;
  const fields=[]; const vals=[];
  const map={ title, category, category_label: categoryLabel, duration, recorded_at: recordedAt, description, date, plays, bpm, image_url: imageUrl, audio_key: audioKey, youtube_url: youtubeUrl, youtube_id: yId };
  Object.entries(map).forEach(([k,v])=>{ if(v!==undefined){ fields.push(`${k} = ?`); vals.push(v); }});
  if(tags!==undefined){ fields.push(`tags = ?`); vals.push(JSON.stringify(tags)); }
  if(tracklistSnippet!==undefined){ fields.push(`tracklist_snippet = ?`); vals.push(JSON.stringify(tracklistSnippet)); }
  if(fields.length===0) return res.status(400).json({error:'no fields'});
  vals.push(req.params.id);
  db.run(`UPDATE mix_tracks SET ${fields.join(', ')} WHERE id = ?`, vals, function(err){ if(err) res.status(500).json({error:err.message}); else res.json({success:true}); });
});

app.delete('/api/mix-tracks/:id', (req,res)=>{
  db.run('DELETE FROM mix_tracks WHERE id = ?', [req.params.id], function(err){ if(err) res.status(500).json({error:err.message}); else res.json({success:true}); });
});

app.post('/api/bookings', (req, res) => {
  const {
    clientName, email, phone,
    venueName, venueCity, guestCount,
    selectedPackage, selectedAddOns,
    estimatedTotal, eventDate
  } = req.body;

  const addOnsStr = selectedAddOns ? JSON.stringify(selectedAddOns) : '';

  db.run(
    `INSERT INTO bookings (client_name, email, phone, venue_name, venue_city, guest_count, selected_package, selected_add_ons, estimated_total, event_date, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [clientName, email, phone, venueName, venueCity, guestCount, selectedPackage, addOnsStr, estimatedTotal, eventDate],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ success: true, bookingId: this.lastID });
      }
    }
  );
});

// Catch-all: serve React app for any non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 4000;

let db = null;

// Initialize SQLite database
db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
  if (err) {
    console.error('Database initialization error:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Create tables
db.serialize(() => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS mix_tracks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      category_label TEXT NOT NULL,
      duration TEXT NOT NULL,
      recorded_at TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      plays TEXT NOT NULL,
      bpm INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      audio_key TEXT NOT NULL,
      youtube_url TEXT DEFAULT '',
      youtube_id TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS service_packages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tag TEXT NOT NULL,
      tag_type TEXT NOT NULL,
      price INTEGER NOT NULL,
      price_period TEXT NOT NULL,
      description TEXT NOT NULL,
      ideal_for TEXT NOT NULL,
      is_popular BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE IF NOT EXISTS add_on_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      description TEXT NOT NULL,
      icon_name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS faq_items (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      venue_name TEXT NOT NULL,
      venue_city TEXT NOT NULL,
      guest_count INTEGER NOT NULL,
      selected_package TEXT NOT NULL,
      selected_add_ons TEXT DEFAULT '',
      estimated_total INTEGER NOT NULL,
      event_date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      status TEXT DEFAULT 'pending'
    );
  `, (err) => {
    if (err) {
      console.error('Table creation error:', err);
    } else {
      console.log('Tables created successfully');
      const migrates = [
        "ALTER TABLE mix_tracks ADD COLUMN youtube_url TEXT DEFAULT ''",
        "ALTER TABLE mix_tracks ADD COLUMN youtube_id TEXT DEFAULT ''",
        "ALTER TABLE mix_tracks ADD COLUMN tags TEXT DEFAULT '[]'",
        "ALTER TABLE mix_tracks ADD COLUMN tracklist_snippet TEXT DEFAULT '[]'"
      ];
      migrates.forEach(sql => db.run(sql, () => {}));
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});