-- selos por produto, banners editáveis e nome "Lay.store"
update public.brands set name = 'Lay.store' where slug = 'lay-store';
alter table public.products add column if not exists labels text[] not null default '{}';
update public.products set labels = array['Novidade'] where slug in ('short-duplo', 'blusao-recorte-tela');
update public.products p set labels = array['Sob encomenda'] from public.brands b where b.id = p.brand_id and b.slug = 'falou-bordei';

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  cta_label text,
  link_url text,
  image_path text,
  active boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.banners enable row level security;
create policy banners_read on public.banners for select using (active or (select private.is_admin()));
create policy banners_insert on public.banners for insert to authenticated with check ((select private.is_admin()));
create policy banners_update on public.banners for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy banners_delete on public.banners for delete to authenticated using ((select private.is_admin()));
