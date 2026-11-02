"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Heart, Loader2, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useStore } from "@/components/providers/store-provider";
import { discountPercent } from "@/lib/money";
import { Price } from "@/components/ui/price";
import { Stars } from "@/components/ui/stars";

type WishProduct = {
  id: number;
  handle: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  colors: string[];
  sizes: string[];
  stock: number;
  badge: string | null;
};

export function WishlistView() {
  const { wishlist, hydrated, toggleWishlist, addItem, notify } = useStore();
  const [products, setProducts] = useState<WishProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated) return;
    if (!wishlist.length) {
      setProducts([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/products?handles=${encodeURIComponent(wishlist.join(","))}&limit=60`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setProducts(data.products || []);
      })
      .catch(() => {
        if (!cancelled) notify("Could not load your wishlist.", "error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [wishlist, hydrated, notify]);

  function addAll() {
    if (!products.length) return;
    products.forEach((product) => {
      if (product.stock > 0) {
        addItem(
          {
            id: product.id,
            handle: product.handle,
            title: product.title,
            images: product.images,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            stock: product.stock,
          },
          { size: product.sizes[0], color: product.colors[0], silent: true, openDrawer: false }
        );
      }
    });
    notify(`${products.filter((p) => p.stock > 0).length} pieces added to your bag`, "success");
  }

  if (!hydrated || loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 size={22} className="animate-spin text-clay" />
      </div>
    );
  }

  if (!wishlist.length) {
    return (
      <div className="flex flex-col items-center border border-dashed border-line px-6 py-20 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-sand">
          <Heart size={28} strokeWidth={1.2} className="text-muted" />
        </span>
        <h2 className="mt-6 font-serif text-[30px] font-light">Nothing saved yet.</h2>
        <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-muted">
          Tap the heart on any piece to keep it here — a little edit of the things you love most.
        </p>
        <Link href="/shop" className="btn-dark mt-7">
          Find something soft <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
        <p className="text-[11.5px] text-muted">
          <span className="text-ink">{products.length}</span> saved{" "}
          {products.length === 1 ? "piece" : "pieces"}
        </p>
        <button
          onClick={addAll}
          className="inline-flex items-center gap-2 text-[9.5px] uppercase tracking-[0.14em] text-clay transition-colors hover:text-ink"
        >
          <ShoppingBag size={13} /> Add all to bag
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-3">
        {products.map((product) => {
          const discount = discountPercent(product.price, product.compareAtPrice);
          return (
            <article key={product.id} className="group">
              <div className="relative overflow-hidden bg-sand">
                <Link href={`/products/${product.handle}`} className="block aspect-[4/5]">
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="img-zoom object-cover"
                    />
                  )}
                </Link>
                {discount > 0 && (
                  <span className="badge absolute left-3 top-3 bg-clay text-white">-{discount}%</span>
                )}
                <button
                  onClick={() => toggleWishlist(product.handle)}
                  aria-label="Remove from wishlist"
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-cream/90 text-muted backdrop-blur transition-colors hover:text-clay"
                >
                  <Trash2 size={13} />
                </button>
                <button
                  onClick={() =>
                    addItem(
                      {
                        id: product.id,
                        handle: product.handle,
                        title: product.title,
                        images: product.images,
                        price: product.price,
                        compareAtPrice: product.compareAtPrice,
                        stock: product.stock,
                      },
                      { size: product.sizes[0], color: product.colors[0] }
                    )
                  }
                  disabled={product.stock <= 0}
                  className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-cream text-ink shadow-soft transition-colors hover:bg-ink hover:text-cream disabled:opacity-40 max-sm:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  aria-label={`Add ${product.title} to bag`}
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="mt-4">
                <p className="text-[9px] uppercase tracking-[0.15em] text-muted">{product.category}</p>
                <Link href={`/products/${product.handle}`} className="mt-1 block truncate font-serif text-[17px] hover:text-clay">
                  {product.title}
                </Link>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <Price price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />
                  <Stars rating={product.rating} size={10} />
                </div>
                {product.stock <= 5 && product.stock > 0 && (
                  <p className="mt-1.5 text-[9.5px] text-clay">Only {product.stock} left</p>
                )}
                {product.stock <= 0 && (
                  <p className="mt-1.5 text-[9.5px] text-muted">Currently sold out</p>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-12 border-t border-line pt-6 text-center">
        <p className="text-[11.5px] text-muted">
          Pieces stay saved on this device. Ready to make them yours?
        </p>
        <Link href="/shop" className="link-line mt-3 text-[9.5px] text-ink">
          Continue shopping <ArrowRight size={11} />
        </Link>
      </div>
    </>
  );
}
