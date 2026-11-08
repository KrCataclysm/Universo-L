export interface MonogramProps {
  variant?: 'ink' | 'lilac' | 'bare'
  size?: number
  className?: string
}

const FILL = { ink: ['#28272B', '#F7F5F2'], lilac: ['#A38A9E', '#28272B'], bare: [null, '#28272B'] } as const

export default function Monogram({ variant = 'ink', size = 64, className }: MonogramProps) {
  const [disc, letters] = FILL[variant]
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Universo Lay">
      {disc && <circle cx="50" cy="50" r="46" fill={disc} />}
      <g fill={letters} fontFamily="'Cormorant Garamond', serif" fontWeight="500" fontSize="54" textAnchor="middle">
        <text x="40" y="56">U</text>
        <text x="62" y="77">L</text>
      </g>
    </svg>
  )
}
