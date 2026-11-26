import { useEffect, useRef, useState } from 'react'
import { useAsync } from '../data/CatalogProvider'
import Reveal from '../fx/Reveal'

/** Trabalhos realizados (portfólio da marca). Só aparece quando a loja cadastrou fotos. */
export default function WorksGallery({ brandSlug, brandName }: { brandSlug: string; brandName: string }) {
  const works = useAsync((c) => c.listWorks(brandSlug), [brandSlug])
  const [open, setOpen] = useState<number | null>(null)
  const dlg = useRef<HTMLDialogElement>(null)
  const items = works.data ?? []
  useEffect(() => {
    const d = dlg.current
    if (!d) return
    if (open !== null && !d.open) d.showModal()
    if (open === null && d.open) d.close()
  }, [open])
  if (!items.length) return null
  const cur = open !== null ? items[open] : null
  const go = (d: number) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length))
  return (
    <section className="works sec" aria-labelledby="works-h">
      <div className="container">
        <Reveal><p className="eyebrow">Portfólio</p></Reveal>
        <Reveal delay={60}><h2 id="works-h">Trabalhos realizados</h2></Reveal>
        <p className="works__lead">Alguns dos trabalhos que a {brandName} já entregou. Quer algo parecido? Peça um orçamento.</p>
        <ul className="works__grid">
          {items.map((w, i) => (
            <li key={w.id}>
              <button type="button" className="works__item" onClick={() => setOpen(i)} aria-label={`Ampliar: ${w.title || `trabalho ${i + 1}`}`}>
                <img src={w.imageUrl} alt={w.title || `Trabalho realizado ${i + 1}`} loading="lazy" decoding="async" width={640} height={800} />
                {w.title && <span>{w.title}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <dialog ref={dlg} className="lightbox" aria-label="Trabalho ampliado" onClose={() => setOpen(null)} onClick={(e) => { if (e.target === dlg.current) setOpen(null) }}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }}>
        {cur && <div className="lightbox__stage"><img src={cur.imageUrl} alt={cur.title || 'Trabalho realizado'} draggable={false} /></div>}
        <button type="button" className="lightbox__x" onClick={() => setOpen(null)} aria-label="Fechar">✕</button>
        {items.length > 1 && (<>
          <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={() => go(-1)} aria-label="Anterior">‹</button>
          <button type="button" className="lightbox__nav lightbox__nav--next" onClick={() => go(1)} aria-label="Próximo">›</button>
        </>)}
        {cur && (cur.title || cur.description) && <p className="lightbox__n">{cur.title}{cur.description ? ` — ${cur.description}` : ''}</p>}
      </dialog>
    </section>
  )
}
