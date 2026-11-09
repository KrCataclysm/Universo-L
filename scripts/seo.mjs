/** Utilidades de SEO / Open Graph usadas no pós-build (puras e testáveis). */

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

export function seoBlock({ title, description, url, image }) {
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
  return lines.join('\n    ')
}

export const injectSeo = (html, block) => html.replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, () => `<!--seo:start-->${block}<!--seo:end-->`)

export function buildSitemap(origin, paths) {
  const base = origin.replace(/\/+$/, '')
  const urls = paths.map((p) => `  <url><loc>${esc(p === '/' ? `${base}/` : `${base}${p}`)}</loc></url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}
