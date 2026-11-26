export interface ProductImage { url: string; alt: string }
export interface Variant { id: string; label: string; type: 'size' | 'color' | 'other'; value: string; inStock: boolean; /** unidades; null = a loja não controla a quantidade */ stock?: number | null }
export interface CustomField { key: string; label: string; type: 'text' | 'select'; options?: string[]; required: boolean }

export interface Product {
  id: string
  brandSlug: string
  categorySlug: string | null
  slug: string
  name: string
  description: string
  priceCents: number
  images: ProductImage[]
  variants: Variant[]
  featured: boolean
  customizable: boolean
  /** esgotado: aparece com selo e não pode ser adicionado ao carrinho */
  soldOut?: boolean
  /** selos: Novidade, Pronta entrega, Sob encomenda */
  labels?: string[]
  customizationFields: CustomField[]
  /** true = item de exemplo (pode ser removido pelo painel) */
  isExample?: boolean
  /** só difere de 'published' quando o admin liga "ver rascunhos" */
  status?: string
}

export interface ProductQuery { brandSlug?: string; categorySlug?: string; featured?: boolean }
export interface Category { slug: string; name: string }

export interface Collection { slug: string; name: string; description: string; imageUrl: string | null; count: number }
export interface Work { id: string; brandSlug: string; title: string; description: string; imageUrl: string }

export interface Banner { id: string; title: string; subtitle: string; ctaLabel: string; linkUrl: string; imageUrl: string | null }

export interface Catalog {
  listBanners(): Promise<Banner[]>
  listProducts(q: ProductQuery): Promise<Product[]>
  getProduct(brandSlug: string, slug: string): Promise<Product | null>
  listCategories(brandSlug: string): Promise<Category[]>
  listCollections(): Promise<Collection[]>
  getCollection(slug: string): Promise<{ collection: Collection; products: Product[] } | null>
  listWorks(brandSlug: string): Promise<Work[]>
  getSettings(): Promise<Record<string, string>>
}
