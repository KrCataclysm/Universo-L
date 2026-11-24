import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('configuração de deploy', () => {
  it('o workflow não zera as variáveis do Supabase (valores vêm do .env.production)', () => {
    const wf = readFileSync('.github/workflows/pages.yml', 'utf8')
    expect(wf).not.toMatch(/VITE_SUPABASE_(URL|ANON_KEY):/)
  })
  it('.env.production tem URL e chave pública do projeto', () => {
    const env = readFileSync('.env.production', 'utf8')
    expect(env).toMatch(/^VITE_SUPABASE_URL=https:\/\/[a-z0-9]+\.supabase\.co$/m)
    expect(env).toMatch(/^VITE_SUPABASE_ANON_KEY=\S+$/m)
  })
})
