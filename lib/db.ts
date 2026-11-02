import { createHash, randomBytes } from "node:crypto";
import { getDatabase } from "./database";
import type {
  Collection,
  Coupon,
  Message,
  Order,
  Product,
  Review,
  Subscriber,
  User,
} from "./types";

/* ────────────────────────────────────────────────────────────────────────
   Row mapping
   ──────────────────────────────────────────────────────────────────────── */

type Row = Record<string, any>;

function parseJSON<T>(value: unknown, fallback: T): T {
  try {
    return JSON.parse(String(value ?? "")) as T;
  } catch {
    return fallback;
  }
}

function mapProduct(row: Row): Product {
  return {
    id: row.id,
    handle: row.handle,
    title: row.title,
    category: row.category,
    price: row.price,
    compareAtPrice: row.compare_at_price ?? null,
    sku: row.sku ?? "",
    stock: row.stock,
    sizes: parseJSON<string[]>(row.sizes, []),
    colors: parseJSON<string[]>(row.colors, []),
    collections: parseJSON<string[]>(row.collections, []),
    description: row.description ?? "",
    lead: row.lead ?? "",
    highlights: parseJSON<string[]>(row.highlights, []),
    images: parseJSON<string[]>(row.images, []),
    featured: Boolean(row.featured),
    active: Boolean(row.active),
    badge: row.badge ?? null,
    rating: Number(row.rating ?? 5),
    reviewCount: Number(row.review_count ?? 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapCollection(row: Row): Collection {
  return {
    id: row.id,
    handle: row.handle,
    title: row.title,
    description: row.description ?? "",
    image: row.image ?? "",
    sortOrder: row.sort_order,
    active: Boolean(row.active),
    productCount: row.product_count != null ? Number(row.product_count) : undefined,
  };
}

function mapOrder(row: Row): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    accessToken: row.access_token,
    customerName: row.customer_name,
    email: row.email,
    phone: row.phone,
    address: parseJSON(row.address, {
      line1: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    }),
    items: parseJSON(row.items, []),
    subtotal: row.subtotal,
    discount: row.discount,
    shipping: row.shipping,
    codFee: row.cod_fee,
    total: row.total,
    couponCode: row.coupon_code,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    paymentId: row.payment_id,
    status: row.status,
    notes: row.notes ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapUser(row: Row): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    createdAt: row.created_at,
  };
}

function mapCoupon(row: Row): Coupon {
  return {
    id: row.id,
    code: row.code,
    type: row.type,
    value: row.value,
    minSubtotal: row.min_subtotal,
    maxUses: row.max_uses,
    usedCount: row.used_count,
    active: Boolean(row.active),
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  };
}

function mapReview(row: Row): Review {
  return {
    id: row.id,
    productId: row.product_id,
    name: row.name,
    rating: row.rating,
    title: row.title,
    body: row.body,
    approved: Boolean(row.approved),
    createdAt: row.created_at,
  };
}

/* ────────────────────────────────────────────────────────────────────────
   Products
   ──────────────────────────────────────────────────────────────────────── */

export type ProductQuery = {
  collection?: string;
  q?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "newest" | "rating";
  size?: string;
  maxPrice?: number;
  includeInactive?: boolean;
  featuredOnly?: boolean;
  limit?: number;
  offset?: number;
};

export function listProducts(query: ProductQuery = {}): Product[] {
  const db = getDatabase();
  let rows = db
    .prepare(
      query.includeInactive
        ? "SELECT * FROM products ORDER BY sort_order ASC, id DESC"
        : "SELECT * FROM products WHERE active = 1 ORDER BY sort_order ASC, id DESC"
    )
    .all() as Row[];

  let products = rows.map(mapProduct);

  if (query.collection) {
    products = products.filter((p) => p.collections.includes(query.collection!));
  }
  if (query.featuredOnly) products = products.filter((p) => p.featured);
  if (query.size) {
    products = products.filter((p) =>
      p.sizes.some((s) => s.toLowerCase() === query.size!.toLowerCase())
    );
  }
  if (query.maxPrice != null) {
    products = products.filter((p) => p.price <= query.maxPrice!);
  }
  if (query.q) {
    const q = query.q.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.colors.some((c) => c.toLowerCase().includes(q)) ||
        p.collections.some((c) => c.includes(q.replace(/\s+/g, "-")))
    );
  }

  switch (query.sort) {
    case "price-asc":
      products.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      products.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      products.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "rating":
      products.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    default:
      products.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          Number(Boolean(b.compareAtPrice)) - Number(Boolean(a.compareAtPrice))
      );
  }

  const offset = query.offset ?? 0;
  if (query.limit) products = products.slice(offset, offset + query.limit);
  return products;
}

