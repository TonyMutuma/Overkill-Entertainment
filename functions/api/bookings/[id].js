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
    const body = await request.json();
    const fields = {};
    if (body.status !== undefined) fields.status = body.status;
    if (body.notes !== undefined) fields.notes = body.notes;
    if (body.clientName !== undefined) fields.client_name = body.clientName;
    if (body.email !== undefined) fields.email = body.email;
    if (body.phone !== undefined) fields.phone = body.phone;
    if (Object.keys(fields).length === 0) return new Response(JSON.stringify({ error: 'no fields' }), { status: 400 });
    if (env.DB) {
      try {
        const sets = Object.keys(fields).map(k => `${k}=?`).join(', ');
        const vals = Object.values(fields);
        await env.DB.prepare(`UPDATE booking_inquiries SET ${sets} WHERE id=?`).bind(...vals, params.id).run();
        return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
      } catch {}
    }
    const r = await supaFetch2(env, `booking_inquiries?id=eq.${params.id}`, { method: 'PATCH', body: JSON.stringify(fields) });
    if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data));
    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
export async function onRequestDelete({ env, params }) {
  try {
    if (env.DB) { try { await env.DB.prepare('DELETE FROM booking_inquiries WHERE id=?').bind(params.id).run(); return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } }); } catch {} }
    const r = await supaFetch2(env, `booking_inquiries?id=eq.${params.id}`, { method: 'DELETE' });
    if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data));
    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}
