// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Debug: confirm env vars are loaded
console.log('🔍 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('🔒 Service Role Key present:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

export const sbAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

