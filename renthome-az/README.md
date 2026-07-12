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

## Növbəti addım

Supabase SQL sxemi (`supabase/migrations/`) — cədvəllər və RLS
siyasətləri ayrıca hazırlanacaq.
