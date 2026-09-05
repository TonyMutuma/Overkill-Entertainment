const SUPA_URL = (env) => env.SUPABASE_URL || 'https://rxswzexcmfrtsmsykgmk.supabase.co';
const SUPA_KEY = (env) => env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET || env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_P1lQ0Q0FJXgm-dFKTeQ8Lw_yogcNukI';
async function supaFetch(env, path, init) {
  const url = `${SUPA_URL(env)}/rest/v1/${path}`;
  const res = await fetch(url, { ...init, headers: { 'apikey': SUPA_KEY(env), 'Authorization': `Bearer ${SUPA_KEY(env)}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation', ...(init?.headers||{}) } });
  const text = await res.text();
  try { return { ok: res.ok, data: JSON.parse(text) }; } catch { return { ok: res.ok, data: text }; }
}
function mapRow(r) { return { id: r.id, clientName: r.client_name ?? r.clientName, email: r.email, phone: r.phone || '', eventType: (r.event_type ?? r.eventType) || '', eventDate: (r.event_date ?? r.eventDate) || '', venueName: (r.venue_name ?? r.venueName) || '', venueCity: (r.venue_city ?? r.venueCity) || '', guestCount: r.guest_count ?? r.guestCount ?? 0, selectedPackage: (r.selected_package ?? r.selectedPackage) || '', selectedAddOns: typeof r.selected_add_ons === 'string' ? JSON.parse(r.selected_add_ons) : ((r.selected_add_ons ?? r.selectedAddOns) ?? []), specialRequests: (r.special_requests ?? r.specialRequests) || '', estimatedTotal: r.estimated_total ?? r.estimatedTotal ?? 0, submittedAt: r.submitted_at ?? r.submittedAt, status: r.status || 'new', notes: r.notes || '' }; }
export async function onRequestGet({ env }) {
  try {
    const r = await supaFetch(env, 'booking_inquiries?order=submitted_at.desc', {});
    if (!r.ok) throw new Error(r.data?.message || JSON.stringify(r.data));
    return new Response(JSON.stringify((r.data || []).map(mapRow)), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  } catch (e) { return new Response(JSON.stringify({ error: e.message }), { status: 500 }); }
}
export async function onRequestPost({ request, env }) {
  try {
    const b = await request.json(); const id = b.id || `inq-${Date.now()}`; const row = { id, client_name: b.clientName || b.client_name || '', email: b.email || '', phone: b.phone || '', event_type: b.eventType || b.event_type || '', event_date: b.eventDate || b.event_date || '', venue_name: b.venueName || b.venue_name || '', venue_city: b.venueCity || b.venue_city || '', guest_count: b.guestCount ?? b.guest_count ?? 0, selected_package: b.selectedPackage || b.selected_package || '', selected_add_ons: JSON.stringify(b.selectedAddOns || b.selected_add_ons || []), special_requests: b.specialRequests || b.special_requests || '', estimated_total: b.estimatedTotal ?? b.e
