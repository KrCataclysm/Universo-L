# Universo Lay — Definition of Done (DoD)

Legenda: ✅ feito e verificado · ⏳ depende de uma pessoa · 💡 opcional

## ✅ Entregue e verificado
| Item | Como foi verificado |
|---|---|
| Site no ar (GitHub Pages), 3 marcas, 11 produtos reais com fotos, Instagram e WhatsApp da loja | Navegador limpo no endereço público |
| Banco (Supabase) com regras de segurança (RLS) | 7 testes contra o banco real; advisor de desempenho sem avisos |
| Painel `/admin` (produtos, fotos, esgotado, categorias, configurações, rascunhos) | Fluxo completo testado ponta a ponta com usuário temporário |
| Pedido pelo WhatsApp (carrinho → mensagem com itens, opção, total e "sob consulta") | Teste de navegador confere o link e o número |
| SEO: título/descrição por página, canonical, sitemap, robots, Open Graph, JSON-LD (Produto, Breadcrumb, Organização), preload da foto principal | Lighthouse 100 em SEO |
| Acessibilidade (WCAG AA): teclado, leitor de tela, contraste, alvos de toque | Lighthouse 98–100 |
| Segurança do navegador (CSP), sem erros no console | Teste "zero violações" |
| Desempenho | Lighthouse celular 90–99 (ver `docs/DOD.md` → histórico) |
| 82 testes unitários + 11 de navegador + 7 de RLS | `npm test`, `npm run e2e` |

## ⏳ Falta (depende de pessoa)
1. **Domínio:** GitHub → Settings → Pages → *Custom domain* = `universolay.com.br` + *Enforce HTTPS*; depois publicar a versão do domínio (passo 4 de `COMO-USAR-E-EDITAR.md`).
2. **Painel:** criar o login da Laianny (e-mail dela) e **apagar o usuário temporário** `tmp-e2e-admin@example.invalid` (Supabase → Authentication → Users).
3. **Supabase → Authentication:** desligar *Allow new users to sign up* e ligar *Leaked password protection* (único aviso de segurança restante).
4. **WhatsApp:** abrir o botão do site e confirmar que cai na conversa certa (número cadastrado com 8 dígitos após o DDD; se for 9, trocar em Configurações).
5. **Política de privacidade (LGPD):** precisa de razão social/CNPJ e contato da loja (não inventamos esses dados).
6. **Google Search Console:** cadastrar `universolay.com.br` e enviar `sitemap.xml` (depois do domínio).
7. **Teste em iPhone/Safari reais** (só foi testado em Chromium).
8. **Treinar a Laianny** (produto novo, esgotado, preço, foto).

## 💡 Antes de pagar tráfego (anúncios)
- Instalar **Meta Pixel / Google Analytics** com aviso de cookies (LGPD) e links com UTM por campanha.
- Política de privacidade publicada (item 5).
- Conferir a velocidade no celular pelo 4G (LCP < 2,5 s).

## 💡 Melhorias futuras
- Barra fixa "Adicionar ao carrinho" no celular; busca por produto; avaliações reais de clientes (só com depoimentos reais).
- Migrar para Cloudflare (cabeçalhos de segurança reais, redirecionamentos mais rápidos, redimensionamento de imagem).
- Revisão completa de textos (copy) e auditoria de UX com clientes reais.
