import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { buildSitemap, injectSeo, seoBlock } from './seo.mjs'

const envFile = existsSync('.env.production') ? readFileSync('.env.production', 'utf8') : ''
const fromFile = (k) => envFile.match(new RegExp(`^${k}=(.*)$`, 'm'))?.[1]?.trim()
const SITE = (process.env.VITE_SITE_URL || fromFile('VITE_SITE_URL') || '').replace(/\/+$/, '')
const SB_URL = process.env.VITE_SUPABASE_URL || fromFile('VITE_SUPABASE_URL')
const SB_KEY = process.env.VITE_SUPABASE_ANON_KEY || fromFile('VITE_SUPABASE_ANON_KEY')
const BASE = (process.env.BASE_PATH || '/').replace(/\/?$/, '/')

const template = readFileSync('dist/index.html', 'utf8')
const write = (path, html) => { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, html) }
const SLOGAN = 'Todas as suas marcas em um só lugar.'

// 1) fallback SPA do GitHub Pages
copyFileSync('dist/index.html', 'dist/404.html')

const BRANDS = {
  'lay-store': ['Lay.Store', 'Moda fitness'],
  'ousada-delicada': ['Ousada Delicada', 'Moda íntima'],
  'falou-bordei': ['Falou, Bordei', 'Bordados e personalizados'],
}
const pages = [
  { path: '/sobre', title: 'Sobre — Universo Lay', description: 'Um universo de moda, estilo, delicadeza e peças personalizadas, onde cada mulher encontra algo especial para si ou para presentear.' },
  { path: '/contato', title: 'Contato — Universo Lay', description: 'Fale com o Universo Lay: pedidos, dúvidas e personalizações.' },
  ...Object.entries(BRANDS).map(([slug, [name, cat]]) => ({ path: `/${slug}`, title: `${name} — ${cat} · Universo Lay`, description: `${name}: ${cat.toLowerCase()}. ${SLOGAN}` })),
]

// 2) produtos publicados (para páginas de compartilhamento com Open Graph)
try {
  if (!SB_URL || !SB_KEY) throw new Error('Supabase não configurado')
  const res = await fetch(`${SB_URL}/rest/v1/products?select=slug,name,description,brands!inner(slug,name),product_images(path,sort)&status=eq.published`, { headers: { apikey: SB_KEY } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  for (const p of await res.json()) {
    const img = [...(p.product_images ?? [])].sort((a, b) => a.sort - b.sort)[0]
    pages.push({
      path: `/${p.brands.slug}/${p.slug}`,
      title: `${p.name} — ${p.brands.name} · Universo Lay`,
      description: (p.description || `${p.name} em ${p.brands.name}. ${SLOGAN}`).slice(0, 200),
      image: img ? `${SB_URL}/storage/v1/object/public/product-images/${img.path}` : null,
    })
  }
} catch (e) {
  console.warn('Aviso: sem produtos nas páginas de compartilhamento:', e.message)
}

const defaultImage = SITE ? `${SITE}/og.png` : null
for (const pg of pages) {
  const url = `${SITE}${pg.path}`
  write(join('dist', pg.path, 'index.html'), injectSeo(template, seoBlock({ title: pg.title, description: pg.description, url, image: pg.image ?? defaultImage })))
}

// 3) robots e sitemap
if (SITE) {
  write('dist/robots.txt', `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITE}/sitemap.xml\n`)
  write('dist/sitemap.xml', buildSitemap(SITE, ['/', ...pages.map((p) => p.path)]))
}
console.log(`postbuild: 404.html + ${pages.length} páginas de compartilhamento (base ${BASE}) + robots/sitemap`)
