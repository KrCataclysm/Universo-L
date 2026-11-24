export type BrandSlug = 'lay-store' | 'ousada-delicada' | 'falou-bordei'

export interface Brand {
  slug: BrandSlug
  name: string
  category: string
  /** cor-assinatura: degradê de accentFrom → accentTo */
  accentFrom: string
  accentTo: string
  /** foto de capa (arquivo em public/produtos/) */
  cover: string
  /** texto curto da página da marca (SEO e leitura) */
  intro: string
}

export const BRANDS: readonly Brand[] = [
  { slug: 'lay-store', name: 'Lay.store', category: 'Moda fitness', accentFrom: '#9FB8FF', accentTo: '#A38A9E', cover: 'bermuda-ciclista', intro: 'Moda fitness para treinar com conforto e estilo: bermudas, shorts, tops e blusões de tecido confortável e caimento perfeito.' },
  { slug: 'ousada-delicada', name: 'Ousada Delicada', category: 'Moda íntima', accentFrom: '#F2A7C8', accentTo: '#A38A9E', cover: 'sutia-coringa', intro: 'Moda íntima com personalidade: sutiãs, calcinhas e peças em renda, em cores e modelos pensados para o dia a dia.' },
  { slug: 'falou-bordei', name: 'Falou Bordei', category: 'Bordados e personalizados', accentFrom: '#D9B98A', accentTo: '#A38A9E', cover: 'imaculado-coracao-acrilico', intro: 'Bordados feitos à mão e peças personalizadas: molduras, roupas e lembranças bordadas com carinho, do seu jeito.' },
]

export const getBrand = (slug: string): Brand | undefined => BRANDS.find((b) => b.slug === slug)

export const SLOGAN = 'Todas as suas marcas em um só lugar.'
export const CONCEPT =
  'Um universo de moda, estilo, delicadeza e peças personalizadas, onde cada mulher encontra algo especial para si ou para presentear.'

export const HERO_LEAD = 'Moda fitness, moda íntima e peças personalizadas para vestir, encantar e presentear.'
