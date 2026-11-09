import './fx.css'

export interface NeonFramesProps {
  from?: string
  to?: string
  layers?: number
  animate?: boolean
  className?: string
}

/** Paralelogramas inclinados em camadas, com degradê neon e contorno que se desenha. */
export default function NeonFrames({ from = '#9FB8FF', to = '#F2A7C8', layers = 5, animate = true, className }: NeonFramesProps) {
  const id = `nf-${from.slice(1)}-${to.slice(1)}`
  return (
    <svg className={`nf ${animate ? '' : 'nf-static'} ${className ?? ''}`} viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <g>
        {Array.from({ length: layers }, (_, i) => {
          const o = i * 11
          const d = `M ${120 + o} ${360 - o} L ${250 + o} ${90 + o} L ${720 - o} ${70 + o * 0.6} L ${600 - o} ${360 - o} Z`
          return (
            <g key={i}>
              <path className="nf-path" pathLength={1} style={{ ['--i' as string]: i }} stroke={`url(#${id})`} strokeWidth={7} opacity={0.1 * (1 - i * 0.14)} d={d} />
              <path className="nf-path" pathLength={1} style={{ ['--i' as string]: i }} stroke={`url(#${id})`} strokeWidth={1.6 - i * 0.18} opacity={1 - i * 0.14} d={d} />
            </g>
          )
        })}
      </g>
    </svg>
  )
}
