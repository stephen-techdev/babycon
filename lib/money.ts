export function formatINR(value: number, withDecimals = false): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: withDecimals ? 2 : 0,
    maximumFractionDigits: withDecimals ? 2 : 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export function discountPercent(price: number, compareAt: number | null): number {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export const FREE_SHIPPING_THRESHOLD = 1499;
export const SHIPPING_FEE = 79;
export const COD_FEE = 49;

export type ShippingRates = {
  freeShippingThreshold: number;
  shippingFee: number;
  codFee: number;
};

export function computeDiscount(
  subtotal: number,
  coupon: { type: "percent" | "fixed"; value: number } | null
): number {
  if (!coupon) return 0;
  const raw =
    coupon.type === "percent"
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;
  return Math.min(subtotal, Math.max(0, raw));
}

export function computeShipping(
  subtotalAfterDiscount: number,
  method: "prepaid" | "cod",
  rates?: Partial<ShippingRates>
): { shipping: number; codFee: number } {
  const threshold = rates?.freeShippingThreshold ?? FREE_SHIPPING_THRESHOLD;
  const fee = rates?.shippingFee ?? SHIPPING_FEE;
  const codFee = rates?.codFee ?? COD_FEE;
  const shipping = subtotalAfterDiscount >= threshold ? 0 : fee;
  return { shipping, codFee: method === "cod" ? codFee : 0 };
}
