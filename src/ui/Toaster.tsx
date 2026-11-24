import { useEffect, useRef } from 'react'
import { useToasts, type ToastItem } from './toast'

const ICON: Record<ToastItem['tone'], React.ReactNode> = {
  ok: <path d="m5 12.5 4.2 4.2L19 7" />,
  info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 7.8v.1" /></>,
  warn: <><path d="M12 4 2.8 19.5h18.4L12 4Z" /><path d="M12 10v4.5M12 17.2v.1" /></>,
  error: <><circle cx="12" cy="12" r="8.5" /><path d="m9 9 6 6M15 9l-6 6" /></>,
}

function Toast({ t }: { t: ToastItem }) {
  const dismiss = useToasts((s) => s.dismiss)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const left = useRef(t.ms)
  const started = useRef(0)
  const start = () => { started.current = Date.now(); timer.current = setTimeout(() => dismiss(t.id), left.current) }
  const stop = () => { clearTimeout(timer.current); left.current -= Date.now() - started.current }
  useEffect(() => { start(); return () => clearTimeout(timer.current) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={`toast toast--${t.tone} ${t.leaving ? 'is-out' : ''}`} role={t.tone === 'error' || t.tone === 'warn' ? 'alert' : 'status'}
      onPointerEnter={stop} onPointerLeave={start} onFocus={stop} onBlur={start} style={{ ['--ms' as string]: `${t.ms}ms` }}>
      <svg className="toast__ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICON[t.tone]}</svg>
      <div className="toast__body">
        <strong>{t.title}</strong>
        {t.text && <span>{t.text}</span>}
      </div>
      {t.action && <button className="toast__act" onClick={() => { t.action!.run(); dismiss(t.id) }}>{t.action.label}</button>}
      <button className="toast__x" onClick={() => dismiss(t.id)} aria-label="Fechar aviso">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
      </button>
      <i className="toast__bar" aria-hidden />
    </div>
  )
}

export default function Toaster() {
  const items = useToasts((s) => s.items)
  return <div className="toaster" role="region" aria-label="Avisos">{items.map((t) => <Toast key={t.id} t={t} />)}</div>
}
