import { createClient } from '@supabase/supabase-js';
const url = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://rxswzexcmfrtsmsykgmk.supabase.co';
const key = (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_P1lQ0Q0FJXgm-dFKTeQ8Lw_yogcNukI';
export const supabase = createClient(url, key);
