# DATABASE.md

## 1. Base
- Motor: PostgreSQL no **Supabase** (projeto "Universo Lay", ref `rsbyflojdjecgofyxack`, região São Paulo).
- Alterações: migrações numeradas em `supabase/migrations/` (0001…0012).
- **Nunca** tocar no outro projeto da conta (`lirio-app`).
- Chave pública (anon) em `.env.production`; nenhuma chave de administrador no repositório.

## 2. Tabelas
### brands (marcas)
`id uuid`, `slug text único`, `name`, `accent_from`, `accent_to`, `sort int`, `active boolean`
### categories (categorias)
`id`, `brand_id → brands (cascade)`, `slug`, `name`, `sort`
### products (produtos)
`id`, `brand_id → brands (restrict)`, `category_id → categories (set null)`, `slug`, `name`, `description`,
`price_cents int ≥ 0` (0 = sob consulta), `status` (`draft|published|hidden`), `featured`, `customizable`,
`customization_schema jsonb`, `labels text[]` (selos), `sold_out boolean`, `sort`, `is_example`, `created_at`, `updated_at`
### product_images
`id`, `product_id → products (cascade)`, `path` (caminho no Storage **ou** `/produtos/<slug>.webp` estático), `alt`, `sort`
### product_variants
`id`, `product_id → products (cascade)`, `label`, `option_type` (`size|color|other`), `value`, `in_stock`, `sort`
### settings
`key text pk`, `value text`. Chaves em uso: `whatsapp_number`, `instagram_lay_store`, `instagram_ousada_delicada`, `instagram_falou_bordei`, `info_pagamento`, `info_entrega`, `info_prazos`, `info_trocas`, `loja_razao_social`, `loja_cnpj`, `loja_email`.
### banners
`id`, `title`, `subtitle`, `cta_label`, `link_url`, `image_path`, `active`, `sort`, `created_at`
### admin_users
`user_id uuid pk → auth.users (cascade)`: lista de quem é administrador.
### Storage
Bucket público `product-images` (leitura pública; escrita só administrador).

## 3. Relações
Marca → muitas categorias e produtos. Produto → muitas imagens e variações.

## 4. Regras que o banco garante
- Dinheiro em centavos, inteiro, nunca negativo (`check`).
- `status` e `option_type` restritos por `check`.
- Marca não pode ser apagada se tiver produtos (`restrict`).
- Índices: `products (brand_id, status, sort)`, `product_images (product_id, sort)`, `product_variants (product_id, sort)`.
- `updated_at` mantido por gatilho (`touch_updated_at`).
- `private.is_admin()` (função no schema `private`, não exposta pela API) decide quem escreve.

## 5. Quem vê o quê (RLS ligado em **todas** as tabelas)
- **Público (anon):** lê marcas ativas, categorias, produtos `published`, imagens e variações desses produtos, `settings`, banners ativos.
- **Administrador (`private.is_admin()`):** lê rascunhos e escreve em tudo (inclui Storage).
- Ninguém além do administrador altera nada. `admin_users`: cada usuário só enxerga a si mesmo.
- Testes de RLS em `tests/rls/` (rodam com `SUPABASE_URL`/`SUPABASE_ANON`; pulados sem elas).

## 6. Alterar a estrutura
1. Explicar a mudança e o efeito nos dados existentes.
2. Criar `supabase/migrations/00NN_nome.sql` (idempotente: `if not exists`, `on conflict`).
3. Aplicar e conferir `get_advisors` (segurança/performance) do Supabase.
4. Rodar os testes (inclui RLS).
Nunca mexer à mão na produção, nem rodar reset. **O projeto é único: não há cópia de teste.**

## 7. Dados de teste
Não inventar produto, preço, foto ou cliente. Itens de exemplo têm `is_example = true` e podem ser removidos pelo painel.
Teste que escreve no banco deve **desfazer exatamente o que criou** (uma vez a tabela `settings` foi esvaziada por um script de teste e precisou ser restaurada pelas migrações 0007/0008/0012).

## 8. Cópias de segurança
- Frequência: **por decidir** (depende do plano do Supabase; conferir no painel).
- Última vez que se testou recuperar uma: **nunca testado**.
