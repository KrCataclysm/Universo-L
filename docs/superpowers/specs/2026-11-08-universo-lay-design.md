# Universo Lay — Design

Data: 2026-11-08 · Status: aguardando revisão

## 1. Objetivo

Site/loja do **Universo Lay** ("Todas as suas marcas em um só lugar."): um universo de moda, estilo, delicadeza e peças personalizadas onde cada mulher encontra algo especial para si ou para presentear.

Três marcas dentro do universo:

| Marca | Categoria | Personalidade |
|---|---|---|
| **Lay.Store** | Moda fitness | energia, movimento, fita de linhas rápida |
| **Ousada Delicada** | Moda íntima | sensual, suave, brilho rosé |
| **Falou, Bordei** | Bordados e personalizados | artesanal, textura de linha, fio que "borda" |

**Critério de sucesso:** a cliente vê o site e sente "universo vivo" (animações cinematográficas, estilo das intros de jogo enviadas como referência), navega fácil no celular, monta o carrinho e o pedido sai pronto no WhatsApp da loja. A dona cadastra produtos sozinha, pelo painel, sem tocar em código.

## 2. Restrições firmadas com o JR

- **Zero dado fictício.** Nenhum produto, preço, foto, depoimento ou número inventado, nem no site nem no banco. Sem produto, a vitrine mostra estado vazio elegante ("Em breve"). Textos fixos = só os fornecidos (nome, slogan, conceito, nomes das marcas).
- **Hospedagem: GitHub Pages** (estático, domínio do registro.com.br).
- **Banco: Supabase**, projeto novo **"Universo Lay"** (`rsbyflojdjecgofyxack`, sa-east-1). O projeto `lirio-app` não é tocado.
- **Compra: carrinho → WhatsApp** + **painel admin** para cadastrar produtos.
- **Prévia visual primeiro**, depois dados/painel.
- **Visual:** "vivo, futurista, excepcional", no estilo das referências (fitas holográficas de linhas finas em 3D; contornos neon em camadas com degradê), adaptado à paleta da marca.
- Registro.com.br (DNS) fica com o JR; eu entrego os registros exatos.

## 3. Identidade visual (extraída dos arquivos enviados)

| Token | Valor | Uso |
|---|---|---|
| `--paper` | `#F7F5F2` | fundo claro (áreas de produto) |
| `--ink` | `#28272B` | texto, logo |
| `--lilac` | `#A38A9E` | cor-assinatura da marca |
| `--void` | `#0B0A0D` | fundo dos momentos "portal" (intro, marcas) |
| `--glow-a/b/c` | lilás `#C9A7E8`, rosé `#F2A7C8`, azul-gelo `#9FB8FF` | degradês neon/holográficos |

Cor-assinatura por marca (derivada do universo, ajustável no painel): Lay.Store = azul-gelo → lilás; Ousada Delicada = rosé → lilás; Falou, Bordei = dourado-fio `#D9B98A` → lilás.

Tipografia: **Cormorant Garamond** (títulos, logo; é a família do logo enviado) + sans geométrica discreta (**Manrope**) para UI e preços. Logotipos recriados em SVG (monograma UL em círculo, wordmark "UNIVERSO LAY" com LAY em lilás), nas 4 variações enviadas (círculo grafite, círculo lilás, monograma solto, wordmark).

Ritmo de contraste: **seções escuras** (intro, hero, portais das marcas) para impacto; **seções claras** (grade de produtos, produto, carrinho) para a peça aparecer fiel.

## 4. Stack

- **Vite + React + TypeScript**, react-router (BrowserRouter + `404.html` de fallback para Pages).
- **Three.js via React Three Fiber + shaders GLSL**: fita holográfica de linhas/pontos, fundo vivo.
- **GSAP + ScrollTrigger**: timelines de scroll, revelação de texto, transições.
- **Lenis**: scroll suave.
- **Framer Motion**: micro-interações, carrinho, menus, estados.
- **Supabase JS**: leitura pública (chave `anon` + RLS), Auth (admin), Storage (fotos).
- CSS Modules + tokens CSS. Sem biblioteca de UI pronta (identidade própria).
- **Vitest** (lógica), **Playwright** (fluxos e screenshots), **Lighthouse CI** (performance).

### Limitações do Pages e mitigação

| Limitação | Mitigação |
|---|---|
| Sem servidor/SSR | Supabase como backend; páginas principais pré-renderizadas no build |
| Link de produto sem foto/título no WhatsApp/Instagram | GitHub Action gera páginas estáticas de compartilhamento (`/p/<slug>/`) com Open Graph a partir do banco; reexecutada por botão "Publicar alterações" no painel (workflow_dispatch) |
| Sem otimização de imagem no servidor | Compressão e conversão para WebP no navegador antes do upload; vários tamanhos gerados |
| Sem headers customizados | Sem dependência deles; CSP via `<meta>` |
| Repositório privado exige plano pago para Pages | **Verificar visibilidade do repo** (item aberto) |

## 5. Páginas e fluxo

