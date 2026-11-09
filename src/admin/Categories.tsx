import { useCallback, useEffect, useState } from 'react'
import { addCategory, deleteCategory, listBrands, listCats, renameCategory, type Brand, type Cat } from './adminApi'

export default function Categories() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [cats, setCats] = useState<Cat[]>([])
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [err, setErr] = useState<string | null>(null)
  const load = useCallback(() => { Promise.all([listBrands(), listCats()]).then(([b, c]) => { setBrands(b); setCats(c) }).catch((e) => setErr(e.message)) }, [])
  useEffect(load, [load])
  const run = async (fn: () => Promise<unknown>) => { setErr(null); try { await fn(); load() } catch (e) { setErr((e as Error).message) } }
  return (
    <>
      <header className="adm-head"><h1>Categorias</h1></header>
      {err && <p className="adm-err" role="alert">{err}</p>}
      {brands.map((b) => (
        <section className="adm-card" key={b.id}>
          <h2>{b.name}</h2>
          {cats.filter((c) => c.brand_id === b.id).map((c) => (
            <div className="adm-cat" key={c.id}>
              <input defaultValue={c.name} aria-label={`Nome da categoria ${c.name}`} onBlur={(e) => { const v = e.target.value.trim(); if (v && v !== c.name) run(() => renameCategory(c.id, v)) }} />
              <button className="adm-del" onClick={() => { if (confirm(`Excluir a categoria “${c.name}”? Os produtos ficam sem categoria.`)) run(() => deleteCategory(c.id)) }}>Excluir</button>
            </div>
          ))}
          <form className="adm-cat" onSubmit={(e) => { e.preventDefault(); const v = (draft[b.id] ?? '').trim(); if (v) run(async () => { await addCategory(b.id, v); setDraft((d) => ({ ...d, [b.id]: '' })) }) }}>
            <input value={draft[b.id] ?? ''} onChange={(e) => setDraft((d) => ({ ...d, [b.id]: e.target.value }))} placeholder="Nova categoria" />
            <button className="btn btn--ink adm-sm">Adicionar</button>
          </form>
        </section>
      ))}
    </>
  )
}
