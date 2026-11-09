-- is_admin() sai da API pública (schema private não é exposto pelo PostgREST)
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

create or replace function private.is_admin() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.admin_users where user_id = (select auth.uid())) $$;
revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

alter policy brands_read on public.brands using (active or (select private.is_admin()));
alter policy brands_write on public.brands using ((select private.is_admin())) with check ((select private.is_admin()));
alter policy categories_write on public.categories using ((select private.is_admin())) with check ((select private.is_admin()));
alter policy products_read on public.products using (status = 'published' or (select private.is_admin()));
alter policy products_write on public.products using ((select private.is_admin())) with check ((select private.is_admin()));
alter policy images_read on public.product_images using ((select private.is_admin()) or exists (select 1 from public.products p where p.id = product_id and p.status = 'published'));
alter policy images_write on public.product_images using ((select private.is_admin())) with check ((select private.is_admin()));
alter policy variants_read on public.product_variants using ((select private.is_admin()) or exists (select 1 from public.products p where p.id = product_id and p.status = 'published'));
alter policy variants_write on public.product_variants using ((select private.is_admin())) with check ((select private.is_admin()));
alter policy settings_write on public.settings using ((select private.is_admin())) with check ((select private.is_admin()));
alter policy product_images_insert on storage.objects with check (bucket_id = 'product-images' and (select private.is_admin()));
alter policy product_images_update on storage.objects using (bucket_id = 'product-images' and (select private.is_admin()));
alter policy product_images_delete on storage.objects using (bucket_id = 'product-images' and (select private.is_admin()));
drop function public.is_admin();
