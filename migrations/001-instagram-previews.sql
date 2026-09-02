CREATE TABLE IF NOT EXISTS instagram_previews (id TEXT PRIMARY KEY, url TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')));
