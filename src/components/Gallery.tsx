import { useState } from 'react'
import type { ProductImage } from '../data/catalog'

export default function Gallery({ images }: { images: ProductImage[] }) {
  const [i, setI] = useState(0)
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)
  const cur = images[i]
  if (!cur) return <div className="gallery__main gallery__main--empty">Sem foto</div>
  return (
    <div className="gallery">
      <div className="gallery__main" onPointerMove={(e) => { if (e.pointerType !== 'mouse') return; const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }) }} onPointerLeave={() => setZoom(null)}>
        <img src={cur.url} alt={cur.alt} style={zoom ? { transformOrigin: `${zoom.x}% ${zoom.y}%`, transform: 'scale(1.9)' } : undefined} />
      </div>
      {images.length > 1 && (
        <div className="gallery__thumbs" role="tablist" aria-label="Fotos do produto">
          {images.map((im, n) => (
            <button key={n} role="tab" aria-selected={n === i} aria-label={`Foto ${n + 1}`} className={n === i ? 'on' : ''} onClick={() => setI(n)}>
              <img src={im.url} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
