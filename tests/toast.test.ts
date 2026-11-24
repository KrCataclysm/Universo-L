import { beforeEach, describe, expect, it } from 'vitest'
import { toast, useToasts } from '../src/ui/toast'

beforeEach(() => useToasts.setState({ items: [] }))

describe('toast', () => {
  it('empilha no máximo 3 e mantém os mais novos', () => {
    for (let i = 1; i <= 5; i++) toast({ title: `aviso ${i}` })
    expect(useToasts.getState().items.map((t) => t.title)).toEqual(['aviso 3', 'aviso 4', 'aviso 5'])
  })
  it('não duplica o mesmo título: troca o anterior', () => {
    toast({ title: 'Adicionado' }); toast({ title: 'Adicionado' })
    expect(useToasts.getState().items).toHaveLength(1)
  })
  it('usa tom "ok" por padrão e aceita ação', () => {
    let ran = false
    const id = toast({ title: 'x', action: { label: 'Desfazer', run: () => { ran = true } } })
    const t = useToasts.getState().items.find((i) => i.id === id)!
    expect(t.tone).toBe('ok'); t.action!.run(); expect(ran).toBe(true)
  })
  it('dispensar marca saída e depois remove', async () => {
    const id = toast({ title: 'sai' })
    useToasts.getState().dismiss(id)
    expect(useToasts.getState().items[0].leaving).toBe(true)
    await new Promise((r) => setTimeout(r, 400))
    expect(useToasts.getState().items).toHaveLength(0)
  })
})
