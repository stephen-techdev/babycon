import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Feather, Heart, RotateCcw, Sprout, Truck } from "lucide-react";
import { usps, valuePoints } from "@/lib/site";

const ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  truck: Truck,
  feather: Feather,
  rotate: RotateCcw,
  heart: Heart,
  sprout: Sprout,
};

export function TrustStrip() {
  return (
    <section className="border-y border-line bg-cream">
      <div className="container-x grid grid-cols-2 divide-line sm:grid-cols-4 sm:divide-x">
        {usps.map((usp) => {
          const Icon = ICONS[usp.icon] || Heart;
          return (
            <div
              key={usp.title}
              className="flex items-center gap-3 py-5 sm:justify-center sm:px-4 sm:py-6"
            >
              <Icon size={18} strokeWidth={1.2} className="shrink-0 text-clay" />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink">
                  {usp.title}
                </p>
                <p className="mt-0.5 hidden text-[10.5px] text-muted sm:block">
                  {usp.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function BrandStory() {
  return (
    <section className="relative overflow-hidden bg-sand/60 py-20 sm:py-24 lg:py-28" id="fabric">
      <div className="container-x">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand sm:aspect-[5/5]">
              <Image
                src="/images/banners/story.jpg"
                alt="Softly folded baby essentials in natural tones"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-2 hidden w-[190px] bg-forest p-6 text-cream sm:block lg:-right-8 lg:w-[220px]">
              <p className="font-serif text-[38px] font-light leading-none text-clay">4.9</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-cream/50">
                from 1,200+ parents
              </p>
              <div className="mt-4 h-px w-full bg-cream/15" />
              <p className="mt-4 text-[10.5px] leading-relaxed text-cream/60">
                Small-batch essentials, made to be kept.
              </p>
            </div>
          </div>

          <div>
            <p className="eyebrow flex items-center gap-3 text-clay">
              <span className="h-px w-8 bg-clay/60" />
              Our promise
            </p>
            <h2 className="display mt-5 text-[38px] sm:text-[46px] lg:text-[54px]">
              Made slowly.
              <br />
              <em className="italic text-clay">Loved for years.</em>
            </h2>
            <p className="mt-5 max-w-lg text-[14px] leading-[1.85] text-muted">
              Babycon began with a simple frustration: beautiful baby clothes that felt
              lovely on the hanger but rough against a newborn&apos;s skin. We set out to make
              the alternative — pieces that are as gentle as they are beautiful.
            </p>
            <p className="mt-4 max-w-lg text-[14px] leading-[1.85] text-muted">
              Every collection starts with the fabric. Premium muslin, gentle cottons,
              considered details — checked by hand, made in small batches, designed to be
              passed on.
            </p>

            <div className="mt-8 space-y-5">
              {valuePoints.map((point, i) => (
                <div key={point.title} className="flex gap-4 border-t border-line pt-5">
                  <span className="font-serif text-[13px] italic text-clay">0{i + 1}</span>
                  <div>
                    <h3 className="font-serif text-[19px] font-normal">{point.title}</h3>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
                      {point.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/pages/about" className="link-line mt-8 text-ink">
              Read our story <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
