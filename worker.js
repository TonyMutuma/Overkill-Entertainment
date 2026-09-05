const SUPA_URL = (env) => env.SUPABASE_URL || 'https://rxswzexcmfrtsmsykgmk.supabase.co';
const SUPA_KEY = (env) => env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET || env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_P1lQ0Q0FJXgm-dFKTeQ8Lw_yogcNukI';
async function supaFetch(env, path, init) {
  const key = SUPA_KEY(env);
  const res = await fetch(`${SUPA_URL(env)}/rest/v1/${path}`, { ...init, headers: { 'apikey': key, 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation', ...(init?.headers||{}) } });
  const text = await res.text();
  try { return { ok: res.ok, data: JSON.parse(text) }; } catch { return { ok: res.ok, data: text }; }
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({ ok: true, supabase: !!SUPA_KEY(env) }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (url.pathname.startsWith('/api/mix-tracks')) {
      try {
        if (request.method === 'GET') {
          const r = await supaFetch(env, 'mix_tracks?order=created_at.desc', {});
          if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data));
          return new Response(JSON.stringify(r.data || []), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
        }
        if (request.method === 'POST') {
          const b = await request.json();
          const row = { id: b.id || `mix-${Date.now()}`, title: b.title, category: b.category, category_label: b.category_label || b.categoryLabel, duration: b.duration, recorded_at: b.recorded_at || b.recordedAt, description: b.description, date: b.date, plays: b.plays, bpm: b.bpm, image_url: b.image_url || b.imageUrl, audio_key: b.audio_key || b.audioKey, tags: typeof b.tags === 'string' ? b.tags : JSON.stringify(b.tags||[]), tracklist_snippet: typeof b.tracklist_snippet === 'string' ? b.tracklist_snippet : JSON.stringify(b.tracklist_snippet || b.tracklistSnippet || []), youtube_url: b.youtube_url || b.youtubeUrl, youtube_id: b.youtube_id || b.youtubeId };
          if (!row.title) return new Response(JSON.stringify({ error: 'title required' }), { status: 400 });
          const r = await supaFetch(env, 'mix_tracks', { method: 'POST', body: JSON.stringify(row) });
          if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data));
          return new Response(JSON.stringify(r.data?.[0] || { id: row.id }), { headers: { 'Content-Type': 'application/json' } });
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
          const r = await supaFetch(env, `mix_tracks?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(fields) });
          if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data));
          return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
        }
        if (request.method === 'DELETE') {
          const id = url.pathname.split('/').pop();
          const r = await supaFetch(env, `mix_tracks?id=eq.${id}`, { method: 'DELETE' });
          if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data));
          return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
        }
        if (request.method === 'OPTIONS') return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
      } catch (e) { return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } }); }
    }
    if (url.pathname.startsWith('/api/instagram-previews')) {
      try {
        if (request.method === 'GET') { const r = await supaFetch(env, 'instagram_previews?order=created_at.desc', {}); if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data)); return new Response(JSON.stringify(r.data || []), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }); }
        if (request.method === 'POST') { const { url: igUrl } = await request.json(); if (!igUrl) return new Response(JSON.stringify({ error: 'url required' }), { status: 400 }); const id = `ig-${Date.now()}`; const r = await supaFetch(env, 'instagram_previews', { method: 'POST', body: JSON.stringify({ id, url: igUrl }) }); if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data)); return new Response(JSON.stringify(r.data?.[0] || { id, url: igUrl }), { headers: { 'Content-Type': 'application/json' } }); }
        if (request.method === 'PUT') { const id = url.pathname.split('/').pop(); const { url: igUrl } = await request.json(); const r = await supaFetch(env, `instagram_previews?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ url: igUrl }) }); if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data)); return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } }); }
        if (request.method === 'DELETE') { const id = url.pathname.split('/').pop(); const r = await supaFetch(env, `instagram_previews?id=eq.${id}`, { method: 'DELETE' }); if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data)); return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } }); }
        if (request.method === 'OPTIONS') return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
      } catch (e) { return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } }); }
    }
    if (url.pathname.startsWith('/api/youtube-previews')) {
      try {
        if (request.method === 'GET') { const r = await supaFetch(env, 'youtube_previews?order=position.asc&order=created_at.desc', {}); if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data)); return new Response(JSON.stringify(r.data || []), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }); }
        if (request.method === 'POST') { const body = await request.json(); const ytUrl = body.url; const pos = body.position; const sz = body.size; if (!ytUrl) return new Response(JSON.stringify({ error: 'url required' }), { status: 400 }); const id = `yt-${Date.now()}`; const r = await supaFetch(env, 'youtube_previews', { method: 'POST', body: JSON.stringify({ id, url: ytUrl, position: pos ?? 0, size: sz || 'normal' }) }); if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data)); return new Response(JSON.stringify(r.data?.[0] || { id, url: ytUrl }), { headers: { 'Content-Type': 'application/json' } }); }
        if (request.method === 'PUT') { const id = url.pathname.split('/').pop(); const body = await request.json(); const ytUrl = body.url; const pos = body.position; const sz = body.size; const r = await supaFetch(env, `youtube_previews?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ ...(ytUrl!==undefined?{url:ytUrl}:{}), ...(pos!==undefined?{position:pos}:{}), ...(sz!==undefined?{size:sz}:{}) }) }); if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data)); return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } }); }
        if (request.method === 'DELETE') { const id = url.pathname.split('/').pop(); const r = await supaFetch(env, `youtube_previews?id=eq.${id}`, { method: 'DELETE' }); if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data)); return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } }); }
        if (request.method === 'OPTIONS') return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
      } catch (e) { return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } }); }
    }
    if (url.pathname.startsWith('/api/bookings')) {
      try {
        const mapRow = (r) => ({ id: r.id, clientName: r.client_name ?? r.clientName, email: r.email, phone: r.phone || '', eventType: (r.event_type ?? r.eventType) || '', eventDate: (r.event_date ?? r.eventDate) || '', venueName: (r.venue_name ?? r.venueName) || '', venueCity: (r.venue_city ?? r.venueCity) || '', guestCount: r.guest_count ?? r.guestCount ?? 0, selectedPackage: (r.selected_package ?? r.selectedPackage) || '', selectedAddOns: typeof r.selected_add_ons === 'string' ? JSON.parse(r.selected_add_ons) : ((r.selected_add_ons ?? r.selectedAddOns) ?? []), specialRequests: (r.special_requests ?? r.specialRequests) || '', estimatedTotal: r.estimated_total ?? r.estimatedTotal ?? 0, submittedAt: r.submitted_at ?? r.submittedAt, status: r.status || 'new', notes: r.notes || '' });
        if (request.method === 'GET') { const r = await supaFetch(env, 'booking_inquiries?order=submitted_at.desc', {}); if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data)); return new Response(JSON.stringify((r.data || []).map(mapRow)), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }); }
        if (request.method === 'POST') {
          const b = await request.json(); const id = b.id || `inq-${Date.now()}`; const row = { id, client_name: b.clientName || b.client_name || '', email: b.email || '', phone: b.phone || '', event_type: b.eventType || b.event_type || '', event_date: b.eventDate || b.event_date || '', venue_name: b.venueName || b.venue_name || '', venue_city: b.venueCity || b.venue_city || '', guest_count: b.guestCount ?? b.guest_count ?? 0, selected_package: b.selectedPackage || b.selected_package || '', selected_add_ons: JSON.stringify(b.selectedAddOns || b.selected_add_ons || []), special_requests: b.specialRequests || b.special_requests || '', estimated_total: b.estimatedTotal ?? b.estimated_total ?? 0, submitted_at: b.submittedAt || b.submitted_at || new Date().toISOString().replace('T',' ').slice(0,19), status: b.status || 'new', notes: b.notes || '' };
          if (!row.client_name || !row.email) return new Response(JSON.stringify({ error: 'clientName and email required' }), { status: 400 });
          const r = await supaFetch(env, 'booking_inquiries', { method: 'POST', body: JSON.stringify(row) });
          if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data));
          return new Response(JSON.stringify(r.data?.[0] ? mapRow(r.data[0]) : { id }), { headers: { 'Content-Type': 'application/json' } });
        }
        if (request.method === 'PUT') { const id = url.pathname.split('/').pop(); const body = await request.json(); const fields = {}; if (body.status !== undefined) fields.status = body.status; if (body.notes !== undefined) fields.notes = body.notes; if (body.clientName !== undefined) fields.client_name = body.clientName; if (body.email !== undefined) fields.email = body.email; if (body.phone !== undefined) fields.phone = body.phone; const r = await supaFetch(env, `booking_inquiries?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(fields) }); if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data)); return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } }); }
        if (request.method === 'DELETE') { const id = url.pathname.split('/').pop(); const r = await supaFetch(env, `booking_inquiries?id=eq.${id}`, { method: 'DELETE' }); if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data)); return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } }); }
        if (request.method === 'OPTIONS') return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
      } catch (e) { return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } }); }
    }
    if (env.ASSETS) {
      const res = await env.ASSETS.fetch(request);
      const headers = new Headers(res.headers);
      headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; media-src 'self' https:; connect-src 'self' https://*.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
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
