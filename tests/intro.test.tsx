import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Intro from '../src/fx/Intro'

const media = (reduce: boolean) =>
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: reduce && q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} }))

beforeEach(() => sessionStorage.clear())
afterEach(() => vi.unstubAllGlobals())

describe('<Intro />', () => {
  it('com reduced motion chama onDone sem mostrar animação', () => {
    media(true)
    const done = vi.fn()
    render(<Intro onDone={done} />)
    expect(done).toHaveBeenCalledTimes(1)
    expect(screen.queryByTestId('intro')).toBeNull()
  })
  it('mostra a intro na primeira visita e o botão Pular encerra', async () => {
    media(false)
    const done = vi.fn()
    render(<Intro onDone={done} />)
    expect(screen.getByTestId('intro')).toBeInTheDocument()
    screen.getByRole('button', { name: /pular/i }).click()
    expect(done).toHaveBeenCalledTimes(1)
  })
  it('não reaparece na mesma sessão', () => {
    media(false)
    sessionStorage.setItem('ul-intro', '1')
    const done = vi.fn()
    render(<Intro onDone={done} />)
    expect(screen.queryByTestId('intro')).toBeNull()
    expect(done).toHaveBeenCalledTimes(1)
  })
  it('sessionStorage indisponível não quebra', () => {
    media(false)
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    const done = vi.fn()
    expect(() => render(<Intro onDone={done} />)).not.toThrow()
    vi.restoreAllMocks()
  })
})
