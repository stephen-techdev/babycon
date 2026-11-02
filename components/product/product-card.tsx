"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { discountPercent } from "@/lib/money";
import { Price } from "@/components/ui/price";
import { Stars } from "@/components/ui/stars";
import { useStore } from "@/components/providers/store-provider";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  priority = false,
  className,
  showQuickAdd = true,
}: {
  product: Product;
  priority?: boolean;
  className?: string;
  showQuickAdd?: boolean;
}) {
  const { addItem, toggleWishlist, isWishlisted } = useStore();
  const saved = isWishlisted(product.handle);
  const discount = discountPercent(product.price, product.compareAtPrice);

  return (
    <article className={cn("group relative", className)}>
      <div className="relative overflow-hidden bg-sand">
        <Link
          href={`/products/${product.handle}`}
          aria-label={product.title}
          className="relative block aspect-[4/5] w-full"
        >
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`img-zoom object-cover ${
                product.images[1] ? "transition-opacity duration-500 group-hover:opacity-0" : ""
              }`}
            />
          )}
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={`${product.title} alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="img-zoom absolute inset-0 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </Link>

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.badge && (
            <span
              className={cn(
                "badge",
                product.badge === "Sale"
                  ? "bg-clay text-white"
                  : "bg-cream/95 text-ink backdrop-blur"
              )}
            >
              {product.badge}
            </span>
          )}
          {discount > 0 && product.badge !== "Sale" && (
            <span className="badge bg-clay text-white">-{discount}%</span>
          )}
        </div>

        <button
          onClick={() => toggleWishlist(product.handle)}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          className={cn(
            "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-cream/90 backdrop-blur transition-all duration-300 hover:bg-cream",
            saved ? "text-clay" : "text-ink/70"
          )}
        >
          <Heart size={14} strokeWidth={1.5} className={saved ? "fill-clay" : ""} />
        </button>

        {showQuickAdd && (
          <button
            onClick={() => addItem(product)}
            aria-label={`Add ${product.title} to bag`}
            className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-cream text-ink opacity-0 shadow-soft transition-all duration-300 hover:bg-ink hover:text-cream group-hover:translate-y-0 group-hover:opacity-100 max-sm:translate-y-0 max-sm:opacity-100"
          >
            <Plus size={17} strokeWidth={1.5} />
          </button>
        )}

        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute bottom-3 left-3 bg-cream/90 px-2 py-1 text-[8px] font-medium uppercase tracking-[0.14em] text-clay backdrop-blur">
            Only {product.stock} left
          </span>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="mb-1 text-[9px] uppercase tracking-[0.16em] text-muted/80">
              {product.category}
            </p>
            <Link
              href={`/products/${product.handle}`}
              className="block truncate font-serif text-[16.5px] font-normal leading-snug transition-colors hover:text-clay sm:text-[18px]"
            >
              {product.title}
            </Link>
          </div>
          <div className="shrink-0 text-right">
            <Price price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <Stars rating={product.rating} size={10} />
          {product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 4).map((color) => (
                <span
                  key={color}
                  title={color}
                  className="h-2 w-2 rounded-full border border-ink/15"
                  style={{ background: colorToHex(color) }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[8.5px] text-muted">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function colorToHex(name: string): string {
  const value = name.toLowerCase();
  const map: Record<string, string> = {
    white: "#F6F3EC",
    ivory: "#F7F0E1",
    cream: "#FAF7F2",
    beige: "#D9C6AA",
    sand: "#DCCCB6",
    brown: "#7B5A44",
    chocolate: "#5C4536",
    mocha: "#9A7B65",
    latte: "#C4A98F",
    grey: "#B7B4AE",
    gray: "#B7B4AE",
    charcoal: "#4A4A48",
    black: "#262422",
    blue: "#8DA9C4",
    navy: "#33415C",
    denim: "#5D7A9A",
    sky: "#BBD3E5",
    green: "#8C9A84",
    sage: "#A8B5A2",
    olive: "#7F8266",
    matcha: "#A9B59A",
    pink: "#EBC8C4",
    blush: "#EFDBD3",
    rose: "#D8A7A0",
    red: "#B45A50",
    rust: "#B06A4C",
    yellow: "#E8D38E",
    butter: "#F3E7C9",
    mustard: "#D9B45E",
    purple: "#B5A3C2",
    lavender: "#D6CCE6",
    floral: "#D8C6C4",
    rainbow: "#D9B7A6",
    teddy: "#C7A987",
    heart: "#D9A6A0",
    bunny: "#E5D8CE",
    lemon: "#EFE3A3",
    moon: "#D9D3C7",
    stars: "#C9BFAE",
    dot: "#CFC5B8",
    chick: "#E9D69C",
    tulip: "#D9A9A0",
    strawberry: "#D98A83",
    dinosaur: "#A8B79A",
    flower: "#DDBFB8",
  };
  return map[value] || "#CFC0AC";
}
