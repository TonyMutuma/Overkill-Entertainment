export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/instagram-previews')) {
      const db = env.DB;
      if (!db) return new Response(JSON.stringify({ error: 'DB binding missing' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      try {
        if (request.method === 'GET') {
          const { results } = await db.prepare('SELECT * FROM instagram_previews ORDER BY created_at DESC').all();
          return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
        }
        if (request.method === 'POST') {
          const { url: igUrl } = await request.json();
          if (!igUrl) return new Response(JSON.stringify({ error: 'url required' }), { status: 400 });
          const id = `ig-${Date.now()}`;
          await db.prepare('INSERT INTO instagram_previews (id, url) VALUES (?,?)').bind(id, igUrl).run();
          const { results } = await db.prepare('SELECT * FROM instagram_previews WHERE id=?').bind(id).all();
          return new Response(JSON.stringify(results?.[0] || { id, url: igUrl }), { headers: { 'Content-Type': 'application/json' } });
        }
        if (request.method === 'PUT') {
          const id = url.pathname.split('/').pop();
          const { url: igUrl } = await request.json();
          await db.prepare('UPDATE instagram_previews SET url=? WHERE id=?').bind(igUrl, id).run();
          return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
        }
        if (request.method === 'DELETE') {
          const id = url.pathname.split('/').pop();
          await db.prepare('DELETE FROM instagram_previews WHERE id=?').bind(id).run();
          return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
        }
        if (request.method === 'OPTIONS') {
          return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
        }
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    }
    // Fallback to assets for all other requests (static site)
    if (env.ASSETS) return env.ASSETS.fetch(request);
    return new Response('Not found', { status: 404 });
  }
};
