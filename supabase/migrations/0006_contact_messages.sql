-- ============================================================
-- 0006: "Bizimlə əlaqə" formundan gələn mesajlar üçün cədvəl.
-- Hər kəs (qeydiyyatsız da) mesaj göndərə bilər, yalnız admin oxuya bilər.
-- ============================================================

create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

-- Hər kəs (giriş etməmiş istifadəçi belə) mesaj əlavə edə bilər
create policy "contact_messages_insert_anyone"
  on contact_messages for insert
  with check (true);

-- Yalnız admin oxuya, oxunmuş kimi işarələyə və silə bilər
create policy "contact_messages_admin_select"
  on contact_messages for select
  using (is_admin());

create policy "contact_messages_admin_update"
  on contact_messages for update
  using (is_admin());

create policy "contact_messages_admin_delete"
  on contact_messages for delete
  using (is_admin());

create index if not exists idx_contact_messages_created on contact_messages(created_at desc);
