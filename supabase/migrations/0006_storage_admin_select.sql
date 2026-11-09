-- o admin precisa enxergar o objeto para conseguir apagá-lo pela API de storage
create policy product_images_select on storage.objects for select to authenticated
  using (bucket_id = 'product-images' and (select private.is_admin()));
