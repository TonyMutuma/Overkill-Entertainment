ALTER TABLE youtube_previews ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;
ALTER TABLE youtube_previews ADD COLUMN IF NOT EXISTS size TEXT DEFAULT 'normal' CHECK (size IN ('normal','large','featured'));
CREATE INDEX IF NOT EXISTS idx_youtube_previews_position ON youtube_previews(position);
