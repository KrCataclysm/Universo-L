import { getBrand } from '../brand/brands'
import type { Catalog, Category, CustomField, Product, ProductQuery, Variant } from './catalog'

/** Imagem de exemplo gerada (degradê + legenda). Sem foto real até a loja cadastrar. */
function art(brandSlug: string, label: string): string {
  const b = getBrand(brandSlug)!
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><defs><linearGradient id="g" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${b.accentFrom}"/><stop offset="1" stop-color="${b.accentTo}"/></linearGradient></defs><rect width="800" height="1000" fill="#F7F5F2"/><rect x="60" y="60" width="680" height="880" rx="28" fill="url(#g)" opacity=".55"/><g fill="none" stroke="#28272B" stroke-opacity=".35">${Array.from({ length: 14 }, (_, i) => `<path d="M60 ${320 + i * 22} C 280 ${120 + i * 10}, 520 ${700 - i * 6}, 740 ${360 + i * 8}"/>`).join('')}</g><text x="400" y="880" text-anchor="middle" font-family="Georgia,serif" font-size="40" fill="#28272B" fill-opacity=".8">${label}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const sizes = (): Variant[] => ['P', 'M', 'G', 'GG'].map((s) => ({ id: `s-${s}`, label: 'Tamanho', type: 'size', value: s, inStock: true }))
const bordado: CustomField[] = [
  { key: 'nome', label: 'Nome ou texto a bordar', type: 'text', required: true },
  { key: 'cor_linha', label: 'Cor da linha', type: 'select', options: ['Lilás', 'Rosé', 'Dourado', 'Grafite', 'Branco'], required: true },
  { key: 'observacoes', label: 'Observações', type: 'text', required: false },
]

function mk(brandSlug: string, categorySlug: string, slug: string, title: string, priceCents: number, extra: Partial<Product> = {}): Product {
  const name = `${title} (exemplo)`
  return {
    id: `ex-${brandSlug}-${slug}`, brandSlug, categorySlug, slug, name,
    description: 'Item de exemplo para visualizar o layout. Será substituído pelas peças reais cadastradas no painel.',
    priceCents,
    images: [1, 2, 3].map((n) => ({ url: art(brandSlug, `${title} ${n}`), alt: `${name}, foto ${n}` })),
    variants: [], featured: false, customizable: false, customizationFields: [], isExample: true,
    ...extra,
  }
}

const build = (): Product[] => [
  mk('lay-store', 'leggings', 'legging-cintura-alta', 'Legging cintura alta', 11990, { variants: sizes(), featured: true }),
  mk('lay-store', 'leggings', 'legging-sem-costura', 'Legging sem costura', 13990, { variants: sizes() }),
  mk('lay-store', 'tops', 'top-sustentacao', 'Top de sustentação', 7990, { variants: sizes(), featured: true }),
  mk('lay-store', 'conjuntos', 'conjunto-treino', 'Conjunto de treino', 18990, { variants: sizes() }),
  mk('ousada-delicada', 'conjuntos', 'conjunto-renda', 'Conjunto de renda', 12990, { variants: sizes(), featured: true }),
  mk('ousada-delicada', 'conjuntos', 'conjunto-delicado', 'Conjunto delicado', 10990, { variants: sizes() }),
  mk('ousada-delicada', 'camisolas', 'camisola-cetim', 'Camisola de cetim', 14990, { variants: sizes() }),
  mk('falou-bordei', 'toalhas', 'toalha-bordada', 'Toalha bordada', 6990, { customizable: true, customizationFields: bordado, featured: true }),
  mk('falou-bordei', 'kits', 'kit-presente-bordado', 'Kit presente bordado', 15990, { customizable: true, customizationFields: bordado }),
  mk('falou-bordei', 'toalhas', 'necessaire-bordada', 'Necessaire personalizada', 5490, { customizable: true, customizationFields: bordado }),
]

let cache: Product[] | undefined
const products = (): Product[] => (cache ??= build())

const CATEGORIES: Record<string, Category[]> = {
  'lay-store': [{ slug: 'leggings', name: 'Leggings' }, { slug: 'tops', name: 'Tops' }, { slug: 'conjuntos', name: 'Conjuntos' }],
  'ousada-delicada': [{ slug: 'conjuntos', name: 'Conjuntos' }, { slug: 'camisolas', name: 'Camisolas' }],
  'falou-bordei': [{ slug: 'toalhas', name: 'Toalhas e acessórios' }, { slug: 'kits', name: 'Kits presente' }],
}

export const exampleCatalog: Catalog = {
  async listProducts(q: ProductQuery) {
    return products().filter((p) =>
      (!q.brandSlug || p.brandSlug === q.brandSlug) &&
      (!q.categorySlug || p.categorySlug === q.categorySlug) &&
      (q.featured === undefined || p.featured === q.featured))
  },
  async getProduct(brandSlug, slug) {
    return products().find((p) => p.brandSlug === brandSlug && p.slug === slug) ?? null
  },
  async listCategories(brandSlug) {
    return CATEGORIES[brandSlug] ?? []
  },
  async getSettings() {
    return {}
  },
}
