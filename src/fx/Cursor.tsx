import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from './motion'

/** Rastro de luz lilás que segue o ponteiro (só mouse, sem reduced motion). */
export default function Cursor() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
    const ctx = canvas.getContext('2d')!
    const pts: { x: number; y: number; t: number }[] = []
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    const move = (e: PointerEvent) => pts.push({ x: e.clientX, y: e.clientY, t: performance.now() })
    let raf = 0
    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      while (pts.length && now - pts[0].t > 600) pts.shift()
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i]
        const life = 1 - (now - b.t) / 600
        ctx.strokeStyle = `rgba(201,167,232,${life * 0.55})`
        ctx.lineWidth = 1 + life * 5
        ctx.lineCap = 'round'
        ctx.shadowColor = '#C9A7E8'
        ctx.shadowBlur = 14 * life
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    window.addEventListener('pointermove', move)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('resize', resize)
    }
  }, [])
  return <canvas ref={ref} aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }} />
}
