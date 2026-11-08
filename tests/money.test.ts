import { describe, expect, it } from 'vitest'
import { formatBRL, parsePriceToCents } from '../src/cart/money'

describe('money', () => {
  it('formata centavos em BRL', () => {
    expect(formatBRL(1990).replace(/ /g, ' ')).toBe('R$ 19,90')
    expect(formatBRL(0).replace(/ /g, ' ')).toBe('R$ 0,00')
    expect(formatBRL(123456).replace(/ /g, ' ')).toBe('R$ 1.234,56')
  })
  it('converte texto em centavos inteiros', () => {
    expect(parsePriceToCents('19,90')).toBe(1990)
    expect(parsePriceToCents('19,9')).toBe(1990)
    expect(parsePriceToCents('1.234,50')).toBe(123450)
    expect(parsePriceToCents('20')).toBe(2000)
    expect(parsePriceToCents('abc')).toBeNull()
    expect(parsePriceToCents('-5')).toBeNull()
    expect(parsePriceToCents('')).toBeNull()
  })
})
