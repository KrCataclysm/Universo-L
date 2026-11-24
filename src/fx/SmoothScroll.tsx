import { useEffect } from 'react'
import { prefersReducedMotion } from './motion'

/** Scroll suave só com mouse (touch usa o scroll nativo, que já é liso). Carrega o Lenis sob demanda. */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
    let cancelled = false
    let cleanup = () => {}
    const start = async () => {
      const { default: Lenis } = await import('lenis')
      if (cancelled) return
      const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
      let raf = 0
      const tick = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(tick) }
      raf = requestAnimationFrame(tick)
      cleanup = () => { cancelAnimationFrame(raf); lenis.destroy() }
    }
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback
    const id = ric ? ric(() => void start(), { timeout: 1500 }) : window.setTimeout(() => void start(), 300)
    return () => {
      cancelled = true
      cleanup()
      if (ric) (window as unknown as { cancelIdleCallback: (n: number) => void }).cancelIdleCallback(id)
      else clearTimeout(id)
    }
  }, [])
  return <>{children}</>
}
