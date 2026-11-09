-- Universo Lay: schema + RLS
create table public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  accent_from text not null,
  accent_to text not null,
  sort int not null default 0,
  active boolean not null default true
);
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  slug text not null,
  name text not null,
  sort int not null default 0,
  unique (brand_id, slug)
);
create table public.products (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete restrict,
  category_id uuid references public.categories(id) on delete set null,
  slug text not null,
  name text not null,
  description text not null default '',
  price_cents integer not null check (price_cents >= 0),
  status text not null default 'draft' check (status in ('draft','published','hidden')),
  featured boolean not null default false,
  customizable boolean not null default false,
  customization_schema jsonb not null default '[]'::jsonb,
  sort int not null default 0,
  is_example boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (brand_id, slug)
);
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  path text not null,
  alt text not null default '',
  sort int not null default 0
);
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null,
  option_type text not null default 'size' check (option_type in ('size','color','other')),
  value text not null,
  in_stock boolean not null default true,
  sort int not null default 0
);
create table public.settings (key text primary key, value text not null);
create table public.admin_users (user_id uuid primary key references auth.users(id) on delete cascade);

create index on public.categories (brand_id);
create index on public.products (brand_id, status, sort);
create index on public.products (category_id);
create index on public.product_images (product_id, sort);
create index on public.product_variants (product_id, sort);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.admin_users where user_id = (select auth.uid())) $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public as
$$ begin new.updated_at = now(); return new; end $$;
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();

alter table public.brands enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.settings enable row level security;
alter table public.admin_users enable row level security;

create policy brands_read on public.brands for select using (active or (select public.is_admin()));
create policy brands_write on public.brands for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy categories_read on public.categories for select using (true);
create policy categories_write on public.categories for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy products_read on public.products for select using (status = 'published' or (select public.is_admin()));
create policy products_write on public.products for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy images_read on public.product_images for select using (
  (select public.is_admin()) or exists (select 1 from public.products p where p.id = product_id and p.status = 'published'));
create policy images_write on public.product_images for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy variants_read on public.product_variants for select using (
  (select public.is_admin()) or exists (select 1 from public.products p where p.id = product_id and p.status = 'published'));
create policy variants_write on public.product_variants for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy settings_read on public.settings for select using (true);
create policy settings_write on public.settings for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy admin_self on public.admin_users for select to authenticated using (user_id = (select auth.uid()));
