import fs from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { hashPassword } from "./password";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, COD_FEE } from "./money";

type CatalogProduct = {
  handle: string;
  title: string;
  category: string;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  stock: number;
  sizes: string[];
  colors: string[];
  collections: string[];
  featured: boolean;
  badge: string | null;
  rating: number;
  reviewCount: number;
  description: string;
  lead: string;
  highlights: string[];
  images: string[];
  publishedAt: string;
};

type CatalogCollection = {
  handle: string;
  title: string;
  description: string;
  image: string;
  sortOrder: number;
};

type Catalog = {
  products: CatalogProduct[];
  collections: CatalogCollection[];
};

const COLLECTION_COPY: Record<string, string> = {
  "new-born-essentials":
    "Everything for the first tiny days — soft muslin, gentle cottons and the little things you will reach for again and again.",
  "baby-girl":
    "Sweet silhouettes, muted florals and heirloom details for her first chapters. Made to be twirled in.",
  "baby-boy":
    "Easy denims, waffle knits and comfy co-ords for busy little days of play, naps and discovery.",
  "newborn-comfort-combo-set":
    "Thoughtfully bundled sets that take the guesswork out of the hospital bag. Ready to gift, ready for the first hello.",
  "size-0-6m":
    "Tiny sizes, enormous softness. A considered edit of everyday essentials for ages 0–6 months.",
  "size-6-12m":
    "Room to wriggle, crawl and take those first wobbly steps. Comfort-first pieces for 6–12 months.",
  accessories:
    "The finishing touches: swaddles, blankets, caps, bows and socks, in fabrics gentle enough for the newest skin.",
  "special-offers":
    "A small edit of best-loved pieces at softer prices. Limited stock, once they are gone, they are gone.",
};

const SAMPLE_REVIEWS: Record<string, { name: string; rating: number; title: string; body: string }[]> = {
  "baby-face-towels": [
    {
      name: "Priya N.",
      rating: 5,
      title: "Softer than expected",
      body: "Bought these for my newborn and ended up ordering a second set. They wash beautifully and stay soft.",
    },
    {
      name: "Sneha V.",
      rating: 5,
      title: "Perfect little towels",
      body: "The size is just right for face and hands. The prints are adorable without being loud.",
    },
  ],
  "kimono-muslin-romper-copy": [
    {
      name: "Ananya R.",
      rating: 5,
      title: "Our most-worn romper",
      body: "The kimono opening makes dressing so easy. My daughter has worn it on repeat and it still looks new.",
    },
    {
      name: "Ishita M.",
      rating: 5,
      title: "Beautiful fabric",
      body: "Light, breathable and genuinely gentle. Perfect for Chennai summers.",
    },
  ],
  "muslin-cloth-1": [
    {
      name: "Divya S.",
      rating: 5,
      title: "The everyday essential",
      body: "I have one in every bag and at every feeding station. Absorbent and soft after many washes.",
    },
    {
      name: "Rhea M.",
      rating: 5,
      title: "Lovely quality",
      body: "Thick enough to be useful, light enough to dry quickly. The prints are lovely.",
    },
  ],
  "cozy-blanket": [
    {
      name: "Meera & Kabir",
      rating: 5,
      title: "Heirloom quality",
      body: "The blanket is beautiful enough to gift and soft enough for daily use. We are keeping this one forever.",
    },
    {
      name: "Aisha K.",
      rating: 4,
      title: "Beautiful drape",
      body: "Gorgeous colour and a lovely weight. Took a day longer to arrive than expected but worth it.",
    },
  ],
  "muslin-swaddle": [
    {
      name: "Nandini P.",
      rating: 5,
      title: "Best swaddle we tried",
      body: "Breathable and big enough to actually wrap a wriggly baby. The muslin gets softer every wash.",
    },
  ],
};

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function sampleOrderNumber(i: number): string {
  return `BC-${10020 + i}`;
}

