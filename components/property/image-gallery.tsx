"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ImageGallery({ images }: { images: { url: string }[] }) {
  const tCommon = useTranslations("common");
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="h-[220px] sm:h-[360px] rounded-xl bg-gradient-to-br from-[#cfd9c9] to-[#b9c4b3] flex items-center justify-center text-sm text-ink-soft">
        {tCommon("noImage")}
      </div>
    );
  }

  function prev() {
    setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  }
  function next() {
    setActive((i) => (i === images.length - 1 ? 0 : i + 1));
  }

  return (
    <div>
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active].url}
          alt=""
          className="w-full h-[220px] sm:h-[360px] object-cover rounded-xl"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur text-ink flex items-center justify-center shadow hover:bg-white"
              aria-label="Əvvəlki şəkil"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur text-ink flex items-center justify-center shadow hover:bg-white"
              aria-label="Növbəti şəkil"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-2 right-2 bg-ink/60 text-white text-[11px] px-2 py-0.5 rounded-full">
              {active + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto mt-3 pb-1">
          {images.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={img.url}
              alt=""
              onClick={() => setActive(i)}
              className={`w-16 h-14 sm:w-20 sm:h-16 object-cover rounded-md cursor-pointer border-2 shrink-0 ${
                i === active ? "border-teal" : "border-transparent"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
