import { useEffect } from 'react'
import { prefersReducedMotion } from './motion'

/** Scroll suave só com mouse (touch usa o scroll nativo, que já é liso). Carrega Lenis/GSAP sob demanda. */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
    let cancelled = false
    let cleanup = () => {}
    const start = async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([import('lenis'), import('gsap'), import('gsap/ScrollTrigger')])
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
      lenis.on('scroll', ScrollTrigger.update)
      const tick = (t: number) => lenis.raf(t * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      cleanup = () => { gsap.ticker.remove(tick); lenis.destroy() }
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
