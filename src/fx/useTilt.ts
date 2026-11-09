import { useCallback, useRef } from 'react'
import { prefersReducedMotion } from './motion'

/** Inclinação 3D leve + brilho que segue o ponteiro (CSS vars), no máximo 1 atualização por frame. */
export function useTilt(max = 7) {
  const raf = useRef(0)
  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || prefersReducedMotion()) return
    const el = e.currentTarget
    const { clientX, clientY } = e
    if (raf.current) return
    raf.current = requestAnimationFrame(() => {
      raf.current = 0
      const r = el.getBoundingClientRect()
      const px = (clientX - r.left) / r.width, py = (clientY - r.top) / r.height
      el.style.setProperty('--mx', `${px * 100}%`); el.style.setProperty('--my', `${py * 100}%`)
      el.style.setProperty('--rx', `${(0.5 - py) * max}deg`); el.style.setProperty('--ry', `${(px - 0.5) * max}deg`)
    })
  }, [max])
  const onPointerLeave = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget
    el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg')
  }, [])
  return { onPointerMove, onPointerLeave }
}
