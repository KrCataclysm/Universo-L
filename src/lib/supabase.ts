import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_KEY, SUPABASE_URL, hasSupabase } from './env'

let client: SupabaseClient | null = null
/** Chave publicável (pública por design); a segurança vem das regras RLS do banco. */
export function getSupabase(): SupabaseClient {
  if (!hasSupabase) throw new Error('Supabase não configurado')
  return (client ??= createClient(SUPABASE_URL!, SUPABASE_KEY!, { auth: { persistSession: true, autoRefreshToken: true } }))
}
