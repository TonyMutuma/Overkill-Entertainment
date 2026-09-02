export async function onRequestPut({ request, env, params }) {
  try {
    const { url } = await request.json();
    await env.DB.prepare('UPDATE instagram_previews SET url=? WHERE id=?').bind(url, params.id).run();
    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
export async function onRequestDelete({ env, params }) {
  try {
    await env.DB.prepare('DELETE FROM instagram_previews WHERE id=?').bind(params.id).run();
    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}
