"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  CreditCard,
  Loader2,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  Tag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useStore } from "@/components/providers/store-provider";
import { useStoreConfig } from "@/components/providers/store-config-provider";
import { DemoPayment } from "@/components/checkout/demo-payment";
import {
  computeDiscount,
  computeShipping,
  formatINR,
} from "@/lib/money";
import type { Coupon } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

type PaymentKey = "upi" | "card" | "netbanking" | "wallet" | "cod";

export function CheckoutFlow({
  user,
}: {
  user: { name: string; email: string; phone: string } | null;
}) {
  const router = useRouter();
  const { items, subtotal, updateQty, removeItem, clearCart, hydrated, addItem, toggleWishlist } = useStore();
  const { freeShippingThreshold, shippingFee, codFee, codEnabled } = useStoreConfig();  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  });
  const [method, setMethod] = useState<PaymentKey>("upi");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; type: "percent" | "fixed"; value: number } | null>(null);
  const [couponMessage, setCouponMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const discount = computeDiscount(subtotal, coupon);
  const { shipping, codFee: codHandling } = computeShipping(
    subtotal - discount,
    method === "cod" && codEnabled ? "cod" : "prepaid",
    { freeShippingThreshold, shippingFee, codFee }
  );
  const total = subtotal - discount + shipping + codHandling;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);

  const summaryItems = useMemo(() => items, [items]);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  async function applyCoupon() {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponMessage(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim(), subtotal }),
      });
      const data = await res.json();
      if (data.valid && data.coupon) {
        setCoupon({ code: data.coupon.code, type: data.coupon.type, value: data.coupon.value });
        setCouponMessage({ tone: "ok", text: data.message });
      } else {
        setCoupon(null);
        setCouponMessage({ tone: "error", text: data.message || "That code is not valid." });
      }
    } catch {
      setCouponMessage({ tone: "error", text: "Could not check that code." });
    } finally {
      setCouponLoading(false);
    }
  }

  function removeCoupon() {
    setCoupon(null);
    setCouponInput("");
    setCouponMessage(null);
  }

  function validateForm() {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email.";
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, "").slice(-10)))
      next.phone = "Enter a valid 10-digit mobile number.";
    if (form.line1.trim().length < 5) next.line1 = "Enter your address.";
    if (!form.city.trim()) next.city = "Enter your city.";
    if (!form.state) next.state = "Select your state.";
    if (!/^\d{6}$/.test(form.pincode)) next.pincode = "Enter a valid 6-digit pincode.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function placeOrder(paymentMethod: PaymentKey, paymentId?: string) {
    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: form.name, email: form.email, phone: form.phone },
          address: {
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
          items: items.map((i) => ({
            productId: i.productId,
            qty: i.qty,
            size: i.size,
            color: i.color,
          })),
          couponCode: coupon?.code,
          paymentMethod,
          demoPaymentId: paymentId,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrors(data.errors || { form: data.message || "Could not place order." });
        setSubmitting(false);
        setPaymentOpen(false);
        return;
      }
      clearCart();
      router.push(`/order/${data.orderNumber}?token=${data.token}`);
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
      setSubmitting(false);
      setPaymentOpen(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!items.length) {
      setErrors({ form: "Your bag is empty." });
      return;
    }
    if (!validateForm()) {
      document.getElementById("checkout-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (method === "cod" && codEnabled) {
      placeOrder("cod");
    } else {
      setPaymentOpen(true);
    }
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-clay" size={22} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-x flex min-h-[52vh] flex-col items-center justify-center py-20 text-center">
        <p className="eyebrow text-clay">Checkout</p>
        <h1 className="display mt-4 text-[42px] sm:text-[54px]">Your bag is <em className="italic">empty.</em></h1>
        <p className="mt-3 max-w-sm text-[13.5px] text-muted">
          Add a little softness before you check out — your bag is waiting for its first piece.
        </p>
        <Link href="/shop" className="btn-dark mt-7">
          Shop the collection <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-8 sm:py-12">
      <div className="flex items-center justify-between border-b border-line pb-5">
        <Link href="/cart" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted hover:text-ink">
          <ChevronLeft size={14} /> Back to bag
        </Link>
        <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.16em] text-muted">
          <span className="text-ink">Bag</span>
          <span className="h-px w-5 bg-line" />
          <span className="text-ink">Checkout</span>
          <span className="h-px w-5 bg-line" />
          <span>Confirmation</span>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
        <form id="checkout-form" onSubmit={onSubmit} noValidate>
          <h1 className="font-serif text-[34px] font-light sm:text-[42px]">Checkout</h1>
          <p className="mt-1 text-[12px] text-muted">
            Secure, thoughtful and simple. Delivery across India.
          </p>

          {errors.form && (
            <div className="mt-5 border border-clay/30 bg-clay/5 px-4 py-3 text-[12px] text-clay">
              {errors.form}
            </div>
          )}

          <div className="mt-8">
            <div className="flex items-baseline justify-between border-b border-line pb-3">
              <h2 className="text-[10px] font-medium uppercase tracking-[0.2em]">1 · Contact</h2>
              {!user && (
                <Link href="/account/login?next=/checkout" className="text-[10px] text-clay underline underline-offset-2">
                  Have an account? Sign in
                </Link>
              )}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="name">Full name</label>
                <input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} className={cn("input", errors.name && "border-clay")} placeholder="Ananya Rao" autoComplete="name" />
                {errors.name && <p className="mt-1 text-[10.5px] text-clay">{errors.name}</p>}
              </div>
              <div>
                <label className="label" htmlFor="email">Email</label>
                <input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={cn("input", errors.email && "border-clay")} placeholder="you@example.com" autoComplete="email" />
                {errors.email && <p className="mt-1 text-[10.5px] text-clay">{errors.email}</p>}
              </div>
              <div>
                <label className="label" htmlFor="phone">Mobile number</label>
                <input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value.replace(/[^\d+ ]/g, ""))} className={cn("input", errors.phone && "border-clay")} placeholder="98765 43210" autoComplete="tel" />
                {errors.phone && <p className="mt-1 text-[10.5px] text-clay">{errors.phone}</p>}
              </div>
            </div>
          </div>

          <div className="mt-9">
            <div className="flex items-baseline justify-between border-b border-line pb-3">
              <h2 className="text-[10px] font-medium uppercase tracking-[0.2em]">2 · Delivery</h2>
              <span className="text-[9.5px] text-muted">Ships within 24–48 hours</span>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="line1">Address</label>
                <input id="line1" value={form.line1} onChange={(e) => update("line1", e.target.value)} className={cn("input", errors.line1 && "border-clay")} placeholder="House / flat, street" autoComplete="address-line1" />
                {errors.line1 && <p className="mt-1 text-[10.5px] text-clay">{errors.line1}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="line2">Apartment, landmark (optional)</label>
                <input id="line2" value={form.line2} onChange={(e) => update("line2", e.target.value)} className="input" placeholder="Near..." autoComplete="address-line2" />
              </div>
              <div>
                <label className="label" htmlFor="city">City</label>
                <input id="city" value={form.city} onChange={(e) => update("city", e.target.value)} className={cn("input", errors.city && "border-clay")} placeholder="Chennai" autoComplete="address-level2" />
                {errors.city && <p className="mt-1 text-[10.5px] text-clay">{errors.city}</p>}
              </div>
              <div>
                <label className="label" htmlFor="state">State</label>
                <select id="state" value={form.state} onChange={(e) => update("state", e.target.value)} className={cn("select", errors.state && "border-clay")} autoComplete="address-level1">
                  <option value="">Select state</option>
                  {STATES.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && <p className="mt-1 text-[10.5px] text-clay">{errors.state}</p>}
              </div>
              <div>
                <label className="label" htmlFor="pincode">Pincode</label>
                <input id="pincode" value={form.pincode} onChange={(e) => update("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} className={cn("input", errors.pincode && "border-clay")} placeholder="600004" inputMode="numeric" autoComplete="postal-code" />
                {errors.pincode && <p className="mt-1 text-[10.5px] text-clay">{errors.pincode}</p>}
              </div>
              <div className="flex items-end pb-3 text-[10.5px] text-muted">
                <span className="flex items-center gap-1.5">
                  <Truck size={13} className="text-clay" />
                  {freeShippingRemaining > 0
                    ? `${formatINR(freeShippingRemaining)} away from free shipping`
                    : "Free shipping unlocked"}
                </span>
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="notes">Order notes (optional)</label>
                <textarea id="notes" value={form.notes} onChange={(e) => update("notes", e.target.value)} className="textarea" placeholder="Gift message, delivery instructions..." maxLength={500} />
              </div>
            </div>
          </div>

          <div className="mt-9">
            <div className="flex items-baseline justify-between border-b border-line pb-3">
              <h2 className="text-[10px] font-medium uppercase tracking-[0.2em]">3 · Payment</h2>
              <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.12em] text-sage">
                <Lock size={10} /> Demo checkout
              </span>
            </div>
            <div className="mt-4 space-y-2.5">
              <PaymentOption
                active={method === "upi" || method === "card" || method === "netbanking" || method === "wallet"}
                onClick={() => setMethod("upi")}
                icon={CreditCard}
                title="UPI / Card / Netbanking"
                description="Simulated Razorpay checkout · test mode only"
                badge="Recommended"
              />
              {codEnabled && (
                <PaymentOption
                  active={method === "cod"}
                  onClick={() => setMethod("cod")}
                  icon={Truck}
                  title="Cash on delivery"
                  description={`Pay at your door · ${formatINR(codFee)} handling fee`}
                />
              )}
            </div>
            <div className="mt-3 border border-amber-200 bg-amber-50 px-4 py-3 text-[10.5px] leading-relaxed text-amber-800">
              <strong className="font-semibold">Demo payment.</strong> This is a simulated
              Razorpay flow. No money is charged and no real payment details are stored.
            </div>
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <button
              type="submit"
              disabled={submitting}
              className="btn-dark w-full"
            >
              {submitting ? (
                <><Loader2 size={15} className="animate-spin" /> Placing order…</>
              ) : (
                <>
                  {method === "cod" ? "Place COD order" : `Pay ${formatINR(total)} (demo)`}
                  <ArrowRight size={14} />
                </>
              )}
            </button>
            <p className="mt-3 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.14em] text-muted">
              <ShieldCheck size={12} /> Secure checkout · Easy 7-day returns
            </p>
          </div>
        </form>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="border border-line bg-sand/40">
            <div className="border-b border-line px-5 py-4">
              <h2 className="text-[10px] font-medium uppercase tracking-[0.2em]">
                Your order · {items.reduce((n, i) => n + i.qty, 0)} items
              </h2>
            </div>
            <ul className="max-h-[340px] divide-y divide-line/70 overflow-y-auto px-5">
              {summaryItems.map((item) => (
                <li key={item.key} className="flex gap-3 py-4">
                  <div className="relative h-[76px] w-[60px] shrink-0 overflow-hidden bg-sand">
                    {item.image && (
                      <Image src={item.image} alt={item.title} fill sizes="60px" className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-[14.5px]">{item.title}</p>
                    <p className="mt-0.5 text-[9.5px] uppercase tracking-[0.1em] text-muted">
                      {[item.size, item.color].filter(Boolean).join(" · ")}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border border-line bg-white">
                        <button type="button" onClick={() => updateQty(item.key, item.qty - 1)} aria-label="Decrease" className="flex h-6 w-6 items-center justify-center text-muted hover:text-ink">
                          <Minus size={10} />
                        </button>
                        <span className="w-5 text-center text-[10px]">{item.qty}</span>
                        <button type="button" onClick={() => updateQty(item.key, item.qty + 1)} aria-label="Increase" className="flex h-6 w-6 items-center justify-center text-muted hover:text-ink">
                          <Plus size={10} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px]">{formatINR(item.price * item.qty)}</span>
                        <button type="button" onClick={() => removeItem(item.key)} aria-label="Remove" className="text-muted hover:text-clay">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-line px-5 py-4">
              {coupon ? (
                <div className="flex items-center justify-between border border-sage/40 bg-sage/10 px-3 py-2.5">
                  <span className="flex items-center gap-2 text-[11px] text-ink">
                    <Tag size={12} className="text-sage" />
                    <span className="font-medium">{coupon.code}</span> applied
                  </span>
                  <button type="button" onClick={removeCoupon} aria-label="Remove coupon" className="text-muted hover:text-clay">
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                      <input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Discount code"
                        className="input h-10 pl-8 text-[11px] uppercase tracking-wide"
                        aria-label="Discount code"
                      />
                    </div>
                    <button type="button" onClick={applyCoupon} disabled={couponLoading} className="h-10 shrink-0 border border-ink px-4 text-[9px] font-medium uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-cream disabled:opacity-50">
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                  {couponMessage && (
                    <p className={`mt-2 flex items-center gap-1 text-[10.5px] ${couponMessage.tone === "ok" ? "text-sage" : "text-clay"}`}>
                      {couponMessage.tone === "ok" && <Check size={11} />}
                      {couponMessage.text}
                    </p>
                  )}
                  <p className="mt-2 text-[9.5px] text-muted">
                    Try <button type="button" onClick={() => setCouponInput("WELCOME10")} className="text-clay underline underline-offset-2">WELCOME10</button> for 10% off orders over ₹999.
                  </p>
                </div>
              )}

              <dl className="mt-4 space-y-2.5 border-t border-line pt-4 text-[11.5px]">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd>{formatINR(subtotal)}</dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sage">
                    <dt>Discount ({coupon?.code})</dt>
                    <dd>−{formatINR(discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted">Shipping</dt>
                  <dd>{shipping === 0 ? "Free" : formatINR(shipping)}</dd>
                </div>
                {codHandling > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-muted">COD handling</dt>
                    <dd>{formatINR(codHandling)}</dd>
                  </div>
                )}
                <div className="flex items-baseline justify-between border-t border-line pt-3">
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-muted">Total</dt>
                  <dd className="font-serif text-[24px]">{formatINR(total)}</dd>
                </div>
              </dl>
              <p className="mt-1 text-[9.5px] text-muted">
                {shipping === 0
                  ? "Complimentary shipping included."
                  : `Add ${formatINR(Math.max(0, freeShippingThreshold - (subtotal - discount)))} more for free shipping.`}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2.5 border border-line p-4">
            {[
              { icon: Truck, text: "Dispatched within 24–48 hours" },
              { icon: ShieldCheck, text: "Secure demo checkout — no real charge" },
              { icon: Check, text: "7-day easy returns" },
            ].map(({ icon: Icon, text }) => (
              <p key={text} className="flex items-center gap-2.5 text-[10.5px] text-muted">
                <Icon size={13} className="text-clay" /> {text}
              </p>
            ))}
          </div>
        </aside>
      </div>

      {paymentOpen && (
        <DemoPayment
          amount={total}
          onClose={() => setPaymentOpen(false)}
          onSuccess={(paymentMethod, paymentId) => {
            placeOrder(paymentMethod, paymentId);
          }}
        />
      )}
    </div>
  );
}

function PaymentOption({
  active,
  onClick,
  icon: Icon,
  title,
  description,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 border px-4 py-3.5 text-left transition-colors",
        active ? "border-ink bg-sand/50" : "border-line hover:border-ink/40"
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          active ? "bg-ink text-cream" : "bg-sand text-muted"
        )}
      >
        <Icon size={15} strokeWidth={1.5} />
      </span>
      <span className="flex-1">
        <span className="flex flex-wrap items-center gap-2 text-[12.5px] font-medium">
          {title}
          {badge && (
            <span className="bg-sage/15 px-2 py-0.5 text-[8px] font-medium uppercase tracking-[0.12em] text-sage">
              {badge}
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-[10.5px] text-muted">{description}</span>
      </span>
      <span className={cn("flex h-4 w-4 items-center justify-center rounded-full border", active ? "border-ink" : "border-line")}>
        {active && <span className="h-2 w-2 rounded-full bg-ink" />}
      </span>
    </button>
  );
}
