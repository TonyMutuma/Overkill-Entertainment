export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const u = new URL(trimmed);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1).split('/')[0] || null;
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    const parts = u.pathname.split('/');
    const embedIdx = parts.indexOf('embed');
    if (embedIdx !== -1 && parts[embedIdx + 1]) return parts[embedIdx + 1];
    const shortsIdx = parts.indexOf('shorts');
    if (shortsIdx !== -1 && parts[shortsIdx + 1]) return parts[shortsIdx + 1];
  } catch {
    const m = trimmed.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
  }
  return null;
}
export function getYoutubeEmbedUrl(urlOrId: string): string | null {
  const id = extractYoutubeId(urlOrId);
  return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1` : null;
}
export function getYoutubeField(track: any): string | null {
  return track?.youtubeUrl || track?.youtube_url || track?.youtubeId || track?.youtube_id || null;
}
export function getYoutubeChannelEmbedUrl(channelId: string): string {
  return `https://www.youtube.com/embed?listType=channel&list=${channelId}&rel=0&modestbranding=1&playsinline=1`;
}
