import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '../fx/motion'

/** Discreto: só aparece quando a pessoa rola para cima (quer voltar), e some sozinho — assim não cobre o que está sendo lido. */
export default function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    let last = window.scrollY
    let timer: ReturnType<typeof setTimeout> | undefined
    const on = () => {
      const y = window.scrollY
      const up = y < last - 6
      const down = y > last + 2
      last = y
      if (y < 900) { setShow(false); return }
      if (up) { setShow(true); clearTimeout(timer); timer = setTimeout(() => setShow(false), 2800) }
      else if (down) setShow(false)
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => { window.removeEventListener('scroll', on); clearTimeout(timer) }
  }, [])
  return (
    <button type="button" className={`totop ${show ? 'is-on' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })} aria-label="Voltar ao topo" tabIndex={show ? 0 : -1}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 14 6-6 6 6" /></svg>
    </button>
  )
}
