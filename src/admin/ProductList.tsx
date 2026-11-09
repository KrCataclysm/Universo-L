import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatBRL } from '../cart/money'
import { createDraft, deleteProduct, listBrands, listProducts, quickUpdate, removeExamples, type AdminProduct, type Brand, type Status } from './adminApi'

const LABEL: Record<Status, string> = { draft: 'Rascunho', published: 'Publicado', hidden: 'Oculto' }

export default function ProductList() {
  const nav = useNavigate()
  const [items, setItems] = useState<AdminProduct[] | null>(null)
  const [brands, setBrands] = useState<Brand[]>([])
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const load = useCallback(() => { listProducts().then(setItems).catch((e) => setErr(e.message)) }, [])
  useEffect(() => { load(); listBrands().then(setBrands).catch(() => {}) }, [load])

  const act = async (fn: () => Promise<unknown>) => { setBusy(true); setErr(null); try { await fn(); load() } catch (e) { setErr((e as Error).message) } finally { setBusy(false) } }
  const examples = items?.filter((p) => p.is_example).length ?? 0

  return (
    <>
      <header className="adm-head">
        <h1>Produtos</h1>
        <div className="adm-actions">
          {examples > 0 && <button className="btn btn--ghost" disabled={busy} onClick={() => { if (confirm(`Apagar os ${examples} produtos de exemplo? Isso não afeta os seus produtos reais.`)) act(removeExamples) }}>Remover exemplos ({examples})</button>}
          <select id="newbrand" defaultValue="" aria-label="Marca do novo produto" onChange={(e) => { const b = e.target.value; e.target.value = ''; if (b) act(async () => nav(`/admin/produtos/${await createDraft(b)}`)) }}>
            <option value="">+ Novo produto…</option>
            {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
      </header>
      {err && <p className="adm-err" role="alert">{err}</p>}
      {!items && !err && <p>Carregando…</p>}
      {items && !items.length && <p className="adm-empty">Nenhum produto ainda. Use “+ Novo produto” para cadastrar o primeiro.</p>}
      <div className="adm-list">
        {items?.map((p) => (
          <article key={p.id} className="adm-row">
            <div className="adm-row__main">
              <Link to={`/admin/produtos/${p.id}`}><strong>{p.name}</strong></Link>
              <small>{p.brands?.name} · {formatBRL(p.price_cents)} {p.is_example && '· exemplo'}</small>
            </div>
            <select value={p.status} aria-label={`Situação de ${p.name}`} onChange={(e) => act(() => quickUpdate(p.id, { status: e.target.value as Status }))}>
              {(Object.keys(LABEL) as Status[]).map((s) => <option key={s} value={s}>{LABEL[s]}</option>)}
            </select>
            <label className="adm-chk"><input type="checkbox" checked={p.featured} onChange={(e) => act(() => quickUpdate(p.id, { featured: e.target.checked }))} /> Destaque</label>
            <Link className="btn btn--ghost adm-sm" to={`/admin/produtos/${p.id}`}>Editar</Link>
            <button className="adm-del" onClick={() => { if (confirm(`Excluir “${p.name}”?`)) act(() => deleteProduct(p.id)) }}>Excluir</button>
          </article>
        ))}
      </div>
    </>
  )
}
