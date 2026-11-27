# API.md

O projeto **não tem servidor próprio**. Toda a comunicação é direta com serviços externos.

## 1. Base
- Supabase (PostgREST): `https://rsbyflojdjecgofyxack.supabase.co/rest/v1/…` (cabeçalho `apikey` com a chave pública).
- Supabase Storage (leitura pública): `…/storage/v1/object/public/product-images/<caminho>`.
- Site: `https://universolay.com.br` (o `www.universolay.com.br` redireciona para ele).

## 2. Quem pode chamar
- **Público:** só leitura, o que o RLS permite (ver DATABASE.md §5).
- **Painel:** Supabase Auth (e-mail/senha) + `supabase-js`; a identidade vem do token no servidor do Supabase, nunca de um id enviado pela tela.

## 3. Chamadas usadas pelo site (`src/data/restCatalog.ts`)
| Caminho | Para quê |
|---|---|
| `GET /products?select=…&status=eq.published&order=sort.asc,created_at.asc` | listar peças (filtros: `brands.slug`, `categories.slug`, `featured`) |
| `GET /products?…&slug=eq.<slug>&limit=1` | uma peça |
| `GET /categories?brands.slug=eq.<marca>` | categorias da marca |
| `GET /settings?select=key,value` | contatos e textos |
| `GET /banners?active=eq.true` | banner de campanha |
Colunas selecionadas: constante `COLS` em `restCatalog.ts`. Páginas estáticas do build usam a mesma consulta (`scripts/postbuild.mjs`).

## 4. Serviço externo: WhatsApp
- Formato: `https://wa.me/<número com DDI>?text=<mensagem codificada>`.
- Número vem de `settings.whatsapp_number` (ex.: `5586999463019`, 13 dígitos = celular com 9).
- Mensagem montada em `src/cart/whatsapp.ts` (limite de tamanho tratado; testes em `tests/whatsapp.test.ts`).
- Se falhar: o link abre o WhatsApp mesmo assim; o site só mostra um aviso.

## 5. Erros na tela
Formato único de aviso (`toast`): título curto + texto. Falha de carregamento mostra "Tentar de novo" (`ProductGrid`). Detalhes técnicos não aparecem para a cliente.

## 6. Limites e repetições
- Limites de requisições: padrão do Supabase (**por decidir** se precisa de mais).
- Leitura pública é idempotente; escrita só no painel.

## 7. Build
`.github/workflows/pages.yml`: instala, roda `npm run build` com `BASE_PATH`/`VITE_SITE_URL` e publica; `cron` de hora em hora reconstrói para atualizar prévias. Sem segredos no workflow.
