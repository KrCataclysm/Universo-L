# Universo Lay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar o site/loja Universo Lay (3 marcas, carrinho → WhatsApp, painel admin) em GitHub Pages + Supabase, com visual vivo/futurista, começando por uma prévia visual sem dados.

**Architecture:** SPA estática (Vite + React + TS) servida pelo GitHub Pages. Leitura pública e painel falam direto com o Supabase (anon key + RLS). Camada de dados atrás de uma interface `Catalog`, para a prévia (Fase 1) rodar sem banco e a Fase 2 trocar pela implementação Supabase sem mexer nas telas. Efeitos pesados (WebGL) isolados em `src/fx/` com fallback.

**Tech Stack:** Vite, React 18, TypeScript, react-router, Three.js + @react-three/fiber, GSAP + ScrollTrigger, Lenis, Framer Motion, CSS Modules, @supabase/supabase-js, Vitest, Playwright, Lighthouse CI.

**Spec:** `docs/superpowers/specs/2026-11-08-universo-lay-design.md`

## Global Constraints

- **Zero dado fictício:** nenhum produto, preço, foto, depoimento ou número inventado em código, seeds, testes de UI visível ou banco. Fixtures de teste ficam só em `tests/` e nunca são importadas por `src/`.
- Textos fixos permitidos: "Universo Lay", "Todas as suas marcas em um só lugar.", "Lay.Store", "Ousada Delicada", "Falou, Bordei", conceito: "Um universo de moda, estilo, delicadeza e peças personalizadas, onde cada mulher encontra algo especial para si ou para presentear."
- Categorias das marcas: Lay.Store = Moda fitness; Ousada Delicada = Moda íntima; Falou, Bordei = Bordados e personalizados.
- Tokens: `--paper #F7F5F2`, `--ink #28272B`, `--lilac #A38A9E`, `--void #0B0A0D`, `--glow-a #C9A7E8`, `--glow-b #F2A7C8`, `--glow-c #9FB8FF`, `--thread #D9B98A`.
- Fontes: Cormorant Garamond (títulos/logo) e Manrope (UI/preços), carregadas do Google Fonts com `display=swap`.
- Supabase: projeto `rsbyflojdjecgofyxack` (sa-east-1). Nunca tocar no projeto `lirio-app`. Nenhuma `service_role` no repositório; só `anon`.
- Hospedagem GitHub Pages; roteamento com BrowserRouter + `404.html` de fallback; `base: '/'`.
- `prefers-reduced-motion` desliga movimento; mobile usa versão leve; WebGL com fallback estático.
- Número do WhatsApp **nunca** no código: vem de `settings.whatsapp_number`.
- Moeda BRL, valores em centavos inteiros.
- Branch de trabalho: `claude/universo-lay-site-avn8xn`. Commits frequentes, com as linhas de atribuição exigidas.

## Review Focus

1. **Carrinho vazio ou item cujo produto foi apagado/ocultado:** finalizar não abre WhatsApp; item órfão é removido com aviso (Task 8, 12).
2. **Mensagem do WhatsApp longa** (muitos itens/personalização) ultrapassa o limite de URL: deve ser truncada com aviso ou dividida, nunca gerar link quebrado (Task 8).
3. **Caracteres especiais** (`&`, `#`, `%`, emoji, aspas, quebras de linha) em nome de produto ou texto de personalização preservados na mensagem (Task 8).
4. **WebGL indisponível, aba em segundo plano ou `prefers-reduced-motion`:** página continua utilizável com fallback estático (Task 4, 5).
5. **Número de WhatsApp ainda não configurado:** botão "Finalizar" desabilitado com mensagem clara, sem link para número vazio (Task 8, 12).
6. **Acesso direto à URL de produto em rascunho/oculto** por visitante anônimo: 404 temático, nunca o conteúdo (Task 11, 12).
7. **Upload de imagem enorme ou formato inválido** no painel: recusado/comprimido com mensagem (Task 14).

---

## FASE 1 — Prévia visual (sem dados)