export function getProduct(handle: string): Product | null {
  const row = getDatabase()
    .prepare("SELECT * FROM products WHERE handle = ?")
    .get(handle) as Row | undefined;
  return row ? mapProduct(row) : null;
}

export function getProductById(id: number): Product | null {
  const row = getDatabase()
    .prepare("SELECT * FROM products WHERE id = ?")
    .get(id) as Row | undefined;
  return row ? mapProduct(row) : null;
}

export function getFeatured(limit = 8): Product[] {
  return listProducts({ featuredOnly: true, limit });
}

export function getRelated(product: Product, limit = 4): Product[] {
  const all = listProducts({ limit: 100 });
  const scored = all
    .filter((p) => p.id !== product.id)
    .map((p) => {
      let score = 0;
      if (p.category === product.category) score += 4;
      score += p.collections.filter((c) => product.collections.includes(c)).length;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score || b.p.rating - a.p.rating)
    .map((x) => x.p);
  return scored.slice(0, limit);
}

export function getAllSizes(): string[] {
  const products = listProducts({});
  return [...new Set(products.flatMap((p) => p.sizes))];
}

export function lowStockProducts(threshold = 10): Product[] {
  return listProducts({ includeInactive: true })
    .filter((p) => p.stock <= threshold)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 8);
}

/* ────────────────────────────────────────────────────────────────────────
   Collections
   ──────────────────────────────────────────────────────────────────────── */

export function listCollections(includeInactive = false): Collection[] {
  const rows = getDatabase()
    .prepare(
      includeInactive
        ? "SELECT * FROM collections ORDER BY sort_order ASC, id ASC"
        : "SELECT * FROM collections WHERE active = 1 ORDER BY sort_order ASC, id ASC"
    )
    .all() as Row[];
  const products = listProducts({});
  return rows.map((row) => {
    const c = mapCollection(row);
    c.productCount = products.filter((p) => p.collections.includes(c.handle)).length;
    return c;
  });
}

export function getCollection(handle: string): Collection | null {
  const row = getDatabase()
    .prepare("SELECT * FROM collections WHERE handle = ?")
    .get(handle) as Row | undefined;
  if (!row) return null;
  const c = mapCollection(row);
  c.productCount = listProducts({ collection: handle }).length;
  return c;
}

/* ────────────────────────────────────────────────────────────────────────
   Orders
   ──────────────────────────────────────────────────────────────────────── */

export function listOrders(): Order[] {
  const rows = getDatabase()
    .prepare("SELECT * FROM orders ORDER BY created_at DESC")
    .all() as Row[];
  return rows.map(mapOrder);
}

export function getOrderByNumber(orderNumber: string): Order | null {
  const row = getDatabase()
    .prepare("SELECT * FROM orders WHERE order_number = ?")
    .get(orderNumber) as Row | undefined;
  return row ? mapOrder(row) : null;
}

export function getOrderById(id: number): Order | null {
  const row = getDatabase()
    .prepare("SELECT * FROM orders WHERE id = ?")
    .get(id) as Row | undefined;
  return row ? mapOrder(row) : null;
}

export function getOrdersByEmail(email: string): Order[] {
  const rows = getDatabase()
    .prepare("SELECT * FROM orders WHERE lower(email) = lower(?) ORDER BY created_at DESC")
    .all(email) as Row[];
  return rows.map(mapOrder);
}

export function ordersForCustomer(email: string): Order[] {
  return getOrdersByEmail(email);
}

