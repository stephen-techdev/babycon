import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Collection } from "@/lib/types";
import { SectionHeading } from "@/components/ui/section-heading";

export function CollectionsShowcase({ collections }: { collections: Collection[] }) {
  return (
    <section className="container-x py-20 sm:py-24 lg:py-28">
      <SectionHeading
        eyebrow="Shop by chapter"
        title={
          <>
            Every little moment,
            <br />
            <em className="italic text-clay">considered.</em>
          </>
        }
        description="From the first swaddle to the first wobbly steps — soft, considered pieces for every chapter of their story."
        link="/collections"
        linkLabel="All collections"
      />

      <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:mt-14 lg:grid-cols-4 lg:gap-x-6">
        {collections.map((collection, i) => (
          <Link
            key={collection.handle}
            href={`/collections/${collection.handle}`}
            className={`group relative block ${i % 2 === 1 ? "lg:mt-10" : ""}`}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-sand">
              {collection.image && (
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="img-zoom object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent opacity-90" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 sm:p-5">
                <div>
                  <h3 className="font-serif text-[17px] font-normal leading-tight text-cream sm:text-[21px]">
                    {collection.title}
                  </h3>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-cream/60">
                    {collection.productCount} {collection.productCount === 1 ? "piece" : "pieces"}
                  </p>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cream/30 text-cream transition-all duration-300 group-hover:border-cream group-hover:bg-cream group-hover:text-ink">
                  <ArrowRight size={13} strokeWidth={1.5} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
