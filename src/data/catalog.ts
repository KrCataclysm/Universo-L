export interface ProductImage { url: string; alt: string }
export interface Variant { id: string; label: string; type: 'size' | 'color' | 'other'; value: string; inStock: boolean }
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
  customizationFields: CustomField[]
  /** true = item de exemplo (pode ser removido pelo painel) */
  isExample?: boolean
}

export interface ProductQuery { brandSlug?: string; categorySlug?: string; featured?: boolean }
export interface Category { slug: string; name: string }

export interface Catalog {
  listProducts(q: ProductQuery): Promise<Product[]>
  getProduct(brandSlug: string, slug: string): Promise<Product | null>
  listCategories(brandSlug: string): Promise<Category[]>
  getSettings(): Promise<Record<string, string>>
}
