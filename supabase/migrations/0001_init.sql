-- ============================================================
-- RentHome AZ — İlkin sxem
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- ENUM-lar ----------
create type user_role as enum ('admin', 'ev_sahibi', 'icarechi');
create type property_type as enum ('menzil', 'heyet_evi', 'ofis');
create type property_status as enum ('gozleyir', 'tesdiqlendi', 'reddedildi');
create type notification_type as enum (
  'yeni_mesaj', 'elan_tesdiqlendi', 'elan_reddedildi', 'premium_bitir'
);

-- ---------- profiles (auth.users-i genişləndirir) ----------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  role user_role not null default 'icarechi',
  created_at timestamptz not null default now()
);

-- Yeni istifadəçi qeydiyyatdan keçəndə avtomatik profil yarat
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'icarechi')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- cities / districts ----------
create table cities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique
);

create table districts (
  id uuid primary key default uuid_generate_v4(),
  city_id uuid not null references cities(id) on delete cascade,
  name text not null
);

create index idx_districts_city on districts(city_id);

-- ---------- properties ----------
create table properties (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text not null default '',
  city_id uuid not null references cities(id),
  district_id uuid references districts(id),
  address text not null,
  price numeric(10,2) not null check (price >= 0),
  rooms int not null check (rooms > 0),
  floor int,
  total_floors int,
  area_m2 numeric(6,2) not null check (area_m2 > 0),
  is_renovated boolean not null default false,
  is_furnished boolean not null default false,
  has_balcony boolean not null default false,
  has_elevator boolean not null default false,
  utilities_included boolean not null default false,
  property_type property_type not null default 'menzil',
  phone text not null,
  whatsapp text,
  is_premium boolean not null default false,
  premium_until timestamptz,
  status property_status not null default 'gozleyir',
  view_count int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_properties_city on properties(city_id);
create index idx_properties_district on properties(district_id);
create index idx_properties_owner on properties(owner_id);
create index idx_properties_status on properties(status);
create index idx_properties_price on properties(price);
create index idx_properties_rooms on properties(rooms);
create index idx_properties_premium on properties(is_premium) where is_premium = true;

-- ---------- property_images ----------
create table property_images (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references properties(id) on delete cascade,
  url text not null,
  sort_order int not null default 0
);

create index idx_property_images_property on property_images(property_id);

-- ---------- favorites ----------
create table favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, property_id)
);

-- ---------- messages ----------
create table messages (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references properties(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  receiver_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_messages_property on messages(property_id);
create index idx_messages_participants on messages(sender_id, receiver_id);

-- ---------- notifications ----------
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  type notification_type not null,
  content text not null,
  related_property_id uuid references properties(id) on delete set null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_notifications_user on notifications(user_id, is_read);

-- ---------- reviews ----------
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references properties(id) on delete cascade,
  reviewer_id uuid not null references profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (property_id, reviewer_id)
);

create index idx_reviews_property on reviews(property_id);