### Task 1: Scaffold, tokens e deploy no Pages

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/styles/tokens.css`, `src/styles/global.css`, `scripts/postbuild.mjs`, `.github/workflows/pages.yml`, `.gitignore`, `tests/smoke.test.ts`
- Modify: `README.md`

**Interfaces:**
- Produces: `npm run dev|build|test`; `dist/404.html` idêntico a `dist/index.html` (fallback SPA); CSS vars dos tokens globais.

- [ ] **Step 1:** Teste `tests/smoke.test.ts`: lê `src/styles/tokens.css` e afirma que contém cada token de Global Constraints com o valor exato. Rodar com `npx vitest run` → FAIL.
- [ ] **Step 2:** Criar o projeto Vite React-TS (scripts `dev`, `build` = `tsc -b && vite build && node scripts/postbuild.mjs`, `test`), instalar dependências da Tech Stack, escrever `tokens.css`, `global.css` (reset, `body` com `--paper`, fontes) e `App.tsx` mínimo.
- [ ] **Step 3:** `scripts/postbuild.mjs` copia `dist/index.html` para `dist/404.html`.
- [ ] **Step 4:** Workflow `pages.yml`: em push na `main`, `npm ci`, `npm test`, `npm run build`, upload e deploy via `actions/deploy-pages`. Sem `CNAME` até o domínio ser informado.
- [ ] **Step 5:** `npx vitest run` e `npm run build` → PASS; `dist/404.html` existe.
- [ ] **Step 6:** Commit `feat: scaffold vite + tokens + pages workflow`.

### Task 2: Marca, logos e configuração das marcas

**Files:**
- Create: `src/brand/brands.ts`, `src/brand/Monogram.tsx`, `src/brand/Wordmark.tsx`, `tests/brands.test.ts`

**Interfaces:**
- Produces: `type Brand = { slug: 'lay-store'|'ousada-delicada'|'falou-bordei'; name: string; category: string; accentFrom: string; accentTo: string }`; `export const BRANDS: readonly Brand[]` (ordem: Lay.Store, Ousada Delicada, Falou Bordei); `<Monogram variant="ink"|"lilac"|"bare" size?: number />`; `<Wordmark stacked?: boolean />`.
- Accents: Lay.Store `#9FB8FF→#A38A9E`; Ousada Delicada `#F2A7C8→#A38A9E`; Falou, Bordei `#D9B98A→#A38A9E`.

- [ ] **Step 1:** Teste: `BRANDS` tem 3 itens, slugs únicos, nomes e categorias exatos de Global Constraints. FAIL.
- [ ] **Step 2:** Implementar `brands.ts`, `Monogram` (SVG: círculo + "U" e "L" em Cormorant, "L" deslocado para baixo/direita como no logo enviado; variantes grafite com letras `--paper`, lilás com letras `--ink`, e solto) e `Wordmark` ("UNIVERSO" `--ink`, "LAY" `--lilac`; `stacked` quebra em duas linhas).
- [ ] **Step 3:** Teste passa; commit `feat: brand config and logos`.

### Task 3: Scroll suave, utilitários de movimento e cursor

**Files:**
- Create: `src/fx/motion.ts`, `src/fx/SmoothScroll.tsx`, `src/fx/Cursor.tsx`, `tests/motion.test.ts`

**Interfaces:**
- Produces: `prefersReducedMotion(): boolean`; `isLowPower(): boolean` (true se `matchMedia('(pointer: coarse)')`, tela < 768px ou `navigator.hardwareConcurrency <= 4`); `<SmoothScroll>` (Lenis + ScrollTrigger.update; inativo se reduced motion); `<Cursor />` (rastro lilás; só em `(pointer: fine)` e sem reduced motion).

- [ ] **Step 1:** Testes de `motion.ts` com `matchMedia` mockado: reduced motion `true/false`; `isLowPower` `true` em pointer coarse. FAIL → implementar → PASS.
- [ ] **Step 2:** Implementar `SmoothScroll` e `Cursor`; montar ambos em `App.tsx`.
- [ ] **Step 3:** Commit `feat: smooth scroll, motion utils and cursor`.

### Task 4: Fita holográfica (WebGL) com fallback

**Files:**
- Create: `src/fx/RibbonScene.tsx`, `src/fx/ribbon.vert.glsl`, `src/fx/ribbon.frag.glsl`, `src/fx/RibbonFallback.tsx`, `tests/ribbon.test.tsx`

**Interfaces:**
- Consumes: `isLowPower`, `prefersReducedMotion` (Task 3).
- Produces: `<Ribbon accent?: [string,string] interactive?: boolean />`: renderiza `RibbonScene` quando WebGL existe e não há reduced motion; caso contrário `RibbonFallback` (SVG/CSS de linhas em degradê estático).

