"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  title,
  badge,
}: {
  images: string[];
  title: string;
  badge?: string | null;
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const safeImages = images.length ? images : ["/images/banners/story.jpg"];

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % safeImages.length);
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + safeImages.length) % safeImages.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, safeImages.length]);

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row-reverse sm:gap-4">
        <div className="relative flex-1">
          <div className="group relative aspect-[4/5] w-full overflow-hidden bg-sand">
            <Image
              key={safeImages[active]}
              src={safeImages[active]}
              alt={`${title} — image ${active + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="animate-fade-in object-cover"
            />
            {badge && (
              <span className="badge absolute left-4 top-4 bg-cream/95 text-ink backdrop-blur">
                {badge}
              </span>
            )}
            <button
              onClick={() => setLightbox(true)}
              aria-label="Expand image"
              className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-ink backdrop-blur transition-colors hover:bg-ink hover:text-cream"
            >
              <Expand size={15} strokeWidth={1.5} />
            </button>
            {safeImages.length > 1 && (
              <>
                <button
                  onClick={() => setActive((i) => (i - 1 + safeImages.length) % safeImages.length)}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cream/80 text-ink opacity-0 backdrop-blur transition-opacity hover:bg-cream group-hover:opacity-100"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setActive((i) => (i + 1) % safeImages.length)}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cream/80 text-ink opacity-0 backdrop-blur transition-opacity hover:bg-cream group-hover:opacity-100"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        {safeImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar sm:w-[76px] sm:flex-col sm:overflow-visible">
            {safeImages.map((image, i) => (
              <button
                key={image + i}
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                className={cn(
                  "relative h-[72px] w-[58px] shrink-0 overflow-hidden border transition-all sm:h-[92px] sm:w-full",
                  i === active ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                <Image src={image} alt={`${title} thumbnail ${i + 1}`} fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-ink/95 p-4">
          <button
            onClick={() => setLightbox(false)}
            aria-label="Close gallery"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center border border-cream/30 text-cream transition-colors hover:bg-cream hover:text-ink"
          >
            <X size={18} />
          </button>
          <button
            onClick={() => setActive((i) => (i - 1 + safeImages.length) % safeImages.length)}
            aria-label="Previous"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/70 hover:text-cream"
          >
            <ChevronLeft size={30} />
          </button>
          <div className="relative h-[82vh] w-full max-w-3xl">
            <Image
              src={safeImages[active]}
              alt={title}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
          <button
            onClick={() => setActive((i) => (i + 1) % safeImages.length)}
            aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/70 hover:text-cream"
          >
            <ChevronRight size={30} />
          </button>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-cream/50">
            {active + 1} / {safeImages.length}
          </p>
        </div>
      )}
    </>
  );
}
