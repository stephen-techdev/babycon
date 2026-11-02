"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth-server";
import { getDatabase } from "@/lib/database";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const admin = await getAdminSession();
  if (!admin) throw new Error("Unauthorised");
  return admin;
}

function text(data: FormData, key: string, fallback = ""): string {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : fallback;
}

function numberValue(data: FormData, key: string, fallback = 0): number {
  const value = Number(text(data, key));
  return Number.isFinite(value) ? Math.round(value) : fallback;
}

function csv(data: FormData, key: string): string[] {
  const raw = text(data, key);
  return [...new Set(raw.split(/[,\n]/).map((v) => v.trim()).filter(Boolean))];
}

function parseImages(data: FormData): string[] {
  const raw = text(data, "images");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
    }
  } catch {
    // fall through to a comma-separated list
  }
  return raw.split(/[,\n]/).map((v) => v.trim()).filter(Boolean);
}

function refreshStorefront() {
  revalidatePath("/", "layout");
}

/* ── Products ─────────────────────────────────────────────────────────── */

export async function saveProduct(data: FormData): Promise<void> {
  await requireAdmin();
  const db = getDatabase();
  const id = numberValue(data, "id") || null;
  const title = text(data, "title");
  if (!title) throw new Error("A product title is required.");

  const baseHandle = slugify(text(data, "handle") || title) || `piece-${Date.now()}`;
  let handle = baseHandle;
  let suffix = 2;
  for (;;) {
    const existing = db
      .prepare("SELECT id FROM products WHERE handle = ?")
      .get(handle) as { id: number } | undefined;
    if (!existing || existing.id === id) break;
    handle = `${baseHandle}-${suffix++}`;
  }

  const values = [
    handle,
    title,
    text(data, "category", "Everyday Essentials") || "Everyday Essentials",
    Math.max(0, numberValue(data, "price")),
    numberValue(data, "compareAtPrice") || null,
    text(data, "sku"),
    Math.max(0, numberValue(data, "stock")),
    JSON.stringify(csv(data, "sizes").length ? csv(data, "sizes") : ["One Size"]),
    JSON.stringify(csv(data, "colors")),
    JSON.stringify(data.getAll("collections").filter((v): v is string => typeof v === "string")),
    text(data, "description"),
    text(data, "lead"),
    JSON.stringify(csv(data, "highlights")),
    JSON.stringify(parseImages(data)),
    data.get("featured") === "on" ? 1 : 0,
    data.get("active") === "on" ? 1 : 0,
    text(data, "badge") || null,
  ];

  if (id) {
    db.prepare(
      `UPDATE products SET handle = ?, title = ?, category = ?, price = ?, compare_at_price = ?,
        sku = ?, stock = ?, sizes = ?, colors = ?, collections = ?, description = ?, lead = ?,
        highlights = ?, images = ?, featured = ?, active = ?, badge = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(...values, id);
  } else {
    db.prepare(
      `INSERT INTO products (handle, title, category, price, compare_at_price, sku, stock, sizes,
        colors, collections, description, lead, highlights, images, featured, active, badge,
        rating, review_count, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 5, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    ).run(...values);
  }

  refreshStorefront();
  revalidatePath("/admin/products");
  redirect(`/admin/products?saved=${id ? "updated" : "created"}`);
}

export async function deleteProduct(data: FormData): Promise<void> {
  await requireAdmin();
  const id = numberValue(data, "id");
  if (!id) return;
  const db = getDatabase();
  db.prepare("DELETE FROM reviews WHERE product_id = ?").run(id);
  db.prepare("DELETE FROM products WHERE id = ?").run(id);
  refreshStorefront();
  revalidatePath("/admin/products");
  redirect("/admin/products?deleted=1");
}

/* ── Collections ──────────────────────────────────────────────────────── */

export async function saveCollection(data: FormData): Promise<void> {
  await requireAdmin();
  const db = getDatabase();
  const id = numberValue(data, "id") || null;
  const title = text(data, "title");
  if (!title) throw new Error("A collection title is required.");
  const baseHandle = slugify(text(data, "handle") || title);
  let handle = baseHandle;
  let suffix = 2;
  for (;;) {
    const existing = db
      .prepare("SELECT id FROM collections WHERE handle = ?")
      .get(handle) as { id: number } | undefined;
    if (!existing || existing.id === id) break;
    handle = `${baseHandle}-${suffix++}`;
  }

  const values = [
    handle,
    title,
    text(data, "description"),
    text(data, "image"),
    numberValue(data, "sortOrder"),
    data.get("active") === "on" ? 1 : 0,
  ];

  if (id) {
    db.prepare(
      `UPDATE collections SET handle = ?, title = ?, description = ?, image = ?, sort_order = ?, active = ? WHERE id = ?`
    ).run(...values, id);
  } else {
    db.prepare(
      `INSERT INTO collections (handle, title, description, image, sort_order, active) VALUES (?, ?, ?, ?, ?, ?)`
    ).run(...values);
  }

  refreshStorefront();
  revalidatePath("/admin/collections");
  redirect("/admin/collections?saved=1");
}

export async function deleteCollection(data: FormData): Promise<void> {
  await requireAdmin();
  const id = numberValue(data, "id");
  if (!id) return;
  getDatabase().prepare("DELETE FROM collections WHERE id = ?").run(id);
  refreshStorefront();
  revalidatePath("/admin/collections");
  redirect("/admin/collections?deleted=1");
}

/* ── Coupons ──────────────────────────────────────────────────────────── */

export async function saveCoupon(data: FormData): Promise<void> {
  await requireAdmin();
  const db = getDatabase();
  const id = numberValue(data, "id") || null;
  const code = text(data, "code").toUpperCase();
  if (!code) throw new Error("A coupon code is required.");
  const expiresRaw = text(data, "expiresAt");
  const expiresAt = expiresRaw ? new Date(`${expiresRaw}T23:59:59`).toISOString() : null;
  const values = [
    code,
    text(data, "type", "percent") === "fixed" ? "fixed" : "percent",
    Math.max(0, numberValue(data, "value")),
    Math.max(0, numberValue(data, "minSubtotal")),
    Math.max(0, numberValue(data, "maxUses")),
    data.get("active") === "on" ? 1 : 0,
    expiresAt,
  ];

  if (id) {
    db.prepare(
      `UPDATE coupons SET code = ?, type = ?, value = ?, min_subtotal = ?, max_uses = ?, active = ?, expires_at = ? WHERE id = ?`
    ).run(...values, id);
  } else {
    db.prepare(
      `INSERT INTO coupons (code, type, value, min_subtotal, max_uses, used_count, active, expires_at)
       VALUES (?, ?, ?, ?, ?, 0, ?, ?)`
    ).run(...values);
  }

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons?saved=1");
}

export async function toggleCoupon(data: FormData): Promise<void> {
  await requireAdmin();
  const id = numberValue(data, "id");
  if (!id) return;
  getDatabase()
    .prepare("UPDATE coupons SET active = CASE active WHEN 1 THEN 0 ELSE 1 END WHERE id = ?")
    .run(id);
  revalidatePath("/admin/coupons");
}

export async function deleteCoupon(data: FormData): Promise<void> {
  await requireAdmin();
  const id = numberValue(data, "id");
  if (!id) return;
  getDatabase().prepare("DELETE FROM coupons WHERE id = ?").run(id);
  revalidatePath("/admin/coupons");
  redirect("/admin/coupons?deleted=1");
}

/* ── Orders ───────────────────────────────────────────────────────────── */

export async function updateOrder(data: FormData): Promise<void> {
  await requireAdmin();
  const id = numberValue(data, "id");
  if (!id) return;
  const status = text(data, "status", "placed");
  const paymentStatus = text(data, "paymentStatus", "pending");
  const notes = text(data, "notes");
  getDatabase()
    .prepare(
      `UPDATE orders SET status = ?, payment_status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    )
    .run(status, paymentStatus, notes, id);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  redirect(`/admin/orders/${id}?saved=1`);
}

/* ── Reviews ──────────────────────────────────────────────────────────── */

export async function setReviewApproval(data: FormData): Promise<void> {
  await requireAdmin();
  const id = numberValue(data, "id");
  const approved = data.get("approved") === "1" ? 1 : 0;
  if (!id) return;
  getDatabase().prepare("UPDATE reviews SET approved = ? WHERE id = ?").run(approved, id);
  refreshStorefront();
  revalidatePath("/admin/reviews");
}

export async function deleteReview(data: FormData): Promise<void> {
  await requireAdmin();
  const id = numberValue(data, "id");
  if (!id) return;
  getDatabase().prepare("DELETE FROM reviews WHERE id = ?").run(id);
  refreshStorefront();
  revalidatePath("/admin/reviews");
}

/* ── Messages & subscribers ───────────────────────────────────────────── */

export async function setMessageStatus(data: FormData): Promise<void> {
  await requireAdmin();
  const id = numberValue(data, "id");
  const status = text(data, "status", "read");
  if (!id) return;
  getDatabase().prepare("UPDATE messages SET status = ? WHERE id = ?").run(status, id);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(data: FormData): Promise<void> {
  await requireAdmin();
  const id = numberValue(data, "id");
  if (!id) return;
  getDatabase().prepare("DELETE FROM messages WHERE id = ?").run(id);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteSubscriber(data: FormData): Promise<void> {
  await requireAdmin();
  const id = numberValue(data, "id");
  if (!id) return;
  getDatabase().prepare("DELETE FROM subscribers WHERE id = ?").run(id);
  revalidatePath("/admin/newsletter");
}

/* ── Settings ─────────────────────────────────────────────────────────── */

const SETTING_KEYS = [
  "storeName",
  "announcement",
  "email",
  "phone",
  "address",
  "instagram",
  "freeShippingThreshold",
  "shippingFee",
  "codFee",
  "codEnabled",
  "paymentMode",
  "razorpayTestKey",
  "gstin",
] as const;

export async function saveSettings(data: FormData): Promise<void> {
  await requireAdmin();
  const db = getDatabase();
  const statement = db.prepare(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  );
  for (const key of SETTING_KEYS) {
    if (key === "codEnabled") {
      statement.run(key, data.get("codEnabled") === "on" ? "1" : "0");
      continue;
    }
    const value = text(data, key);
    if (value) statement.run(key, value);
  }
  refreshStorefront();
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}
