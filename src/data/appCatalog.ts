import { SUPABASE_KEY, SUPABASE_URL, hasSupabase } from '../lib/env'
import type { Catalog } from './catalog'
import { exampleCatalog } from './exampleCatalog'
import { createRestCatalog } from './restCatalog'

/** Banco configurado → catálogo real (REST leve); senão, exemplos locais. */
export const appCatalog: Catalog = hasSupabase ? createRestCatalog(SUPABASE_URL!, SUPABASE_KEY!) : exampleCatalog
