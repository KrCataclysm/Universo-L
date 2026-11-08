import type { Catalog } from './catalog'

export const emptyCatalog: Catalog = {
  listProducts: async () => [],
  getProduct: async () => null,
  listCategories: async () => [],
  getSettings: async () => ({}),
}
