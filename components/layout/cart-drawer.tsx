"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useStore } from "@/components/providers/store-provider";
import { useStoreConfig } from "@/components/providers/store-config-provider";
import { formatINR } from "@/lib/money";

export function CartDrawer() {
  const { items, cartOpen, setCartOpen, updateQty, removeItem, subtotal, cartCount } =
    useStore();
  const { freeShippingThreshold } = useStoreConfig();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setCartOpen]);

  const remaining = Math.max(0, freeShippingThreshold - subtotal);
  const progress = Math.min(
    100,
    freeShippingThreshold > 0 ? Math.round((subtotal / freeShippingThreshold) * 100) : 100
  );

  return (
    <div
      className={`fixed inset-0 z-[110] ${cartOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!cartOpen}
    >
      <div
        onClick={() => setCartOpen(false)}
        className={`absolute inset-0 bg-ink/45 backdrop-blur-[2px] transition-opacity duration-400 ${
          cartOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-cream shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping bag"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div className="flex items-baseline gap-2">
            <h2 className="font-serif text-[23px] font-light">Your bag</h2>
            <span className="text-[11px] text-muted">({cartCount})</span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            aria-label="Close bag"
            className="flex h-9 w-9 items-center justify-center transition-colors hover:text-clay"
          >
            <X size={19} strokeWidth={1.4} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sand">
              <ShoppingBag size={26} strokeWidth={1.2} className="text-muted" />
            </div>
            <h3 className="mt-6 font-serif text-[24px] font-light">Your bag is empty</h3>
            <p className="mt-2 max-w-[240px] text-[13px] leading-relaxed text-muted">
              A little softness goes a long way. Start with our most-loved pieces.
            </p>
            <Link
              href="/shop"
              onClick={() => setCartOpen(false)}
              className="btn-dark mt-7"
            >
              Shop the collection
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-line px-6 py-4">
              {remaining > 0 ? (
                <p className="text-[11.5px] text-muted">
                  You&apos;re{" "}
                  <span className="font-medium text-ink">{formatINR(remaining)}</span> away
                  from free shipping
                </p>
              ) : (
                <p className="text-[11.5px] font-medium text-sage">
                  Complimentary shipping unlocked
                </p>
              )}
              <div className="mt-2.5 h-[3px] w-full bg-line">
                <div
                  className="h-full bg-clay transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              <ul className="divide-y divide-line">
                {items.map((item) => (
                  <li key={item.key} className="flex gap-4 py-5">
                    <Link
                      href={`/products/${item.handle}`}
                      onClick={() => setCartOpen(false)}
                      className="relative h-[104px] w-[82px] shrink-0 overflow-hidden bg-sand"
                    >
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="82px"
                          className="object-cover"
                        />
                      )}
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.handle}`}
                          onClick={() => setCartOpen(false)}
                          className="font-serif text-[15px] leading-snug hover:text-clay"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeItem(item.key)}
                          aria-label={`Remove ${item.title}`}
                          className="shrink-0 text-muted transition-colors hover:text-clay"
                        >
                          <X size={13} />
                        </button>
                      </div>
                      <p className="mt-1 text-[10.5px] uppercase tracking-[0.1em] text-muted">
                        {[item.size, item.color].filter(Boolean).join(" · ")}
                      </p>
                      <div className="mt-auto flex items-end justify-between pt-3">
                        <div className="flex items-center border border-line">
                          <button
                            onClick={() => updateQty(item.key, item.qty - 1)}
                            aria-label="Decrease quantity"
                            className="flex h-7 w-7 items-center justify-center text-muted transition-colors hover:text-ink"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-6 text-center text-[11px]">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.key, item.qty + 1)}
                            aria-label="Increase quantity"
                            className="flex h-7 w-7 items-center justify-center text-muted transition-colors hover:text-ink"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        <span className="text-[13px] font-medium">
                          {formatINR(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-line bg-sand/60 px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.18em] text-muted">
                  Subtotal
                </span>
                <span className="font-serif text-[21px]">{formatINR(subtotal)}</span>
              </div>
              <p className="mt-1 text-[10.5px] text-muted">
                Shipping & discounts calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={() => setCartOpen(false)}
                className="btn-dark mt-4 w-full"
              >
                Checkout securely
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/cart"
                onClick={() => setCartOpen(false)}
                className="mt-3 block text-center text-[10px] font-medium uppercase tracking-[0.2em] text-muted underline-offset-4 hover:text-ink hover:underline"
              >
                View full bag
              </Link>
              <div className="mt-4 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.15em] text-muted/70">
                <span className="h-1 w-1 rounded-full bg-sage" />
                Demo checkout · no real payment
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
