import { SiteHeader } from "@/components/layout/site-header";
import { PropertyCard } from "@/components/property/property-card";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionary";

// Bu, sadəcə UI üçün nümunə datadır - real versiyada Supabase-dən gələcək
const yeniElanlar = [
  { id: "1", title: "2 otaqlı, Nəsimi r.", price: 650, is_premium: false, floor: 4, total_floors: 9, cityName: "Bakı", districtName: "28 May m.", is_renovated: true, is_furnished: true, has_elevator: true, has_balcony: false, utilities_included: false },
  { id: "2", title: "1 otaqlı studiya", price: 380, is_premium: false, floor: 2, total_floors: 5, cityName: "Bakı", districtName: "Yasamal r.", is_renovated: false, is_furnished: false, has_elevator: false, has_balcony: true, utilities_included: false },
  { id: "3", title: "3 otaqlı həyət evi", price: 520, is_premium: false, floor: null, total_floors: null, cityName: "Sumqayıt", districtName: "6-cı mikrorayon", is_renovated: false, is_furnished: true, has_elevator: false, has_balcony: false, utilities_included: true },
];

const premiumElanlar = [
  { id: "4", title: "4 otaqlı, dəniz mənzərəli", price: 1450, is_premium: true, floor: 12, total_floors: 16, cityName: "Bakı", districtName: "Badamdar", is_renovated: true, is_furnished: false, has_elevator: true, has_balcony: true, utilities_included: false },
  { id: "5", title: "2 otaqlı, tam təmirli", price: 890, is_premium: true, floor: 5, total_floors: 9, cityName: "Bakı", districtName: "Səbail r.", is_renovated: true, is_furnished: true, has_elevator: false, has_balcony: false, utilities_included: true },
];

export default function HomePage() {
  const locale = getLocale();
  const t = getDictionary(locale).home;

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

          <form className="mt-8 bg-paper border border-line rounded-2xl p-4.5 grid grid-cols-1 md:grid-cols-5 gap-3.5 items-end">
            <div>
              <label className="block text-xs text-ink-soft mb-1.5 font-medium">{t.city}</label>
              <select className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm">
                <option>{t.allCities}</option>
                <option>Bakı</option>
                <option>Gəncə</option>
                <option>Sumqayıt</option>
                <option>Mingəçevir</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-ink-soft mb-1.5 font-medium">{t.priceRange}</label>
              <select className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm">
                <option>{t.all}</option>
                <option>0 – 300</option>
                <option>300 – 600</option>
                <option>600 – 1000</option>
                <option>1000+</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-ink-soft mb-1.5 font-medium">{t.rooms}</label>
              <select className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm">
                <option>{t.anyRooms}</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4+</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-ink-soft mb-1.5 font-medium">{t.propertyType}</label>
              <select className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm">
                <option>{t.all}</option>
                <option>Mənzil</option>
                <option>Həyət evi</option>
                <option>Ofis</option>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {yeniElanlar.map((p, i) => (
              <PropertyCard key={p.id} property={p} tilt={i % 2 === 0 ? "left" : "right"} />
            ))}
          </div>
        </div>
      </section>

      <section className="pt-14 pb-16">
        <div className="max-w-[1120px] mx-auto px-7">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-display text-2xl font-medium">{t.premium}</h2>
            <a href="/elanlar?premium=1" className="text-[13.5px] text-teal-deep border-b border-teal-deep">
              {t.seeAll}
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {premiumElanlar.map((p, i) => (
              <PropertyCard key={p.id} property={p} tilt={i % 2 === 0 ? "left" : "right"} />
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-line py-7 text-[13px] text-ink-soft">
        <div className="max-w-[1120px] mx-auto px-7 flex justify-between">
          <span>© 2026 RentHome AZ</span>
          <span>Mingəçevir, Azərbaycan</span>
        </div>
      </footer>
    </>
  );
}