export function seedDatabase(db: DatabaseSync): void {
  const catalogPath = path.join(process.cwd(), "data", "catalog.json");
  if (!fs.existsSync(catalogPath)) {
    throw new Error(
      "Missing data/catalog.json. Run `node scripts/build-catalog.mjs` first."
    );
  }
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8")) as Catalog;

  db.exec("BEGIN IMMEDIATE");
  try {
    const existing = db
      .prepare("SELECT COUNT(*) AS count FROM products")
      .get() as { count: number };
    if (existing.count > 0) {
      db.exec("COMMIT");
      return;
    }

    // ── Collections ────────────────────────────────────────────────────
    const insertCollection = db.prepare(
      `INSERT INTO collections (handle, title, description, image, sort_order, active)
       VALUES (?, ?, ?, ?, ?, 1)`
    );
    catalog.collections.forEach((c, i) => {
      insertCollection.run(
        c.handle,
        c.title,
        COLLECTION_COPY[c.handle] || c.description || "",
        c.image,
        i
      );
    });

    // ── Products ───────────────────────────────────────────────────────
    const insertProduct = db.prepare(
      `INSERT INTO products (
        handle, title, category, price, compare_at_price, sku, stock,
        sizes, colors, collections, description, lead, highlights, images,
        featured, active, badge, rating, review_count, sort_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?)`
    );

    catalog.products.forEach((p, i) => {
      insertProduct.run(
        p.handle,
        p.title,
        p.category,
        p.price,
        p.compareAtPrice,
        p.sku,
        p.stock,
        JSON.stringify(p.sizes),
        JSON.stringify(p.colors),
        JSON.stringify(p.collections),
        p.description,
        p.lead,
        JSON.stringify(p.highlights),
        JSON.stringify(p.images),
        p.featured ? 1 : 0,
        p.badge,
        p.rating,
        p.reviewCount,
        i,
        p.publishedAt || new Date().toISOString(),
        p.publishedAt || new Date().toISOString()
      );
    });

    // ── Admin & sample customers ───────────────────────────────────────
    const adminEmail = process.env.ADMIN_EMAIL || "admin@babycon.in";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
    const insertUser = db.prepare(
      `INSERT INTO users (name, email, phone, password_hash, role)
       VALUES (?, ?, ?, ?, ?)`
    );
    insertUser.run(
      "Babycon Admin",
      adminEmail,
      "+91 98765 43210",
      hashPassword(adminPassword),
      "admin"
    );

    const customers = [
      { name: "Ananya Rao", email: "ananya@example.com", phone: "9845012345" },
      { name: "Meera Shah", email: "meera@example.com", phone: "9820011223" },
      { name: "Divya Subramanian", email: "divya@example.com", phone: "9444055667" },
      { name: "Rhea Menon", email: "rhea@example.com", phone: "9822099887" },
      { name: "Aisha Khan", email: "aisha@example.com", phone: "9847099881" },
    ];
    const customerPassword = hashPassword("Baby@12345");
    customers.forEach((c) =>
      insertUser.run(c.name, c.email, c.phone, customerPassword, "customer")
    );

    // ── Coupons ────────────────────────────────────────────────────────
    const insertCoupon = db.prepare(
      `INSERT INTO coupons (code, type, value, min_subtotal, max_uses, used_count, active, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, 1, ?)`
    );
    const nextYear = new Date(Date.now() + 365 * 86400000).toISOString();
    insertCoupon.run("WELCOME10", "percent", 10, 999, 500, 38, nextYear);
    insertCoupon.run("BABYCON200", "fixed", 200, 1999, 300, 12, nextYear);
    insertCoupon.run("SOFTSTART15", "percent", 15, 2499, 150, 4, nextYear);

    // ── Settings ───────────────────────────────────────────────────────
    const settings: Record<string, string> = {
      storeName: "babycon",
      announcement: "Free shipping on orders over ₹1,499",
      email: "care@babycon.in",
      phone: "+91 98765 43210",
      address: "No. 12, Kutchery Road, Mylapore, Chennai 600 004",
      instagram: "https://instagram.com",
      freeShippingThreshold: String(FREE_SHIPPING_THRESHOLD),
      shippingFee: String(SHIPPING_FEE),
      codFee: String(COD_FEE),
      codEnabled: "1",
      paymentMode: "demo",
      razorpayTestKey: "rzp_test_BabyconDemo",
      gstin: "33ABCFB1234C1ZQ",
    };
    const insertSetting = db.prepare(
      "INSERT INTO settings (key, value) VALUES (?, ?)"
    );
    Object.entries(settings).forEach(([k, v]) => insertSetting.run(k, v));

    // ── Sample orders ──────────────────────────────────────────────────
    const allProducts = db
      .prepare("SELECT id, handle, title, price, images, sizes, colors FROM products ORDER BY id")
      .all() as {
      id: number;
      handle: string;
      title: string;
      price: number;
      images: string;
      sizes: string;
      colors: string;
    }[];

    let seed = 42;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };

    const insertOrder = db.prepare(
      `INSERT INTO orders (
        order_number, access_token, customer_name, email, phone, address, items,
        subtotal, discount, shipping, cod_fee, total, coupon_code,
        payment_method, payment_status, payment_id, status, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const cityState: Record<string, [string, string, string]> = {
      Chennai: ["Tamil Nadu", "600004", "Mylapore"],
      Bengaluru: ["Karnataka", "560001", "Indiranagar"],
      Mumbai: ["Maharashtra", "400050", "Bandra West"],
      Hyderabad: ["Telangana", "500081", "Gachibowli"],
      Kochi: ["Kerala", "682016", "Panampilly Nagar"],
    };
    const cities = Object.keys(cityState);
    const statuses = [
      "delivered",
      "delivered",
      "delivered",
      "shipped",
      "shipped",
      "confirmed",
      "confirmed",
      "placed",
      "placed",
      "placed",
      "packed",
      "packed",
      "delivered",
      "cancelled",
      "returned",
      "delivered",
    ];
    const methods = ["UPI (Demo)", "Card (Demo)", "COD", "Netbanking (Demo)"];

    statuses.forEach((status, i) => {
      const customer = customers[i % customers.length];
      const city = cities[i % cities.length];
      const [state, pincode, area] = cityState[city];
      const method = i % 3 === 0 ? "COD" : pick(methods.filter((m) => m !== "COD"), rand);
      const itemCount = 1 + Math.floor(rand() * 3);
      const chosen = new Set<number>();
      while (chosen.size < itemCount) chosen.add(Math.floor(rand() * allProducts.length));
      const items = [...chosen].map((idx) => {
        const p = allProducts[idx];
        const sizes = JSON.parse(p.sizes) as string[];
        const colors = JSON.parse(p.colors) as string[];
        const images = JSON.parse(p.images) as string[];
        return {
          productId: p.id,
          handle: p.handle,
          title: p.title,
          image: images[0] || "",
          price: p.price,
          size: sizes[0] || "One Size",
          color: colors[0] || "",
          qty: 1 + (rand() > 0.78 ? 1 : 0),
        };
      });
      const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
      const couponCode = i % 4 === 0 ? "WELCOME10" : null;
      const discount = couponCode ? Math.round(subtotal * 0.1) : 0;
      const shipping = subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
      const codFee = method === "COD" ? COD_FEE : 0;
      const total = subtotal - discount + shipping + codFee;
      const createdAt = new Date(
        Date.now() - Math.floor(rand() * 27 + 1) * 86400000 - Math.floor(rand() * 12) * 3600000
      ).toISOString();
      const paymentStatus =
        method === "COD"
          ? status === "delivered"
            ? "paid"
            : "pending"
          : status === "cancelled"
            ? "refunded"
            : "paid";
      const paymentId =
        method === "COD" ? null : `pay_demo_${randomBytes(6).toString("hex")}`;

      insertOrder.run(
        sampleOrderNumber(i),
        randomBytes(16).toString("hex"),
        customer.name,
        customer.email,
        customer.phone,
        JSON.stringify({
          line1: `${10 + i} ${area} Main Road`,
          line2: i % 3 === 0 ? "Near Babycon Studio" : "",
          city,
          state,
          pincode,
          country: "India",
        }),
        JSON.stringify(items),
        subtotal,
        discount,
        shipping,
        codFee,
        total,
        couponCode,
        method,
        paymentStatus,
        paymentId,
        status,
        i === 13 ? "Customer requested cancellation before dispatch." : "",
        createdAt,
        createdAt
      );
    });

    // ── Reviews ────────────────────────────────────────────────────────
    const insertReview = db.prepare(
      `INSERT INTO reviews (product_id, name, rating, title, body, approved, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    for (const [handle, reviews] of Object.entries(SAMPLE_REVIEWS)) {
      const p = allProducts.find((x) => x.handle === handle);
      if (!p) continue;
      reviews.forEach((r, idx) => {
        insertReview.run(
          p.id,
          r.name,
          r.rating,
          r.title,
          r.body,
          1,
          new Date(Date.now() - (idx + 1) * 9 * 86400000).toISOString()
        );
      });
    }
    // A couple waiting for moderation so the admin has something to action.
    const pendingProduct = allProducts.find((p) => p.handle === "cozy-blanket");
    if (pendingProduct) {
      insertReview.run(
        pendingProduct.id,
        "Kavya S.",
        5,
        "Lovely gift",
        "Bought this for a friend's baby shower. The packaging was beautiful.",
        0,
        new Date(Date.now() - 2 * 86400000).toISOString()
      );
    }

    // ── Messages & subscribers ─────────────────────────────────────────
    const insertMessage = db.prepare(
      `INSERT INTO messages (name, email, phone, subject, message, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    insertMessage.run(
      "Shruti Iyer",
      "shruti@example.com",
      "9840011122",
      "Sizing help",
      "My baby is 4 months and 6.2kg. Would the 3–6 month kimono romper fit for a few more weeks?",
      "new",
      new Date(Date.now() - 5 * 3600000).toISOString()
    );
    insertMessage.run(
      "Arjun Nair",
      "arjun@example.com",
      "9895033344",
      "Bulk gifting",
      "We would like to order 25 newborn combo sets for a corporate gifting initiative. Could you share pricing?",
      "read",
      new Date(Date.now() - 2 * 86400000).toISOString()
    );
    insertMessage.run(
      "Tanvi Kapoor",
      "tanvi@example.com",
      "",
      "Order follow-up",
      "The muslin swaddle is gorgeous. Do you restock the sage colour?",
      "replied",
      new Date(Date.now() - 4 * 86400000).toISOString()
    );

    const insertSubscriber = db.prepare(
      "INSERT INTO subscribers (email, created_at) VALUES (?, ?)"
    );
    ["hello@example.com", "priya@example.com", "meera@example.com", "divya@example.com", "rhea@example.com"].forEach(
      (email, i) =>
        insertSubscriber.run(
          email,
          new Date(Date.now() - i * 4 * 86400000).toISOString()
        )
    );

    db.prepare("INSERT INTO meta (key, value) VALUES ('seed_version', '1')").run();
    db.prepare(
      "INSERT INTO meta (key, value) VALUES ('seeded_at', ?)"
    ).run(new Date().toISOString());

    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
