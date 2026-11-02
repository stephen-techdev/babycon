import { NextResponse } from "next/server";
import { createOrder, getProductById, getSettings, validateCoupon } from "@/lib/db";
import { computeDiscount, computeShipping } from "@/lib/money";
import { storeConfigFromSettings } from "@/lib/store-config";

export const dynamic = "force-dynamic";

type IncomingItem = {
  productId: number;
  qty: number;
  size?: string;
  color?: string;
};

const PAYMENT_METHODS: Record<string, string> = {
  upi: "UPI (Demo)",
  card: "Card (Demo)",
  netbanking: "Netbanking (Demo)",
  wallet: "Wallet (Demo)",
  cod: "Cash on Delivery",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customer = body.customer || {};
    const address = body.address || {};
    const items = Array.isArray(body.items) ? (body.items as IncomingItem[]) : [];
    const method = String(body.paymentMethod || "upi").toLowerCase();
    const couponCode = body.couponCode ? String(body.couponCode).trim().toUpperCase() : null;
    const storeConfig = storeConfigFromSettings(getSettings());

    const errors: Record<string, string> = {};
    if (!customer.name || String(customer.name).trim().length < 2)
      errors.name = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(String(customer.email || "")))
      errors.email = "Please enter a valid email address.";
    if (!/^[6-9]\d{9}$/.test(String(customer.phone || "").replace(/\D/g, "").slice(-10)))
      errors.phone = "Please enter a valid 10-digit Indian mobile number.";
    if (!address.line1 || String(address.line1).trim().length < 5)
      errors.address = "Please enter your address.";
    if (!address.city) errors.city = "Please enter your city.";
    if (!address.state) errors.state = "Please select your state.";
    if (!/^\d{6}$/.test(String(address.pincode || "")))
      errors.pincode = "Please enter a valid 6-digit pincode.";
    if (!items.length) errors.items = "Your bag is empty.";
    if (!PAYMENT_METHODS[method]) errors.payment = "Choose a payment method.";
    if (method === "cod" && !storeConfig.codEnabled)
      errors.payment = "Cash on delivery is currently unavailable. Please pay online.";

    if (Object.keys(errors).length) {
      return NextResponse.json({ ok: false, errors }, { status: 422 });
    }

    const orderItems = [];
    for (const item of items) {
      const product = getProductById(Number(item.productId));
      if (!product || !product.active) {
        return NextResponse.json(
          { ok: false, errors: { items: "An item in your bag is no longer available." } },
          { status: 409 }
        );
      }
      const qty = Math.max(1, Math.min(10, Math.floor(Number(item.qty) || 1)));
      if (product.stock < qty) {
        return NextResponse.json(
          {
            ok: false,
            errors: {
              items: `Only ${product.stock} left of ${product.title}. Please update your bag.`,
            },
          },
          { status: 409 }
        );
      }
      orderItems.push({
        productId: product.id,
        handle: product.handle,
        title: product.title,
        image: product.images[0] || "",
        price: product.price,
        size: String(item.size || product.sizes[0] || "One Size"),
        color: String(item.color || product.colors[0] || ""),
        qty,
      });
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    let discount = 0;
    let appliedCoupon: string | null = null;
    if (couponCode) {
      const result = validateCoupon(couponCode, subtotal);
      if (!result.valid) {
        return NextResponse.json(
          { ok: false, errors: { coupon: result.message } },
          { status: 422 }
        );
      }
      discount = result.discount || 0;
      appliedCoupon = result.coupon?.code || null;
    }

    const { shipping, codFee } = computeShipping(
      subtotal - discount,
      method === "cod" ? "cod" : "prepaid",
      {
        freeShippingThreshold: storeConfig.freeShippingThreshold,
        shippingFee: storeConfig.shippingFee,
        codFee: storeConfig.codFee,
      }
    );
    const total = subtotal - discount + shipping + codFee;

    let paymentId: string | null = null;
    if (method !== "cod") {
      paymentId = String(body.demoPaymentId || "").startsWith("pay_demo_")
        ? String(body.demoPaymentId)
        : `pay_demo_${Math.random().toString(36).slice(2, 14)}`;
    }

    const { order, token } = createOrder({
      customerName: String(customer.name).trim(),
      email: String(customer.email).trim().toLowerCase(),
      phone: String(customer.phone).replace(/\D/g, "").slice(-10),
      address: {
        line1: String(address.line1 || "").trim(),
        line2: String(address.line2 || "").trim(),
        city: String(address.city || "").trim(),
        state: String(address.state || "").trim(),
        pincode: String(address.pincode || ""),
        country: "India",
      },
      items: orderItems,
      subtotal,
      discount,
      shipping,
      codFee,
      total,
      couponCode: appliedCoupon,
      paymentMethod: PAYMENT_METHODS[method],
      paymentStatus: method === "cod" ? "pending" : "paid",
      paymentId,
      notes: String(body.notes || "").slice(0, 500),
    });

    return NextResponse.json({
      ok: true,
      orderNumber: order.orderNumber,
      token,
      total: order.total,
      paymentId,
      paymentStatus: order.paymentStatus,
    });
  } catch (error) {
    console.error("checkout failed", error);
    const message =
      error instanceof Error ? error.message : "Something went wrong. Please try again.";
    return NextResponse.json({ ok: false, errors: { items: message } }, { status: 500 });
  }
}
