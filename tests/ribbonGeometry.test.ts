import { describe, expect, it } from 'vitest'
import { buildRibbonGeometry } from '../src/fx/ribbonGeometry'

describe('buildRibbonGeometry', () => {
  it('gera 2 vértices (x,y) por segmento: rows+1 linhas × cols segmentos', () => {
    const g = buildRibbonGeometry(4, 10)
    expect(g.vertexCount).toBe(5 * 10 * 2)
    expect(g.positions.length).toBe(g.vertexCount * 2)
  })
  it('cobre x em [-6,6] e y em [-3,3]', () => {
    const g = buildRibbonGeometry(6, 12)
    const xs: number[] = [], ys: number[] = []
    for (let i = 0; i < g.positions.length; i += 2) { xs.push(g.positions[i]); ys.push(g.positions[i + 1]) }
    expect(Math.min(...xs)).toBeCloseTo(-6); expect(Math.max(...xs)).toBeCloseTo(6)
    expect(Math.min(...ys)).toBeCloseTo(-3); expect(Math.max(...ys)).toBeCloseTo(3)
  })
  it('cada segmento é contínuo: fim de um é o começo do próximo na mesma linha', () => {
    const g = buildRibbonGeometry(1, 3)
    // linha 0: seg0 (v0,v1), seg1 (v2,v3): v1 == v2
    expect([g.positions[2], g.positions[3]]).toEqual([g.positions[4], g.positions[5]])
  })
  it('rejeita tamanhos inválidos', () => {
    expect(() => buildRibbonGeometry(0, 10)).toThrow()
    expect(() => buildRibbonGeometry(10, 0)).toThrow()
  })
})
