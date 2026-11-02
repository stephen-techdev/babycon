import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Leaf, Mail, Scissors, Sparkles } from "lucide-react";
import { careSteps, pages, site, valuePoints } from "@/lib/site";

type Props = { params: Promise<{ handle: string }> };

const POLICY_LINKS = [
  { handle: "about", label: "Our story" },
  { handle: "shipping", label: "Shipping policy" },
  { handle: "refund", label: "Returns & refunds" },
  { handle: "privacy", label: "Privacy policy" },
  { handle: "terms", label: "Terms of service" },
];

export function generateStaticParams() {
  return Object.keys(pages).map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const page = pages[handle];
  if (!page) return { title: "Page not found" };
  return {
    title: page.title,
    description: page.intro,
    alternates: { canonical: `/pages/${handle}` },
    openGraph: {
      title: `${page.title} | Babycon`,
      description: page.intro,
      url: `/pages/${handle}`,
    },
  };
}

export default async function ContentPage({ params }: Props) {
  const { handle } = await params;
  const page = pages[handle];
  if (!page) notFound();

  if (handle === "about") {
    return (
      <>
        <section className="relative overflow-hidden bg-ink text-cream">
          <div className="absolute inset-0">
            <Image
              src="/images/banners/story.jpg"
              alt="Softly folded Babycon essentials"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-55"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
          </div>
          <div className="container-x relative z-10 flex min-h-[460px] flex-col justify-end py-14 sm:min-h-[540px] sm:py-20">
            <nav className="mb-8 flex items-center gap-2 text-[9.5px] uppercase tracking-[0.16em] text-cream/55">
              <Link href="/" className="hover:text-cream">Home</Link>
              <span>/</span>
              <span className="text-cream/90">Our story</span>
            </nav>
            <p className="eyebrow text-cream/60">{page.eyebrow}</p>
            <h1 className="display mt-4 max-w-3xl text-[46px] sm:text-[64px] lg:text-[76px]">
              Made for the <em className="italic text-blush">first tiny days.</em>
            </h1>
            <p className="mt-5 max-w-xl text-[13.5px] leading-[1.85] text-cream/70">
              {page.intro}
            </p>
          </div>
        </section>

        <section className="container-x py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div>
              <p className="eyebrow flex items-center gap-3 text-clay">
                <span className="h-px w-8 bg-clay/60" /> Why we exist
              </p>
              <h2 className="display mt-4 text-[34px] sm:text-[42px]">
                Softness is a <em className="italic text-clay">standard,</em> not a selling point.
              </h2>
              <div className="mt-6 flex items-center gap-4 border-t border-line pt-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sand text-clay">
                  <Leaf size={18} strokeWidth={1.4} />
                </span>
                <p className="text-[11.5px] leading-relaxed text-muted">
                  Premium muslin, gentle cottons, small batches and a hand-check on every piece.
                </p>
              </div>
            </div>
            <div className="prose-babycon max-w-none">
              {page.sections.map((section) => (
                <div key={section.heading} className="mb-8 last:mb-0">
                  <h3 className="!mt-0">{section.heading}</h3>
                  {section.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                  ))}
                </div>
              ))}
              <p className="flex items-center gap-2 text-[11px] not-italic text-ink">
                <Sparkles size={13} className="text-clay" /> Designed in Chennai, made in small
                batches in India.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-sand/60 py-16 sm:py-20">
          <div className="container-x">
            <div className="max-w-xl">
              <p className="eyebrow text-clay">What we hold to</p>
              <h2 className="display mt-4 text-[34px] sm:text-[42px]">
                Three things we <em className="italic text-clay">never rush.</em>
              </h2>
            </div>
            <div className="mt-9 grid gap-4 sm:grid-cols-3">
              {valuePoints.map((point, i) => (
                <div key={point.title} className="border border-line bg-cream p-6">
                  <span className="font-serif text-[13px] italic text-clay">0{i + 1}</span>
                  <h3 className="mt-3 font-serif text-[21px]">{point.title}</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{point.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container-x py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
            <div className="relative aspect-[4/3] overflow-hidden bg-sand">
              <Image
                src="/images/banners/editorial-girl.jpg"
                alt="A little one wearing Babycon"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="eyebrow text-clay">Fabric & care</p>
              <h2 className="display mt-4 text-[34px] sm:text-[40px]">
                Keep it soft, <em className="italic text-clay">for longer.</em>
              </h2>
              <div className="mt-6 space-y-4">
                {careSteps.map((step) => (
                  <div key={step.step} className="flex gap-4 border-t border-line pt-4">
                    <span className="font-serif text-[12px] italic text-clay">{step.step}</span>
                    <div>
                      <p className="text-[12.5px] font-medium text-ink">{step.title}</p>
                      <p className="mt-1 text-[12px] leading-relaxed text-muted">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 flex items-start gap-2 text-[11px] leading-relaxed text-muted">
                <Scissors size={13} className="mt-0.5 shrink-0 text-clay" />
                Every piece is checked by hand before it is folded. Small marks or variations in
                weave are part of the character of natural fabric.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-butter">
          <div className="container-x flex flex-col items-center py-14 text-center sm:py-16">
            <p className="eyebrow text-clay">The next chapter</p>
            <h2 className="display mt-4 max-w-2xl text-[34px] sm:text-[44px]">
              Made to be kept, <em className="italic">passed on,</em> and loved again.
            </h2>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/shop" className="btn-dark">
                Shop the collection <ArrowRight size={14} />
              </Link>
              <Link href="/contact" className="btn-outline border-ink/30">
                Talk to us
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="border-b border-line bg-sand/50">
        <div className="container-x py-12 sm:py-16">
          <nav className="flex items-center gap-2 text-[9.5px] uppercase tracking-[0.16em] text-muted">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span>/</span>
            <span className="text-ink">{page.title}</span>
          </nav>
          <p className="eyebrow mt-7 text-clay">{page.eyebrow}</p>
          <h1 className="display mt-4 max-w-3xl text-[40px] sm:text-[54px]">{page.title}</h1>
          <p className="mt-4 max-w-2xl text-[13.5px] leading-relaxed text-muted">{page.intro}</p>
        </div>
      </section>

      <section className="container-x py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.32fr_0.68fr] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <p className="mb-3 text-[9.5px] uppercase tracking-[0.18em] text-muted">The fine print</p>
            <nav className="border border-line">
              {POLICY_LINKS.map((link) => (
                <Link
                  key={link.handle}
                  href={`/pages/${link.handle}`}
                  className={`flex items-center justify-between border-b border-line px-4 py-3 text-[11.5px] transition-colors last:border-b-0 ${
                    link.handle === handle
                      ? "bg-ink text-cream"
                      : "text-muted hover:bg-sand/40 hover:text-ink"
                  }`}
                >
                  {link.label}
                  <ArrowRight size={11} />
                </Link>
              ))}
            </nav>
            <div className="mt-4 border border-line p-4">
              <p className="text-[9.5px] uppercase tracking-[0.14em] text-muted">Last updated</p>
              <p className="mt-1 text-[12px]">1 November 2026</p>
              <p className="mt-3 text-[10.5px] leading-relaxed text-muted">
                Questions about this policy? Write to{" "}
                <a href={`mailto:${site.email}`} className="text-clay underline underline-offset-2">
                  {site.email}
                </a>
                .
              </p>
            </div>
          </aside>

          <div className="max-w-3xl">
            {page.sections.map((section) => (
              <div key={section.heading} className="mb-9 border-b border-line pb-9 last:border-b-0 last:pb-0">
                <h2 className="font-serif text-[26px] font-light text-ink sm:text-[30px]">
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-4 text-[13.5px] leading-[1.85] text-muted">
                  {section.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-10 flex flex-col justify-between gap-4 border border-line bg-sand/40 p-5 sm:flex-row sm:items-center">
              <div>
                <p className="flex items-center gap-2 font-serif text-[19px]">
                  <Mail size={15} className="text-clay" /> Still have a question?
                </p>
                <p className="mt-1 text-[11.5px] text-muted">We reply within one working day.</p>
              </div>
              <Link href="/contact" className="btn-outline btn-sm w-fit">
                Contact us <ArrowRight size={12} />
              </Link>
            </div>

            <p className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-muted/70">
              <Check size={12} className="text-sage" /> Demo store · no real payment is processed
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