- [ ] **Step 1:** Teste: sem `WebGLRenderingContext`/com reduced motion, `<Ribbon />` renderiza o fallback e não lança erro. FAIL.
- [ ] **Step 2:** Implementar a cena: plano subdividido deslocado por ruído no vertex shader, desenhado como linhas finas (`LineSegments`/`Points`) com brilho nas bordas no fragment shader, degradê `glow-a→glow-b→glow-c`, parallax por ponteiro/giroscópio, DPR máx. 1.5 (1 em low power), densidade de linhas menor em low power, `frameloop="demand"` pausado fora da viewport (IntersectionObserver) e com aba oculta.
- [ ] **Step 3:** Teste passa; conferir no navegador (Playwright screenshot em desktop e emulação mobile) que a fita aparece e o FPS não despenca; commit `feat: holographic ribbon with fallback`.

### Task 5: Contornos neon, intro e transições de rota

**Files:**
- Create: `src/fx/NeonFrames.tsx`, `src/fx/Intro.tsx`, `src/fx/PageTransition.tsx`, `src/router.tsx`, `tests/intro.test.tsx`

**Interfaces:**
- Produces: `<NeonFrames from: string to: string layers?: number />` (SVG de paralelogramas inclinados em camadas, `stroke-dashoffset` animado); `<Intro onDone />` (monograma desenhado em camadas neon + slogan revelado por letra; botão "Pular"; roda 1× por sessão via `sessionStorage` em try/catch); `<PageTransition>` (molduras varrem a tela entre rotas, instantâneo com reduced motion).

- [ ] **Step 1:** Teste: com reduced motion, `<Intro>` chama `onDone` sem animação; após concluída, segunda montagem na mesma sessão não reaparece; `sessionStorage` indisponível não quebra. FAIL → implementar → PASS.
- [ ] **Step 2:** Implementar `router.tsx` (rotas `/`, `/:brand`, `/:brand/:slug`, `/sobre`, `/contato`, `*` → NotFound) envolvido por `PageTransition`.
- [ ] **Step 3:** Commit `feat: neon frames, intro and page transitions`.

### Task 6: Home

**Files:**
- Create: `src/pages/Home.tsx`, `src/pages/Home.module.css`, `src/components/BrandPortal.tsx`, `src/components/Footer.tsx`, `src/components/Header.tsx`, `src/pages/NotFound.tsx`, `src/pages/About.tsx`, `src/pages/Contact.tsx`

**Interfaces:**
- Consumes: `BRANDS`, `Ribbon`, `NeonFrames`, `Wordmark`.
- Produces: seções: hero escuro (Ribbon + slogan + conceito), 3 `BrandPortal` (hover acende a cor-assinatura e expande; link para `/:slug`), vitrine de destaques (usa `useFeatured()` da Task 7; vazio → `EmptyState`), "Como comprar" (3 passos: escolher, montar o carrinho, finalizar no WhatsApp), marquee do slogan, rodapé. `About`/`Contact` usam só o conceito fornecido e links vindos de `settings` (ausentes ocultam o bloco).

- [ ] **Step 1:** Implementar e animar com GSAP ScrollTrigger (revelação de texto por máscara, parallax, tilt/brilho nos portais, botões magnéticos).
- [ ] **Step 2:** Playwright `tests/e2e/home.spec.ts`: Home mostra os 3 nomes de marca e o slogan; não contém "R$"; navega para cada marca. Rodar → PASS.
- [ ] **Step 3:** Commit `feat: home with brand portals`.

### Task 7: Catálogo (interface), páginas de marca e estados vazios

**Files:**
- Create: `src/data/catalog.ts`, `src/data/emptyCatalog.ts`, `src/data/CatalogProvider.tsx`, `src/pages/Brand.tsx`, `src/components/ProductGrid.tsx`, `src/components/EmptyState.tsx`, `tests/catalog.test.ts`

