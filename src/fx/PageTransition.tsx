import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { prefersReducedMotion } from './motion'
import './fx.css'

/** Moldura inclinada em degradê varre a tela a cada troca de rota. */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const first = useRef(true)
  const [key, setKey] = useState(0)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    window.scrollTo(0, 0)
    if (prefersReducedMotion()) return
    setKey((k) => k + 1)
  }, [pathname])
  return (
    <>
      {children}
      {key > 0 && <div key={key} className="sweep" aria-hidden />}
    </>
  )
}
