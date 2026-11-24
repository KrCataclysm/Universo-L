import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { prefersReducedMotion } from './motion'
import './fx.css'

/** Troca de página: página entra suave e uma linha de progresso cruza o topo. */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const first = useRef(true)
  const [key, setKey] = useState(0)
  const [anim, setAnim] = useState(false)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    window.scrollTo(0, 0)
    if (prefersReducedMotion()) return
    setKey((k) => k + 1); setAnim(true)
    const t = setTimeout(() => setAnim(false), 700)
    return () => clearTimeout(t)
  }, [pathname])
  return (
    <>
      <div className={anim ? 'page-in' : undefined}>{children}</div>
      {key > 0 && <div key={`l${key}`} className="route-line" aria-hidden />}
    </>
  )
}
