# RentHome AZ

Azərbaycan üçün icarə elanları platforması (Next.js + Supabase).

## Qurulum

```bash
npm install
cp .env.example .env.local   # Supabase URL/key-lərini doldur
npm run dev
```

## Struktur

```
app/
  layout.tsx            Root layout (fontlar, meta)
  page.tsx               Ana səhifə (axtarış + ən yeni + premium elanlar)
  globals.css             Tailwind + design token-lar

  (auth)/
    giris/                Giriş
    qeydiyyat/             Qeydiyyat

  (main)/
    elanlar/               Bütün elanlar + filtrlər
    elan/[id]/             Elan detay səhifəsi
    elan-yerlesdir/        Yeni elan yerləşdirmə forması (ev sahibi)
    favorilerim/           Yadda saxlanılan elanlar
    mesajlar/              Mesajlaşma (Supabase Realtime)
    profil/                İstifadəçi profili

  admin/
    page.tsx               Dashboard (statistika)
    elanlar/                Elan təsdiq/rədd
    istifadeciler/          İstifadəçi idarəetməsi

components/
  layout/site-header.tsx   Naviqasiya
  property/property-card.tsx   Elan kartı (pinned-tag dizaynı)
  ui/                      shadcn/ui komponentləri buraya gələcək

lib/
  supabase/client.ts       Browser Supabase client
  supabase/server.ts       Server Component / Route Handler client
  types/index.ts           Verilənlər bazası ilə uyğun TS tipləri

middleware.ts               Auth session-u hər sorğuda yeniləyir
```

## Rol sistemi

`profiles.role` sütunu: `admin` | `ev_sahibi` | `icarechi`.
Marşrut qorunması (`/admin/*`, `/elan-yerlesdir`) middleware və ya
server component-də `supabase.auth.getUser()` + rol yoxlaması ilə edilir.

## Supabase quraşdırılması

Supabase layihəsini yarat (supabase.com), sonra SQL Editor-də bu sırayla
işə sal (və ya `supabase db push` ilə):

```
supabase/migrations/0001_init.sql        cədvəllər, enum-lar, indekslər
supabase/migrations/0002_rls.sql          Row Level Security siyasətləri
supabase/migrations/0003_functions.sql    RPC funksiyaları + trigger-lər
supabase/seed.sql                          şəhər/rayon başlanğıc data
```

Storage-da `property-images` adlı public bucket yarat (Dashboard →
Storage → New bucket → Public) — elan şəkilləri üçün.

`.env.local`-a Project Settings → API-dən URL və `anon` açarını yapışdır.

### Rol sistemi necə işləyir

- `profiles.role` sütunu: `admin` | `ev_sahibi` | `icarechi`
- Yeni istifadəçi qeydiyyatdan keçəndə trigger avtomatik profil yaradır
  (default rol: `icarechi`); ev sahibi qeydiyyat formasında rolu
  `raw_user_meta_data`-ya `role: 'ev_sahibi'` kimi ötürməklə seçdirilir
- RLS bütün əsas qaydaları backend səviyyəsində məcburi edir — frontend
  kodu səhv yazılsa belə, məsələn icarəçi başqasının elanını silə bilməz
- İlk admin istifadəçini əl ilə təyin et: Supabase SQL Editor-də
  `update profiles set role = 'admin' where id = '<sənin-user-id-in>';`

## Növbəti addım

Frontend tərəfini Supabase-ə qoşmaq: `elanlar` səhifəsində real sorğu,
`elan-yerlesdir` formasında şəkil yükləmə, `giris`/`qeydiyyat`-da auth axını.
