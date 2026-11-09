-- Itens de EXEMPLO (is_example = true). Removíveis pelo painel ("Remover exemplos").
insert into public.categories (brand_id, slug, name, sort)
select b.id, c.slug, c.name, c.sort from public.brands b join (values
 ('lay-store','leggings','Leggings',1),('lay-store','tops','Tops',2),('lay-store','conjuntos','Conjuntos',3),
 ('ousada-delicada','conjuntos','Conjuntos',1),('ousada-delicada','camisolas','Camisolas',2),
 ('falou-bordei','toalhas','Toalhas e acessórios',1),('falou-bordei','kits','Kits presente',2)
) c(brand, slug, name, sort) on b.slug = c.brand;

insert into public.products (brand_id, category_id, slug, name, description, price_cents, status, featured, customizable, customization_schema, sort, is_example)
select b.id, c.id, p.slug, p.name || ' (exemplo)', 'Item de exemplo para visualizar o layout. Será substituído pelas peças reais cadastradas no painel.',
  p.price, 'published', p.featured, p.custom,
  case when p.custom then '[{"key":"nome","label":"Nome ou texto a bordar","type":"text","required":true},{"key":"cor_linha","label":"Cor da linha","type":"select","options":["Lilás","Rosé","Dourado","Grafite","Branco"],"required":true},{"key":"observacoes","label":"Observações","type":"text","required":false}]'::jsonb else '[]'::jsonb end,
  p.sort, true
from (values
 ('lay-store','leggings','legging-cintura-alta','Legging cintura alta',11990,true,false,1),
 ('lay-store','leggings','legging-sem-costura','Legging sem costura',13990,false,false,2),
 ('lay-store','tops','top-sustentacao','Top de sustentação',7990,true,false,3),
 ('lay-store','conjuntos','conjunto-treino','Conjunto de treino',18990,false,false,4),
 ('ousada-delicada','conjuntos','conjunto-renda','Conjunto de renda',12990,true,false,1),
 ('ousada-delicada','conjuntos','conjunto-delicado','Conjunto delicado',10990,false,false,2),
 ('ousada-delicada','camisolas','camisola-cetim','Camisola de cetim',14990,false,false,3),
 ('falou-bordei','toalhas','toalha-bordada','Toalha bordada',6990,true,true,1),
 ('falou-bordei','kits','kit-presente-bordado','Kit presente bordado',15990,false,true,2),
 ('falou-bordei','toalhas','necessaire-bordada','Necessaire personalizada',5490,false,true,3)
) p(brand, cat, slug, name, price, featured, custom, sort)
join public.brands b on b.slug = p.brand
join public.categories c on c.brand_id = b.id and c.slug = p.cat;

insert into public.product_variants (product_id, label, option_type, value, sort)
select p.id, 'Tamanho', 'size', s.v, s.o from public.products p
cross join (values ('P',1),('M',2),('G',3),('GG',4)) s(v, o)
where p.is_example and not p.customizable;
