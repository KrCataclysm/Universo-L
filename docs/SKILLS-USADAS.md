# Skills do ZionLine — o que foi usado no Universo Lay

Conjunto lido: **114 skills** (o zip enviado é idêntico ao já usado antes: 0 arquivos diferentes). Abaixo, o que serviu ao projeto e o que não se aplica a um site estático em GitHub Pages + Supabase.

## Aplicadas
| Skill | Como foi usada |
|---|---|
| `refero-design` | Método: travar uma referência dominante antes de desenhar e validar o resultado contra ela. A referência do Pinterest (vitrine com cor do produto) virou a **Vitrine em destaque** da home. |
| `apple-design` | Materiais translúcidos (menu e seletor em **pílula de vidro**) e resposta imediata ao toque (`:active` no pointer-down). |
| `premium-frontend-design`, `visual-design-foundations`, `frontend-design` | Escala tipográfica, tokens (cores, sombras, espaçamento 8pt), hierarquia e contraste (`readable.css`). |
| `micro-interaction`, `accessible-animation` | Toasts, botões com preenchimento deslizante, coração animado; tudo respeita `prefers-reduced-motion`. |
| `lgpd-privacy-policy` | Política de privacidade reescrita com os itens do art. 9º (finalidade, duração, controlador, compartilhamento, transferência internacional, cookies/armazenamento, direitos, crianças). Inclui favoritos e vistos recentes. **Continua minuta: precisa de revisão jurídica.** |
| `accessibility-*`, `web-design-guidelines` | Auditorias com Lighthouse (acessibilidade 100), foco visível, ordem de títulos, diálogos nativos. |
| `web-perf`, `performance-optimization` | Medição de LCP, seed de dados no HTML, remoção de animação acima da dobra. |
| `schema`, `seo-audit` | JSON-LD de Produto/Breadcrumb/Organization e páginas estáticas por rota (já no build). |
| `copy-editing`, `no-ai-slop` | Revisão de textos curtos de interface (sem inventar dados da loja). |

## Lidas e não aplicadas (e por quê)
- **Backend/autenticação:** `fastify-*`, `nestjs-patterns`, `backend-patterns`, `oauth`, `auth0`, `better-auth-*`, `jwt-security-review`, `api-*` — não há servidor próprio; o Supabase cuida do login do painel.
- **Infra:** `cloudflare`, `vercel-optimize` — hospedagem é GitHub Pages (Cloudflare só se o domínio próprio exigir).
- **Marketing de conteúdo/social:** `*-sms`, `instagram-marketing`, `ig-content-planner`, `social`, `content-*`, `ai-seo`, `marketing-plan` — são trabalho de operação da loja, não do código do site.
- **Processo pesado (`ux-*`, `vision`, `spec-driven-development`, `constraint-driven-development`):** úteis em time grande; aqui o `docs/DOD.md` já cumpre o papel.
- **LGPD além da política** (`lgpd-dsar`, `consent-schema`, `data-mapping`, `dpo-encarregado`): só passam a valer se a loja adotar análise de visitas, pixel ou formulários. Hoje o site não coleta dados pessoais no servidor.
- **`page-transition-animation`:** é específica do Next.js App Router; a troca de página do site usa uma entrada suave própria.
