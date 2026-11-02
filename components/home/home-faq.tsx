import Link from "next/link";
import { Plus } from "lucide-react";
import { faqs } from "@/lib/site";

export function HomeFaq() {
  return (
    <section className="container-x py-20 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div>
          <p className="eyebrow flex items-center gap-3 text-clay">
            <span className="h-px w-8 bg-clay/60" />
            Good to know
          </p>
          <h2 className="display mt-5 text-[36px] sm:text-[44px]">
            Little questions,
            <br />
            <em className="italic text-clay">answered.</em>
          </h2>
          <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-muted">
            Sizing, fabric, shipping or a gift — here are the things parents ask us most.
          </p>
          <Link href="/faq" className="link-line mt-7 text-ink">
            All FAQs
          </Link>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {faqs.slice(0, 5).map((faq) => (
            <details key={faq.q} className="accordion group">
              <summary className="flex items-center justify-between gap-6 py-5">
                <span className="font-serif text-[17px] leading-snug text-ink sm:text-[19px]">
                  {faq.q}
                </span>
                <span className="accordion-icon flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-muted">
                  <Plus size={13} strokeWidth={1.5} />
                </span>
              </summary>
              <div className="accordion-body pb-5 pr-10 text-[13px] leading-[1.8] text-muted">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
