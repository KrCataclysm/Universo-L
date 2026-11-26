import { useCallback, useEffect, useState } from 'react'
import { deleteCollection, listBrands, listCollectionsAdmin, listProducts, saveCollection, type AdminProduct, type Brand, type CollectionRow } from './adminApi'

const empty = { name: '', description: '', active: true, productIds: [] as string[] }

export default function Collections() {
  const [items, setItems] = useState<CollectionRow[]>([])
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [f, setF] = useState<typeof empty & { id?: string }>(empty)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const load = useCallback(() => { Promise.all([listCollectionsAdmin(), listProducts(), listBrands()]).then(([c, p, b]) => { setItems(c); setProducts(p); setBrands(b) }).catch((e) => setMsg({ ok: false, text: e.message })) }, [])
  useEffect(load, [load])
  const run = async (fn: () => Promise<unknown>, okText: string) => {
    setBusy(true); setMsg(null)
    try { await fn(); setMsg({ ok: true, text: okText }); load() } catch (e) { setMsg({ ok: false, text: (e as Error).message }) } finally { setBusy(false) }
  }
  const toggle = (pid: string) => setF((x) => ({ ...x, productIds: x.productIds.includes(pid) ? x.productIds.filter((i) => i !== pid) : [...x.productIds, pid] }))
  return (
    <>
      <header className="adm-head"><h1>Coleções</h1></header>
      <p className="adm-note">Uma coleção reúne peças de qualquer marca (ex.: “Verão”, “Dia das Mães”). Ela aparece em <b>Coleções</b>, no rodapé do site, quando está ativa e tem ao menos uma peça publicada.</p>
      {msg && <p className={msg.ok ? 'adm-ok' : 'adm-err'} role={msg.ok ? 'status' : 'alert'}>{msg.text}</p>}
      <form className="adm-card" onSubmit={(e) => { e.preventDefault(); if (!f.name.trim()) return setMsg({ ok: false, text: 'Dê um nome à coleção.' }); void run(async () => { await saveCollection({ id: f.id, name: f.name.trim(), description: f.description.trim(), active: f.active, productIds: f.productIds }); setF(empty) }, 'Coleção salva.') }}>
        <h2>{f.id ? 'Editar coleção' : 'Nova coleção'}</h2>
        <label className="field"><span>Nome</span><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} maxLength={60} placeholder="Ex.: Verão" /></label>
        <label className="field"><span>Descrição (opcional)</span><input value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} maxLength={160} placeholder="Uma frase curta" /></label>
        <label className="adm-chk"><input type="checkbox" checked={f.active} onChange={(e) => setF({ ...f, active: e.target.checked })} /> Coleção ativa (aparece no site)</label>
        <fieldset className="adm-pick"><legend>Peças da coleção ({f.productIds.length})</legend>
          {brands.map((b) => (
            <div key={b.id}>
              <h3>{b.name}</h3>
              {products.filter((p) => p.brand_id === b.id).map((p) => (
                <label key={p.id} className="adm-chk"><input type="checkbox" checked={f.productIds.includes(p.id)} onChange={() => toggle(p.id)} /> {p.name}{p.status !== 'published' ? ' (não publicada)' : ''}</label>
              ))}
            </div>
          ))}
        </fieldset>
        <div className="adm-actions">
          <button className="btn btn--ink" disabled={busy}>{busy ? 'Salvando…' : 'Salvar coleção'}</button>
          {f.id && <button type="button" className="btn btn--ghost" onClick={() => setF(empty)}>Cancelar</button>}
        </div>
      </form>
      {items.map((c) => (
        <section className="adm-card" key={c.id}>
          <h2>{c.name} <small>{c.active ? 'ativa' : 'oculta'} · {c.product_ids.length} peças</small></h2>
          {c.description && <p>{c.description}</p>}
          <div className="adm-actions">
            <button className="btn btn--ghost adm-sm" onClick={() => { setF({ id: c.id, name: c.name, description: c.description, active: c.active, productIds: c.product_ids }); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Editar</button>
            <button className="btn btn--ghost adm-sm" onClick={() => void run(() => saveCollection({ id: c.id, name: c.name, description: c.description, active: !c.active, productIds: c.product_ids }), c.active ? 'Coleção ocultada.' : 'Coleção ativada.')}>{c.active ? 'Ocultar' : 'Ativar'}</button>
            <button className="adm-del" onClick={() => { if (confirm(`Excluir a coleção “${c.name}”? As peças não são apagadas.`)) void run(() => deleteCollection(c.id), 'Coleção excluída.') }}>Excluir</button>
          </div>
        </section>
      ))}
    </>
  )
}
