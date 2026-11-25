import { useEffect, useRef, useState } from 'react'
import type { ProductImage } from '../data/catalog'
import { imgSize, imgSrcSet } from '../lib/env'

export default function Gallery({ images }: { images: ProductImage[] }) {
  const [i, setI] = useState(0)
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)
  const [big, setBig] = useState(false)
  const dlg = useRef<HTMLDialogElement>(null)
  const startX = useRef<number | null>(null)
  const cur = images[i]
  const go = (d: number) => setI((n) => (n + d + images.length) % images.length)
  useEffect(() => {
    const d = dlg.current
    if (!d) return
    if (big && !d.open) d.showModal()
    if (!big && d.open) d.close()
  }, [big])
  if (!cur) return <div className="gallery__main gallery__main--empty">Sem foto</div>
  return (
    <div className="gallery">
      <div className="gallery__main" onClick={() => setBig(true)} onPointerMove={(e) => { if (e.pointerType !== 'mouse') return; const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }) }} onPointerLeave={() => setZoom(null)}>
        <img src={cur.url} srcSet={imgSrcSet(cur.url)} sizes="(max-width: 900px) 100vw, 580px" alt={cur.alt} width={1280} height={1600} fetchPriority="high" decoding="async" style={zoom ? { transformOrigin: `${zoom.x}% ${zoom.y}%`, transform: 'scale(1.9)' } : undefined} />
        <button type="button" className="gallery__zoom" onClick={(e) => { e.stopPropagation(); setBig(true) }} aria-label="Ampliar foto">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
        </button>
      </div>
      {images.length > 1 && (
        <div className="gallery__thumbs" role="tablist" aria-label="Fotos do produto">
          {images.map((im, n) => (
            <button key={n} role="tab" aria-selected={n === i} aria-label={`Foto ${n + 1}`} className={n === i ? 'on' : ''} onClick={() => setI(n)}>
              <img src={imgSize(im.url, 480)} alt="" />
            </button>
          ))}
        </div>
      )}
      <dialog ref={dlg} className="lightbox" aria-label="Foto ampliada" onClose={() => setBig(false)} onClick={(e) => { if (e.target === dlg.current) setBig(false) }}
        onKeyDown={(e) => { if (images.length > 1 && e.key === 'ArrowRight') go(1); if (images.length > 1 && e.key === 'ArrowLeft') go(-1) }}>
        {big && (
          <div className="lightbox__stage" onPointerDown={(e) => { startX.current = e.clientX }} onPointerUp={(e) => { if (startX.current !== null && images.length > 1) { const dx = e.clientX - startX.current; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1) } startX.current = null }}>
            <img src={cur.url} srcSet={imgSrcSet(cur.url)} sizes="100vw" alt={cur.alt} draggable={false} />
          </div>
        )}
        <button type="button" className="lightbox__x" onClick={() => setBig(false)} aria-label="Fechar foto ampliada">✕</button>
        {images.length > 1 && (<>
          <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={() => go(-1)} aria-label="Foto anterior">‹</button>
          <button type="button" className="lightbox__nav lightbox__nav--next" onClick={() => go(1)} aria-label="Próxima foto">›</button>
          <p className="lightbox__n" aria-live="polite">{i + 1} / {images.length}</p>
        </>)}
      </dialog>
    </div>
  )
}
