import { useNavigate } from 'react-router-dom'
import { useFavs } from '../store/favStore'
import { toast } from '../ui/toast'

export default function FavButton({ id, name, className = '' }: { id: string; name: string; className?: string }) {
  const on = useFavs((s) => s.ids.includes(id))
  const nav = useNavigate()
  const click = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    const added = useFavs.getState().toggle(id)
    if (added) toast({ title: 'Salvo nos favoritos', text: name, action: { label: 'Ver favoritos', run: () => nav('/favoritos') } })
    else toast({ tone: 'info', title: 'Removido dos favoritos', text: name, action: { label: 'Desfazer', run: () => useFavs.getState().toggle(id) } })
  }
  return (
    <button type="button" className={`fav ${on ? 'is-on' : ''} ${className}`} onClick={click} aria-pressed={on} aria-label={on ? `Remover ${name} dos favoritos` : `Salvar ${name} nos favoritos`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.2-9.4C1.7 7.8 3.7 5 6.8 5c1.9 0 3.5 1 5.2 3 1.7-2 3.3-3 5.2-3 3.1 0 5.1 2.8 4 6.1-1.7 4.8-9.2 9.4-9.2 9.4Z" /></svg>
    </button>
  )
}
