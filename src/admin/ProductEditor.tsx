import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { formatBRL, parsePriceToCents } from '../cart/money'
import {
  addImage, deleteProduct, getProduct, listBrands, listCats, removeImage, reorderImages, saveProduct,
  type AdminProduct, type Brand, type Cat, type FieldDef, type ImageRow, type Status, type VariantRow,
} from './adminApi'
import { ImageRejected } from './imageUpload'

const centsToInput = (c: number) => (c / 100).toFixed(2).replace('.', ',')

export default function ProductEditor() {
  const { id = '' } = useParams()
  const nav = useNavigate()
  const [p, setP] = useState<AdminProduct | null | undefined>()
  const [brands, setBrands] = useState<Brand[]>([])
  const [cats, setCats] = useState<Cat[]>([])
  const [f, setF] = useState({ name: '', description: '', price: '', brandId: '', categoryId: '', status: 'draft' as Status, featured: false, customizable: false })
  const [fields, setFields] = useState<FieldDef[]>([])
  const [variants, setVariants] = useState<VariantRow[]>([])
  const [images, setImages] = useState<ImageRow[]>([])
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [optInput, setOptInput] = useState('')
  const [optLabel, setOptLabel] = useState('Tamanho')
  const file = useRef<HTMLInputElement>(null)

  useEffect(() => {
    Promise.all([getProduct(id), listBrands(), listCats()]).then(([prod, b, c]) => {
      setBrands(b); setCats(c); setP(prod)
      if (!prod) return
      setF({ name: prod.name, description: prod.description, price: centsToInput(prod.price_cents), brandId: prod.brand_id, categoryId: prod.category_id ?? '', status: prod.status, featured: prod.featured, customizable: prod.customizable })
      setFields(prod.customization_schema ?? [])
      setVariants([...prod.product_variants].sort((a, z) => a.sort - z.sort))
      setImages([...prod.product_images].sort((a, z) => a.sort - z.sort))
      if (prod.product_variants[0]) setOptLabel(prod.product_variants[0].label)
    }).catch((e) => setMsg({ ok: false, text: e.message }))
  }, [id])

  if (p === undefined) return <p>Carregando…</p>
  if (p === null) return <p>Produto não encontrado. <Link to="/admin">Voltar</Link></p>

  const brandCats = cats.filter((c) => c.brand_id === f.brandId)
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((s) => ({ ...s, [k]: v }))

  const save = async () => {
    setMsg(null)
    const price = parsePriceToCents(f.price)
    if (!f.name.trim()) return setMsg({ ok: false, text: 'Dê um nome ao produto.' })
    if (price === null) return setMsg({ ok: false, text: 'Preço inválido. Exemplo: 119,90' })
    const bad = f.customizable && fields.find((x) => !x.label.trim())
    if (bad) return setMsg({ ok: false, text: 'Preencha o nome de todos os campos de personalização.' })
    setBusy(true)
    try {
      const cleanFields = fields.map((x, n) => ({ ...x, key: x.key || `campo_${n + 1}`, options: x.type === 'select' ? (x.options ?? []).filter(Boolean) : undefined }))
      const slug = await saveProduct({ id, brandId: f.brandId, categoryId: f.categoryId || null, name: f.name.trim(), description: f.description.trim(), priceCents: price, status: f.status, featured: f.featured, customizable: f.customizable, fields: cleanFields, variants }, p)
      setP({ ...p, name: f.name.trim(), slug, brand_id: f.brandId })
      setMsg({ ok: true, text: 'Salvo!' })
    } catch (e) { setMsg({ ok: false, text: (e as Error).message }) } finally { setBusy(false) }
  }

  const upload = async (files: FileList | null) => {
    if (!files?.length) return
    setBusy(true); setMsg(null)
    try {
      let list = images
      for (const file of Array.from(files)) { const row = await addImage(id, file, f.name.trim() || 'Foto do produto', list.length); list = [...list, row]; setImages(list) }
    } catch (e) { setMsg({ ok: false, text: e instanceof ImageRejected ? e.message : (e as Error).message }) } finally { setBusy(false); if (file.current) file.current.value = '' }
  }
  const move = async (i: number, d: -1 | 1) => {
    const j = i + d; if (j < 0 || j >= images.length) return
    const next = [...images]; [next[i], next[j]] = [next[j], next[i]]
    setImages(next); await reorderImages(next)
  }
  const addOptions = () => {
    const vals = optInput.split(',').map((v) => v.trim()).filter(Boolean)
    const type = /cor/i.test(optLabel) ? 'color' : /tam/i.test(optLabel) ? 'size' : 'other'
    setVariants((v) => [...v.filter((x) => x.label === optLabel), ...vals.filter((x) => !v.some((y) => y.value === x)).map((value) => ({ label: optLabel, option_type: type as VariantRow['option_type'], value, in_stock: true }))])
    setOptInput('')
  }

  return (
    <>
      <header className="adm-head">
        <h1>{f.name || 'Produto'}</h1>
        <div className="adm-actions">
          <Link to="/admin" className="btn btn--ghost">← Produtos</Link>
          {f.status === 'published' && <Link to={`/${brands.find((b) => b.id === f.brandId)?.slug}/${p.slug}`} className="btn btn--ghost" target="_blank">Ver no site</Link>}
          <button className="btn btn--ink" onClick={save} disabled={busy}>{busy ? 'Salvando…' : 'Salvar'}</button>
        </div>
      </header>
      {msg && <p className={msg.ok ? 'adm-ok' : 'adm-err'} role={msg.ok ? 'status' : 'alert'}>{msg.text}</p>}
      <div className="adm-grid">
        <section className="adm-card">
          <h2>Informações</h2>
          <label className="field"><span>Nome</span><input value={f.name} onChange={(e) => set('name', e.target.value)} maxLength={120} /></label>
          <label className="field"><span>Descrição</span><textarea rows={4} value={f.description} onChange={(e) => set('description', e.target.value)} maxLength={1200} /></label>
          <div className="adm-two">
            <label className="field"><span>Preço (R$)</span><input inputMode="decimal" value={f.price} onChange={(e) => set('price', e.target.value)} placeholder="119,90" /></label>
            <label className="field"><span>Situação</span>
              <select value={f.status} onChange={(e) => set('status', e.target.value as Status)}><option value="draft">Rascunho (só você vê)</option><option value="published">Publicado</option><option value="hidden">Oculto</option></select>
            </label>
          </div>
          <div className="adm-two">
            <label className="field"><span>Marca</span><select value={f.brandId} onChange={(e) => { set('brandId', e.target.value); set('categoryId', '') }}>{brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
            <label className="field"><span>Categoria</span><select value={f.categoryId} onChange={(e) => set('categoryId', e.target.value)}><option value="">Sem categoria</option>{brandCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
          </div>
          <label className="adm-chk"><input type="checkbox" checked={f.featured} onChange={(e) => set('featured', e.target.checked)} /> Mostrar nos destaques da página inicial</label>
          {Number.isFinite(parsePriceToCents(f.price) ?? NaN) && <small>Vai aparecer como {formatBRL(parsePriceToCents(f.price)!)}</small>}
        </section>

        <section className="adm-card">
          <h2>Fotos</h2>
          <input ref={file} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
          <div className="adm-drop" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); upload(e.dataTransfer.files) }} onClick={() => file.current?.click()} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && file.current?.click()}>
            Clique ou arraste as fotos aqui<small>Reduzidas e otimizadas automaticamente</small>
          </div>
          <div className="adm-thumbs">
            {images.map((im, i) => (
              <figure key={im.id}>
                <img src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${im.path}`} alt={im.alt} />
                <figcaption>
                  <button onClick={() => move(i, -1)} aria-label="Mover para trás" disabled={i === 0}>←</button>
                  <button onClick={() => move(i, 1)} aria-label="Mover para frente" disabled={i === images.length - 1}>→</button>
                  <button onClick={async () => { await removeImage(im); setImages((l) => l.filter((x) => x.id !== im.id)) }} aria-label="Remover foto">✕</button>
                </figcaption>
              </figure>
            ))}
          </div>
          {p.product_images.length === 0 && images.length === 0 && <small>A primeira foto é a capa do produto.</small>}
        </section>

        <section className="adm-card">
          <h2>Opções (tamanho, cor…)</h2>
          <div className="adm-two">
            <label className="field"><span>Tipo</span><input value={optLabel} onChange={(e) => setOptLabel(e.target.value)} placeholder="Tamanho" /></label>
            <label className="field"><span>Valores (separe por vírgula)</span><input value={optInput} onChange={(e) => setOptInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOptions() } }} placeholder="P, M, G" /></label>
          </div>
          <button className="btn btn--ghost adm-sm" onClick={addOptions}>Adicionar</button>
          <div className="adm-chips">
            {variants.map((v) => (
              <span key={`${v.label}-${v.value}`} className={v.in_stock ? '' : 'off'}>
                <button onClick={() => setVariants((l) => l.map((x) => (x === v ? { ...x, in_stock: !x.in_stock } : x)))} title="Clique para marcar esgotado/disponível">{v.value}{!v.in_stock && ' (esgotado)'}</button>
                <button onClick={() => setVariants((l) => l.filter((x) => x !== v))} aria-label={`Remover ${v.value}`}>✕</button>
              </span>
            ))}
          </div>
        </section>

        <section className="adm-card">
          <h2>Personalização</h2>
          <label className="adm-chk"><input type="checkbox" checked={f.customizable} onChange={(e) => set('customizable', e.target.checked)} /> Esta peça aceita personalização (ex.: nome bordado)</label>
          {f.customizable && (
            <>
              {fields.map((x, i) => (
                <div className="adm-field" key={i}>
                  <input value={x.label} onChange={(e) => setFields((l) => l.map((y, j) => (j === i ? { ...y, label: e.target.value } : y)))} placeholder="Nome do campo (ex.: Nome a bordar)" />
                  <select value={x.type} onChange={(e) => setFields((l) => l.map((y, j) => (j === i ? { ...y, type: e.target.value as FieldDef['type'] } : y)))}><option value="text">Texto livre</option><option value="select">Lista de opções</option></select>
                  {x.type === 'select' && <input value={(x.options ?? []).join(', ')} onChange={(e) => setFields((l) => l.map((y, j) => (j === i ? { ...y, options: e.target.value.split(',').map((s) => s.trim()) } : y)))} placeholder="Opções separadas por vírgula" />}
                  <label className="adm-chk"><input type="checkbox" checked={x.required} onChange={(e) => setFields((l) => l.map((y, j) => (j === i ? { ...y, required: e.target.checked } : y)))} /> Obrigatório</label>
                  <button className="adm-del" onClick={() => setFields((l) => l.filter((_, j) => j !== i))}>Remover</button>
                </div>
              ))}
              <button className="btn btn--ghost adm-sm" onClick={() => setFields((l) => [...l, { key: '', label: '', type: 'text', required: false }])}>+ Adicionar campo</button>
            </>
          )}
        </section>
      </div>
      <button className="adm-del adm-danger" onClick={async () => { if (confirm('Excluir este produto e as fotos dele?')) { await deleteProduct(id); nav('/admin') } }}>Excluir produto</button>
    </>
  )
}
