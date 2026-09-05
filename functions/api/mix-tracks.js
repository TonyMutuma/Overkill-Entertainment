const SUPA_URL = (env) => env.SUPABASE_URL || 'https://rxswzexcmfrtsmsykgmk.supabase.co';
const SUPA_KEY = (env) => env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET;
async function supaFetch(env, path, init) {
  const url = `${SUPA_URL(env)}/rest/v1/${path}`;
  const res = await fetch(url, { ...init, headers: { 'apikey': SUPA_KEY(env), 'Authorization': `Bearer ${SUPA_KEY(env)}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation', ...(init?.headers||{}) } });
  const text = await res.text();
  try { return { ok: res.ok, data: JSON.parse(text) }; } catch { return { ok: res.ok, data: text }; }
}
export async function onRequestGet({ env }) {
  try {
    if (env.DB) {
      try {
        const { results } = await env.DB.prepare('SELECT * FROM mix_tracks ORDER BY created_at DESC').all();
        if (results) return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      } catch {}
    }
    const r = await supaFetch(env, 'mix_tracks?order=created_at.desc', {});
    if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data));
    return new Response(JSON.stringify(r.data || []), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  } catch (e) { return new Response(JSON.stringify({ error: e.message }), { status: 500 }); }
}
export async function onRequestPost({ request, env }) {
  try {
    const b = await request.json();
    const id = b.id || `mix-${Date.now()}`;
    const row = {
      id,
      title: b.title,
      category: b.category,
      category_label: b.category_label || b.categoryLabel,
      duration: b.duration,
      recorded_at: b.recorded_at || b.recordedAt,
      description: b.description,
      date: b.date,
      plays: b.plays,
      bpm: b.bpm,
      image_url: b.image_url || b.imageUrl,
      audio_key: b.audio_key || b.audioKey,
      tags: typeof b.tags === 'string' ? b.tags : JSON.stringify(b.tags || []),
      tracklist_snippet: typeof b.tracklist_snippet === 'string' ? b.tracklist_snippet : JSON.stringify(b.tracklist_snippet || b.tracklistSnippet || []),
      youtube_url: b.youtube_url || b.youtubeUrl,
      youtube_id: b.youtube_id || b.youtubeId,
    };
    if (!row.title) return new Response(JSON.stringify({ error: 'title required' }), { status: 400 });
    if (env.DB) {
      try {
        await env.DB.prepare('INSERT INTO mix_tracks (id, title, category, category_label, duration, recorded_at, description, date, plays, bpm, image_url, audio_key, tags, tracklist_snippet, youtube_url, youtube_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(row.id, row.title, row.category, row.category_label, row.duration, row.recorded_at, row.description, row.date, row.plays, row.bpm, row.image_url, row.audio_key, row.tags, row.tracklist_snippet, row.youtube_url, row.youtube_id).run();
        const { results } = await env.DB.prepare('SELECT * FROM mix_tracks WHERE id=?').bind(id).all();
        return new Response(JSON.stringify(results?.[0] || { id }), { headers: { 'Content-Type': 'application/json' } });
      } catch {}
    }
    const r = await supaFetch(env, 'mix_tracks', { method: 'POST', body: JSON.stringify(row) });
    if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data));
    return new Response(JSON.stringify(r.data?.[0] || { id }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) { return new Response(JSON.stringify({ error: e.message }), { status: 500 }); }
}
export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}
