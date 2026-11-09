export default function Wordmark({ stacked = false, className }: { stacked?: boolean; className?: string }) {
  return (
    <span
      className={className}
      style={{
        fontFamily: 'var(--font-display)',
        letterSpacing: '.06em',
        textTransform: 'uppercase',
        display: 'inline-flex',
        flexDirection: stacked ? 'column' : 'row',
        alignItems: 'center',
        gap: stacked ? 0 : '.35em',
        lineHeight: 1,
      }}
    >
      <span style={{ color: 'var(--ink)' }}>Universo</span>
      <span style={{ color: 'var(--lilac)' }}>Lay</span>
    </span>
  )
}
