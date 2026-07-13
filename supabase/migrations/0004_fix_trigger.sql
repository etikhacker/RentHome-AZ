-- ============================================================
-- Düzəliş: handle_new_user funksiyası search_path xətası
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'icarechi')
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;