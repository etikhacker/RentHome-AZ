import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/site-header";
import { PropertyCard } from "@/components/property/property-card";

type Props = { params: Promise<{ locale: string }> };

export default async function FavorilerimPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("favorites");
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect({ href: { pathname: "/giris", query: { next: "/favorilerim" } }, locale });

  const { data: favorites } = await supabase
    .from("favorites")
    .select(
      `property_id,
       properties (
         id, title, price, floor, total_floors, is_premium, is_renovated,
         is_furnished, has_elevator, has_balcony, utilities_included, status,
         cities ( name ), districts ( name ), property_images ( url, sort_order )
       )`
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const properties = (favorites ?? [])
    .map((f: any) => f.properties)
    .filter((p: any) => p && p.status === "tesdiqlendi");

  return (
    <>
      <SiteHeader />
      <div className="max-w-[1120px] mx-auto px-7 py-10">
        <h1 className="font-display text-2xl font-medium mb-6">{t("title")}</h1>

        {properties.length === 0 ? (
          <p className="text-sm text-ink-soft">
            {t("empty")}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((p: any, i: number) => {
              const sorted = [...(p.property_images ?? [])].sort(
                (a: any, b: any) => a.sort_order - b.sort_order
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
                    cityName: p.cities?.name,
                    districtName: p.districts?.name,
                    thumbnailUrl: sorted[0]?.url ?? null,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
