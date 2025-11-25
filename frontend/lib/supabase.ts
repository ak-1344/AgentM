// Frontend Supabase client configuration
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a singleton browser client that uses cookies
// This prevents multiple instances and ensures cookie-based auth
let client: ReturnType<typeof createBrowserClient<Database>> | undefined

export const supabase = (() => {
  if (!client) {
    client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return client
})()
