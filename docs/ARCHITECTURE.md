# ARCHITECTURE.md

## 1. Visão geral
```
Cliente (navegador) ──► Site estático (GitHub Pages)
        │                    │
        │                    └─ build: Vite + páginas estáticas por rota + dados do produto embutidos
        ├─► Supabase (PostgREST + Storage)  ← leitura pública do catálogo, só com chave anon + RLS
        └─► WhatsApp (link wa.me com a mensagem pronta)
Painel /admin ──► Supabase Auth + supabase-js (carregado só no painel)
```

## 2. Tecnologias
- Vite + **React 19** + TypeScript (`strict`), react-router 7 (BrowserRouter, `basename` = base do Vite)
- Estado: zustand (carrinho, favoritos, vistos, avisos, visualização rápida), tudo no `localStorage` quando persistente
- Estilos: CSS global em camadas (`src/styles/*.css`, sem biblioteca de UI)
- Movimento: CSS + framer-motion (só na gaveta do carrinho) + Lenis (rolagem suave, só desktop)
- Dados: Supabase (Postgres, Auth, Storage). Leitura pública por `fetch` (`src/data/restCatalog.ts`).
- Hospedagem: GitHub Pages; build por GitHub Actions (também de hora em hora).
Não juntar outra tecnologia sem perguntar e explicar porquê.

## 3. Pastas
```
src/pages/       páginas (Home, Brand, ProductPage, Search, Favorites, Info, Privacy, About, Contact, NotFound)
src/components/  componentes (ProductCard, ProductGrid, FeaturedShowcase, QuickView, Gallery, Header, Footer…)
src/admin/       painel da loja (carregado sob demanda)
src/cart/        carrinho, dinheiro, mensagem do WhatsApp
src/data/        catálogo: restCatalog (público), exemplo/vazio, mapProduct, seed
src/store/       favoritos, vistos recentemente, visualização rápida
src/ui/          toasts
src/fx/          animações (Reveal, SplitWords, transição de página…)
src/lib/         utilidades (env, formatos, busca, ordenação, info)
src/styles/      tokens → layout → pages → shop → refresh → polish → editorial → ui → readable → features
scripts/         postbuild (páginas estáticas, sitemap, JSON-LD), seo
supabase/migrations/  migrações numeradas (0001…0012)
tests/ e tests/e2e/   Vitest e Playwright
docs/            estes arquivos
```

## 4. Quem faz o quê
- Páginas mostram dados e recebem cliques. Regras de negócio ficam em `src/cart`, `src/lib`, `src/data`.
- Só `src/data` e `src/admin` falam com o Supabase.
- Não existe servidor próprio: toda regra de acesso mora no **RLS do banco**.
- Chaves secretas **não existem** no projeto; só a chave pública (anon) em `.env.production`.

## 5. Exemplo: pedido pelo WhatsApp
1. Na página do produto a cliente escolhe a cor e toca em "Adicionar ao carrinho".
2. `cartStore.add` guarda no `localStorage`; um toast confirma.
3. Na gaveta, `buildWhatsAppUrl` monta a mensagem (itens, variações, personalização, total, nome opcional).
4. A cliente toca em "Finalizar no WhatsApp" e envia a mensagem para o número da tabela `settings`.
5. Pagamento e entrega são combinados na conversa. Nada é gravado no servidor.

## 6. Build e páginas estáticas
`npm run build` = `tsc -b` + `vite build` + `scripts/postbuild.mjs`. O postbuild lê os produtos publicados e gera uma página por rota (SEO, Open Graph, JSON-LD) e **embute os dados do produto** no HTML (`#__seed`) para a foto aparecer sem esperar a rede. A base do site vem de `BASE_PATH` (hoje `/Universo-L/`).

## 7. Ambientes
Local (`npm run dev`), testes (preview + Playwright) e produção usam o **mesmo** projeto Supabase (único). Por isso: nunca rodar teste que apague ou limpe dados; o painel de teste usa um usuário temporário (a ser removido).

## 8. Decisões já tomadas
| Data | Decisão | Porquê |
|---|---|---|
| 2026-11 | GitHub Pages em vez de Vercel | pedido do dono; custo zero |
| 2026-11 | Supabase como banco do catálogo | painel sem servidor próprio, RLS |
| 2026-11 | Carrinho → WhatsApp, sem pagamento online | como a loja já vende |
| 2026-11 | Preço 0 = "Sob consulta" | bordados e personalizados |
| 2026-11 | Direção editorial; removidos efeitos neon, abertura animada e cursor com rastro | pedido da cliente: mais comercial, mais rápido |
| 2026-11 | "Adicionar" mostra toast em vez de abrir a gaveta | não interromper a navegação |
| 2026-11 | Dados do produto embutidos no HTML | derrubar o atraso de descoberta da foto (LCP) |

## 9. Limites conhecidos
- Prévia de link (Open Graph) só atualiza quando o site é reconstruído (a cada hora ou por novo deploy).
- GitHub Pages não define cabeçalhos HTTP: a política de segurança é por `<meta>`.
- LCP das páginas internas fica em 2,8–3,1 s (JavaScript do React).
- Tudo no mesmo projeto Supabase (sem staging).
