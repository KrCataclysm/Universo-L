/** Utilidades de SEO / Open Graph usadas no pós-build (puras e testáveis). */

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

export function seoBlock({ title, description, url, image, jsonLd, preload }) {
  const t = esc(title), d = esc(description), u = esc(url)
  const lines = [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    `<link rel="canonical" href="${u}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Universo Lay" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:url" content="${u}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
  ]
  if (image) {
    const i = esc(image)
    lines.push(`<meta property="og:image" content="${i}" />`, `<meta name="twitter:image" content="${i}" />`)
  }
  if (preload) lines.push(`<link rel="preload" as="image" href="${esc(preload.href)}"${preload.srcset ? ` imagesrcset="${esc(preload.srcset)}"` : ''}${preload.sizes ? ` imagesizes="${esc(preload.sizes)}"` : ''} fetchpriority="high" />`)
  for (const j of [jsonLd].flat().filter(Boolean)) lines.push(`<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`)
  return lines.join('\n    ')
}

export const injectSeo = (html, block) => html.replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, () => `<!--seo:start-->${block}<!--seo:end-->`)

export function buildSitemap(origin, paths) {
  const base = origin.replace(/\/+$/, '')
  const urls = paths.map((p) => `  <url><loc>${esc(p === '/' ? `${base}/` : `${base}${p}`)}</loc></url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

/** Coloca HTML inicial dentro de #root (o React substitui ao carregar). */
export const injectRoot = (html, inner) => html.replace('<div id="root"></div>', () => `<div id="root">${inner}</div>`)

/** Embute os dados do produto no HTML: a página renderiza a foto no 1º commit, sem esperar a rede. */
export const withSeed = (html, seed) => {
  if (!seed) return html
  const json = JSON.stringify(seed).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
  return html.replace('</body>', () => `<script id="__seed" type="application/json">${json}</script></body>`)
}
