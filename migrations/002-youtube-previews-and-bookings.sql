CREATE TABLE IF NOT EXISTS youtube_previews (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS booking_inquiries (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  event_type TEXT,
  event_date TEXT,
  venue_name TEXT,
  venue_city TEXT,
  guest_count INTEGER,
  selected_package TEXT,
  selected_add_ons TEXT,
  special_requests TEXT,
  estimated_total INTEGER,
  submitted_at TEXT DEFAULT (datetime('now')),
  status TEXT DEFAULT 'new',
  notes TEXT
);
