import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from './motion'

/** Rastro de luz lilás (só mouse). Sem blur de sombra; só anima enquanto há rastro. */
export default function Cursor() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
    const ctx = canvas.getContext('2d')!
    const pts: { x: number; y: number; t: number }[] = []
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    let raf = 0
    const draw = (now: number) => {
      raf = 0
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      while (pts.length && now - pts[0].t > 520) pts.shift()
      if (pts.length < 2) return
      ctx.lineCap = 'round'
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i]
        const life = 1 - (now - b.t) / 520
        ctx.strokeStyle = `rgba(201,167,232,${life * 0.16})`; ctx.lineWidth = 2 + life * 12
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
        ctx.strokeStyle = `rgba(242,167,200,${life * 0.7})`; ctx.lineWidth = 0.8 + life * 2.4
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
      }
      raf = requestAnimationFrame(draw)
    }
    const move = (e: PointerEvent) => {
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() })
      if (pts.length > 40) pts.shift()
      if (!raf) raf = requestAnimationFrame(draw)
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }} />
}