**Interfaces:**
- Produces: `type Product = { id: string; brandSlug: string; categorySlug: string|null; slug: string; name: string; description: string; priceCents: number; images: {url:string; alt:string}[]; variants: {id:string; label:string; type:'size'|'color'|'other'; value:string; inStock:boolean}[]; featured: boolean; customizable: boolean; customizationFields: {key:string; label:string; type:'text'|'select'; options?:string[]; required:boolean}[] }`; `interface Catalog { listProducts(q:{brandSlug?:string; categorySlug?:string; featured?:boolean}): Promise<Product[]>; getProduct(brandSlug:string, slug:string): Promise<Product|null>; listCategories(brandSlug:string): Promise<{slug:string;name:string}[]>; getSettings(): Promise<Record<string,string>> }`; `emptyCatalog` (tudo vazio); `useCatalog()`, `useFeatured()`.

- [ ] **Step 1:** Teste: `emptyCatalog.listProducts({})` → `[]`, `getProduct(...)` → `null`, `getSettings()` → `{}`. FAIL → implementar → PASS.
- [ ] **Step 2:** `Brand.tsx`: hero na cor-assinatura, filtros de categoria (ocultos se vazio), `ProductGrid` (skeleton shimmer enquanto carrega; `EmptyState` "Em breve" com NeonFrames quando vazio). Produto inexistente → `NotFound`.
- [ ] **Step 3:** Commit `feat: catalog interface and brand pages with empty states`.

### Task 8: Carrinho e mensagem do WhatsApp (TDD)

**Files:**
- Create: `src/cart/cartStore.ts`, `src/cart/whatsapp.ts`, `src/cart/money.ts`, `src/components/CartDrawer.tsx`, `tests/cart.test.ts`, `tests/whatsapp.test.ts`, `tests/money.test.ts`

**Interfaces:**
- Produces: `type CartItem = { productId:string; slug:string; brandSlug:string; name:string; unitPriceCents:number; qty:number; variantLabel?:string; custom?: Record<string,string> }`; store (Zustand-like ou useSyncExternalStore) com `add(item)`, `setQty(key, qty)`, `remove(key)`, `clear()`, `totalCents()`, persistência em `localStorage` (try/catch, funciona sem); `formatBRL(cents:number): string`; `buildWhatsAppUrl(args:{phone:string|undefined; customerName?:string; items:CartItem[]}): { url:string|null; truncated:boolean; reason?:'empty'|'no-phone' }`.

- [ ] **Step 1:** Testes (com os valores abaixo, todos fixtures só de teste):
  - `formatBRL(1990)` → `"R$ 19,90"`; `formatBRL(0)` → `"R$ 0,00"`.
  - `add` do mesmo produto+variante+custom soma qty; variante diferente cria linha nova; `setQty(key,0)` remove.
  - `buildWhatsAppUrl({phone:undefined,...})` → `{url:null, reason:'no-phone'}`; itens vazios → `reason:'empty'`.
  - Nome com `& # % "` e emoji + quebra de linha em personalização: a URL decodificada contém o texto exato.
  - 60 itens longos: `url.length <= 1900`, `truncated === true`, mensagem termina avisando que a lista foi resumida.
  - Cart corrompido no `localStorage` (JSON inválido) → carrinho vazio, sem exceção.
  FAIL.
- [ ] **Step 2:** Implementar os três módulos (`wa.me/<apenas dígitos>?text=` com `encodeURIComponent`; total e itens linha a linha).
- [ ] **Step 3:** `CartDrawer`: itens, qty, personalização, total, campo "Seu nome" (opcional), botão "Finalizar no WhatsApp" (desabilitado com mensagem se `reason` for `empty`/`no-phone`), animação de mola e item "voando" até o ícone.
- [ ] **Step 4:** `npx vitest run` → PASS; commit `feat: cart and whatsapp message builder`.

### Task 9: Página de produto

**Files:**
- Create: `src/pages/ProductPage.tsx`, `src/components/Gallery.tsx`, `src/components/CustomizationForm.tsx`, `tests/e2e/product.spec.ts`

**Interfaces:**
- Consumes: `Catalog.getProduct`, `cartStore.add`, `Product`.
- Produces: galeria com zoom/gestos, seleção de variações (esgotada desabilitada), campos de personalização conforme `customizationFields` (obrigatórios validados), "Adicionar ao carrinho", "Chamar no WhatsApp sobre esta peça" (some sem telefone).

- [ ] **Step 1:** E2E com Catalog stub injetado **só no teste** (via `window.__CATALOG__` habilitado só em `import.meta.env.MODE==='test'`): campo obrigatório vazio bloqueia adicionar; adicionar atualiza o contador do carrinho. FAIL → implementar → PASS.
- [ ] **Step 2:** Commit `feat: product page`.

