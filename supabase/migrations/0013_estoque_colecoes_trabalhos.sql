-- Estoque por quantidade (por opção de cor/tamanho), coleções, trabalhos realizados e categorias de cada marca.

-- 1) Estoque: null = não controla quantidade; 0 = esgotado; n = unidades. in_stock continua valendo (o painel o mantém em dia).
alter table public.product_variants add column if not exists stock integer check (stock is null or stock >= 0);

-- 2) Coleções (agrupam produtos de qualquer marca)
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  image_path text,
  active boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.collection_products (
  collection_id uuid not null references public.collections(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  sort int not null default 0,
  primary key (collection_id, product_id)
);
create index if not exists collection_products_product_idx on public.collection_products (product_id);

-- 3) Trabalhos realizados (portfólio por marca; começa na Falou Bordei)
create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  title text not null default '',
  description text not null default '',
  image_path text not null,
  active boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists works_brand_idx on public.works (brand_id, active, sort);

-- 4) RLS: público lê só o que está ativo; só administrador escreve
alter table public.collections enable row level security;
alter table public.collection_products enable row level security;
alter table public.works enable row level security;

create policy collections_read on public.collections for select using (active or (select private.is_admin()));
create policy collections_insert on public.collections for insert to authenticated with check ((select private.is_admin()));
create policy collections_update on public.collections for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy collections_delete on public.collections for delete to authenticated using ((select private.is_admin()));

create policy collection_products_read on public.collection_products for select using (
  exists (select 1 from public.collections c where c.id = collection_id and c.active) or (select private.is_admin())
);
create policy collection_products_insert on public.collection_products for insert to authenticated with check ((select private.is_admin()));
create policy collection_products_update on public.collection_products for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy collection_products_delete on public.collection_products for delete to authenticated using ((select private.is_admin()));

create policy works_read on public.works for select using (active or (select private.is_admin()));
create policy works_insert on public.works for insert to authenticated with check ((select private.is_admin()));
create policy works_update on public.works for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy works_delete on public.works for delete to authenticated using ((select private.is_admin()));

-- 5) Categorias de cada marca (pedido da loja)
insert into public.categories (brand_id, slug, name, sort)
select b.id, v.slug, v.name, v.sort from public.brands b
join (values
  ('lay-store','conjuntos','Conjuntos',1), ('lay-store','shorts-e-bermudas','Shorts e bermudas',2), ('lay-store','leggings','Leggings',3),
  ('lay-store','tops','Tops',4), ('lay-store','blusas-e-camisetas','Blusas e camisetas',5), ('lay-store','macaquinhos','Macaquinhos',6),
  ('ousada-delicada','calcinhas','Calcinhas',1), ('ousada-delicada','sutias','Sutiãs',2), ('ousada-delicada','conjuntos','Conjuntos',3),
  ('ousada-delicada','camisolas','Camisolas',4), ('ousada-delicada','combos','Combos',5),
  ('falou-bordei','camisetas-e-regatas-bordadas','Camisetas e regatas bordadas',1), ('falou-bordei','infantil','Infantil',2), ('falou-bordei','bones','Bonés',3),
  ('falou-bordei','bastidores','Bastidores',4), ('falou-bordei','molduras-acrilicas','Molduras acrílicas',5), ('falou-bordei','pecas-decorativas','Peças decorativas',6),
  ('falou-bordei','acessorios','Acessórios',7), ('falou-bordei','encomendas-personalizadas','Encomendas personalizadas',8)
) as v(brand, slug, name, sort) on v.brand = b.slug
where not exists (select 1 from public.categories c where c.brand_id = b.id and c.slug = v.slug);

-- 6) Peças atuais nas categorias (pelo nome; a loja pode ajustar pelo painel)
update public.products p set category_id = c.id
from public.categories c, public.brands b, (values
  ('bermuda-ciclista','shorts-e-bermudas'), ('short-duplo','shorts-e-bermudas'), ('duo-preto-short-e-top','conjuntos'), ('blusao-recorte-tela','blusas-e-camisetas'),
  ('sutia-coringa','sutias'), ('calcinha-borboleta','calcinhas'), ('renda-fucsia','conjuntos'),
  ('imaculado-coracao-acrilico','molduras-acrilicas'), ('jesus-vidrilho-dourado','camisetas-e-regatas-bordadas'), ('bordado-momento-especial','bastidores'), ('fotografia-bordada','camisetas-e-regatas-bordadas')
) as m(pslug, cslug)
where p.slug = m.pslug and c.slug = m.cslug and c.brand_id = p.brand_id and b.id = p.brand_id and p.category_id is null;
