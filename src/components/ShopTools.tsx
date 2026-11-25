import { BANDS, SORTS, bandCounts, type Band, type SortKey, type Tools } from '../lib/sort'
import type { Product } from '../data/catalog'

/** Barra de ordenar + faixa de preço (só mostra faixas que têm peças). */
export default function ShopTools({ all, shown, value, onChange, hideCount }: { all: Product[]; shown: number; value: Tools; onChange: (t: Tools) => void; hideCount?: boolean }) {
  const counts = bandCounts(all)
  const bands = BANDS.filter((b) => counts[b.key] > 0)
  if (all.length < 2) return null
  return (
    <div className="stools">
      {!hideCount && <p className="stools__n" role="status" aria-live="polite">{shown} {shown === 1 ? 'peça' : 'peças'}</p>}
      {bands.length > 1 && (
        <div className="stools__bands" role="group" aria-label="Faixa de preço">
          <button className={value.band === 'todos' ? 'on' : ''} aria-pressed={value.band === 'todos'} onClick={() => onChange({ ...value, band: 'todos' as Band })}>Todas</button>
          {bands.map((b) => <button key={b.key} className={value.band === b.key ? 'on' : ''} aria-pressed={value.band === b.key} onClick={() => onChange({ ...value, band: b.key })}>{b.label} <small>{counts[b.key]}</small></button>)}
        </div>
      )}
      <label className="stools__sort"><span>Ordenar</span>
        <select value={value.sort} onChange={(e) => onChange({ ...value, sort: e.target.value as SortKey })}>
          {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
      </label>
    </div>
  )
}
