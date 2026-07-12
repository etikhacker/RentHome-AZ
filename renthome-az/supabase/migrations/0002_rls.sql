-- ============================================================
-- RentHome AZ — Row Level Security siyasətləri
-- ============================================================

alter table profiles enable row level security;
alter table cities enable row level security;
alter table districts enable row level security;
alter table properties enable row level security;
alter table property_images enable row level security;
alter table favorites enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;
alter table reviews enable row level security;

-- ---------- Köməkçi funksiya: cari istifadəçi admindirmi? ----------
create function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ============================================================
-- profiles
-- ============================================================
-- Hər kəs profilləri oxuya bilər (ictimai məlumat: ad, telefon və s.)
create policy "profiles_select_all"
  on profiles for select
  using (true);

-- İstifadəçi yalnız öz profilini yeniləyə bilər
create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id);

-- Admin istənilən profili idarə edə bilər
create policy "profiles_admin_all"
  on profiles for all
  using (is_admin());

-- ============================================================
-- cities / districts — ictimai oxunur, yalnız admin dəyişir
-- ============================================================
create policy "cities_select_all" on cities for select using (true);
create policy "cities_admin_write" on cities for insert with check (is_admin());
create policy "cities_admin_update" on cities for update using (is_admin());
create policy "cities_admin_delete" on cities for delete using (is_admin());

create policy "districts_select_all" on districts for select using (true);
create policy "districts_admin_write" on districts for insert with check (is_admin());
create policy "districts_admin_update" on districts for update using (is_admin());
create policy "districts_admin_delete" on districts for delete using (is_admin());

-- ============================================================
-- properties
-- ============================================================
-- İctimai: yalnız təsdiqlənmiş elanlar görünür
create policy "properties_select_public"
  on properties for select
  using (status = 'tesdiqlendi');

-- Ev sahibi öz elanlarını (statusundan asılı olmayaraq) görə bilər
create policy "properties_select_own"
  on properties for select
  using (auth.uid() = owner_id);

-- Ev sahibi öz elanını yarada bilər (yalnız 'ev_sahibi' rolu ilə)
create policy "properties_insert_owner"
  on properties for insert
  with check (
    auth.uid() = owner_id
    and exists (
      select 1 from profiles
      where id = auth.uid() and role in ('ev_sahibi', 'admin')
    )
  );

-- Ev sahibi öz elanını yeniləyə bilər, amma statusu özü dəyişə bilməz
create policy "properties_update_owner"
  on properties for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Ev sahibi öz elanını silə bilər
create policy "properties_delete_owner"
  on properties for delete
  using (auth.uid() = owner_id);

-- Admin hər şeyi görə/dəyişə/silə bilər (təsdiq/rədd/premium daxil)
create policy "properties_admin_all"
  on properties for all
  using (is_admin());

-- ============================================================
-- property_images
-- ============================================================
-- Şəkil, əgər əlaqəli elan görünürsə, görünür
create policy "property_images_select"
  on property_images for select
  using (
    exists (
      select 1 from properties p
      where p.id = property_id
        and (p.status = 'tesdiqlendi' or p.owner_id = auth.uid())
    )
  );

-- Yalnız elanın sahibi şəkil əlavə edə/silə bilər
create policy "property_images_owner_write"
  on property_images for insert
  with check (
    exists (
      select 1 from properties p
      where p.id = property_id and p.owner_id = auth.uid()
    )
  );

create policy "property_images_owner_delete"
  on property_images for delete
  using (
    exists (
      select 1 from properties p
      where p.id = property_id and p.owner_id = auth.uid()
    )
  );

create policy "property_images_admin_all"
  on property_images for all
  using (is_admin());

-- ============================================================
-- favorites — istifadəçi yalnız öz favorilərini idarə edir
-- ============================================================
create policy "favorites_select_own"
  on favorites for select
  using (auth.uid() = user_id);

create policy "favorites_insert_own"
  on favorites for insert
  with check (auth.uid() = user_id);

create policy "favorites_delete_own"
  on favorites for delete
  using (auth.uid() = user_id);

-- ============================================================
-- messages — yalnız göndərən/alan görə bilər
-- ============================================================
create policy "messages_select_participant"
  on messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "messages_insert_sender"
  on messages for insert
  with check (auth.uid() = sender_id);

-- Alıcı mesajı "oxundu" kimi işarələyə bilər
create policy "messages_update_receiver"
  on messages for update
  using (auth.uid() = receiver_id)
  with check (auth.uid() = receiver_id);

-- ============================================================
-- notifications — istifadəçi yalnız özününkiləri görür
-- ============================================================
create policy "notifications_select_own"
  on notifications for select
  using (auth.uid() = user_id);

create policy "notifications_update_own"
  on notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Sistemin (backend/service role) bildiriş yarada bilməsi service_role
-- açarı ilə RLS-i bypass etdiyi üçün ayrıca insert policy lazım deyil.

-- ============================================================
-- reviews
-- ============================================================
create policy "reviews_select_all"
  on reviews for select
  using (true);

create policy "reviews_insert_own"
  on reviews for insert
  with check (auth.uid() = reviewer_id);

create policy "reviews_update_own"
  on reviews for update
  using (auth.uid() = reviewer_id);

create policy "reviews_delete_own"
  on reviews for delete
  using (auth.uid() = reviewer_id);
