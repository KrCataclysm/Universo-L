export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
export const hasSupabase = !!SUPABASE_URL && !!SUPABASE_KEY
export const publicImageUrl = (path: string): string => `${SUPABASE_URL}/storage/v1/object/public/product-images/${path}`
