import Link from "next/link";
import { FavoriteButton } from "./favorite-button";

type Props = {
  property: {
    id: string;
    title: string;
    price: number;
    floor: number | null;
    total_floors: number | null;
    is_premium: boolean;
    is_renovated: boolean;
    is_furnished: boolean;
    has_elevator: boolean;
    has_balcony: boolean;
    utilities_included: boolean;
    cityName?: string;
    districtName?: string;
    thumbnailUrl?: string | null;
  };
  tilt?: "left" | "right";
  currentUserId?: string | null;
  favorited?: boolean;
};

function buildTags(p: Props["property"]) {
  const tags: string[] = [];
  tags.push(p.is_renovated ? "Təmirli" : "Təmirsiz");
  if (p.is_furnished) tags.push("Əşyalı");
  if (p.has_elevator) tags.push("Lift");
  if (p.has_balcony) tags.push("Balkon");
  if (p.utilities_included) tags.push("Kommunal daxil");
  return tags;
}

export function PropertyCard({ property, tilt = "left", currentUserId, favorited }: Props) {
  const rotation = tilt === "left" ? "-rotate-[0.6deg]" : "rotate-[0.5deg]";
  const tags = buildTags(property);

  return (
    <div
      className={`card-pin relative bg-paper border border-line p-3.5 pb-4
        transition-transform duration-300 hover:-translate-y-1
        shadow-[0_1px_1px_rgba(22,48,44,0.06),0_8px_16px_-6px_rgba(22,48,44,0.16),0_20px_30px_-18px_rgba(22,48,44,0.18)]
        ${rotation}`}
    >
      {property.is_premium && (
        <span className="absolute top-2.5 right-2.5 z-10 bg-gold text-white text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide">
          PREMIUM
        </span>
      )}

      <Link href={`/elan/${property.id}`} className="block">
        <div className="h-[150px] rounded mb-3 bg-gradient-to-br from-[#cfd9c9] to-[#b9c4b3] flex items-center justify-center text-xs text-ink-soft overflow-hidden">
          {property.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={property.thumbnailUrl} alt={property.title} className="w-full h-full object-cover" />
          ) : (
            "şəkil"
          )}
        </div>

        <h3 className="text-[15.5px] font-semibold mb-1">{property.title}</h3>
        <p className="text-[12.5px] text-ink-soft mb-2.5">
          {property.districtName ?? ""} {property.cityName ? `, ${property.cityName}` : ""}
          {property.floor && property.total_floors
            ? ` · ${property.floor}/${property.total_floors} mərtəbə`
            : ""}
        </p>

        {tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] text-ink-soft border border-line px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>

      <div className="flex items-center justify-between border-t border-dashed border-line pt-2.5">
        <span className="font-mono text-[15px] font-medium text-brick">
          {property.price} ₼
          <small className="font-sans text-[11px] text-ink-soft"> /ay</small>
        </span>
        <FavoriteButton
          propertyId={property.id}
          currentUserId={currentUserId}
          initialFavorited={favorited}
        />
      </div>
    </div>
  );
}