import { useEffect, useState } from 'react'
import type { TocItem } from '../lib/useToc'

/** Índice lateral fixo com destaque da seção visível. */
export function DocNav({ items }: { items: TocItem[] }) {
  const [on, setOn] = useState('')
  useEffect(() => {
    if (!items.length || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((es) => { const v = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]; if (v) setOn(v.target.id) }, { rootMargin: '-90px 0px -60% 0px' })
    items.forEach((i) => { const el = document.getElementById(i.id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [items])
  if (!items.length) return <div />
  return (
    <nav className="doc__nav" aria-label="Nesta página">
      <p className="eyebrow">Nesta página</p>
      <ol>{items.map((i) => <li key={i.id}><a href={`#${i.id}`} className={on === i.id ? 'on' : ''} aria-current={on === i.id ? 'location' : undefined}>{i.title}</a></li>)}</ol>
    </nav>
  )
}
