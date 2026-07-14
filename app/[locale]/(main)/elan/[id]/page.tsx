import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/site-header";
import { PropertyCard } from "@/components/property/property-card";
import { ImageGallery } from "@/components/property/image-gallery";
import { ContactOwnerBox } from "@/components/property/contact-owner-box";

type Props = { params: Promise<{ id: string; locale: string }> };

export default async function ElanDetayPage({ params }: Props) {
  const { id, locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("listing");
  const tFeatures = await getTranslations("features");
  const tCommon = await getTranslations("common");

  const supabase = createClient();

  const { data: property } = await supabase
    .from("properties")
    .select(
      `*, cities ( name ), districts ( name ),
       property_images ( url, sort_order ),
       profiles ( id, full_name, avatar_url, phone )`
    )
    .eq("id", id)
    .single();

  if (!property) notFound();

  // baxış sayğacını artır (nəticəni gözləməyə ehtiyac yoxdur)
  supabase.rpc("increment_view_count", { prop_id: id });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: similar } = await supabase
    .from("properties")
    .select(
      `id, title, price, floor, total_floors, is_premium, is_renovated,
       is_furnished, has_elevator, has_balcony, utilities_included,
       cities ( name ), districts ( name ), property_images ( url, sort_order )`
    )
    .eq("city_id", property.city_id)
    .eq("status", "tesdiqlendi")
    .neq("id", property.id)
    .limit(3);

  const images = [...(property.property_images ?? [])].sort(
    (a: any, b: any) => a.sort_order - b.sort_order
  );

  const owner = property.profiles as any;
  const cityName = (property.cities as any)?.name;
  const districtName = (property.districts as any)?.name;

  const featureKeys = [
    "is_renovated",
    "is_furnished",
    "has_balcony",
    "has_elevator",
    "utilities_included",
  ] as const;

  return (
    <>
      <SiteHeader />

      <div className="max-w-[1120px] mx-auto px-7 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ImageGallery images={images} />

            <div className="mt-6">
              <h1 className="font-display text-[28px] font-medium mb-1">{property.title}</h1>
              <p className="text-sm text-ink-soft mb-4">
                {districtName ? `${districtName}, ` : ""}
                {cityName} · {property.address}
              </p>

              {property.map_url && (
                <a
                  href={property.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-teal-deep border-b border-teal-deep mb-4"
                >
                  {t("mapLink")}
                </a>
              )}

              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-mono text-2xl font-medium text-brick">
                  {property.price} {tCommon("currency")}
                </span>
                <span className="text-sm text-ink-soft">{tCommon("perMonth")}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6 text-sm">
                <Stat label={t("rooms")} value={String(property.rooms)} />
                <Stat label={t("area")} value={`${property.area_m2} m²`} />
                <Stat
                  label={t("floor")}
                  value={
                    property.floor && property.total_floors
                      ? `${property.floor}/${property.total_floors}`
                      : "—"
                  }
                />
              </div>

              <h2 className="font-display text-lg font-medium mb-2">{t("aboutTitle")}</h2>
              <p className="text-sm text-ink-soft leading-relaxed mb-6 whitespace-pre-line">
                {property.description || t("noDescription")}
              </p>

              <h2 className="font-display text-lg font-medium mb-2">{t("featuresTitle")}</h2>
              <div className="flex flex-wrap gap-2 mb-8">
                {featureKeys
                  .filter((key) => property[key])
                  .map((key) => (
                    <span
                      key={key}
                      className="text-xs text-ink-soft border border-line px-3 py-1.5 rounded-full"
                    >
                      {tFeatures(key)}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <ContactOwnerBox
              propertyId={property.id}
              ownerId={property.owner_id}
              ownerPhone={property.phone}
              ownerWhatsapp={property.whatsapp}
              currentUserId={user?.id ?? null}
            />

            <div className="bg-paper border border-line rounded-2xl p-5">
              <h3 className="font-display text-lg font-medium mb-2">{t("ownerBoxTitle")}</h3>
              <p className="text-sm font-medium">{owner?.full_name ?? t("ownerFallback")}</p>
            </div>
          </div>
        </div>

        {similar && similar.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-2xl font-medium mb-5">{t("similar")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similar.map((p: any, i: number) => {
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
                      cityName: (p.cities as any)?.name,
                      districtName: (p.districts as any)?.name,
                      thumbnailUrl: sorted[0]?.url ?? null,
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-paper border border-line rounded-lg py-2.5 text-center">
      <div className="font-mono font-medium">{value}</div>
      <div className="text-[11px] text-ink-soft">{label}</div>
    </div>
  );
}
