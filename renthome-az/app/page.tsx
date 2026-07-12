import { SiteHeader } from "@/components/layout/site-header";
import { PropertyCard } from "@/components/property/property-card";

// Bu, sadəcə UI üçün nümunə datadır - real versiyada Supabase-dən gələcək
const yeniElanlar = [
  { id: "1", title: "2 otaqlı, Nəsimi r.", price: 650, is_premium: false, rooms: 2, floor: 4, total_floors: 9, cityName: "Bakı", districtName: "28 May m.", tags: ["Təmirli", "Əşyalı", "Lift"] },
  { id: "2", title: "1 otaqlı studiya", price: 380, is_premium: false, rooms: 1, floor: 2, total_floors: 5, cityName: "Bakı", districtName: "Yasamal r.", tags: ["Təmirsiz", "Balkon"] },
  { id: "3", title: "3 otaqlı həyət evi", price: 520, is_premium: false, rooms: 3, floor: null, total_floors: null, cityName: "Sumqayıt", districtName: "6-cı mikrorayon", tags: ["Əşyalı", "Kommunal daxil"] },
];

const premiumElanlar = [
  { id: "4", title: "4 otaqlı, dəniz mənzərəli", price: 1450, is_premium: true, rooms: 4, floor: 12, total_floors: 16, cityName: "Bakı", districtName: "Badamdar", tags: ["Təmirli", "Lift", "Yeni tikili"] },
  { id: "5", title: "2 otaqlı, tam təmirli", price: 890, is_premium: true, rooms: 2, floor: 5, total_floors: 9, cityName: "Bakı", districtName: "Səbail r.", tags: ["Əşyalı", "Kommunal daxil"] },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <section className="pt-16 pb-10">
        <div className="max-w-[1120px] mx-auto px-7">
          <h1 className="font-display font-medium text-[46px] leading-[1.12] tracking-tight max-w-xl">
            Şəhərini seç.
            <br />
            Evini <em className="italic text-brick not-italic font-medium">tap</em>.
          </h1>
          <p className="mt-3.5 text-[16.5px] text-ink-soft max-w-md">
            Bakı, Gəncə, Sumqayıt və digər şəhərlərdə minlərlə yoxlanılmış icarə
            elanı — vasitəçisiz, birbaşa ev sahibi ilə əlaqə.
          </p>

          <form className="mt-8 bg-paper border border-line rounded-2xl p-4.5 grid grid-cols-1 md:grid-cols-5 gap-3.5 items-end">
            <div>
              <label className="block text-xs text-ink-soft mb-1.5 font-medium">Şəhər</label>
              <select className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm">
                <option>Bütün şəhərlər</option>
                <option>Bakı</option>
                <option>Gəncə</option>
                <option>Sumqayıt</option>
                <option>Mingəçevir</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-ink-soft mb-1.5 font-medium">Qiymət aralığı (₼)</label>
              <select className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm">
                <option>Hamısı</option>
                <option>0 – 300</option>
                <option>300 – 600</option>
                <option>600 – 1000</option>
                <option>1000+</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-ink-soft mb-1.5 font-medium">Otaq sayı</label>
              <select className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm">
                <option>Fərq etməz</option>
                <option>1 otaq</option>
                <option>2 otaq</option>
                <option>3 otaq</option>
                <option>4+ otaq</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-ink-soft mb-1.5 font-medium">Ev tipi</label>
              <select className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm">
                <option>Hamısı</option>
                <option>Mənzil</option>
                <option>Həyət evi</option>
                <option>Ofis</option>
              </select>
            </div>
            <button className="bg-brick hover:bg-brick-deep text-white rounded-lg px-5 py-2.5 text-sm font-medium">
              Axtar
            </button>
          </form>
        </div>
      </section>

      <section className="pt-12">
        <div className="max-w-[1120px] mx-auto px-7">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-display text-2xl font-medium">Ən yeni elanlar</h2>
            <a href="/elanlar" className="text-[13.5px] text-teal-deep border-b border-teal-deep">
              Hamısına bax →
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
            <h2 className="font-display text-2xl font-medium">Premium elanlar</h2>
            <a href="/elanlar?premium=1" className="text-[13.5px] text-teal-deep border-b border-teal-deep">
              Hamısına bax →
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
