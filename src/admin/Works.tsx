import { useCallback, useEffect, useRef, useState } from 'react'
import { publicImageUrl } from '../lib/env'
import { addWork, deleteWork, listBrands, listWorksAdmin, updateWork, type Brand, type WorkRow } from './adminApi'
import { ImageRejected } from './imageUpload'

export default function Works() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [items, setItems] = useState<WorkRow[]>([])
  const [brandId, setBrandId] = useState('')
  const [title, setTitle] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const file = useRef<HTMLInputElement>(null)
  const load = useCallback(() => { Promise.all([listBrands(), listWorksAdmin()]).then(([b, w]) => { setBrands(b); setItems(w); setBrandId((cur) => cur || b.find((x) => x.slug === 'falou-bordei')?.id || b[0]?.id || '') }).catch((e) => setMsg({ ok: false, text: e.message })) }, [])
  useEffect(load, [load])
  const run = async (fn: () => Promise<unknown>, okText: string) => {
    setBusy(true); setMsg(null)
    try { await fn(); setMsg({ ok: true, text: okText }); load() } catch (e) { setMsg({ ok: false, text: e instanceof ImageRejected ? e.message : (e as Error).message }) } finally { setBusy(false) }
  }
  const upload = (files: FileList | null) => {
    if (!files?.length || !brandId) return
    const base = items.filter((w) => w.brand_id === brandId).length
    void run(async () => { let n = base; for (const f of Array.from(files)) { await addWork(brandId, f, files.length === 1 ? title.trim() : '', n++) } setTitle(''); if (file.current) file.current.value = '' }, 'Foto(s) adicionada(s).')
  }
  const move = (w: WorkRow, list: WorkRow[], d: -1 | 1) => {
    const i = list.findIndex((x) => x.id === w.id), o = list[i + d]
    if (!o) return
    void run(async () => { await updateWork(w.id, { sort: o.sort }); await updateWork(o.id, { sort: w.sort }) }, 'Ordem atualizada.')
  }
  return (
    <>
      <header className="adm-head"><h1>Trabalhos realizados</h1></header>
      <p className="adm-note">Fotos de trabalhos já entregues (portfólio). Aparecem no fim da página da marca, só quando houver ao menos uma foto ativa.</p>
      {msg && <p className={msg.ok ? 'adm-ok' : 'adm-err'} role={msg.ok ? 'status' : 'alert'}>{msg.text}</p>}
      <section className="adm-card">
        <h2>Adicionar fotos</h2>
        <label className="field"><span>Marca</span><select value={brandId} onChange={(e) => setBrandId(e.target.value)}>{brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
        <label className="field"><span>Título (opcional, para uma foto)</span><input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} placeholder="Ex.: Bastidor de casamento" /></label>
        <input ref={file} type="file" accept="image/*" multiple disabled={busy || !brandId} onChange={(e) => upload(e.target.files)} />
        <small>As fotos são reduzidas e otimizadas automaticamente.</small>
      </section>
      {brands.map((b) => {
        const list = items.filter((w) => w.brand_id === b.id)
        if (!list.length) return null
        return (
          <section className="adm-card" key={b.id}>
            <h2>{b.name} <small>{list.length} foto(s)</small></h2>
            <div className="adm-works">
              {list.map((w) => (
                <figure key={w.id} className={w.active ? '' : 'off'}>
                  <img src={w.image_path.startsWith('/') ? w.image_path : publicImageUrl(w.image_path)} alt={w.title || 'Trabalho'} loading="lazy" />
                  <input defaultValue={w.title} placeholder="Título" aria-label="Título da foto" maxLength={80} onBlur={(e) => { const v = e.target.value.trim(); if (v !== w.title) void run(() => updateWork(w.id, { title: v }), 'Título salvo.') }} />
                  <div className="adm-actions">
                    <button className="btn btn--ghost adm-sm" onClick={() => move(w, list, -1)} aria-label="Mover para antes">←</button>
                    <button className="btn btn--ghost adm-sm" onClick={() => move(w, list, 1)} aria-label="Mover para depois">→</button>
                    <button className="btn btn--ghost adm-sm" onClick={() => void run(() => updateWork(w.id, { active: !w.active }), w.active ? 'Foto ocultada.' : 'Foto ativada.')}>{w.active ? 'Ocultar' : 'Mostrar'}</button>
                    <button className="adm-del" onClick={() => { if (confirm('Excluir esta foto?')) void run(() => deleteWork(w), 'Foto excluída.') }}>Excluir</button>
                  </div>
                </figure>
              ))}
            </div>
          </section>
        )
      })}
    </>
  )
}
