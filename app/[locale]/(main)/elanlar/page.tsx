import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/site-header";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyFilters } from "@/components/property/property-filters";

type SearchParams = {
  city?: string;
  min_price?: string;
  max_price?: string;
  rooms?: string;
  renovated?: string;
  furnished?: string;
  elevator?: string;
};

type Props = {
  searchParams: SearchParams;
  params: Promise<{ locale: string }>;
};

export default async function ElanlarPage({ searchParams, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("listings");
  const supabase = createClient();

  const { data: cities } = await supabase
    .from("cities")
    .select("id, name")
    .order("name");

  let query = supabase
    .from("properties")
    .select(
      `id, title, price, floor, total_floors, is_premium, is_renovated,
       is_furnished, has_elevator, has_balcony, utilities_included,
       cities ( name ),
       districts ( name ),
       property_images ( url, sort_order )`
    )
    .eq("status", "tesdiqlendi")
    .order("created_at", { ascending: false });

  if (searchParams.city) query = query.eq("city_id", searchParams.city);
  if (searchParams.min_price) query = query.gte("price", Number(searchParams.min_price));
  if (searchParams.max_price) query = query.lte("price", Number(searchParams.max_price));
  if (searchParams.rooms) {
    const rooms = Number(searchParams.rooms);
    rooms >= 4 ? (query = query.gte("rooms", 4)) : (query = query.eq("rooms", rooms));
  }
  if (searchParams.renovated === "1") query = query.eq("is_renovated", true);
  if (searchParams.furnished === "1") query = query.eq("is_furnished", true);
  if (searchParams.elevator === "1") query = query.eq("has_elevator", true);

  const { data: properties, error } = await query;

  return (
    <>
      <SiteHeader />

      <section className="pt-10 pb-16">
        <div className="max-w-[1120px] mx-auto px-7">
          <h1 className="font-display text-2xl font-medium mb-6">{t("title")}</h1>

          <PropertyFilters cities={cities ?? []} searchParams={searchParams} />

          {error && (
            <p className="text-sm text-brick">{t("errorLoad")}</p>
          )}

          {!error && properties?.length === 0 && (
            <p className="text-sm text-ink-soft">
              {t("noResults")}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties?.map((p, i) => {
              const sortedImages = [...(p.property_images ?? [])].sort(
                (a, b) => a.sort_order - b.sort_order
              );
              return (
                <PropertyCard
                  key={p.id}
                  tilt={i % 2 === 0 ? "left" : "right"}
                  property={{
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
                    cityName: (p.cities as any)?.name,
                    districtName: (p.districts as any)?.name,
                    thumbnailUrl: sortedImages[0]?.url ?? null,
                  }}
                />
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
