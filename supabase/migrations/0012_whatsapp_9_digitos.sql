-- Corrige o WhatsApp da loja: celular com 9 dígitos (86 99946-3019).
insert into public.settings (key, value) values ('whatsapp_number', '5586999463019')
on conflict (key) do update set value = excluded.value;
