"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { heroSlides } from "@/lib/site";

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((index: number) => {
    setActive((index + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => {
      setActive((i) => (i + 1) % heroSlides.length);
    }, 7000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused]);

  return (
    <section
      className="relative h-[82vh] min-h-[580px] w-full overflow-hidden bg-ink sm:h-[76vh] sm:min-h-[620px] lg:h-[78vh] lg:max-h-[860px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Featured collections"
    >
      {heroSlides.map((slide, i) => (
        <div
          key={slide.title + i}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
            i === active ? "z-10 opacity-100" : "z-0 opacity-0"
          }`}
          aria-hidden={i !== active}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover transition-transform duration-[8000ms] ease-out ${
                i === 0
                  ? "scale-[1.35] object-[50%_72%] sm:scale-100 sm:object-center"
                  : "scale-100 object-center"
              } ${i === active ? "sm:scale-[1.04]" : "sm:scale-100"}`}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/45 to-ink/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/10" />

          <div className="container-x relative z-10 flex h-full flex-col justify-end pb-20 sm:justify-center sm:pb-0">
            <div className="max-w-[640px] text-cream">
              <p
                className={`eyebrow flex items-center gap-3 text-cream/70 transition-all delay-200 duration-700 ${
                  i === active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <span className="h-px w-8 bg-clay" />
                {slide.eyebrow}
              </p>
              <h1
                className={`display mt-5 text-[54px] leading-[0.94] text-cream transition-all delay-300 duration-700 sm:text-[72px] lg:text-[92px] ${
                  i === active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
              >
                {slide.title}
                <br />
                <em className="font-light italic text-blush">{slide.titleAccent}</em>
              </h1>
              <p
                className={`mt-6 max-w-[430px] text-[13.5px] leading-[1.8] text-cream/75 transition-all delay-500 duration-700 sm:text-[14.5px] ${
                  i === active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                {slide.description}
              </p>
              <div
                className={`mt-8 flex flex-wrap items-center gap-3 transition-all delay-700 duration-700 ${
                  i === active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <Link href={slide.cta.href} className="btn-light group">
                  {slide.cta.label}
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href={slide.secondary.href}
                  className="link-line hidden border-b border-cream/40 pb-1 text-cream sm:inline-flex"
                >
                  {slide.secondary.label}
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          </div>

          <p className="absolute bottom-8 right-6 z-10 hidden text-[9px] uppercase tracking-[0.28em] text-cream/50 sm:block lg:right-12">
            {slide.caption}
          </p>
        </div>
      ))}

      {/* Hero footer controls */}
      <div className="container-x absolute inset-x-0 bottom-5 z-20 sm:bottom-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="font-serif text-[12px] text-cream/70">
              0{active + 1} <span className="text-cream/30">/</span> 0{heroSlides.length}
            </span>
            <div className="flex items-center gap-1.5">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="group py-2"
                >
                  <span
                    className={`block h-[2px] transition-all duration-500 ${
                      i === active ? "w-9 bg-cream" : "w-4 bg-cream/30 group-hover:bg-cream/60"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => go(active - 1)}
              aria-label="Previous slide"
              className="flex h-9 w-9 items-center justify-center border border-cream/25 text-cream transition-colors hover:border-cream hover:bg-cream hover:text-ink"
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => go(active + 1)}
              aria-label="Next slide"
              className="flex h-9 w-9 items-center justify-center border border-cream/25 text-cream transition-colors hover:border-cream hover:bg-cream hover:text-ink"
            >
              <ArrowRight size={14} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
