import { describe, expect, it } from 'vitest'
import { buildSitemap, esc, injectSeo, seoBlock } from '../scripts/seo.mjs'

describe('seo', () => {
  it('esc neutraliza HTML e aspas', () => {
    expect(esc(`"<script>alert('x')</script>&`)).toBe('&quot;&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;&amp;')
  })
  it('seoBlock gera título, descrição e Open Graph escapados', () => {
    const b = seoBlock({ title: 'Toalha "bordada" & cia', description: 'Peça <única>', url: 'https://x.test/a', image: 'https://x.test/i.webp' })
    expect(b).toContain('<title>Toalha &quot;bordada&quot; &amp; cia</title>')
    expect(b).toContain('content="Peça &lt;única&gt;"')
    expect(b).toContain('property="og:image" content="https://x.test/i.webp"')
    expect(b).toContain('rel="canonical" href="https://x.test/a"')
    expect(b).not.toContain('<script>')
  })
  it('sem imagem não gera og:image', () => {
    expect(seoBlock({ title: 't', description: 'd', url: 'https://x.test/', image: null })).not.toContain('og:image')
  })
  it('injectSeo troca só o bloco marcado', () => {
    const html = '<head><!--seo:start-->velho<!--seo:end--><meta name="viewport"></head>'
    const out = injectSeo(html, 'NOVO')
    expect(out).toBe('<head><!--seo:start-->NOVO<!--seo:end--><meta name="viewport"></head>')
  })
  it('sitemap lista as URLs absolutas sem duplicar barras', () => {
    const x = buildSitemap('https://x.test/base/', ['/', '/lay-store', '/lay-store/peca'])
    expect(x).toContain('<loc>https://x.test/base/</loc>')
    expect(x).toContain('<loc>https://x.test/base/lay-store/peca</loc>')
    expect(x.match(/<url>/g)!.length).toBe(3)
  })
})
