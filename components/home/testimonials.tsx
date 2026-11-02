import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { testimonials } from "@/lib/site";
import { Stars } from "@/components/ui/stars";
import { SectionHeading } from "@/components/ui/section-heading";

export function Testimonials() {
  return (
    <section className="bg-cream py-20 sm:py-24 lg:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Notes from the nursery"
          title={
            <>
              Loved by the people
              <br />
              who <em className="italic text-clay">hold them closest.</em>
            </>
          }
          align="center"
          className="mb-12"
        />

        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.slice(0, 3).map((t) => (
            <figure
              key={t.name}
              className="relative flex flex-col border border-line bg-white/40 p-7 transition-colors hover:border-ink/20 sm:p-8"
            >
              <Quote size={26} strokeWidth={1} className="text-clay/50" />
              <blockquote className="mt-5 flex-1 font-serif text-[18px] font-light leading-[1.6] text-ink">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <figcaption className="mt-7 flex items-center justify-between border-t border-line pt-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-[10px] font-medium text-ink">
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-[11.5px] font-medium">{t.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-muted">
                      {t.city} · {t.product}
                    </p>
                  </div>
                </div>
                <Stars rating={t.rating} size={11} />
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-9 flex flex-col items-center justify-between gap-4 border-t border-line pt-7 sm:flex-row">
          <div className="flex items-center gap-3">
            <Stars rating={5} size={14} />
            <span className="text-[11px] text-muted">
              4.9 / 5 from 1,200+ happy parents across India
            </span>
          </div>
          <Link href="/shop" className="link-line text-[10px]">
            Find your favourites <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
