export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
export const hasSupabase = !!SUPABASE_URL && !!SUPABASE_KEY
export const publicImageUrl = (path: string): string => `${SUPABASE_URL}/storage/v1/object/public/product-images/${path}`

/** Arquivo do próprio site (public/), respeitando a base do deploy. */
export const asset = (path: string): string => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const SITE_IMG = /(\/produtos\/[^/]+?)\.webp$/
/** Versão menor (480/800) de uma foto do próprio site; fotos do storage ou já dimensionadas não mudam. */
export const imgSize = (url: string, w: 480 | 800): string => (/-(480|800)\.webp$/.test(url) ? url : url.replace(SITE_IMG, `$1-${w}.webp`))
/** srcset 480w/800w/1280w para foto do site; undefined para as demais. */
export const imgSrcSet = (url: string): string | undefined => (SITE_IMG.test(url) && !/-(480|800)\.webp$/.test(url) ? `${imgSize(url, 480)} 480w, ${imgSize(url, 800)} 800w, ${url} 1280w` : undefined)
