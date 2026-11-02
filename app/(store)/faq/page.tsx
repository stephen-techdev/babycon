import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, Plus } from "lucide-react";
import { careSteps, faqs, site } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description:
    "Answers on fabrics, sizing, shipping, returns, cash on delivery, gifting and the Babycon demo checkout.",
  alternates: { canonical: "/faq" },
};

const GROUPS = [
  { title: "Product & fabric", range: [0, 3] },
  { title: "Orders & delivery", range: [3, 6] },
  { title: "Payment & returns", range: [6, 8] },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="border-b border-line bg-sand/50">
        <div className="container-x py-12 sm:py-16">
          <nav className="flex items-center gap-2 text-[9.5px] uppercase tracking-[0.16em] text-muted">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span>/</span>
            <span className="text-ink">FAQs</span>
          </nav>
          <div className="mt-7">
            <p className="eyebrow flex items-center gap-3 text-clay">
              <span className="h-px w-8 bg-clay/60" /> Good to know
            </p>
            <h1 className="display mt-4 max-w-2xl text-[44px] sm:text-[60px]">
              Little questions, <em className="italic text-clay">answered.</em>
            </h1>
            <p className="mt-4 max-w-lg text-[13.5px] leading-relaxed text-muted">
              Everything you might want to know about our fabrics, sizing, delivery and the little
              things in between. Still curious? Write to us.
            </p>
          </div>
        </div>
      </section>

      <section className="container-x py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
          <div>
            {GROUPS.map((group) => (
              <div key={group.title} className="mb-10 last:mb-0">
                <h2 className="mb-3 font-serif text-[25px] font-light">{group.title}</h2>
                <div className="divide-y divide-line border-y border-line">
                  {faqs.slice(group.range[0], group.range[1]).map((faq) => (
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
            ))}
          </div>

          <aside className="space-y-4">
            <div className="border border-line bg-sand/40 p-6">
              <p className="eyebrow text-clay">Fabric care</p>
              <h2 className="mt-3 font-serif text-[26px] font-light">
                A little care, <em className="italic text-clay">a longer life.</em>
              </h2>
              <div className="mt-5 space-y-4">
                {careSteps.map((step) => (
                  <div key={step.step} className="flex gap-3 border-t border-line pt-4 first:border-t-0 first:pt-0">
                    <span className="font-serif text-[12px] italic text-clay">{step.step}</span>
                    <div>
                      <p className="text-[12.5px] font-medium text-ink">{step.title}</p>
                      <p className="mt-1 text-[11.5px] leading-relaxed text-muted">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-line p-6">
              <p className="flex items-center gap-2 text-[9.5px] uppercase tracking-[0.16em] text-muted">
                <Mail size={12} className="text-clay" /> Still wondering?
              </p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                Our small team reads every message. Write to{" "}
                <a href={`mailto:${site.email}`} className="text-clay underline underline-offset-2">
                  {site.email}
                </a>{" "}
                and we&apos;ll reply within one working day.
              </p>
              <Link href="/contact" className="btn-outline btn-sm mt-4 w-full">
                Contact us <ArrowRight size={12} />
              </Link>
            </div>

            <div className="border border-line bg-forest p-6 text-cream">
              <p className="eyebrow text-clay">Good to know</p>
              <p className="mt-3 text-[12.5px] leading-relaxed text-cream/70">
                This storefront is a demonstration build. The Razorpay-style checkout is a
                simulation — no real money is charged. See our{" "}
                <Link href="/pages/terms" className="text-cream underline underline-offset-2">
                  terms
                </Link>{" "}
                for details.
              </p>
              <p className="mt-4 text-[9px] uppercase tracking-[0.16em] text-cream/40">
                {absoluteUrl("/faq").replace(/^https?:\/\//, "")}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
