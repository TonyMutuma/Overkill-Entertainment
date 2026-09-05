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
    if (url.pathname.startsWith('/api/mix-tracks')) {
      try {
        if (request.method === 'GET') {
          if (SUPA_KEY(env)) {
            const r = await supaFetch(env, 'mix_tracks?order=created_at.desc', {});
            if (r.ok) return new Response(JSON.stringify(r.data || []), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
          }
          if (env.DB) {
            const { results } = await env.DB.prepare('SELECT * FROM mix_tracks ORDER BY created_at DESC').all();
            return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
          }
          return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });
        }
        if (request.method === 'POST') {
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
          if (SUPA_KEY(env)) {
            const r = await supaFetch(env, 'mix_tracks', { method: 'POST', body: JSON.stringify(row) });
            if (r.ok) return new Response(JSON.stringify(r.data?.[0] || { id }), { headers: { 'Content-Type': 'application/json' } });
          }
          if (env.DB) {
            await env.DB.prepare('INSERT INTO mix_tracks (id, title, category, category_label, duration, recorded_at, description, date, plays, bpm, image_url, audio_key, tags, tracklist_snippet, youtube_url, youtube_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(row.id, row.title, row.category, row.category_label, row.duration, row.recorded_at, row.description, row.date, row.plays, row.bpm, row.image_url, row.audio_key, row.tags, row.tracklist_snippet, row.youtube_url, row.youtube_id).run();
            const { results } = await env.DB.prepare('SELECT * FROM mix_tracks WHERE id=?').bind(id).all();
            return new Response(JSON.stringify(results?.[0] || { id }), { headers: { 'Content-Type': 'application/json' } });
          }
          return new Response(JSON.stringify({ error: 'No DB' }), { status: 500 });
        }
        if (request.method === 'PUT') {
          const id = url.pathname.split('/').pop();
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
          if (SUPA_KEY(env)) {
            const r = await supaFetch(env, `mix_tracks?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(fields) });
            if (r.ok) return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
          }
          if (env.DB) {
            const sets = Object.keys(fields).map(k => `${k}=?`).join(', ');
            const vals = Object.values(fields);
            await env.DB.prepare(`UPDATE mix_tracks SET ${sets} WHERE id=?`).bind(...vals, id).run();
            return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
          }
          return new Response(JSON.stringify({ error: 'No DB' }), { status: 500 });
        }
        if (request.method === 'DELETE') {
          const id = url.pathname.split('/').pop();
          if (SUPA_KEY(env)) {
            const r = await supaFetch(env, `mix_tracks?id=eq.${id}`, { method: 'DELETE' });
            if (r.ok) return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
          }
          if (env.DB) {
            await env.DB.prepare('DELETE FROM mix_tracks WHERE id=?').bind(id).run();
            return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
          }
          return new Response(JSON.stringify({ error: 'No DB' }), { status: 500 });
        }
        if (request.method === 'OPTIONS') return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    }
    if (url.pathname.startsWith('/api/youtube-previews')) {
      try {
        if (request.method === 'GET') {
          if (SUPA_KEY(env)) {
            const r = await supaFetch(env, 'youtube_previews?order=created_at.desc', {});
            if (r.ok) return new Response(JSON.stringify(r.data || []), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
          }
          if (env.DB) {
            const { results } = await env.DB.prepare('SELECT * FROM youtube_previews ORDER BY created_at DESC').all();
            return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
          }
          return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });
        }
        if (request.method === 'POST') {
          const { url: ytUrl } = await request.json();
          if (!ytUrl) return new Response(JSON.stringify({ error: 'url required' }), { status: 400 });
          const id = `yt-${Date.now()}`;
          if (SUPA_KEY(env)) {
            const r = await supaFetch(env, 'youtube_previews', { method: 'POST', body: JSON.stringify({ id, url: ytUrl }) });
            if (r.ok) return new Response(JSON.stringify(r.data?.[0] || { id, url: ytUrl }), { headers: { 'Content-Type': 'application/json' } });
          }
          if (env.DB) {
            await env.DB.prepare('INSERT INTO youtube_previews (id, url) VALUES (?,?)').bind(id, ytUrl).run();
            const { results } = await env.DB.prepare('SELECT * FROM youtube_previews WHERE id=?').bind(id).all();
            return new Response(JSON.stringify(results?.[0] || { id, url: ytUrl }), { headers: { 'Content-Type': 'application/json' } });
          }
          return new Response(JSON.stringify({ error: 'No DB or Supabase configured' }), { status: 500 });
        }
        if (request.method === 'PUT') {
          const id = url.pathname.split('/').pop();
          const { url: ytUrl } = await request.json();
          if (SUPA_KEY(env)) {
            const r = await supaFetch(env, `youtube_previews?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ url: ytUrl }) });
            if (r.ok) return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
          }
          if (env.DB) {
            await env.DB.prepare('UPDATE youtube_previews SET url=? WHERE id=?').bind(ytUrl, id).run();
            return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
          }
          return new Response(JSON.stringify({ error: 'No DB' }), { status: 500 });
        }
        if (request.method === 'DELETE') {
          const id = url.pathname.split('/').pop();
          if (SUPA_KEY(env)) {
            const r = await supaFetch(env, `youtube_previews?id=eq.${id}`, { method: 'DELETE' });
            if (r.ok) return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
          }
          if (env.DB) {
            await env.DB.prepare('DELETE FROM youtube_previews WHERE id=?').bind(id).run();
            return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
          }
          return new Response(JSON.stringify({ error: 'No DB' }), { status: 500 });
        }
        if (request.method === 'OPTIONS') return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    }
    if (url.pathname.startsWith('/api/bookings')) {
      try {
        const mapRow = (r) => ({
          id: r.id,
          clientName: r.client_name ?? r.clientName,
          email: r.email,
          phone: r.phone || '',
          eventType: (r.event_type ?? r.eventType) || '',
          eventDate: (r.event_date ?? r.eventDate) || '',
          venueName: (r.venue_name ?? r.venueName) || '',
          venueCity: (r.venue_city ?? r.venueCity) || '',
          guestCount: r.guest_count ?? r.guestCount ?? 0,
          selectedPackage: (r.selected_package ?? r.selectedPackage) || '',
          selectedAddOns: typeof r.selected_add_ons === 'string' ? JSON.parse(r.selected_add_ons) : ((r.selected_add_ons ?? r.selectedAddOns) ?? []),
          specialRequests: (r.special_requests ?? r.specialRequests) || '',
          estimatedTotal: r.estimated_total ?? r.estimatedTotal ?? 0,
          submittedAt: r.submitted_at ?? r.submittedAt,
          status: r.status || 'new',
          notes: r.notes || ''
        });
        if (request.method === 'GET') {
          if (SUPA_KEY(env)) {
            const r = await supaFetch(env, 'booking_inquiries?order=submitted_at.desc', {});
            if (r.ok) return new Response(JSON.stringify((r.data || []).map(mapRow)), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
          }
          if (env.DB) {
            const { results } = await env.DB.prepare('SELECT * FROM booking_inquiries ORDER BY submitted_at DESC').all();
            return new Response(JSON.stringify((results || []).map(mapRow)), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
          }
          return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });
        }
        if (request.method === 'POST') {
          const b = await request.json();
          const id = b.id || `inq-${Date.now()}`;
          const row = {
            id,
            client_name: b.clientName || b.client_name || '',
            email: b.email || '',
            phone: b.phone || '',
            event_type: b.eventType || b.event_type || '',
            event_date: b.eventDate || b.event_date || '',
            venue_name: b.venueName || b.venue_name || '',
            venue_city: b.venueCity || b.venue_city || '',
            guest_count: b.guestCount ?? b.guest_count ?? 0,
            selected_package: b.selectedPackage || b.selected_package || '',
            selected_add_ons: JSON.stringify(b.selectedAddOns || b.selected_add_ons || []),
            special_requests: b.specialRequests || b.special_requests || '',
            estimated_total: b.estimatedTotal ?? b.estimated_total ?? 0,
            submitted_at: b.submittedAt || b.submitted_at || new Date().toISOString().replace('T',' ').slice(0,19),
            status: b.status || 'new',
            notes: b.notes || ''
          };
          if (!row.client_name || !row.email) return new Response(JSON.stringify({ error: 'clientName and email required' }), { status: 400 });
          if (SUPA_KEY(env)) {
            const r = await supaFetch(env, 'booking_inquiries', { method: 'POST', body: JSON.stringify(row) });
            if (r.ok) return new Response(JSON.stringify(r.data?.[0] ? mapRow(r.data[0]) : { id }), { headers: { 'Content-Type': 'application/json' } });
          }
          if (env.DB) {
            await env.DB.prepare('INSERT INTO booking_inquiries (id, client_name, email, phone, event_type, event_date, venue_name, venue_city, guest_count, selected_package, selected_add_ons, special_requests, estimated_total, submitted_at, status, notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(row.id, row.client_name, row.email, row.phone, row.event_type, row.event_date, row.venue_name, row.venue_city, row.guest_count, row.selected_package, row.selected_add_ons, row.special_requests, row.estimated_total, row.submitted_at, row.status, row.notes).run();
            const { results } = await env.DB.prepare('SELECT * FROM booking_inquiries WHERE id=?').bind(id).all();
            return new Response(JSON.stringify(results?.[0] ? mapRow(results[0]) : { id }), { headers: { 'Content-Type': 'application/json' } });
          }
          return new Response(JSON.stringify({ error: 'No DB' }), { status: 500 });
        }
        if (request.method === 'PUT') {
          const id = url.pathname.split('/').pop();
          const body = await request.json();
          const fields = {};
          if (body.status !== undefined) fields.status = body.status;
          if (body.notes !== undefined) fields.notes = body.notes;
          if (body.clientName !== undefined) fields.client_name = body.clientName;
          if (body.email !== undefined) fields.email = body.email;
          if (body.phone !== undefined) fields.phone = body.phone;
          if (SUPA_KEY(env)) {
            const r = await supaFetch(env, `booking_inquiries?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(fields) });
            if (r.ok) return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
          }
          if (env.DB) {
            const sets = Object.keys(fields).map(k => `${k}=?`).join(', ');
            const vals = Object.values(fields);
            if (sets) await env.DB.prepare(`UPDATE booking_inquiries SET ${sets} WHERE id=?`).bind(...vals, id).run();
            return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
          }
          return new Response(JSON.stringify({ error: 'No DB' }), { status: 500 });
        }
        if (request.method === 'DELETE') {
          const id = url.pathname.split('/').pop();
          if (SUPA_KEY(env)) {
            const r = await supaFetch(env, `booking_inquiries?id=eq.${id}`, { method: 'DELETE' });
            if (r.ok) return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
          }
          if (env.DB) {
            await env.DB.prepare('DELETE FROM booking_inquiries WHERE id=?').bind(id).run();
            return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
          }
          return new Response(JSON.stringify({ error: 'No DB' }), { status: 500 });
        }
        if (request.method === 'OPTIONS') return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
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
