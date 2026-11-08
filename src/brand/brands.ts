export type BrandSlug = 'lay-store' | 'ousada-delicada' | 'falou-bordei'

export interface Brand {
  slug: BrandSlug
  name: string
  category: string
  /** cor-assinatura: degradê de accentFrom → accentTo */
  accentFrom: string
  accentTo: string
}

export const BRANDS: readonly Brand[] = [
  { slug: 'lay-store', name: 'Lay.Store', category: 'Moda fitness', accentFrom: '#9FB8FF', accentTo: '#A38A9E' },
  { slug: 'ousada-delicada', name: 'Ousada Delicada', category: 'Moda íntima', accentFrom: '#F2A7C8', accentTo: '#A38A9E' },
  { slug: 'falou-bordei', name: 'Falou, Bordei', category: 'Bordados e personalizados', accentFrom: '#D9B98A', accentTo: '#A38A9E' },
]

export const getBrand = (slug: string): Brand | undefined => BRANDS.find((b) => b.slug === slug)

export const SLOGAN = 'Todas as suas marcas em um só lugar.'
export const CONCEPT =
  'Um universo de moda, estilo, delicadeza e peças personalizadas, onde cada mulher encontra algo especial para si ou para presentear.'
