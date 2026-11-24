-- fotos com nome descritivo (SEO): /produtos/<slug-do-produto>.webp
update public.product_images i set path = '/produtos/' || p.slug || '.webp'
from public.products p where p.id = i.product_id and i.path like '/produtos/%';