### Task 10: Checkpoint — prévia publicada

**Files:**
- Create: `tests/e2e/responsive.spec.ts`
- Modify: `README.md`

- [ ] **Step 1:** Playwright: screenshots de Home, uma marca (vazia) e 404 em 375×812, 768×1024 e 1440×900, sem rolagem horizontal (`document.documentElement.scrollWidth <= innerWidth`) → PASS; salvar imagens em `docs/preview/`.
- [ ] **Step 2:** Verificar Lighthouse mobile na Home (performance ≥ 80 nesta fase) e ausência de erros no console.
- [ ] **Step 3:** Merge na `main` (após revisão do JR), conferir o deploy no Pages e enviar a URL da prévia ao JR. **Parar e aguardar aprovação visual antes da Fase 2.**
- [ ] **Step 4:** Commit `docs: preview screenshots`.

---

## FASE 2 — Dados e painel

### Task 11: Schema, RLS e storage no Supabase

**Files:**
- Create: `supabase/migrations/0001_schema.sql`, `supabase/migrations/0002_rls.sql`, `supabase/migrations/0003_storage.sql`, `tests/rls/rls.test.ts`

**Interfaces:**
- Produces: tabelas conforme spec seção 7 (`brands, categories, products, product_images, product_variants, settings, admin_users`), `is_admin()` (security definer, `search_path` fixo), bucket `product-images` público para leitura.
- `brands` recebe os 3 registros reais (slug, nome, categoria, cores) via migration — são dados da marca, não fictícios. `products`, `categories`, `settings` nascem vazios.

- [ ] **Step 1:** Teste RLS (cliente com `anon`, chave pública do projeto): `select` em `products` retorna só `published`; `insert/update/delete` em qualquer tabela falha; rascunho inexistente para anônimo.
- [ ] **Step 2:** Escrever migrations; aplicar no projeto `rsbyflojdjecgofyxack` (MCP `apply_migration`); rodar `get_advisors` (security) e corrigir apontamentos.
- [ ] **Step 3:** Teste passa; commit `feat: supabase schema, rls and storage`.

### Task 12: Catálogo Supabase e configurações

**Files:**
- Create: `src/data/supabaseCatalog.ts`, `src/lib/supabase.ts`, `.env.example`, `tests/supabaseCatalog.test.ts`
- Modify: `src/data/CatalogProvider.tsx`

