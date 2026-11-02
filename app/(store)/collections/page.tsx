import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listCollections } from "@/lib/db";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Collections — Shop by chapter",
  description:
    "Explore Babycon edits for newborn essentials, baby girl, baby boy, combo sets, sizes 0–6M and 6–12M, accessories and special offers.",
  alternates: { canonical: "/collections" },
};

export const revalidate = 300;

export default function CollectionsPage() {
  const collections = listCollections();

  return (
    <>
      <section className="border-b border-line bg-sand/50">
        <div className="container-x py-14 text-center sm:py-20">
          <p className="eyebrow flex items-center justify-center gap-3 text-clay">
            <span className="h-px w-8 bg-clay/60" /> Shop by chapter <span className="h-px w-8 bg-clay/60" />
          </p>
          <h1 className="display mx-auto mt-5 max-w-3xl text-[44px] sm:text-[62px]">
            Every little moment,
            <br />
            <em className="italic text-clay">considered.</em>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[13.5px] leading-relaxed text-muted">
            From the first swaddle to the first wobbly steps — discover edits made for
            every stage, size and little personality.
          </p>
        </div>
      </section>

      <section className="container-x py-14 sm:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection, i) => (
            <Link
              key={collection.handle}
              href={`/collections/${collection.handle}`}
              className={`group relative block overflow-hidden bg-sand ${
                i === 0 ? "sm:col-span-2 sm:row-span-2" : ""
              }`}
            >
              <div className={`relative ${i === 0 ? "aspect-[4/3] sm:aspect-square" : "aspect-[4/3]"}`}>
                {collection.image && (
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    sizes={i === 0 ? "(max-width: 640px) 100vw, 66vw" : "(max-width: 640px) 100vw, 33vw"}
                    className="img-zoom object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.18em] text-cream/60">
                      {collection.productCount} pieces
                    </p>
                    <h2 className={`mt-1 font-serif font-light text-cream ${i === 0 ? "text-[30px] sm:text-[40px]" : "text-[24px]"}`}>
                      {collection.title}
                    </h2>
                    <p className="mt-2 hidden max-w-sm text-[12px] leading-relaxed text-cream/65 sm:block">
                      {collection.description}
                    </p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cream/30 text-cream transition-all group-hover:border-cream group-hover:bg-cream group-hover:text-ink">
                    <ArrowRight size={15} strokeWidth={1.5} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 border-t border-line pt-10 sm:mt-20">
          <SectionHeading
            eyebrow="Not sure where to start?"
            title={<>Let us help you find <em className="italic text-clay">the perfect piece.</em></>}
            description="Tell us a little about your little one and we'll point you to the softest place to begin."
            link="/contact"
            linkLabel="Talk to us"
          />
        </div>
      </section>
    </>
  );
}
