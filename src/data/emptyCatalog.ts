import type { Catalog } from './catalog'

export const emptyCatalog: Catalog = {
  listBanners: async () => [],
  listProducts: async () => [],
  getProduct: async () => null,
  listCategories: async () => [],
  getSettings: async () => ({}),
}
