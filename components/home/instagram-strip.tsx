import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";
import type { Product } from "@/lib/types";

export function InstagramStrip({ products }: { products: Product[] }) {
  return (
    <section className="border-t border-line py-16 sm:py-20">
      <div className="container-x">
        <div className="flex flex-col items-center text-center">
          <p className="eyebrow flex items-center gap-2 text-clay">
            <Instagram size={13} /> The little moments
          </p>
          <h2 className="display mt-4 text-[34px] sm:text-[42px]">
            Life, lately <em className="italic text-clay">@babycon.in</em>
          </h2>
          <p className="mt-3 max-w-md text-[12.5px] text-muted">
            Tag us in your everyday magic. We love seeing our pieces out in the wild.
          </p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-3 gap-1 sm:grid-cols-6">
        {products.slice(0, 6).map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.handle}`}
            className="group relative aspect-square overflow-hidden bg-sand"
            aria-label={product.title}
          >
            {product.images[0] && (
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 33vw, 16vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-ink/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Instagram size={20} className="text-white" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="link-line text-[10px]"
        >
          Follow along <Instagram size={12} />
        </a>
      </div>
    </section>
  );
}
