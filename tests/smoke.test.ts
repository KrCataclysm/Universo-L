import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync('src/styles/tokens.css', 'utf8')

describe('design tokens', () => {
  const tokens: Record<string, string> = {
    '--paper': '#F7F5F2',
    '--ink': '#28272B',
    '--lilac': '#A38A9E',
    '--void': '#0B0A0D',
    '--glow-a': '#C9A7E8',
    '--glow-b': '#F2A7C8',
    '--glow-c': '#9FB8FF',
    '--thread': '#D9B98A',
  }
  for (const [name, value] of Object.entries(tokens)) {
    it(`define ${name} como ${value}`, () => {
      expect(css).toContain(`${name}: ${value}`)
    })
  }
})
