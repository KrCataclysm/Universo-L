import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { buildSitemap, esc, injectRoot, injectSeo, seoBlock, withSeed } from './seo.mjs'

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
  // mantenha igual a src/brand/brands.ts
  'lay-store': ['Lay.store', 'Moda fitness', 'Moda fitness para treinar com conforto e estilo: bermudas, shorts, tops e blusões de tecido confortável e caimento perfeito.'],
  'ousada-delicada': ['Ousada Delicada', 'Moda íntima', 'Moda íntima com personalidade: sutiãs, calcinhas e peças em renda, em cores e modelos pensados para o dia a dia.'],
  'falou-bordei': ['Falou Bordei', 'Bordados e personalizados', 'Bordados feitos à mão e peças personalizadas: molduras, roupas e lembranças bordadas com carinho, do seu jeito.'],
}
const pages = [
  { path: '/sobre', title: 'Sobre — Universo Lay', description: 'Um universo de moda, estilo, delicadeza e peças personalizadas, onde cada mulher encontra algo especial para si ou para presentear.' },
  { path: '/informacoes', title: 'Pagamento, entrega e trocas — Universo Lay', description: 'Formas de pagamento, entrega, prazos, trocas e devoluções do Universo Lay.' },
  { path: '/privacidade', title: 'Política de privacidade — Universo Lay', description: 'Como o site do Universo Lay trata os seus dados, conforme a LGPD.' },
  { path: '/busca', title: 'Buscar produtos — Universo Lay', description: 'Busque produtos das lojas Lay.store, Ousada Delicada e Falou Bordei.' },
  { path: '/colecoes', title: 'Coleções — Universo Lay', description: 'Seleções de peças das lojas Lay.store, Ousada Delicada e Falou Bordei.' },
  { path: '/favoritos', title: 'Favoritos — Universo Lay', description: 'Suas peças favoritas do Universo Lay, salvas neste aparelho.' },
  { path: '/contato', title: 'Contato — Universo Lay', description: 'Fale com o Universo Lay: pedidos, dúvidas e personalizações.' },
  ...Object.entries(BRANDS).map(([slug, [name, cat, intro]]) => ({ path: `/${slug}`, title: `${name} — ${cat} · Universo Lay`, description: intro })),
]

// 1b) coleções ativas (páginas estáticas para abrir o link direto com status 200)
try {
  if (SB_URL && SB_KEY) {
    const r = await fetch(`${SB_URL}/rest/v1/collections?select=slug,name,description&active=eq.true`, { headers: { apikey: SB_KEY } })
    if (r.ok) for (const c of await r.json()) pages.push({ path: `/colecao/${c.slug}`, title: `${c.name} — Coleção · Universo Lay`, description: (c.description || `Coleção ${c.name} do Universo Lay.`).slice(0, 200) })
  }
} catch (e) { console.warn('Aviso: sem coleções nas páginas estáticas:', e.message) }

// 2) produtos publicados (para páginas de compartilhamento com Open Graph)
try {
  if (!SB_URL || !SB_KEY) throw new Error('Supabase não configurado')
  const res = await fetch(`${SB_URL}/rest/v1/products?select=id,slug,name,description,price_cents,featured,customizable,sold_out,labels,customization_schema,is_example,status,brands!inner(slug,name),product_images(path,sort,alt),product_variants(id,label,option_type,value,in_stock,sort)&status=eq.published&order=sort`, { headers: { apikey: SB_KEY } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  for (const p of await res.json()) {
    const imgs = [...(p.product_images ?? [])].sort((a, b) => a.sort - b.sort).map((i) => (i.path.startsWith('/') ? `${SITE}${i.path}` : `${SB_URL}/storage/v1/object/public/product-images/${i.path}`))
    const img = imgs[0]
    const url = `${SITE}/${p.brands.slug}/${p.slug}/`
    pages.push({
      rootHtml: imgs[0] ? `<main class="page pdp"><div class="container pdp__grid"><div class="gallery"><div class="gallery__main"><img src="${esc(imgs[0])}"${/\/produtos\/[^/]+\.webp$/.test(imgs[0]) ? ` srcset="${[480, 800].map((w) => `${esc(imgs[0].replace(/\.webp$/, `-${w}.webp`))} ${w}w`).concat(`${esc(imgs[0])} 1280w`).join(', ')}"` : ''} sizes="(max-width: 900px) 100vw, 580px" width="1280" height="1600" fetchpriority="high" decoding="async" alt="${esc(p.name)}"></div></div></div></main>` : undefined,
      preload: imgs[0] ? { href: imgs[0], srcset: /\/produtos\/[^/]+\.webp$/.test(imgs[0]) ? [480, 800].map((w) => `${imgs[0].replace(/\.webp$/, `-${w}.webp`)} ${w}w`).concat(`${imgs[0]} 1280w`).join(', ') : undefined, sizes: '(max-width: 900px) 100vw, 580px' } : undefined,
      jsonLd: [{
        '@context': 'https://schema.org', '@type': 'Product', name: p.name, description: p.description || undefined,
        image: imgs.length ? imgs : undefined, brand: { '@type': 'Brand', name: p.brands.name }, url,
        // preço 0 = sob consulta: não declara oferta (o Google exige preço real)
        offers: p.price_cents > 0 ? { '@type': 'Offer', priceCurrency: 'BRL', price: (p.price_cents / 100).toFixed(2), url, availability: p.sold_out ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock' } : undefined,
      }, {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [['Início', `${SITE}/`], [p.brands.name, `${SITE}/${p.brands.slug}/`], [p.name, url]].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
      }],
      seed: p,
      path: `/${p.brands.slug}/${p.slug}`,
      title: `${p.name} — ${p.brands.name} · Universo Lay`,
      description: (p.description || `${p.name} em ${p.brands.name}. ${SLOGAN}`).slice(0, 200),
      image: img ?? null,
    })
  }
} catch (e) {
  console.warn('Aviso: sem produtos nas páginas de compartilhamento:', e.message)
}

const defaultImage = SITE ? `${SITE}/og.png` : null
for (const pg of pages) {
  const url = `${SITE}${pg.path}/` // o Pages serve cada rota como pasta (com barra final)
  const page = injectSeo(template, seoBlock({ title: pg.title, description: pg.description, url, image: pg.image ?? defaultImage, jsonLd: pg.jsonLd, preload: pg.preload }))
  write(join('dist', pg.path, 'index.html'), withSeed(pg.rootHtml ? injectRoot(page, pg.rootHtml) : page, pg.seed))
}

// painel: sem versão estática o Pages respondia 404 (a página abria, mas com status de erro)
write('dist/admin/index.html', template.replace('</head>', '<meta name="robots" content="noindex,nofollow" /></head>'))

// 3) robots e sitemap
if (SITE) {
  write('dist/robots.txt', `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITE}/sitemap.xml\n`)
  write('dist/sitemap.xml', buildSitemap(SITE, ['/', ...pages.filter((p) => p.path !== '/favoritos').map((p) => `${p.path}/`)]))
}
console.log(`postbuild: 404.html + ${pages.length} páginas de compartilhamento (base ${BASE}) + robots/sitemap`)
