import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function OfferBanner() {
  return (
    <section className="container-x pb-20 sm:pb-24">
      <div className="relative overflow-hidden bg-butter">
        <div className="pointer-events-none absolute -right-20 -top-24 h-[320px] w-[320px] rounded-full border border-ink/10" />
        <div className="pointer-events-none absolute -right-6 -top-10 h-[200px] w-[200px] rounded-full border border-ink/10" />
        <div className="pointer-events-none absolute -bottom-24 left-[8%] h-[260px] w-[260px] rounded-full bg-blush/50 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center px-6 py-14 text-center sm:px-12 sm:py-16 lg:py-20">
          <p className="eyebrow flex items-center gap-2 text-clay">
            <Sparkles size={13} /> A little welcome
          </p>
          <h2 className="display mt-4 max-w-[720px] text-[36px] leading-[1.02] sm:text-[50px] lg:text-[60px]">
            A softer start to
            <br />
            <em className="italic">every little day.</em>
          </h2>
          <p className="mt-5 max-w-md text-[13px] leading-relaxed text-ink/60 sm:text-[14px]">
            Enjoy 10% off your first order with code{" "}
            <span className="border border-ink/20 bg-cream/60 px-2 py-0.5 font-medium tracking-[0.14em] text-ink">
              WELCOME10
            </span>
            . Valid on orders over ₹999.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="/shop" className="btn-dark group">
              Shop the collection
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/collections/special-offers" className="link-line pb-1 text-ink">
              Explore offers
            </Link>
          </div>
          <p className="mt-6 text-[9px] uppercase tracking-[0.18em] text-ink/35">
            Demo store · test checkout · no real payment
          </p>
        </div>
      </div>
    </section>
  );
}