1. **Intro (primeira visita):** tela escura, contornos neon em camadas desenham o monograma UL e fecham no logo; fita holográfica surge; "Todas as suas marcas em um só lugar." revela por letra. Pulável; roda uma vez por sessão.
2. **Home:** hero com fita de linhas 3D reativa a mouse/toque e scroll; conceito; **três portais** (um por marca) com hover que acende a cor-assinatura e expande; vitrine de destaques (vazia = "Em breve"); como comprar (3 passos reais: escolher, montar o carrinho, finalizar no WhatsApp); rodapé com contato.
3. **Marca** (`/lay-store`, `/ousada-delicada`, `/falou-bordei`): hero próprio na cor-assinatura, filtros por categoria, grade de produtos.
4. **Produto:** galeria com zoom e gestos, variações (tamanho/cor), campos de **personalização** (Falou, Bordei: nome/texto, cor da linha, observações), quantidade, "Adicionar ao carrinho", "Chamar no WhatsApp sobre esta peça".
5. **Carrinho (drawer):** itens, quantidades, personalização, total. Persistido em `localStorage`.
6. **Finalizar:** monta mensagem estruturada e abre `wa.me/<número>?text=…` com itens, variações, personalizações, total e nome da cliente.
7. **Sobre / Contato**, **404** temática.
8. **/admin** (login).

## 6. Animações (catálogo)

- Fita holográfica (linhas finas deslocadas por ruído, brilho nas bordas, parallax com cursor/giroscópio).
- Contornos neon em camadas (SVG stroke-dashoffset + degradê) em logo, títulos de seção e transições entre rotas.
- Transições de página: molduras inclinadas em degradê varrem a tela.
- Texto revelado por máscara/letra; contadores e linhas que se desenham no scroll.
- Cursor com rastro de luz lilás, botões magnéticos, cards com tilt e brilho que segue o ponteiro.
- Marquee do slogan, grain sutil, glow nas bordas.
- Carrinho: item "voa" até o ícone; drawer com mola.

**Degradação e acessibilidade:** `prefers-reduced-motion` desliga movimento e mantém versão estática elegante; mobile usa versão leve (menos linhas, DPR limitado, sem pós-processamento); WebGL pausa fora da viewport/aba; fallback em imagem/CSS se WebGL falhar; foco visível e navegação por teclado; contraste mínimo AA.

## 7. Modelo de dados (Supabase)

Tudo com **RLS ligado**.

- `brands(id, slug, name, tagline, accent_from, accent_to, sort, active)`
- `categories(id, brand_id, slug, name, sort)`
- `products(id, brand_id, category_id, slug, name, description, price_cents, status [draft|published|hidden], featured, customizable, customization_schema jsonb, sort, created_at, updated_at)`
- `product_images(id, product_id, path, alt, sort)`
- `product_variants(id, product_id, label, option_type [size|color|other], value, in_stock)`
- `settings(key, value)` — `whatsapp_number`, `instagram_*`, textos de contato (preenchidos pela dona; sem valor padrão inventado)
- `admin_users(user_id)` — allowlist de quem é admin
- Função `is_admin()` (security definer) usada nas policies.

**Policies:** leitura pública só de `published` (e `brands`/`categories`/`settings` públicos); escrita só `is_admin()`. Admin enxerga rascunhos para a **prévia "ver como cliente"**. Storage bucket `product-images`: leitura pública, escrita só admin. Nenhuma chave `service_role` no repositório; só `anon`.

## 8. Painel admin

Login (Supabase Auth, e-mail/senha) → dashboard. Produtos: criar/editar/ocultar/excluir, upload múltiplo com arrastar-e-soltar e compressão, reordenar fotos e produtos, variações, personalização (campos configuráveis), destaque, rascunho/publicado, **prévia ao vivo** como a cliente verá. Marcas e categorias; configurações (WhatsApp, redes). Botão "Publicar alterações" (atualiza páginas de compartilhamento). Responsivo (usável pelo celular).

## 9. Deploy

Repositório `krcataclysm/universo-l`, branch `main` → **GitHub Actions** (build + Pages). Arquivo `CNAME` com o domínio. DNS (JR faz no registro.com.br): registros `A` do apex para `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` e `CNAME` do `www` para `krcataclysm.github.io`; depois habilitar "Enforce HTTPS" no Pages. Domínio exato a informar pelo JR.

## 10. Entrega em fases

1. **Prévia visual** (publicada em URL do Pages): intro, home, 3 portais, páginas de marca, produto e carrinho com **estados vazios** (nenhum dado falso), animações completas, responsivo. JR aprova o visual.
2. **Dados e painel:** schema/RLS/storage, admin, cadastro real, carrinho → WhatsApp.
3. **Acabamento:** páginas de compartilhamento (OG), SEO, performance (Lighthouse ≥ 90 mobile no conteúdo), acessibilidade, testes ponta a ponta, domínio.

## 11. Testes

Vitest: cálculo de carrinho, montagem da mensagem do WhatsApp (escape/limite de tamanho), compressão de imagem. Playwright: fluxos (marca → produto → carrinho → WhatsApp), admin (login, criar produto, prévia), screenshots em mobile/tablet/desktop. RLS verificada com consultas anônimas (não lê rascunho, não escreve). Lighthouse CI no pipeline.

## 12. Itens abertos (preciso do JR)

1. **Número de WhatsApp** da loja (vai em `settings`, via painel; sem valor no código).
2. **Domínio** exato e se o repositório é público (Pages).
3. **Instagram/redes** das marcas (opcional).
4. Confirmar as **cores-assinatura** de cada marca.
5. Arquivos originais do logo (SVG/PNG alta), se existirem; senão recrio fielmente em SVG.
6. **E-mail da administradora** para criar o login do painel (a senha ela define; não passa por chat).

## 13. Segurança

Sem credenciais no repositório nem no chat. Login e senha do cliente no registro.com.br **não devem ser passados para mim**; o DNS é feito pelo JR com os registros da seção 9.
