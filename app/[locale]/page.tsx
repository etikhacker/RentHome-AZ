import { SiteHeader } from "@/components/layout/site-header";
import { PropertyCard } from "@/components/property/property-card";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { ShieldCheck, Zap, Home as HomeIcon, Headset } from "lucide-react";
import { HouseIllustration } from "@/components/illustrations/house-illustration";
import { Reveal } from "@/components/anim/reveal";
import { AnimatedCounter } from "@/components/anim/animated-counter";

const cardFields =
  `id, title, price, floor, total_floors, is_premium, is_renovated,
   is_furnished, has_elevator, has_balcony, utilities_included,
   cities ( name ), districts ( name ), property_images ( url, sort_order, media_type )`;

function toCardProps(p: any) {
  const sorted = [...(p.property_images ?? [])].sort(
    (a: any, b: any) => a.sort_order - b.sort_order
  );
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    floor: p.floor,
    total_floors: p.total_floors,
    is_premium: p.is_premium,
    is_renovated: p.is_renovated,
    is_furnished: p.is_furnished,
    has_elevator: p.has_elevator,
    has_balcony: p.has_balcony,
    utilities_included: p.utilities_included,
    cityName: p.cities?.name,
    districtName: p.districts?.name,
    thumbnailUrl: sorted[0]?.url ?? null,
    thumbnailType: sorted[0]?.media_type ?? null,
  };
}

