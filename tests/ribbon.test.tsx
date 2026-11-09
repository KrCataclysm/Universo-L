import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Ribbon from '../src/fx/Ribbon'

afterEach(() => vi.unstubAllGlobals())

describe('<Ribbon />', () => {
  it('usa o fallback estático quando não há WebGL', () => {
    render(<Ribbon />)
    expect(screen.getByTestId('ribbon-fallback')).toBeInTheDocument()
  })
  it('usa o fallback com reduced motion mesmo havendo WebGL', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} }))
    render(<Ribbon />)
    expect(screen.getByTestId('ribbon-fallback')).toBeInTheDocument()
  })
})
