import { useCallback, useEffect, useRef, useState } from 'react'
import { asset, publicImageUrl } from '../lib/env'
import { deleteBanner, listBannersAdmin, saveBanner, uploadBannerImage, type BannerRow } from './adminApi'
import { ImageRejected } from './imageUpload'

const empty = { title: '', subtitle: '', cta_label: '', link_url: '', image_path: null as string | null, active: true, sort: 0 }

export default function Banners() {
  const [items, setItems] = useState<BannerRow[]>([])
  const [f, setF] = useState<(typeof empty) & { id?: string }>(empty)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const file = useRef<HTMLInputElement>(null)
  const load = useCallback(() => { listBannersAdmin().then(setItems).catch((e) => setMsg({ ok: false, text: e.message })) }, [])
  useEffect(load, [load])
  const src = (p: string | null) => (p ? (p.startsWith('/') ? asset(p) : publicImageUrl(p)) : '')
  const run = async (fn: () => Promise<unknown>, okText: string) => {
    setBusy(true); setMsg(null)
    try { await fn(); setMsg({ ok: true, text: okText }); load() } catch (e) { setMsg({ ok: false, text: e instanceof ImageRejected ? e.message : (e as Error).message }) } finally { setBusy(false) }
  }
  return (
    <>
      <header className="adm-head"><h1>Banners</h1></header>
      <p className="adm-note">Espaço de campanhas, coleções, datas comemorativas e promoções na página inicial. Aparece o primeiro banner ativo (menor “ordem”). Sem banner ativo, o espaço some.</p>
      {msg && <p className={msg.ok ? 'adm-ok' : 'adm-err'} role={msg.ok ? 'status' : 'alert'}>{msg.text}</p>}
      <form className="adm-card" onSubmit={(e) => { e.preventDefault(); if (!f.title.trim()) return setMsg({ ok: false, text: 'Dê um título ao banner.' }); void run(async () => { await saveBanner({ ...f, title: f.title.trim() }); setF(empty) }, 'Banner salvo!') }}>
        <h2>{f.id ? 'Editar banner' : 'Novo banner'}</h2>
        <label className="field"><span>Título</span><input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} maxLength={80} placeholder="Ex.: Coleção Dia das Mães" /></label>
        <label className="field"><span>Texto de apoio (opcional)</span><input value={f.subtitle ?? ''} onChange={(e) => setF({ ...f, subtitle: e.target.value })} maxLength={140} /></label>
        <div className="adm-two">
          <label className="field"><span>Texto do botão (opcional)</span><input value={f.cta_label ?? ''} onChange={(e) => setF({ ...f, cta_label: e.target.value })} maxLength={30} placeholder="Ver coleção" /></label>
          <label className="field"><span>Link (opcional)</span><input value={f.link_url ?? ''} onChange={(e) => setF({ ...f, link_url: e.target.value })} placeholder="/lay-store ou https://…" /></label>
        </div>
        <input ref={file} type="file" accept="image/*" hidden onChange={(e) => { const fl = e.target.files?.[0]; if (fl) void run(async () => { const path = await uploadBannerImage(fl); setF((s) => ({ ...s, image_path: path })) }, 'Imagem enviada (salve o banner).') ; if (file.current) file.current.value = '' }} />
        <div className="adm-actions">
          <button type="button" className="btn btn--ghost adm-sm" onClick={() => file.current?.click()}>{f.image_path ? 'Trocar imagem' : 'Enviar imagem'}</button>
          {f.image_path && <img className="adm-banner-thumb" src={src(f.image_path)} alt="" />}
          <label className="adm-chk"><input type="checkbox" checked={f.active} onChange={(e) => setF({ ...f, active: e.target.checked })} /> Ativo</label>
          <label className="adm-chk">Ordem <input type="number" value={f.sort} onChange={(e) => setF({ ...f, sort: Number(e.target.value) || 0 })} style={{ width: 70 }} /></label>
        </div>
        <div className="adm-actions"><button className="btn btn--ink" disabled={busy}>Salvar banner</button>{f.id && <button type="button" className="btn btn--ghost" onClick={() => setF(empty)}>Cancelar edição</button>}</div>
      </form>
      <div className="adm-list">
        {items.map((b) => (
          <article key={b.id} className="adm-row">
            <div className="adm-row__main"><strong>{b.title}</strong><small>{b.active ? 'Ativo' : 'Inativo'} · ordem {b.sort}{b.link_url ? ` · ${b.link_url}` : ''}</small></div>
            <button className="btn btn--ghost adm-sm" onClick={() => { setF({ id: b.id, title: b.title, subtitle: b.subtitle ?? '', cta_label: b.cta_label ?? '', link_url: b.link_url ?? '', image_path: b.image_path, active: b.active, sort: b.sort }); window.scrollTo(0, 0) }}>Editar</button>
            <button className="adm-del" onClick={() => { if (confirm(`Excluir o banner “${b.title}”?`)) void run(() => deleteBanner(b), 'Banner excluído.') }}>Excluir</button>
          </article>
        ))}
        {!items.length && <p className="adm-empty">Nenhum banner ainda.</p>}
      </div>
    </>
  )
}
