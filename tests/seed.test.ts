import { afterEach, describe, expect, it } from 'vitest'
import { seedProduct } from '../src/data/seed'
import { withSeed } from '../scripts/seo.mjs'

const row = { id: '1', slug: 'bermuda-ciclista', name: 'Bermuda', description: '', price_cents: 6690, featured: true, customizable: false, sold_out: false, labels: [], customization_schema: null, is_example: false, status: 'published', brands: { slug: 'lay-store' }, product_images: [{ path: '/produtos/bermuda-ciclista.webp', sort: 0, alt: 'x' }], product_variants: [] }
afterEach(() => { document.body.innerHTML = '' })

describe('seed do produto', () => {
  it('lê o produto embutido quando marca e slug batem', () => {
    document.body.innerHTML = withSeed('<body></body>', row).replace(/<\/?body>/g, '')
    expect(seedProduct('lay-store', 'bermuda-ciclista')?.name).toBe('Bermuda')
  })
  it('ignora quando é outro produto (navegação interna)', () => {
    document.body.innerHTML = withSeed('<body></body>', row).replace(/<\/?body>/g, '')
    expect(seedProduct('lay-store', 'outro')).toBeNull()
  })
  it('sem seed devolve null e escapa "<" no JSON', () => {
    expect(seedProduct('lay-store', 'x')).toBeNull()
    expect(withSeed('</body>', { name: '</script><b>' })).not.toContain('</script><b>')
  })
})
