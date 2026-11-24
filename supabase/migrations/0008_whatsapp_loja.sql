insert into public.settings (key, value) values ('whatsapp_number', '558699463019')
on conflict (key) do update set value = excluded.value;
