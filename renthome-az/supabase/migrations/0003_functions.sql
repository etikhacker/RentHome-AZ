-- ============================================================
-- RentHome AZ — Köməkçi funksiyalar (RPC)
-- ============================================================

-- Elana baxış əlavə et (RLS-i bypass edir, çünki security definer)
create function public.increment_view_count(prop_id uuid)
returns void as $$
  update properties set view_count = view_count + 1 where id = prop_id;
$$ language sql security definer;

-- Admin dashboard üçün ümumi statistika
create function public.admin_dashboard_stats()
returns table (
  total_users bigint,
  total_properties bigint,
  new_properties_today bigint,
  active_properties bigint
) as $$
  select
    (select count(*) from profiles),
    (select count(*) from properties),
    (select count(*) from properties where created_at >= current_date),
    (select count(*) from properties where status = 'tesdiqlendi')
  where public.is_admin();
$$ language sql security definer stable;

-- Elan təsdiqləndikdə/rədd edildikdə ev sahibinə bildiriş yarat
create function public.notify_on_status_change()
returns trigger as $$
begin
  if new.status = 'tesdiqlendi' and old.status is distinct from 'tesdiqlendi' then
    insert into notifications (user_id, type, content, related_property_id)
    values (new.owner_id, 'elan_tesdiqlendi', new.title || ' elanı təsdiqləndi.', new.id);
  elsif new.status = 'reddedildi' and old.status is distinct from 'reddedildi' then
    insert into notifications (user_id, type, content, related_property_id)
    values (new.owner_id, 'elan_reddedildi', new.title || ' elanı rədd edildi.', new.id);
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_property_status_change
  after update of status on properties
  for each row execute procedure public.notify_on_status_change();

-- Yeni mesaj gələndə alıcıya bildiriş yarat
create function public.notify_on_new_message()
returns trigger as $$
begin
  insert into notifications (user_id, type, content, related_property_id)
  values (new.receiver_id, 'yeni_mesaj', 'Yeni mesajınız var.', new.property_id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_new_message
  after insert on messages
  for each row execute procedure public.notify_on_new_message();