export default async function HomePage() {
  const locale = getLocale();
  const t = getDictionary(locale).home;
  const supabase = createClient();

  const [
    { data: newest },
    { data: premium },
    { data: cities },
    { data: { user } },
    { count: activeListingsCount },
    { count: usersCount },
  ] = await Promise.all([
    supabase
      .from("properties")
      .select(cardFields)
      .eq("status", "tesdiqlendi")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("properties")
      .select(cardFields)
      .eq("status", "tesdiqlendi")
      .eq("is_premium", true)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase.from("cities").select("id, name").order("name"),
    supabase.auth.getUser(),
    supabase.from("properties").select("id", { count: "exact", head: true }).eq("status", "tesdiqlendi"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);

  const allIds = [...(newest ?? []), ...(premium ?? [])].map((p: any) => p.id);
  let favoritedIds = new Set<string>();
  if (user && allIds.length > 0) {
    const { data: favs } = await supabase
      .from("favorites")
      .select("property_id")
      .eq("user_id", user.id)
      .in("property_id", allIds);
    favoritedIds = new Set((favs ?? []).map((f) => f.property_id));
  }

  return (
    <>
      <SiteHeader />

      <section className="pt-10 sm:pt-16 pb-8 sm:pb-10">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-7 grid md:grid-cols-[1.15fr_0.85fr] gap-8 md:gap-10 items-center">
          <Reveal>
          <h1 className="font-display font-medium text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] sm:leading-[1.12] tracking-tight max-w-xl">
            {t.heroTitle1}
            <br />
            {t.heroTitle2} <em className="italic text-brick not-italic font-medium">{t.heroTitle3}</em>
          </h1>
          <p className="mt-3.5 text-[15px] sm:text-[16.5px] text-ink-soft max-w-md">{t.heroSubtitle}</p>

          <form action="/elanlar" className="mt-7 sm:mt-8 bg-paper border border-line rounded-2xl p-3.5 sm:p-4.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-3.5 items-end">
            <div>
              <label className="block text-xs text-ink-soft mb-1.5 font-medium">{t.city}</label>
              <select name="city" className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm">
                <option value="">{t.allCities}</option>
                {cities?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-ink-soft mb-1.5 font-medium">Min qiymət (₼)</label>
              <input
                type="number"
                name="min_price"
                placeholder="0"
                className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-ink-soft mb-1.5 font-medium">Max qiymət (₼)</label>
              <input
                type="number"
                name="max_price"
                placeholder="2000"
                className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-ink-soft mb-1.5 font-medium">{t.rooms}</label>
              <select name="rooms" className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm">
                <option value="">{t.anyRooms}</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-ink-soft mb-1.5 font-medium">{t.propertyType}</label>
              <select name="type" className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm">
                <option value="">{t.all}</option>
                <option value="menzil">Mənzil</option>
                <option value="heyet_evi">Həyət evi</option>
                <option value="ofis">Ofis</option>
              </select>
            </div>
            <button className="bg-brick hover:bg-brick-deep text-white rounded-lg px-5 py-2.5 text-sm font-medium">
              {t.search_btn}
            </button>
          </form>

          <div className="mt-6 sm:mt-7 grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { Icon: ShieldCheck, title: "Etibarlı və yoxlanılmış", text: "Hər elan admin tərəfindən yoxlanılır" },
              { Icon: Zap, title: "Sürətli axtarış", text: "Filtrlə saniyələr içində tap" },
              { Icon: HomeIcon, title: "Geniş seçim", text: "Bir çox şəhərdə minlərlə ev" },
              { Icon: Headset, title: "Dəstək xidməti", text: "Sualların olsa bizimlə əlaqə saxla" },
            ].map(({ Icon, title, text }) => (
              <div key={title} className="bg-paper border border-line rounded-xl p-3.5 sm:p-4 flex items-start gap-3">
                <span className="shrink-0 w-9 h-9 rounded-lg bg-teal/10 text-teal-deep flex items-center justify-center">
                  <Icon size={18} />
                </span>
                <div>
                  <div className="text-[13px] sm:text-sm font-semibold leading-tight">{title}</div>
                  <div className="text-[11.5px] sm:text-xs text-ink-soft mt-0.5 leading-snug">{text}</div>
                </div>
              </div>
            ))}
          </div>
          </Reveal>

          <div className="hidden md:block">
            <HouseIllustration />
          </div>
        </div>
      </section>

      <section className="pt-10 sm:pt-12">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-7">
          <div className="flex items-baseline justify-between mb-5 gap-3">
            <h2 className="font-display text-xl sm:text-2xl font-medium">{t.newest}</h2>
            <a href="/elanlar" className="text-[13.5px] text-teal-deep border-b border-teal-deep whitespace-nowrap">
              {t.seeAll}
            </a>
          </div>

          {!newest || newest.length === 0 ? (
            <p className="text-sm text-ink-soft">Hələ təsdiqlənmiş elan yoxdur.</p>
          ) : (
            <Reveal staggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newest.map((p: any, i: number) => (
                <PropertyCard
                  key={p.id}
                  property={toCardProps(p)}
                  tilt={i % 2 === 0 ? "left" : "right"}
                  currentUserId={user?.id ?? null}
                  favorited={favoritedIds.has(p.id)}
                />
              ))}
            </Reveal>
          )}
        </div>
      </section>

      {premium && premium.length > 0 && (
        <section className="pt-12 sm:pt-14 pb-14 sm:pb-16">
          <div className="max-w-[1120px] mx-auto px-4 sm:px-7">
            <div className="flex items-baseline justify-between mb-5 gap-3">
              <h2 className="font-display text-xl sm:text-2xl font-medium">{t.premium}</h2>
              <a href="/elanlar?premium=1" className="text-[13.5px] text-teal-deep border-b border-teal-deep whitespace-nowrap">
                {t.seeAll}
              </a>
            </div>
            <Reveal staggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {premium.map((p: any, i: number) => (
                <PropertyCard
                  key={p.id}
                  property={toCardProps(p)}
                  tilt={i % 2 === 0 ? "left" : "right"}
                  currentUserId={user?.id ?? null}
                  favorited={favoritedIds.has(p.id)}
                />
              ))}
            </Reveal>
          </div>
        </section>
      )}

      <section className="py-10 sm:py-14 bg-paper border-t border-line">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-medium mb-1">
              Evini kirayə vermək istəyirsən?
            </h2>
            <p className="text-sm text-ink-soft">
              Bizimlə əlaqə saxla, elanını komandamız saytda yerləşdirsin.
            </p>
          </div>
          <a
            href="/elaqe"
            className="shrink-0 bg-teal hover:bg-teal-deep text-white rounded-lg px-6 py-2.5 text-sm font-medium"
          >
            Bizimlə əlaqə
          </a>
        </div>
      </section>

      <section className="py-8 sm:py-10 border-t border-line">
        <Reveal staggerChildren className="max-w-[1120px] mx-auto px-4 sm:px-7 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          {[
            { Icon: HomeIcon, value: `${activeListingsCount ?? 0}+`, label: "Aktiv elan" },
            { Icon: ShieldCheck, value: "100%", label: "Yoxlanılmış elanlar" },
            { Icon: Headset, value: "7/24", label: "Dəstək xidməti" },
            { Icon: Zap, value: `${usersCount ?? 0}+`, label: "Qeydiyyatlı istifadəçi" },
          ].map(({ Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <span className="w-10 h-10 rounded-full bg-teal/10 text-teal-deep flex items-center justify-center">
                <Icon size={19} />
              </span>
              <AnimatedCounter value={value} className="font-mono text-xl sm:text-2xl font-medium text-ink" />
              <span className="text-[11.5px] sm:text-xs text-ink-soft">{label}</span>
            </div>
          ))}
        </Reveal>
      </section>

      <footer className="border-t border-line py-6 sm:py-7 text-[13px] text-ink-soft">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-7 flex flex-col sm:flex-row gap-1.5 sm:justify-between">
          <span>© 2026 RentHome AZ</span>
          <span>Mingəçevir, Azərbaycan</span>
        </div>
      </footer>
    </>
  );
}