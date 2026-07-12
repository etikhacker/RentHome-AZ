import { Heart } from "lucide-react";
import type { Property } from "@/lib/types";

type Props = {
  property: Pick<
    Property,
    "id" | "title" | "price" | "rooms" | "floor" | "total_floors" | "is_premium"
  > & { cityName?: string; districtName?: string; tags?: string[] };
  tilt?: "left" | "right";
};

export function PropertyCard({ property, tilt = "left" }: Props) {
  const rotation = tilt === "left" ? "-rotate-[0.6deg]" : "rotate-[0.5deg]";

  return (
    <a
      href={`/elan/${property.id}`}
      className={`card-pin relative block bg-paper border border-line p-3.5 pb-4
        transition-transform duration-300 hover:-translate-y-1
        shadow-[0_1px_1px_rgba(22,48,44,0.06),0_8px_16px_-6px_rgba(22,48,44,0.16),0_20px_30px_-18px_rgba(22,48,44,0.18)]
        ${rotation}`}
    >
      {property.is_premium && (
        <span className="absolute top-2.5 right-2.5 z-10 bg-gold text-white text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide">
          PREMIUM
        </span>
      )}

      <div className="h-[150px] rounded mb-3 bg-gradient-to-br from-[#cfd9c9] to-[#b9c4b3] flex items-center justify-center text-xs text-ink-soft">
        şəkil
      </div>

      <h3 className="text-[15.5px] font-semibold mb-1">{property.title}</h3>
      <p className="text-[12.5px] text-ink-soft mb-2.5">
        {property.districtName ?? ""} {property.cityName ? `, ${property.cityName}` : ""}
        {property.floor && property.total_floors
          ? ` · ${property.floor}/${property.total_floors} mərtəbə`
          : ""}
      </p>

      {property.tags && property.tags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-3">
          {property.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] text-ink-soft border border-line px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-dashed border-line pt-2.5">
        <span className="font-mono text-[15px] font-medium text-brick">
          {property.price} ₼
          <small className="font-sans text-[11px] text-ink-soft"> /ay</small>
        </span>
        <Heart size={16} className="text-ink-soft" />
      </div>
    </a>
  );
}
