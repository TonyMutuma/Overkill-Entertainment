const SUPA_URL = (env) => env.SUPABASE_URL || 'https://rxswzexcmfrtsmsykgmk.supabase.co';
const SUPA_KEY = (env) => env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET;
async function supaFetch(env, path, init) {
  const url = `${SUPA_URL(env)}/rest/v1/${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'apikey': SUPA_KEY(env),
      'Authorization': `Bearer ${SUPA_KEY(env)}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...(init?.headers || {})
    }
  });
  const text = await res.text();
  try { return { ok: res.ok, status: res.status, data: JSON.parse(text) }; } catch { return { ok: res.ok, status: res.status, data: text }; }
}
export async function onRequestGet({ env }) {
  try {
    if (env.DB) {
      const { results } = await env.DB.prepare('SELECT * FROM instagram_previews ORDER BY created_at DESC').all();
      if (results) return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }
    const r = await supaFetch(env, 'instagram_previews?order=created_at.desc', {});
    if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data));
    return new Response(JSON.stringify(r.data || []), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
export async function onRequestPost({ request, env }) {
  try {
    const { url } = await request.json();
    if (!url) return new Response(JSON.stringify({ error: 'url required' }), { status: 400 });
    const id = `ig-${Date.now()}`;
    if (env.DB) {
      try {
        await env.DB.prepare('INSERT INTO instagram_previews (id, url) VALUES (?,?)').bind(id, url).run();
        const { results } = await env.DB.prepare('SELECT * FROM instagram_previews WHERE id=?').bind(id).all();
        return new Response(JSON.stringify(results?.[0] || { id, url }), { headers: { 'Content-Type': 'application/json' } });
      } catch {}
    }
    const r = await supaFetch(env, 'instagram_previews', { method: 'POST', body: JSON.stringify({ id, url }) });
    if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data));
    return new Response(JSON.stringify(r.data?.[0] || { id, url }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}
