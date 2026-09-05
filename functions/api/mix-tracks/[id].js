const SUPA_URL2 = (env) => env.SUPABASE_URL || 'https://rxswzexcmfrtsmsykgmk.supabase.co';
const SUPA_KEY2 = (env) => env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET;
async function supaFetch2(env, path, init) {
  const url = `${SUPA_URL2(env)}/rest/v1/${path}`;
  const res = await fetch(url, { ...init, headers: { 'apikey': SUPA_KEY2(env), 'Authorization': `Bearer ${SUPA_KEY2(env)}`, 'Content-Type': 'application/json', ...(init?.headers||{}) } });
  const text = await res.text();
  try { return { ok: res.ok, data: JSON.parse(text) }; } catch { return { ok: res.ok, data: text }; }
}
export async function onRequestPut({ request, env, params }) {
  try {
    const b = await request.json();
    const fields = {};
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
    if (env.DB) {
      try {
        const sets = Object.keys(fields).map(k => `${k}=?`).join(', ');
        const vals = Object.values(fields);
        await env.DB.prepare(`UPDATE mix_tracks SET ${sets} WHERE id=?`).bind(...vals, params.id).run();
        return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
      } catch {}
    }
    const r = await supaFetch2(env, `mix_tracks?id=eq.${params.id}`, { method: 'PATCH', body: JSON.stringify(fields) });
    if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data));
    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) { return new Response(JSON.stringify({ error: e.message }), { status: 500 }); }
}
export async function onRequestDelete({ env, params }) {
  try {
    if (env.DB) { try { await env.DB.prepare('DELETE FROM mix_tracks WHERE id=?').bind(params.id).run(); return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } }); } catch {} }
    const r = await supaFetch2(env, `mix_tracks?id=eq.${params.id}`, { method: 'DELETE' });
    if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data));
    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) { return new Response(JSON.stringify({ error: e.message }), { status: 500 }); }
}
export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}
