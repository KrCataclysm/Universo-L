import { createElement, useEffect, useRef } from 'react'
import { prefersReducedMotion } from './motion'

export interface RevealProps { children: React.ReactNode; as?: keyof React.JSX.IntrinsicElements; delay?: number; className?: string }

/** Entra suavemente ao rolar até o elemento. */
export default function Reveal({ children, as = 'div', delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') { el.classList.add('in'); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect() } }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return createElement(as, { ref, className: `rv ${className}`, style: { ['--d' as string]: `${delay}ms` } }, children)
}