export type NewOrderInput = {
  customerName: string;
  email: string;
  phone: string;
  address: Record<string, string>;
  items: {
    productId: number;
    handle: string;
    title: string;
    image: string;
    price: number;
    size: string;
    color: string;
    qty: number;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  codFee: number;
  total: number;
  couponCode: string | null;
  paymentMethod: string;
  paymentStatus: "paid" | "pending";
  paymentId: string | null;
  notes?: string;
};

export type CreatedOrder = { order: Order; token: string };

export function createOrder(input: NewOrderInput): CreatedOrder {
  const db = getDatabase();
  db.exec("BEGIN IMMEDIATE");
  try {
    const orderNumber = `BC-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 9 + 1)}`;
    const token = randomBytes(20).toString("hex");

    for (const item of input.items) {
      const product = getProductById(item.productId);
      if (!product || !product.active) {
        throw new Error(`${item.title} is no longer available.`);
      }
      if (product.stock < item.qty) {
        throw new Error(
          `Only ${product.stock} left of ${item.title}. Please update your bag.`
        );
      }
    }

    for (const item of input.items) {
      db.prepare(
        "UPDATE products SET stock = stock - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
      ).run(item.qty, item.productId);
    }

    if (input.couponCode) {
      db.prepare(
        "UPDATE coupons SET used_count = used_count + 1 WHERE upper(code) = upper(?)"
      ).run(input.couponCode);
    }

    db.prepare(
      `INSERT INTO orders (
        order_number, access_token, customer_name, email, phone, address, items,
        subtotal, discount, shipping, cod_fee, total, coupon_code,
        payment_method, payment_status, payment_id, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'placed', ?)`
    ).run(
      orderNumber,
      token,
      input.customerName,
      input.email,
      input.phone,
      JSON.stringify(input.address),
      JSON.stringify(input.items),
      input.subtotal,
      input.discount,
      input.shipping,
      input.codFee,
      input.total,
      input.couponCode,
      input.paymentMethod,
      input.paymentStatus,
      input.paymentId,
      input.notes ?? ""
    );

    db.exec("COMMIT");
    const order = getOrderByNumber(orderNumber);
    if (!order) throw new Error("Could not create order");
    return { order, token };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function updateOrder(
  id: number,
  patch: { status?: string; paymentStatus?: string; notes?: string }
): void {
  const fields: string[] = [];
  const values: any[] = [];
  if (patch.status) {
    fields.push("status = ?");
    values.push(patch.status);
  }
  if (patch.paymentStatus) {
    fields.push("payment_status = ?");
    values.push(patch.paymentStatus);
  }
  if (patch.notes !== undefined) {
    fields.push("notes = ?");
    values.push(patch.notes);
  }
  if (!fields.length) return;
  values.push(id);
  getDatabase()
    .prepare(
      `UPDATE orders SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    )
    .run(...values);
}

/* ────────────────────────────────────────────────────────────────────────
   Auth
   ──────────────────────────────────────────────────────────────────────── */

export function findUserByEmail(email: string): (User & { passwordHash: string }) | null {
  const row = getDatabase()
    .prepare("SELECT * FROM users WHERE lower(email) = lower(?)")
    .get(email) as Row | undefined;
  if (!row) return null;
  return { ...mapUser(row), passwordHash: row.password_hash };
}

export function createUser(input: {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
}): User {
  const db = getDatabase();
  db.prepare(
    "INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, 'customer')"
  ).run(input.name, input.email.toLowerCase(), input.phone, input.passwordHash);
  const row = db
    .prepare("SELECT * FROM users WHERE lower(email) = lower(?)")
    .get(input.email) as Row;
  return mapUser(row);
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createSession(userId: number, role: "admin" | "customer"): string {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 7 * 86400000).toISOString();
  getDatabase()
    .prepare(
      "INSERT INTO sessions (token, user_id, role, expires_at) VALUES (?, ?, ?, ?)"
    )
    .run(hashToken(token), userId, role, expires);
  return token;
}

export function getSessionUser(
  token: string,
  role: "admin" | "customer"
): User | null {
  if (!token) return null;
  const row = getDatabase()
    .prepare(
      `SELECT u.* FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.role = ? AND s.expires_at > datetime('now')`
    )
    .get(hashToken(token), role) as Row | undefined;
  return row ? mapUser(row) : null;
}

export function deleteSession(token: string): void {
  if (!token) return;
  getDatabase()
    .prepare("DELETE FROM sessions WHERE token = ?")
    .run(hashToken(token));
}

export function listCustomers(): (User & { orderCount: number; spent: number })[] {
  const db = getDatabase();
  const users = (
    db.prepare("SELECT * FROM users WHERE role = 'customer' ORDER BY created_at DESC").all() as Row[]
  ).map(mapUser);
  const orders = listOrders();
  return users.map((u) => {
    const mine = orders.filter((o) => o.email.toLowerCase() === u.email.toLowerCase());
    return {
      ...u,
      orderCount: mine.length,
      spent: mine
        .filter((o) => o.status !== "cancelled" && o.status !== "returned")
        .reduce((s, o) => s + o.total, 0),
    };
  });
}

/* ────────────────────────────────────────────────────────────────────────
   Coupons
   ──────────────────────────────────────────────────────────────────────── */

export function listCoupons(): Coupon[] {
  const rows = getDatabase()
    .prepare("SELECT * FROM coupons ORDER BY created_at DESC")
    .all() as Row[];
  return rows.map(mapCoupon);
}

export function getCouponByCode(code: string): Coupon | null {
  const row = getDatabase()
    .prepare("SELECT * FROM coupons WHERE upper(code) = upper(?)")
    .get(code.trim()) as Row | undefined;
  return row ? mapCoupon(row) : null;
}

export function validateCoupon(
  code: string,
  subtotal: number
): { valid: boolean; message: string; coupon?: Coupon; discount?: number } {
  const coupon = getCouponByCode(code);
  if (!coupon) return { valid: false, message: "That code does not exist." };
  if (!coupon.active) return { valid: false, message: "This code is no longer active." };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date())
    return { valid: false, message: "This code has expired." };
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses)
    return { valid: false, message: "This code has reached its usage limit." };
  if (subtotal < coupon.minSubtotal)
    return {
      valid: false,
      message: `Add items worth ₹${(coupon.minSubtotal - subtotal).toLocaleString("en-IN")} more to use this code.`,
    };
  const discount =
    coupon.type === "percent"
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;
  return {
    valid: true,
    message: `${coupon.type === "percent" ? `${coupon.value}% off` : `₹${coupon.value} off`} applied`,
    coupon,
    discount: Math.min(discount, subtotal),
  };
}

/* ────────────────────────────────────────────────────────────────────────
   Reviews
   ──────────────────────────────────────────────────────────────────────── */

export function getProductReviews(productId: number, approvedOnly = true): Review[] {
  const rows = getDatabase()
    .prepare(
      approvedOnly
        ? "SELECT * FROM reviews WHERE product_id = ? AND approved = 1 ORDER BY created_at DESC"
        : "SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC"
    )
    .all(productId) as Row[];
  return rows.map(mapReview);
}

export function listAllReviews(): (Review & { productTitle: string; productHandle: string })[] {
  const rows = getDatabase()
    .prepare(
      `SELECT r.*, p.title AS product_title, p.handle AS product_handle FROM reviews r
       LEFT JOIN products p ON p.id = r.product_id
       ORDER BY r.approved ASC, r.created_at DESC`
    )
    .all() as Row[];
  return rows.map((r) => ({
    ...mapReview(r),
    productTitle: r.product_title ?? "Product",
    productHandle: r.product_handle ?? "",
  }));
}

/* ────────────────────────────────────────────────────────────────────────
   Messages, subscribers, settings
   ──────────────────────────────────────────────────────────────────────── */

export function listMessages(): Message[] {
  const rows = getDatabase()
    .prepare("SELECT * FROM messages ORDER BY created_at DESC")
    .all() as Row[];
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    subject: r.subject,
    message: r.message,
    status: r.status,
    createdAt: r.created_at,
  }));
}

export function createMessage(input: Omit<Message, "id" | "createdAt" | "status">): void {
  getDatabase()
    .prepare(
      "INSERT INTO messages (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, 'new')"
    )
    .run(input.name, input.email, input.phone, input.subject, input.message);
}

export function listSubscribers(): Subscriber[] {
  const rows = getDatabase()
    .prepare("SELECT * FROM subscribers ORDER BY created_at DESC")
    .all() as Row[];
  return rows.map((r) => ({ id: r.id, email: r.email, createdAt: r.created_at }));
}

export function addSubscriber(email: string): boolean {
  try {
    getDatabase()
      .prepare("INSERT INTO subscribers (email) VALUES (?)")
      .run(email.toLowerCase());
    return true;
  } catch {
    return false;
  }
}

export function getSettings(): Record<string, string> {
  const rows = getDatabase().prepare("SELECT * FROM settings").all() as Row[];
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export function updateSettings(values: Record<string, string>): void {
  const stmt = getDatabase().prepare(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  );
  for (const [k, v] of Object.entries(values)) stmt.run(k, v);
}

/* ────────────────────────────────────────────────────────────────────────
   Dashboard
   ──────────────────────────────────────────────────────────────────────── */

export function dashboardStats() {
  const orders = listOrders();
  const products = listProducts({ includeInactive: true });
  const valid = orders.filter((o) => o.status !== "cancelled" && o.status !== "returned");
  const revenue = valid.reduce((s, o) => s + o.total, 0);
  const aov = valid.length ? Math.round(revenue / valid.length) : 0;

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - (13 - i) * 86400000);
    const key = d.toISOString().slice(0, 10);
    const dayOrders = valid.filter((o) => o.createdAt.slice(0, 10) === key);
    return {
      label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      revenue: dayOrders.reduce((s, o) => s + o.total, 0),
      orders: dayOrders.length,
    };
  });

  const itemTotals = new Map<string, { title: string; qty: number; revenue: number; image: string }>();
  for (const o of valid) {
    for (const item of o.items) {
      const key = item.handle;
      const prev = itemTotals.get(key) || {
        title: item.title,
        qty: 0,
        revenue: 0,
        image: item.image,
      };
      prev.qty += item.qty;
      prev.revenue += item.qty * item.price;
      itemTotals.set(key, prev);
    }
  }
  const topProducts = [...itemTotals.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);
  const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  return {
    revenue,
    orders: orders.length,
    aov,
    customers: listCustomers().length,
    products: products.length,
    lowStock: products.filter((p) => p.stock <= 10).length,
    pending: orders.filter((o) => o.status === "placed" || o.status === "confirmed").length,
    days,
    topProducts,
    statusCounts,
    recentOrders: orders.slice(0, 6),
  };
}
