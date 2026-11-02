import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function EditorialSplit() {
  const blocks = [
    {
      image: "/images/banners/editorial-girl.jpg",
      eyebrow: "For her",
      title: "Offers for Barbies",
      description:
        "From pretty pastels to playful prints, explore the cutest outfits for her next big adventure.",
      href: "/collections/baby-girl",
      tone: "light",
      align: "left",
    },
    {
      image: "/images/banners/editorial-boy.jpg",
      eyebrow: "For him",
      title: "Top trends for boys",
      description:
        "Durable, stylish and comfortable everyday wear for playtime, naps and everything in between.",
      href: "/collections/baby-boy",
      tone: "light",
      align: "left",
    },
  ];

  return (
    <section className="container-x py-4 pb-20 sm:pb-24">
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        {blocks.map((block) => (
          <Link
            key={block.href}
            href={block.href}
            className="group relative block min-h-[420px] overflow-hidden bg-sand sm:min-h-[500px] lg:min-h-[560px]"
          >
            <Image
              src={block.image}
              alt={block.title}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="img-zoom object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="eyebrow text-cream/65">{block.eyebrow}</p>
              <h3 className="mt-3 font-serif text-[30px] font-light leading-tight text-cream sm:text-[36px]">
                {block.title}
              </h3>
              <p className="mt-3 max-w-[300px] text-[12.5px] leading-relaxed text-cream/65">
                {block.description}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 border-b border-cream/40 pb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-cream transition-colors group-hover:border-cream">
                Shop now <ArrowUpRight size={13} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted sm:hidden">
        <Link href="/collections/baby-girl" className="flex items-center gap-1">
          Shop girls <ArrowRight size={12} />
        </Link>
      </div>
    </section>
  );
}
