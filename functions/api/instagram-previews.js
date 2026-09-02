export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM instagram_previews ORDER BY created_at DESC').all();
    return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
export async function onRequestPost({ request, env }) {
  try {
    const { url } = await request.json();
    if (!url) return new Response(JSON.stringify({ error: 'url required' }), { status: 400 });
    const id = `ig-${Date.now()}`;
    await env.DB.prepare('INSERT INTO instagram_previews (id, url) VALUES (?,?)').bind(id, url).run();
    const { results } = await env.DB.prepare('SELECT * FROM instagram_previews WHERE id=?').bind(id).all();
    return new Response(JSON.stringify(results?.[0] || { id, url }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}
