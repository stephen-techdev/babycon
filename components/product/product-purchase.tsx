"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  Sparkles,
  Truck,
  Undo2,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { discountPercent, formatINR } from "@/lib/money";
import { useStore } from "@/components/providers/store-provider";
import { useStoreConfig } from "@/components/providers/store-config-provider";
import { Stars } from "@/components/ui/stars";
import { colorToHex } from "@/components/product/product-card";

export function ProductPurchase({
  product,
  reviewTotal,
}: {
  product: Product;
  reviewTotal: number;
}) {
  const router = useRouter();
  const { addItem, toggleWishlist, isWishlisted, notify } = useStore();
  const { freeShippingThreshold, shippingFee, codEnabled } = useStoreConfig();
  const [size, setSize] = useState(product.sizes[0] || "One Size");
  const [color, setColor] = useState(product.colors[0] || "");
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState("");
  const [delivery, setDelivery] = useState<{ ok: boolean; message: string } | null>(null);
  const saved = isWishlisted(product.handle);
  const discount = discountPercent(product.price, product.compareAtPrice);

  function add() {
    addItem(product, { size, color, qty });
  }

  function buyNow() {
    addItem(product, { size, color, qty, openDrawer: false, silent: true });
    router.push("/checkout");
  }

  function checkPincode(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setDelivery({ ok: false, message: "Please enter a valid 6-digit pincode." });
      return;
    }
    const days = 3 + (Number(pincode.slice(-1)) % 3);
    const date = new Date(Date.now() + days * 86400000);
    const label = date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    setDelivery({
      ok: true,
      message: `Delivers by ${label} · ${codEnabled ? "Cash on delivery available" : "Prepaid orders only"}`,
    });
  }

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: product.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        notify("Link copied to clipboard", "success");
      }
    } catch {
      // cancelled
    }
  }

  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <Link
        href={`/collections/${product.collections[0] || "new-born-essentials"}`}
        className="text-[9.5px] uppercase tracking-[0.18em] text-clay hover:underline"
      >
        {product.category}
      </Link>
      <h1 className="mt-3 font-serif text-[32px] font-light leading-[1.05] tracking-tight sm:text-[40px]">
        {product.title}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Stars rating={product.rating} size={13} />
        <a href="#reviews" className="text-[10.5px] text-muted underline-offset-2 hover:underline">
          {product.reviewCount} reviews
        </a>
        <span className="h-3 w-px bg-line" />
        <span className="text-[10.5px] text-muted">SKU {product.sku}</span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="text-[24px] font-medium tracking-tight">{formatINR(product.price)}</span>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <>
            <span className="text-[14px] text-muted/70 line-through">
              {formatINR(product.compareAtPrice)}
            </span>
            <span className="badge bg-clay text-white">Save {discount}%</span>
          </>
        )}
      </div>
      <p className="mt-1 text-[10.5px] text-muted">Inclusive of all taxes · Free shipping over {formatINR(freeShippingThreshold)}</p>

      <p className="mt-5 max-w-[430px] text-[13.5px] leading-[1.8] text-muted">{product.lead}</p>

      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {product.highlights.map((highlight) => (
          <li key={highlight} className="flex items-start gap-2 text-[11.5px] text-ink/75">
            <Check size={13} className="mt-0.5 shrink-0 text-clay" />
            {highlight}
          </li>
        ))}
      </ul>

      {product.colors.length > 0 && (
        <div className="mt-7">
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
              Print / Colour
            </p>
            <span className="text-[10.5px] text-ink">{color}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((option) => (
              <button
                key={option}
                onClick={() => setColor(option)}
                aria-label={option}
                title={option}
                className={`flex items-center gap-2 border px-3 py-2 text-[10.5px] transition-colors ${
                  color === option
                    ? "border-ink bg-ink text-cream"
                    : "border-line text-muted hover:border-ink hover:text-ink"
                }`}
              >
                <span
                  className="h-3 w-3 rounded-full border border-black/10"
                  style={{ background: colorToHex(option) }}
                />
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">Size</p>
          <span className="text-[10.5px] text-clay">
            {product.sizes.length > 1 ? "Fits true to size" : product.sizes[0]}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((option) => (
            <button
              key={option}
              onClick={() => setSize(option)}
              className={`min-w-[64px] border px-4 py-2.5 text-[11px] transition-colors ${
                size === option
                  ? "border-ink bg-ink text-cream"
                  : "border-line text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <div className="flex h-[50px] w-full items-center justify-between border border-line px-2 sm:w-[120px]">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:text-ink"
          >
            <Minus size={14} />
          </button>
          <span className="text-[12px]">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            aria-label="Increase quantity"
            className="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:text-ink"
          >
            <Plus size={14} />
          </button>
        </div>
        <button onClick={add} className="btn-dark flex-1" disabled={product.stock <= 0}>
          {product.stock <= 0 ? "Sold out" : "Add to bag"}
          {product.stock > 0 && <ArrowRight size={14} />}
        </button>
      </div>
      <button
        onClick={buyNow}
        className="btn-outline mt-3 w-full"
        disabled={product.stock <= 0}
      >
        Buy it now
      </button>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => toggleWishlist(product.handle)}
          className={`flex items-center gap-2 text-[10.5px] uppercase tracking-[0.12em] transition-colors ${
            saved ? "text-clay" : "text-muted hover:text-ink"
          }`}
        >
          <Heart size={14} className={saved ? "fill-clay" : ""} />
          {saved ? "Saved to wishlist" : "Save for later"}
        </button>
        <button
          onClick={share}
          className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-ink"
        >
          <Share2 size={13} /> Share
        </button>
      </div>

      <div className="mt-6 border-y border-line py-4">
        <form onSubmit={checkPincode} className="flex items-center gap-2">
          <input
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="Enter pincode for delivery"
            inputMode="numeric"
            className="h-10 w-full border border-line bg-white px-3 text-[12px] outline-none focus:border-ink"
            aria-label="Pincode"
          />
          <button type="submit" className="h-10 shrink-0 border border-ink px-4 text-[9px] font-medium uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-cream">
            Check
          </button>
        </form>
        {delivery && (
          <p className={`mt-2 flex items-center gap-1.5 text-[11px] ${delivery.ok ? "text-sage" : "text-clay"}`}>
            {delivery.ok && <Check size={12} />}
            {delivery.message}
          </p>
        )}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            { icon: Truck, label: "Ships in 24–48h" },
            { icon: Undo2, label: "7-day returns" },
            { icon: ShieldCheck, label: "Secure checkout" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 bg-sand/60 px-2 py-3">
              <Icon size={16} strokeWidth={1.3} className="text-clay" />
              <span className="text-[9px] leading-tight text-muted">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 divide-y divide-line border-b border-line">
        <details className="accordion" open>
          <summary className="flex items-center justify-between py-4">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em]">
              Description & details
            </span>
            <ChevronDown size={15} className="accordion-icon text-muted" />
          </summary>
          <div
            className="accordion-body prose-babycon pb-6"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </details>
        <details className="accordion">
          <summary className="flex items-center justify-between py-4">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em]">
              Fabric & care
            </span>
            <ChevronDown size={15} className="accordion-icon text-muted" />
          </summary>
          <div className="accordion-body space-y-3 pb-6 text-[13px] leading-relaxed text-muted">
            <p>
              Gentle machine wash cold with a mild, fragrance-free detergent. Wash with
              similar colours. Do not bleach. Tumble dry low or line dry in shade. Warm
              iron on the reverse if needed.
            </p>
            <p>
              Muslin and cotton pieces soften beautifully with each wash. We recommend
              pre-washing everything before the first wear.
            </p>
            <p className="flex items-center gap-2 text-[11px] text-ink">
              <Sparkles size={13} className="text-clay" /> Made in small batches in India
            </p>
          </div>
        </details>
        <details className="accordion">
          <summary className="flex items-center justify-between py-4">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em]">
              Shipping & returns
            </span>
            <ChevronDown size={15} className="accordion-icon text-muted" />
          </summary>
          <div className="accordion-body space-y-3 pb-6 text-[13px] leading-relaxed text-muted">
            <p>
              Orders dispatch within 24–48 hours. Metro cities receive orders in 2–4
              working days; the rest of India in 4–7 working days. Free shipping on orders
              over {formatINR(freeShippingThreshold)}, otherwise a flat {formatINR(shippingFee)} applies.
            </p>
            <p>
              Unused pieces with tags can be returned within 7 days of delivery. For hygiene
              reasons, opened blankets, towels and socks are final sale unless faulty. See
              our{" "}
              <Link href="/pages/refund" className="text-ink underline underline-offset-2">
                returns policy
              </Link>
              .
            </p>
          </div>
        </details>
        <details className="accordion">
          <summary className="flex items-center justify-between py-4">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em]">
              Size guide
            </span>
            <ChevronDown size={15} className="accordion-icon text-muted" />
          </summary>
          <div className="accordion-body pb-6">
            <table className="w-full text-left text-[11.5px]">
              <thead className="border-b border-line text-[9px] uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th className="py-2 font-medium">Size</th>
                  <th className="py-2 font-medium">Age</th>
                  <th className="py-2 font-medium">Height</th>
                  <th className="py-2 font-medium">Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70 text-muted">
                <tr><td className="py-2 text-ink">0–3M</td><td>0–3 months</td><td>50–60 cm</td><td>3–5 kg</td></tr>
                <tr><td className="py-2 text-ink">0–6M</td><td>0–6 months</td><td>50–67 cm</td><td>3–7 kg</td></tr>
                <tr><td className="py-2 text-ink">3–6M</td><td>3–6 months</td><td>60–67 cm</td><td>5–7 kg</td></tr>
                <tr><td className="py-2 text-ink">6–12M</td><td>6–12 months</td><td>67–75 cm</td><td>7–10 kg</td></tr>
                <tr><td className="py-2 text-ink">9–12M</td><td>9–12 months</td><td>72–78 cm</td><td>8–10 kg</td></tr>
              </tbody>
            </table>
            <p className="mt-3 text-[11px] text-muted">
              Between sizes? Size up for room to grow. Still unsure? Write to{" "}
              <a href="mailto:care@babycon.in" className="text-ink underline underline-offset-2">
                care@babycon.in
              </a>{" "}
              and we&apos;ll help.
            </p>
          </div>
        </details>
      </div>

      <p className="mt-4 text-center text-[9.5px] uppercase tracking-[0.16em] text-muted/60">
        Demo store · test checkout · no real payment
      </p>
    </div>
  );
}
