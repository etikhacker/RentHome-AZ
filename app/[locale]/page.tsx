import { SiteHeader } from "@/components/layout/site-header";
import { PropertyCard } from "@/components/property/property-card";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionary";

const cardFields =
  `id, title, price, floor, total_floors, is_premium, is_renovated,
   is_furnished, has_elevator, has_balcony, utilities_included,
   cities ( name ), districts ( name ), property_images ( url, sort_order )`;

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
  };
}

export default async function HomePage() {
  const locale = getLocale();
  const t = getDictionary(locale).home;
  const supabase = createClient();

  const [{ data: newest }, { data: premium }, { data: cities }, { data: { user } }] = await Promise.all([
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

      <section className="pt-16 pb-10">
        <div className="max-w-[1120px] mx-auto px-7">
          <h1 className="font-display font-medium text-[46px] leading-[1.12] tracking-tight max-w-xl">
            {t.heroTitle1}
            <br />
            {t.heroTitle2} <em className="italic text-brick not-italic font-medium">{t.heroTitle3}</em>
          </h1>
          <p className="mt-3.5 text-[16.5px] text-ink-soft max-w-md">{t.heroSubtitle}</p>

          <form action="/elanlar" className="mt-8 bg-paper border border-line rounded-2xl p-4.5 grid grid-cols-1 md:grid-cols-6 gap-3.5 items-end">
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
        </div>
      </section>

      <section className="pt-12">
        <div className="max-w-[1120px] mx-auto px-7">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-display text-2xl font-medium">{t.newest}</h2>
            <a href="/elanlar" className="text-[13.5px] text-teal-deep border-b border-teal-deep">
              {t.seeAll}
            </a>
          </div>

          {!newest || newest.length === 0 ? (
            <p className="text-sm text-ink-soft">Hələ təsdiqlənmiş elan yoxdur.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newest.map((p: any, i: number) => (
                <PropertyCard
                  key={p.id}
                  property={toCardProps(p)}
                  tilt={i % 2 === 0 ? "left" : "right"}
                  currentUserId={user?.id ?? null}
                  favorited={favoritedIds.has(p.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {premium && premium.length > 0 && (
        <section className="pt-14 pb-16">
          <div className="max-w-[1120px] mx-auto px-7">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="font-display text-2xl font-medium">{t.premium}</h2>
              <a href="/elanlar?premium=1" className="text-[13.5px] text-teal-deep border-b border-teal-deep">
                {t.seeAll}
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {premium.map((p: any, i: number) => (
                <PropertyCard
                  key={p.id}
                  property={toCardProps(p)}
                  tilt={i % 2 === 0 ? "left" : "right"}
                  currentUserId={user?.id ?? null}
                  favorited={favoritedIds.has(p.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-line py-7 text-[13px] text-ink-soft">
        <div className="max-w-[1120px] mx-auto px-7 flex justify-between">
          <span>© 2026 RentHome AZ</span>
          <span>Mingəçevir, Azərbaycan</span>
        </div>
      </footer>
    </>
  );
}