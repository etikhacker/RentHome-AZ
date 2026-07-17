-- Bizimlə əlaqə formuna telefon sahəsi + yalnız giriş etmiş istifadəçilər
-- mesaj göndərə bilsin (əvvəllər hər kəs, anonim də, göndərə bilirdi)

alter table contact_messages add column if not exists phone text;

do $$
begin
  if exists (select 1 from pg_policies where tablename='contact_messages' and policyname='contact_insert_anyone') then
    drop policy contact_insert_anyone on contact_messages;
  end if;
  if exists (select 1 from pg_policies where tablename='contact_messages' and policyname='contact_messages_insert_anyone') then
    drop policy contact_messages_insert_anyone on contact_messages;
  end if;
end $$;

create policy "contact_insert_authenticated"
  on contact_messages for insert
  to authenticated
  with check (true);