import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/site-header";
import { PropertyCard } from "@/components/property/property-card";
import { ImageGallery } from "@/components/property/image-gallery";
import { ContactOwnerBox } from "@/components/property/contact-owner-box";

const featureLabels: { key: string; label: string }[] = [
  { key: "is_renovated", label: "Təmirli" },
  { key: "is_furnished", label: "Əşyalı" },
  { key: "has_balcony", label: "Balkon var" },
  { key: "has_elevator", label: "Lift var" },
  { key: "utilities_included", label: "Kommunal daxildir" },
];

export default async function ElanDetayPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [{ data: property }, { data: { user } }] = await Promise.all([
    supabase
      .from("properties")
      .select(
        `*, cities ( name ), districts ( name ),
         property_images ( url, sort_order, media_type ),
         profiles ( id, full_name, avatar_url, phone )`
      )
      .eq("id", params.id)
      .single(),
    supabase.auth.getUser(),
  ]);

  if (!property) notFound();

  // baxış sayğacını artır (nəticəni gözləməyə ehtiyac yoxdur)
  supabase.rpc("increment_view_count", { prop_id: params.id });

  const { data: similar } = await supabase
    .from("properties")
    .select(
      `id, title, price, floor, total_floors, is_premium, is_renovated,
       is_furnished, has_elevator, has_balcony, utilities_included,
       cities ( name ), districts ( name ), property_images ( url, sort_order, media_type )`
    )
    .eq("city_id", property.city_id)
    .eq("status", "tesdiqlendi")
    .neq("id", property.id)
    .limit(3);

  let favoritedIds = new Set<string>();
  if (user && similar && similar.length > 0) {
    const { data: favs } = await supabase
      .from("favorites")
      .select("property_id")
      .eq("user_id", user.id)
      .in("property_id", similar.map((p: any) => p.id));
    favoritedIds = new Set((favs ?? []).map((f) => f.property_id));
  }

  const images = [...(property.property_images ?? [])].sort(
    (a: any, b: any) => a.sort_order - b.sort_order
  );

  const owner = property.profiles as any;
  const cityName = (property.cities as any)?.name;
  const districtName = (property.districts as any)?.name;

  return (
    <>
      <SiteHeader />

      <div className="max-w-[1120px] mx-auto px-4 sm:px-7 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <ImageGallery images={images} />

            <div className="mt-5 sm:mt-6">
              <h1 className="font-display text-[22px] sm:text-[28px] font-medium mb-1 leading-tight text-balance">{property.title}</h1>
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
                  📍 Xəritədə bax
                </a>
              )}

              <div className="flex items-baseline gap-2 mb-5 sm:mb-6">
                <span className="font-mono text-2xl font-medium text-brick">
                  {property.price} ₼
                </span>
                <span className="text-sm text-ink-soft">/ay</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-6 text-sm">
                <Stat label="Otaq" value={String(property.rooms)} />
                <Stat label="Sahə" value={`${property.area_m2} m²`} />
                <Stat
                  label="Mərtəbə"
                  value={
                    property.floor && property.total_floors
                      ? `${property.floor}/${property.total_floors}`
                      : "—"
                  }
                />
              </div>

              <h2 className="font-display text-lg font-medium mb-2">Ev haqqında</h2>
              <p className="text-sm text-ink-soft leading-relaxed mb-6 whitespace-pre-line">
                {property.description || "Təsvir əlavə edilməyib."}
              </p>

              <h2 className="font-display text-lg font-medium mb-2">Xüsusiyyətlər</h2>
              <div className="flex flex-wrap gap-2 mb-8">
                {featureLabels
                  .filter((f) => property[f.key])
                  .map((f) => (
                    <span
                      key={f.key}
                      className="text-xs text-ink-soft border border-line px-3 py-1.5 rounded-full"
                    >
                      {f.label}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-5">
            <ContactOwnerBox
              propertyId={property.id}
              ownerId={property.owner_id}
              ownerPhone={property.phone}
              ownerWhatsapp={property.whatsapp}
              currentUserId={user?.id ?? null}
            />

            <div className="bg-paper border border-line rounded-2xl p-4 sm:p-5">
              <h3 className="font-display text-lg font-medium mb-2">Ev sahibi</h3>
              <p className="text-sm font-medium">{owner?.full_name ?? "İstifadəçi"}</p>
            </div>
          </div>
        </div>

        {similar && similar.length > 0 && (
          <div className="mt-12 sm:mt-14">
            <h2 className="font-display text-xl sm:text-2xl font-medium mb-5">Oxşar elanlar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {similar.map((p: any, i: number) => {
                const sorted = [...(p.property_images ?? [])].sort(
                  (a: any, b: any) => a.sort_order - b.sort_order
                );
                return (
                  <PropertyCard
                    key={p.id}
                    tilt={i % 2 === 0 ? "left" : "right"}
                    currentUserId={user?.id ?? null}
                    favorited={favoritedIds.has(p.id)}
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
                    thumbnailType: sorted[0]?.media_type ?? null,
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
    <div className="bg-paper border border-line rounded-lg py-2.5 text-center px-1.5">
      <div className="font-mono font-medium text-sm sm:text-base">{value}</div>
      <div className="text-[10px] sm:text-[11px] text-ink-soft">{label}</div>
    </div>
  );
}
