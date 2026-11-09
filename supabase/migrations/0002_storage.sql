insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/webp','image/jpeg','image/png','image/avif'])
on conflict (id) do nothing;
create policy product_images_insert on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and (select public.is_admin()));
create policy product_images_update on storage.objects for update to authenticated using (bucket_id = 'product-images' and (select public.is_admin()));
create policy product_images_delete on storage.objects for delete to authenticated using (bucket_id = 'product-images' and (select public.is_admin()));
