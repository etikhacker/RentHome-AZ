-- ============================================================
-- 0005: "ev_sahibi" rolunu ləğv et — yalnız admin elan əlavə edə bilər.
-- Həmçinin property_images-ə video dəstəyi (media_type) əlavə olunur.
-- ============================================================

-- Mövcud "ev_sahibi" profillərini "icarechi"-yə keçiririk (test data əhəmiyyətsizdir)
update profiles set role = 'icarechi' where role = 'ev_sahibi';

-- Yeni qeydiyyatlarda rol seçimi artıq yoxdur — həmişə "icarechi" təyin olunur
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    'icarechi'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- properties: artıq yalnız admin yeni elan əlavə edə bilər
drop policy if exists "properties_insert_owner" on properties;
create policy "properties_insert_admin_only"
  on properties for insert
  with check (is_admin());

-- property_images: artıq yalnız admin şəkil/video əlavə edə/silə bilər
drop policy if exists "property_images_owner_write" on property_images;
drop policy if exists "property_images_owner_delete" on property_images;
-- "property_images_admin_all" siyasəti artıq mövcuddur, admin üçün kifayətdir

-- Video dəstəyi üçün sütun
alter table property_images
  add column if not exists media_type text not null default 'image'
  check (media_type in ('image', 'video'));