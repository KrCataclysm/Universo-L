import NeonFrames from '../fx/NeonFrames'

export default function EmptyState({ title = 'Em breve', text, from, to }: { title?: string; text?: string; from?: string; to?: string }) {
  return (
    <div className="empty" role="status">
      <NeonFrames from={from} to={to} layers={4} animate={false} className="empty__art" />
      <h3>{title}</h3>
      {text && <p>{text}</p>}
    </div>
  )
}
