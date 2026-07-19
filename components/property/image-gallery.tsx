"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";

type Media = { url: string; media_type?: string };

export function ImageGallery({ images }: { images: Media[] }) {
  const tCommon = useTranslations("common");
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/5] sm:aspect-[4/3] rounded-xl bg-gradient-to-br from-[#cfd9c9] to-[#b9c4b3] flex items-center justify-center text-sm text-ink-soft overflow-hidden">
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
        {images[active].media_type === "video" ? (
          <video
            src={images[active].url}
            controls
            className="w-full aspect-[4/5] sm:aspect-[4/3] object-cover sm:object-contain rounded-xl bg-black"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="block w-full cursor-zoom-in"
            aria-label="Böyüt"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[active].url}
              alt=""
              className="w-full aspect-[4/5] sm:aspect-[4/3] object-cover sm:object-contain rounded-xl bg-ink/5"
            />
          </button>
        )}

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
            <div key={i} className="relative shrink-0">
              {img.media_type === "video" ? (
                <video
                  src={img.url}
                  onClick={() => setActive(i)}
                  className={`w-16 h-14 sm:w-20 sm:h-16 object-cover rounded-md cursor-pointer border-2 ${
                    i === active ? "border-teal" : "border-transparent"
                  }`}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img.url}
                  alt=""
                  onClick={() => setActive(i)}
                  className={`w-16 h-14 sm:w-20 sm:h-16 object-cover rounded-md cursor-pointer border-2 ${
                    i === active ? "border-teal" : "border-transparent"
                  }`}
                />
              )}
              {img.media_type === "video" && (
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="w-5 h-5 rounded-full bg-black/50 flex items-center justify-center text-white text-[10px]">
                    ▶
                  </span>
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <Lightbox
          images={images}
          active={active}
          onClose={() => setLightboxOpen(false)}
          onPrev={prev}
          onNext={next}
        />
      )}
    </div>
  );
}

function Lightbox({
  images,
  active,
  onClose,
  onPrev,
  onNext,
}: {
  images: Media[];
  active: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => setZoom(1), [active]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, []);

  function zoomIn() {
    setZoom((z) => Math.min(z + 0.5, 4));
  }
  function zoomOut() {
    setZoom((z) => Math.max(z - 0.5, 1));
  }
  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  }
  function handleDoubleClick() {
    setZoom((z) => (z > 1 ? 1 : 2));
  }

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
        aria-label="Bağla"
      >
        <X size={22} />
      </button>

      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={zoomOut}
          disabled={zoom <= 1}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white flex items-center justify-center"
          aria-label="Kiçilt"
        >
          <ZoomOut size={20} />
        </button>
        <button
          onClick={zoomIn}
          disabled={zoom >= 4}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white flex items-center justify-center"
          aria-label="Böyüt"
        >
          <ZoomIn size={20} />
        </button>
        <span className="h-10 px-3 rounded-full bg-white/10 text-white text-sm flex items-center">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            aria-label="Əvvəlki şəkil"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            aria-label="Növbəti şəkil"
          >
            <ChevronRight size={22} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-white/10 text-white text-xs px-3 py-1 rounded-full">
            {active + 1} / {images.length}
          </div>
        </>
      )}

      <div
        className="w-full h-full overflow-auto flex items-center justify-center"
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active].url}
          alt=""
          draggable={false}
          style={{
            transform: `scale(${zoom})`,
            transition: "transform 0.15s ease-out",
            cursor: zoom > 1 ? "grab" : "zoom-in",
          }}
          className="max-w-full max-h-full object-contain select-none"
        />
      </div>
    </div>,
    document.body
  );
}
