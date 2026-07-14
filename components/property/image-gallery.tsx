"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function ImageGallery({ images }: { images: { url: string }[] }) {
  const tCommon = useTranslations("common");
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="h-[360px] rounded-xl bg-gradient-to-br from-[#cfd9c9] to-[#b9c4b3] flex items-center justify-center text-sm text-ink-soft">
        {tCommon("noImage")}
      </div>
    );
  }

  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[active].url}
        alt=""
        className="w-full h-[360px] object-cover rounded-xl mb-3"
      />
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={img.url}
              alt=""
              onClick={() => setActive(i)}
              className={`w-20 h-16 object-cover rounded-md cursor-pointer border-2 ${
                i === active ? "border-teal" : "border-transparent"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
