/** Versão estática (sem WebGL / reduced motion): linhas em degradê, ainda elegante. */
export default function RibbonFallback({ accent }: { accent?: [string, string] }) {
  const a = accent?.[0] ?? '#C9A7E8'
  const b = accent?.[1] ?? '#F2A7C8'
  const lines = Array.from({ length: 34 }, (_, i) => i)
  return (
    <svg data-testid="ribbon-fallback" aria-hidden viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="rf" x1="0" x2="1">
          <stop offset="0" stopColor={a} />
          <stop offset=".55" stopColor={b} />
          <stop offset="1" stopColor="#9FB8FF" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#rf)" strokeWidth="1" opacity=".75">
        {lines.map((i) => (
          <path key={i} opacity={0.25 + (i % 7) / 10}
            d={`M -50 ${380 + i * 4} C 250 ${120 + i * 6}, 520 ${620 - i * 5}, 820 ${250 + i * 3} S 1150 ${180 + i * 4}, 1260 ${300 + i * 2}`} />
        ))}
      </g>
    </svg>
  )
}
