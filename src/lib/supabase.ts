import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) return supabaseInstance

  const storage = typeof window !== 'undefined' ? {
    getItem: (key: string) => window.sessionStorage.getItem(key),
    setItem: (key: string, value: string) => window.sessionStorage.setItem(key, value),
    removeItem: (key: string) => window.sessionStorage.removeItem(key),
  } : undefined

  supabaseInstance = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'lonara-auth-token',
        ...(storage && { storage }),
      },
    }
  )

  return supabaseInstance
}

export const supabase = getSupabaseClient()