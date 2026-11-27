import { toast } from '../ui/toast'

/** Decide se a versão publicada é diferente da que está aberta. */
export function isNewVersion(current: string, remote: unknown): boolean {
  return typeof remote === 'string' && remote.length > 0 && remote !== current
}

/** Evita laço de recarregamentos: só deixa recarregar 1 vez a cada 60 s por aba. */
export function shouldReloadOnce(store: Pick<Storage, 'getItem' | 'setItem'>, now = Date.now()): boolean {
  try {
    const last = Number(store.getItem('ul-reloaded-at') ?? 0)
    if (now - last < 60_000) return false
    store.setItem('ul-reloaded-at', String(now))
    return true
  } catch { return false }
}

const MIN_GAP_MS = 30_000
const EVERY_MS = 5 * 60_000

/**
 * Atualização automática: confere /version.json (sem cache) ao voltar para a aba e a cada 5 min.
 * Há versão nova → recarrega sozinho, a menos que a pessoa esteja no meio de algo
 * (modal aberto ou no painel /admin, onde só avisa para não perder o que está sendo editado).
 */
export function startUpdateCheck(): void {
  if (typeof __BUILD_ID__ === 'undefined' || import.meta.env.DEV) return
  let last = 0
  let warned = false
  const check = async () => {
    if (document.visibilityState !== 'visible' || Date.now() - last < MIN_GAP_MS) return
    last = Date.now()
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}version.json?_=${Date.now()}`, { cache: 'no-store' })
      if (!res.ok) return
      const { id } = (await res.json()) as { id?: unknown }
      if (!isNewVersion(__BUILD_ID__, id)) return
      const inAdmin = location.pathname.includes('/admin')
      const busy = !!document.querySelector('dialog[open], .drawer')
      if (inAdmin || busy) {
        if (!warned) { warned = true; toast({ title: 'Há uma versão nova do site', text: 'Salve o que está fazendo e atualize.', ms: 12000, action: { label: 'Atualizar', run: () => location.reload() } }) }
        return
      }
      if (shouldReloadOnce(sessionStorage)) location.reload()
    } catch { /* sem rede: tenta de novo depois */ }
  }
  // arquivo antigo que não existe mais (publicação nova com a página velha em cache): recarrega uma vez
  window.addEventListener('vite:preloadError', (e) => {
    if (shouldReloadOnce(sessionStorage)) { e.preventDefault(); location.reload() }
  })
  // primeira conferência logo depois de abrir, sem esperar a pessoa sair e voltar
  window.setTimeout(() => { void check() }, 2500)
  document.addEventListener('visibilitychange', () => { void check() })
  window.addEventListener('focus', () => { void check() })
  window.setInterval(() => { void check() }, EVERY_MS)
}
