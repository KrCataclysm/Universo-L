import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Catalog, Product, ProductQuery } from './catalog'
import { exampleCatalog } from './exampleCatalog'

const Ctx = createContext<Catalog>(exampleCatalog)

export function CatalogProvider({ catalog = exampleCatalog, children }: { catalog?: Catalog; children: React.ReactNode }) {
  return <Ctx.Provider value={catalog}>{children}</Ctx.Provider>
}

export const useCatalog = () => useContext(Ctx)

export interface Async<T> { data?: T; loading: boolean; error: string | null; reload: () => void }

export function useAsync<T>(fn: (c: Catalog) => Promise<T>, deps: unknown[]): Async<T> {
  const catalog = useCatalog()
  const [state, setState] = useState<{ data?: T; loading: boolean; error: string | null }>({ loading: true, error: null })
  const [tick, setTick] = useState(0)
  useEffect(() => {
    let live = true
    setState((s) => ({ ...s, loading: true, error: null }))
    fn(catalog).then(
      (data) => live && setState({ data, loading: false, error: null }),
      () => live && setState({ loading: false, error: 'Não foi possível carregar. Tente de novo.' }),
    )
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalog, tick, ...deps])
  const reload = useCallback(() => setTick((t) => t + 1), [])
  return { ...state, reload }
}

export const useProducts = (q: ProductQuery) => useAsync<Product[]>((c) => c.listProducts(q), [q.brandSlug, q.categorySlug, q.featured])
export const useFeatured = () => useProducts({ featured: true })
