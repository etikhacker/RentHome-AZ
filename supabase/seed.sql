-- ============================================================
-- RentHome AZ — Başlanğıc data (şəhərlər və rayonlar)
-- ============================================================

insert into cities (name, slug) values
  ('Bakı', 'baki'),
  ('Gəncə', 'ganja'),
  ('Sumqayıt', 'sumqayit'),
  ('Mingəçevir', 'mingacevir'),
  ('Şəki', 'seki'),
  ('Lənkəran', 'lankaran');

-- Bakı rayonları
insert into districts (city_id, name)
select id, district_name from cities,
  unnest(array[
    'Nəsimi', 'Yasamal', 'Səbail', 'Xətai', 'Nərimanov',
    'Binəqədi', 'Nizami', 'Suraxanı', 'Xəzər', 'Qaradağ',
    'Badamdar', 'Əhmədli'
  ]) as district_name
where slug = 'baki';

-- Gəncə rayonları
insert into districts (city_id, name)
select id, district_name from cities,
  unnest(array['Kəpəz', 'Nizami']) as district_name
where slug = 'ganja';

-- Sumqayıt mikrorayonları
insert into districts (city_id, name)
select id, district_name from cities,
  unnest(array['1-ci mikrorayon', '2-ci mikrorayon', '6-cı mikrorayon', 'Mərkəz']) as district_name
where slug = 'sumqayit';
