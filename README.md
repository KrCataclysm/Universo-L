# Universo Lay

Site/loja do **Universo Lay** — "Todas as suas marcas em um só lugar." (Lay.Store · Ousada Delicada · Falou, Bordei)

- `npm run dev` — desenvolvimento
- `npm test` — testes unitários
- `npm run build` — build estático (GitHub Pages)

Design: `docs/superpowers/specs/` · Plano: `docs/superpowers/plans/`

## Deploy (GitHub Pages)

- Sem domínio próprio: a URL é `https://krcataclysm.github.io/Universo-L/` (o workflow usa `BASE_PATH=/Universo-L/`).
- Com domínio próprio (`universolay.com.br`): em *Settings → Secrets and variables → Actions → Variables* crie `BASE_PATH` = `/` e `SITE_URL` = `https://universolay.com.br`, configure o domínio em *Settings → Pages* e aponte o DNS (ver `docs/superpowers/specs/2026-11-08-universo-lay-design.md`, seção 9).
