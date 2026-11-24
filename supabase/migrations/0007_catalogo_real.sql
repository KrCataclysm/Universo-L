-- Catálogo real (11 itens) no lugar dos exemplos + marca "Falou Bordei" + campo "esgotado" + Instagram das lojas
update public.brands set name = 'Falou Bordei' where slug = 'falou-bordei';
alter table public.products add column if not exists sold_out boolean not null default false;

delete from public.products where is_example;
delete from public.categories;

with p as (
  insert into public.products (brand_id, slug, name, description, price_cents, status, featured, customizable, customization_schema, sort, is_example)
  select b.id, v.slug, v.name, v.descr, v.price, 'published', v.featured, v.custom,
    case when v.custom then '[{"key":"observacoes","label":"Observações (frase, cores, referência…)","type":"text","required":false}]'::jsonb else '[]'::jsonb end,
    v.sort, false
  from (values
   ('lay-store','bermuda-ciclista','Bermuda ciclista','Bermuda ciclista pra treinar sem se preocupar. Tecido de alta compressão, cintura alta e caimento perfeito, nas cores preta ou azul marinho, escolha a sua.',6690,true,false,1),
   ('lay-store','short-duplo','Short duplo','Chegou o short duplo que virou queridinho: aquele short soltinho que dá um toque fashion e ainda garante todo conforto pra treinar ou sair na correria.',8000,false,false,2),
   ('lay-store','duo-preto-short-e-top','Duo preto: short e top','Duo preto que não erra. Short com cós alto e top com alcinhas duplas, tecido confortável que acompanha seu ritmo em qualquer treino.',9990,true,false,3),
   ('lay-store','blusao-recorte-tela','Blusão com recorte em tela','Estamos de volta! E pra abrir esse retorno, trouxemos essa seleção em 3 cores com o mesmo caimento perfeito: esse blusão com recorte em tela respirável, ideal pra treinar com estilo.',6500,false,false,4),
   ('falou-bordei','imaculado-coracao-acrilico','Imaculado Coração em moldura acrílica','A imagem dourada, acompanhada da frase “O meu Imaculado Coração será o teu refúgio”, bordada à mão, ganha ainda mais encanto na transparência da moldura acrílica.',0,true,true,1),
   ('falou-bordei','jesus-vidrilho-dourado','Jesus em vidrilho dourado','Jesus, bordado em vidrilho dourado.',0,false,true,2),
   ('falou-bordei','bordado-momento-especial','Bordado de um momento especial','Um momento especial, uma lembrança cheia de amor e um bordado feito à mão para guardar esse sentimento para sempre.',0,false,true,3),
   ('falou-bordei','fotografia-bordada','Fotografia bordada à mão','Uma fotografia transformada em bordado à mão, com traços delicados que eternizam um abraço, um olhar e uma linda história de amor.',0,false,true,4),
   ('ousada-delicada','sutia-coringa','Sutiã coringa','Aquele sutiã coringa que não pode faltar no guarda-roupa, com alças removíveis, super confortável e disfarça embaixo de qualquer look.',1090,true,false,1),
   ('ousada-delicada','calcinha-borboleta','Calcinha Borboleta','Calcinha modelo Borboleta em cores que são pura personalidade.',1090,false,false,2),
   ('ousada-delicada','renda-fucsia','Renda fúcsia','Renda em tom fúcsia que é pura ousadia.',6590,false,false,3)
  ) v(brand, slug, name, descr, price, featured, custom, sort)
  join public.brands b on b.slug = v.brand
  returning id, slug, name, sort, brand_id
), img as (
  insert into public.product_images (product_id, path, alt, sort)
  select p.id, '/produtos/' || b.slug || '-' || p.sort || '.webp', p.name, 0 from p join public.brands b on b.id = p.brand_id
  returning 1
)
insert into public.product_variants (product_id, label, option_type, value, sort)
select p.id, 'Cor', 'color', c.v, c.o from p cross join (values ('Preta',1),('Azul marinho',2)) c(v, o) where p.slug = 'bermuda-ciclista';

insert into public.settings (key, value) values
  ('instagram_lay_store', 'https://instagram.com/lay.store'),
  ('instagram_falou_bordei', 'https://instagram.com/faloubordei'),
  ('instagram_ousada_delicada', 'https://instagram.com/lojaousadadelicada')
on conflict (key) do update set value = excluded.value;
