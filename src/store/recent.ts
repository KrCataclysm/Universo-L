const KEY = 'ul-recent'
export const getRecent = (): string[] => {
  try { const v = JSON.parse(localStorage.getItem(KEY) ?? '[]'); return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [] } catch { return [] }
}
/** guarda os últimos produtos vistos (mais novo primeiro, máx. 8) */
export const pushRecent = (id: string) => {
  try { localStorage.setItem(KEY, JSON.stringify([id, ...getRecent().filter((x) => x !== id)].slice(0, 8))) } catch { /* ignore */ }
}