**Interfaces:**
- Consumes: `Catalog` (Task 7). Produces: `createSupabaseCatalog(client): Catalog` mapeando linhas → `Product` (centavos inteiros, imagens ordenadas por `sort`, URL pública do storage). Variáveis `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (a anon é pública; entra no build via secret/variável do Actions).

- [ ] **Step 1:** Teste com client falso: mapeia produto com 2 imagens fora de ordem → ordenadas; `getProduct` de slug inexistente → `null`; erro de rede → rejeita com mensagem tratável (UI mostra erro com "tentar de novo").
- [ ] **Step 2:** Implementar e trocar o provider (usa Supabase quando as variáveis existem, senão `emptyCatalog`). Carrinho remove itens órfãos ao carregar e avisa.
- [ ] **Step 3:** Commit `feat: supabase catalog`.

### Task 13: Autenticação do admin

**Files:**
- Create: `src/admin/AuthProvider.tsx`, `src/admin/Login.tsx`, `src/admin/RequireAdmin.tsx`, `src/admin/AdminLayout.tsx`, `tests/e2e/admin-auth.spec.ts`

**Interfaces:**
- Produces: rota `/admin` protegida por `RequireAdmin` (sessão Supabase **e** presença em `admin_users`); logout; mensagens de erro claras; sem cadastro público.

- [ ] **Step 1:** E2E: visitante em `/admin` vai para login; credenciais inválidas mostram erro; usuário autenticado fora de `admin_users` não acessa.
- [ ] **Step 2:** Implementar. Criar o usuário da administradora no Supabase Auth com o e-mail dela (senha definida por ela) e inserir em `admin_users`.
- [ ] **Step 3:** Commit `feat: admin auth`.

### Task 14: CRUD de produtos com upload de fotos

**Files:**
- Create: `src/admin/ProductList.tsx`, `src/admin/ProductEditor.tsx`, `src/admin/imageUpload.ts`, `src/admin/adminApi.ts`, `tests/imageUpload.test.ts`, `tests/e2e/admin-products.spec.ts`

**Interfaces:**
- Produces: `compressImage(file: File, opts?: {maxSide?: number; quality?: number}): Promise<Blob>` (WebP, lado máx. 1600, recusa tipos não-imagem e arquivos > 15 MB com erro tipado `ImageRejected`); `adminApi` com `saveProduct`, `deleteProduct`, `uploadProductImage`, `reorderImages`, `setStatus('draft'|'published'|'hidden')`; editor com arrastar-e-soltar, reordenação, variações, campos de personalização, destaque, preço em R$ → centavos inteiros.

- [ ] **Step 1:** Testes: `compressImage` rejeita `text/plain` e arquivo de 16 MB; saída é `image/webp` e ≤ 1600 px; preço `"19,90"` → `1990`, `"19,9"` → `1990`, `"abc"` → erro de validação.
- [ ] **Step 2:** Implementar listagem, editor e API; slug gerado do nome, único por marca (colisão acrescenta sufixo numérico).
- [ ] **Step 3:** E2E (com usuário de teste e projeto de teste, nunca com dados reais): criar → rascunho invisível ao anônimo → publicar → aparece → ocultar → some.
- [ ] **Step 4:** Commit `feat: admin product management`.

### Task 15: Marcas, categorias, configurações e prévia

**Files:**
- Create: `src/admin/Settings.tsx`, `src/admin/Categories.tsx`, `src/admin/PreviewToggle.tsx`

**Interfaces:**
- Produces: edição de categorias por marca; `settings` (`whatsapp_number` validado como 10–13 dígitos, `instagram_lay_store`, `instagram_ousada_delicada`, `instagram_falou_bordei`, texto de contato); modo "ver como cliente" que, para o admin autenticado, inclui rascunhos no `Catalog` com selo "Prévia".

- [ ] **Step 1:** Teste: número com letras/curto é rejeitado; número válido normaliza para dígitos; com telefone salvo, o carrinho passa a habilitar "Finalizar".
- [ ] **Step 2:** Implementar; commit `feat: admin settings, categories and preview`.

---

## FASE 3 — Acabamento

### Task 16: Páginas de compartilhamento e publicação

**Files:**
- Create: `scripts/buildSharePages.ts`, `.github/workflows/publish.yml`, `tests/sharePages.test.ts`
- Modify: `.github/workflows/pages.yml`, `src/admin/AdminLayout.tsx`

**Interfaces:**
- Produces: `renderSharePage(p: {brandSlug:string; slug:string; name:string; description:string; imageUrl:string|null; origin:string}): string` (HTML com `og:title`, `og:description`, `og:image`, `og:url` escapados e redirecionamento para `/${brandSlug}/${slug}`); build gera `dist/p/<brand>/<slug>/index.html` só de `published`; workflow `publish.yml` por `workflow_dispatch` (botão "Publicar alterações" no painel dispara via link para a página do workflow).

- [ ] **Step 1:** Teste: nome com `"<script>&` fica escapado; produto sem imagem omite `og:image`; rascunho não gera página.
- [ ] **Step 2:** Implementar e integrar ao build; commit `feat: share pages`.

### Task 17: SEO, acessibilidade, performance, domínio

**Files:**
- Create: `lighthouserc.json`, `tests/e2e/a11y.spec.ts`, `docs/DOMINIO.md`
- Modify: `index.html`, `src/router.tsx`

- [ ] **Step 1:** Meta tags, títulos por rota, `robots.txt`, `sitemap` das rotas fixas e dos produtos publicados, JSON-LD `Organization`.
- [ ] **Step 2:** Playwright + axe: zero violações sérias/críticas nas rotas principais; navegação completa por teclado; foco visível; contraste AA.
- [ ] **Step 3:** Lighthouse CI: performance ≥ 90 mobile na Home e marca, acessibilidade ≥ 95, SEO ≥ 95.
- [ ] **Step 4:** `docs/DOMINIO.md` com os registros DNS exatos (4 `A`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; `CNAME www` → `krcataclysm.github.io`), passo de `CNAME` no repositório e "Enforce HTTPS". Adicionar `public/CNAME` somente quando o JR informar o domínio.
- [ ] **Step 5:** Commit `feat: seo, a11y, performance and domain docs`.
