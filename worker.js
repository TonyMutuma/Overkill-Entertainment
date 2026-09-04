const SUPA_URL = (env) => env.SUPABASE_URL || 'https://rxswzexcmfrtsmsykgmk.supabase.co';
const SUPA_KEY = (env) => env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET;
async function supaFetch(env, path, init) {
  const key = SUPA_KEY(env);
  if (!key) return { ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY missing' };
  const res = await fetch(`${SUPA_URL(env)}/rest/v1/${path}`, { ...init, headers: { 'apikey': key, 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation', ...(init?.headers||{}) } });
  const text = await res.text();
  try { return { ok: res.ok, data: JSON.parse(text) }; } catch { return { ok: res.ok, data: text }; }
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({ ok: true, db: !!env.DB, supabase: !!SUPA_KEY(env) }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (url.pathname.startsWith('/api/instagram-previews')) {
      try {
        if (request.method === 'GET') {
          if (SUPA_KEY(env)) {
            const r = await supaFetch(env, 'instagram_previews?order=created_at.desc', {});
            if (r.ok) return new Response(JSON.stringify(r.data || []), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
          }
          if (env.DB) {
            const { results } = await env.DB.prepare('SELECT * FROM instagram_previews ORDER BY created_at DESC').all();
            return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
          }
          return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });
        }
        if (request.method === 'POST') {
          const { url: igUrl } = await request.json();
          if (!igUrl) return new Response(JSON.stringify({ error: 'url required' }), { status: 400 });
          const id = `ig-${Date.now()}`;
          if (SUPA_KEY(env)) {
            const r = await supaFetch(env, 'instagram_previews', { method: 'POST', body: JSON.stringify({ id, url: igUrl }) });
            if (r.ok) return new Response(JSON.stringify(r.data?.[0] || { id, url: igUrl }), { headers: { 'Content-Type': 'application/json' } });
          }
          if (env.DB) {
            await env.DB.prepare('INSERT INTO instagram_previews (id, url) VALUES (?,?)').bind(id, igUrl).run();
            const { results } = await env.DB.prepare('SELECT * FROM instagram_previews WHERE id=?').bind(id).all();
            return new Response(JSON.stringify(results?.[0] || { id, url: igUrl }), { headers: { 'Content-Type': 'application/json' } });
          }
          return new Response(JSON.stringify({ error: 'No DB or Supabase configured' }), { status: 500 });
        }
        if (request.method === 'PUT') {
          const id = url.pathname.split('/').pop();
          const { url: igUrl } = await request.json();
          if (SUPA_KEY(env)) {
            const r = await supaFetch(env, `instagram_previews?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ url: igUrl }) });
            if (r.ok) return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
          }
          if (env.DB) {
            await env.DB.prepare('UPDATE instagram_previews SET url=? WHERE id=?').bind(igUrl, id).run();
            return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
          }
          return new Response(JSON.stringify({ error: 'No DB' }), { status: 500 });
        }
        if (request.method === 'DELETE') {
          const id = url.pathname.split('/').pop();
          if (SUPA_KEY(env)) {
            const r = await supaFetch(env, `instagram_previews?id=eq.${id}`, { method: 'DELETE' });
            if (r.ok) return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
          }
          if (env.DB) {
            await env.DB.prepare('DELETE FROM instagram_previews WHERE id=?').bind(id).run();
            return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
          }
          return new Response(JSON.stringify({ error: 'No DB' }), { status: 500 });
        }
        if (request.method === 'OPTIONS') {
          return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
        }
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    }
    // Fallback to assets for all other requests (static site)
    if (env.ASSETS) {
      const res = await env.ASSETS.fetch(request);
      const headers = new Headers(res.headers);
      headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.instagram.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; media-src 'self' https:; connect-src 'self' https://*.supabase.co https://www.instagram.com https://*.instagram.com; frame-src 'self' https://www.instagram.com https://*.instagram.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
      headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      headers.set('X-Frame-Options', 'DENY');
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
      if (url.pathname.match(/\.(js|css|png|jpg|jpeg|webp|woff2?)$/)) headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      else if (url.pathname === '/' || url.pathname.endsWith('.html')) headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
      return new Response(res.body, { status: res.status, headers });
    }
    return new Response('Not found', { status: 404 });
  }
};
