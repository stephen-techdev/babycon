"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Heart, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useStore } from "@/components/providers/store-provider";
import { useStoreConfig } from "@/components/providers/store-config-provider";
import { formatINR } from "@/lib/money";

export function CartView() {
  const { items, hydrated, updateQty, removeItem, subtotal, toggleWishlist, addItem } = useStore();
  const { freeShippingThreshold, shippingFee } = useStoreConfig();
  const [note, setNote] = useState("");

  if (!hydrated) {
    return (
      <div className="container-x py-16">
        <div className="h-8 w-48 animate-pulse bg-sand" />
        <div className="mt-8 h-48 w-full animate-pulse bg-sand" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <section className="container-x py-16 sm:py-24">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-sand">
            <ShoppingBag size={30} strokeWidth={1.1} className="text-muted" />
          </div>
          <p className="eyebrow mt-7 text-clay">Your bag</p>
          <h1 className="display mt-3 text-[42px] sm:text-[56px]">
            Waiting for its <em className="italic text-clay">first piece.</em>
          </h1>
          <p className="mt-3 max-w-sm text-[13.5px] leading-relaxed text-muted">
            Start with something soft — a muslin swaddle, a little romper, or a set made for
            the first tiny days.
          </p>
          <Link href="/shop" className="btn-dark mt-8">
            Shop the collection <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    );
  }

  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingFee;
  const remaining = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <section className="container-x py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow flex items-center gap-3 text-clay">
            <span className="h-px w-8 bg-clay/60" /> The edit so far
          </p>
          <h1 className="display mt-3 text-[40px] sm:text-[52px]">Your bag</h1>
        </div>
        <p className="text-[11px] text-muted">
          {items.reduce((n, i) => n + i.qty, 0)} items · {formatINR(subtotal)}
        </p>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
        <div>
          <ul className="divide-y divide-line border-y border-line">
            {items.map((item) => (
              <li key={item.key} className="flex gap-4 py-6 sm:gap-6">
                <Link
                  href={`/products/${item.handle}`}
                  className="relative h-[132px] w-[104px] shrink-0 overflow-hidden bg-sand sm:h-[164px] sm:w-[130px]"
                >
                  {item.image && (
                    <Image src={item.image} alt={item.title} fill sizes="130px" className="object-cover" />
                  )}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/products/${item.handle}`} className="font-serif text-[19px] leading-snug hover:text-clay sm:text-[22px]">
                        {item.title}
                      </Link>
                      <p className="mt-1.5 text-[10.5px] uppercase tracking-[0.12em] text-muted">
                        {[item.size, item.color].filter(Boolean).join(" · ")}
                      </p>
                      {item.stock <= 5 && (
                        <p className="mt-1 text-[10px] text-clay">Only {item.stock} left</p>
                      )}
                    </div>
                    <p className="shrink-0 font-medium">{formatINR(item.price * item.qty)}</p>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                    <div className="flex items-center border border-line">
                      <button onClick={() => updateQty(item.key, item.qty - 1)} aria-label="Decrease quantity" className="flex h-9 w-9 items-center justify-center text-muted hover:text-ink">
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-[12px]">{item.qty}</span>
                      <button onClick={() => updateQty(item.key, item.qty + 1)} aria-label="Increase quantity" className="flex h-9 w-9 items-center justify-center text-muted hover:text-ink">
                        <Plus size={13} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.1em] text-muted">
                      <button onClick={() => { toggleWishlist(item.handle); removeItem(item.key); }} className="flex items-center gap-1.5 hover:text-clay">
                        <Heart size={12} /> Save
                      </button>
                      <button onClick={() => removeItem(item.key)} className="flex items-center gap-1.5 hover:text-clay">
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <Link href="/shop" className="text-[10px] uppercase tracking-[0.16em] text-muted underline underline-offset-4 hover:text-ink">
              Continue shopping
            </Link>
            <p className="text-[10.5px] text-muted">
              Delivery calculated at checkout. Free over {formatINR(freeShippingThreshold)}.
            </p>
          </div>

          <div className="mt-8">
            <p className="label">A little note for your order? (optional)</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="textarea bg-white"
              placeholder="Gift message or delivery notes — we'll pass it along."
            />
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="border border-line bg-sand/40 p-5 sm:p-6">
            <h2 className="text-[10px] font-medium uppercase tracking-[0.2em]">Order summary</h2>
            <dl className="mt-5 space-y-3 text-[12px]">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd>{formatINR(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Shipping (est.)</dt>
                <dd>{shipping === 0 ? "Free" : formatINR(shipping)}</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-4">
                <dt className="text-[10px] uppercase tracking-[0.18em] text-muted">Total</dt>
                <dd className="font-serif text-[25px]">{formatINR(subtotal + shipping)}</dd>
              </div>
            </dl>
            {remaining > 0 ? (
              <div className="mt-4">
                <p className="text-[10.5px] text-muted">
                  <span className="font-medium text-ink">{formatINR(remaining)}</span> away from free shipping
                </p>
                <div className="mt-2 h-[3px] bg-line">
                  <div className="h-full bg-clay" style={{ width: `${freeShippingThreshold > 0 ? Math.min(100, (subtotal / freeShippingThreshold) * 100) : 100}%` }} />
                </div>
              </div>
            ) : (
              <p className="mt-4 text-[10.5px] text-sage">Complimentary shipping unlocked.</p>
            )}
            <Link href="/checkout" className="btn-dark mt-5 w-full">
              Checkout securely <ArrowRight size={14} />
            </Link>
            <Link href="/shop" className="btn-outline mt-2 w-full">
              Keep shopping
            </Link>
            <p className="mt-3 text-center text-[9px] uppercase tracking-[0.14em] text-muted">
              Demo store · test checkout · no real payment
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {items.slice(0, 2).map((item) => (
              <button
                key={item.key}
                onClick={() => addItem({ id: item.productId, handle: item.handle, title: item.title, images: [item.image], price: item.price, compareAtPrice: item.compareAtPrice, stock: item.stock }, { size: item.size, color: item.color, silent: true })}
                className="group relative aspect-square overflow-hidden bg-sand"
                aria-label={`Add ${item.title} again`}
              >
                {item.image && <Image src={item.image} alt="" fill sizes="200px" className="object-cover opacity-70 transition-opacity group-hover:opacity-100" />}
                <span className="absolute inset-x-0 bottom-0 bg-ink/60 py-1.5 text-[8px] uppercase tracking-[0.12em] text-cream">
                  Add again
                </span>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
