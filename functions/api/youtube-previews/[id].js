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
    const { url } = await request.json();
    if (env.DB) { try { await env.DB.prepare('UPDATE youtube_previews SET url=? WHERE id=?').bind(url, params.id).run(); return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } }); } catch {} }
    const r = await supaFetch2(env, `youtube_previews?id=eq.${params.id}`, { method: 'PATCH', body: JSON.stringify({ url }) });
    if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data));
    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
export async function onRequestDelete({ env, params }) {
  try {
    if (env.DB) { try { await env.DB.prepare('DELETE FROM youtube_previews WHERE id=?').bind(params.id).run(); return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } }); } catch {} }
    const r = await supaFetch2(env, `youtube_previews?id=eq.${params.id}`, { method: 'DELETE' });
    if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data));
    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}
