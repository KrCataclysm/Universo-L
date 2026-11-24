-- troca "for all" por insert/update/delete (sem políticas permissivas sobrepostas no SELECT)
do $$ declare r record; begin
  for r in select * from (values ('brands','brands_write'),('categories','categories_write'),('products','products_write'),('product_images','images_write'),('product_variants','variants_write'),('settings','settings_write')) v(t, pol) loop
    execute format('drop policy %I on public.%I', r.pol, r.t);
    execute format('create policy %I on public.%I for insert to authenticated with check ((select private.is_admin()))', r.t || '_insert', r.t);
    execute format('create policy %I on public.%I for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()))', r.t || '_update', r.t);
    execute format('create policy %I on public.%I for delete to authenticated using ((select private.is_admin()))', r.t || '_delete', r.t);
  end loop;
end $$;
