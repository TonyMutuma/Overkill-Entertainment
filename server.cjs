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
      res.json(rows);
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
      audio_key TEXT NOT NULL
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
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});