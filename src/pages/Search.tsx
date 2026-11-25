import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ShopTools from '../components/ShopTools'
import { DEFAULT_TOOLS, applyTools, type Tools } from '../lib/sort'
import { BRANDS } from '../brand/brands'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../data/CatalogProvider'
import { searchProducts } from '../lib/search'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Search() {
  useDocumentTitle('Buscar produtos')
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const all = useProducts({})
  const found = useMemo(() => (all.data ? searchProducts(all.data, q) : []), [all.data, q])
  const [tools, setTools] = useState<Tools>(DEFAULT_TOOLS)
  const results = useMemo(() => applyTools(found, tools), [found, tools])
  return (
    <main className="page searchpage">
      <div className="container">
        <h1>Buscar produtos</h1>
        <form role="search" className="searchbox" onSubmit={(e) => e.preventDefault()}>
          <label className="sr-only" htmlFor="q">O que você procura?</label>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4" /></svg>
          <input id="q" type="search" autoFocus value={q} placeholder="Ex.: bermuda, sutiã, bordado…" onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })} autoComplete="off" />
        </form>
        {all.error && <p role="alert" className="searchpage__msg">{all.error} <button className="btn btn--ghost" onClick={all.reload}>Tentar de novo</button></p>}
        {all.data && (
          <p className="searchpage__msg" role="status" aria-live="polite">
            {q.trim() ? `${results.length} ${results.length === 1 ? 'resultado' : 'resultados'} para “${q.trim()}”` : `${results.length} ${results.length === 1 ? 'produto' : 'produtos'}`}
          </p>
        )}
        {all.data && found.length > 1 && <ShopTools all={found} shown={results.length} value={tools} onChange={setTools} hideCount />}
        {all.data && !results.length && (
          <div className="empty"><h2 className="sr-only">Resultado da busca</h2><h3>Nada encontrado</h3><p>Tente outra palavra ou veja as marcas:</p>
            <div className="contact__links">{BRANDS.map((b) => <Link key={b.slug} className="btn btn--ghost" to={`/${b.slug}`}>{b.name}</Link>)}</div>
          </div>
        )}
        <div className="pgrid">{results.map((p) => <div key={p.id} className="pgrid__item"><ProductCard p={p} /></div>)}</div>
      </div>
    </main>
  )
}
