import { hasSupabase } from '../lib/env'
import type { Catalog } from './catalog'
import { exampleCatalog } from './exampleCatalog'

/** Carrega o cliente Supabase sob demanda (fora do JS inicial). */
let loaded: Promise<Catalog> | undefined
const load = () => (loaded ??= import('./supabaseCatalog').then((m) => m.createSupabaseCatalog()))

const lazy: Catalog = {
  listProducts: async (q) => (await load()).listProducts(q),
  getProduct: async (b, s) => (await load()).getProduct(b, s),
  listCategories: async (b) => (await load()).listCategories(b),
  getSettings: async () => (await load()).getSettings(),
}

export const appCatalog: Catalog = hasSupabase ? lazy : exampleCatalog
