const mq = (q: string): boolean => {
  try {
    return typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(q).matches : false
  } catch {
    return false
  }
}

export const prefersReducedMotion = (): boolean => mq('(prefers-reduced-motion: reduce)')

/** Aparelho fraco/touch: usa versão leve dos efeitos. */
export const isLowPower = (): boolean => {
  if (mq('(pointer: coarse)')) return true
  if (typeof window !== 'undefined' && window.innerWidth < 768) return true
  return typeof navigator !== 'undefined' && !!navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4
}

export const hasWebGL = (): boolean => {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}
