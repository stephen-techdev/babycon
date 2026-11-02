/**
 * Builds data/catalog.json from the reference storefront export and downloads
 * imagery into public/images so the storefront works offline and loads fast.
 *
 * Run: node scripts/build-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const rawDir = path.join(root, "data", "raw");
const imagesDir = path.join(root, "public", "images");
const productImgDir = path.join(imagesDir, "products");
const collectionImgDir = path.join(imagesDir, "collections");
const bannerImgDir = path.join(imagesDir, "banners");

for (const dir of [productImgDir, collectionImgDir, bannerImgDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

const raw = JSON.parse(fs.readFileSync(path.join(rawDir, "all.json"), "utf8"));
const rawCollections = JSON.parse(
  fs.readFileSync(path.join(rawDir, "collections.json"), "utf8")
);

const FEATURED = new Set([
  "baby-face-towels",
  "kimono-muslin-romper-copy",
  "muslin-cloth-1",
  "cozy-blanket",
  "helloworld-3-pcs-set-copy",
  "muslin-swaddle",
  "helloworld-3-pcs-set-brown",
  "kimono-muslin-romper-copy-2",
]);

const COLLECTION_ORDER = [
  "new-born-essentials",
  "baby-girl",
  "baby-boy",
  "newborn-comfort-combo-set",
  "size-0-6m",
  "size-6-12m",
  "accessories",
  "special-offers",
];

const SLUG = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function cleanText(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function categoryOf(p) {
  const t = p.title.toLowerCase();
  if (/(combo|3 pcs|3 piece|welcome|comfort set)/.test(t)) return "Sets & Combos";
  if (/(blanket|swaddle|sleeping bag|wrapper|quilts)/.test(t)) return "Blankets & Swaddles";
  if (/(towel|burp|changing mat|bath)/.test(t)) return "Bath & Care";
  if (/(frock|dress|belle|gown|tulle)/.test(t)) return "Dresses";
  if (/(dungaree|pinafore)/.test(t)) return "Dungarees";
  if (/(cordset|co-ord|coord|pants|hoodie|sweater|jumpsuit|set)/.test(t)) return "Co-ords & Sets";
  if (/(romper|onesie|sleepsuit|bodysuit)/.test(t)) return "Rompers & Onesies";
  if (/(sock|cap|beanie|bow|mitten|booties|bonnet)/.test(t)) return "Accessories";
  if (/(muslin cloth)/.test(t)) return "Muslin Cloths";
  return "Everyday Essentials";
}

const SIZE_ORDER = [
  "0-3 months",
  "0-6 months",
  "3-6 months",
  "6-9 months",
  "6-12 months",
  "9-12 months",
  "12-18 months",
  "18-24 months",
  "0-3m",
  "0-6m",
  "3-6m",
  "6-12m",
  "9-12m",
];

function normalizeSize(s) {
  const v = String(s).trim();
  if (!v || /default title/i.test(v)) return "One Size";
  return v.replace(/\s+/g, " ");
}

function sizeRank(s) {
  const idx = SIZE_ORDER.indexOf(s.toLowerCase());
  return idx === -1 ? 99 : idx;
}

function buildDescription(p, category) {
  const title = p.title.replace(/\s+/g, " ").trim();
  let lead, body, bullets;

  if (category === "Blankets & Swaddles") {
    lead = `${title} — a whisper-soft layer made for naps, cuddles and everything in between.`;
    body =
      "Woven from breathable muslin cotton, this piece gets softer with every wash while staying light enough for year-round comfort. Generously sized so it can be used as a swaddle, nursing cover, pram blanket or play mat.";
    bullets = [
      "Premium breathable muslin cotton",
      "Gets softer with every wash",
      "Generous size for swaddling & cuddles",
      "Gentle on delicate newborn skin",
    ];
  } else if (category === "Bath & Care") {
    lead = `${title} — everyday care, made gentler.`;
    body =
      "Made from plush, quick-drying muslin cotton that is kind to delicate skin. Lightweight, absorbent and beautifully finished, it is designed to make bath time and daily clean-ups feel effortless.";
    bullets = [
      "Ultra-soft, absorbent muslin cotton",
      "Quick drying & lightweight",
      "Ideal for bath, feeding and travel",
      "Thoughtfully finished edges",
    ];
  } else if (category === "Accessories") {
    lead = `${title} — the sweetest finishing touch to every little outfit.`;
    body =
      "Soft, stretchy and comfortable from the first wear. Designed to stay put through wiggles and naps, with gentle materials that never dig or itch.";
    bullets = [
      "Skin-friendly, soft-touch yarn",
      "Comfortable stretch fit",
      "Perfect for gifting & first photos",
      "Easy care, long lasting",
    ];
  } else if (category === "Dresses") {
    lead = `${title} — made for tiny celebrations and ordinary magic.`;
    body =
      "A beautifully finished piece in soft, breathable fabric with thoughtful details at the neckline and hem. Easy to slip on, easy to move in and lovely enough for the moments you will want to remember.";
    bullets = [
      "Soft, breathable premium fabric",
      "Easy dressing with snap or button closure",
      "Delicate, machine-washable finish",
      "Designed for special days & everyday twirls",
    ];
  } else if (category === "Dungarees") {
    lead = `${title} — playful, practical and impossibly cute.`;
    body =
      "Cut from durable, soft cotton with an adjustable fit and easy-access snaps. Roomy enough for cloth nappies and active play, and finished with details that make every outfit feel special.";
    bullets = [
      "Soft yet durable cotton",
      "Adjustable straps for a growing fit",
      "Snap closure for quick changes",
      "Layers beautifully over tees & bodysuits",
    ];
  } else if (category === "Sets & Combos") {
    lead = `${title} — a ready-made outfit for life's little moments.`;
    body =
      "This thoughtfully curated set brings together soft, breathable pieces that mix, match and layer beautifully. Finished with gentle seams and easy closures, it is the sweetest shortcut to a put-together look.";
    bullets = [
      "Coordinated pieces in premium cotton",
      "Soft, breathable & gentle on skin",
      "Easy dressing for everyday adventures",
      "Beautifully boxed for gifting",
    ];
  } else if (category === "Co-ords & Sets") {
    lead = `${title} — comfort-first essentials for busy little days.`;
    body =
      "Made from soft, stretch-friendly cotton with a relaxed fit that moves how they move. Easy to put on, easy to wash and easy to love — the kind of piece that becomes part of the weekly rotation.";
    bullets = [
      "Premium soft-touch cotton",
      "Stretch comfort waistband",
      "Breathable for all-day wear",
      "Machine washable, keeps its shape",
    ];
  } else if (category === "Muslin Cloths") {
    lead = `${title} — the tiny essential you will reach for every single day.`;
    body =
      "Woven from premium muslin cotton, these cloths are absorbent, breathable and wonderfully soft against delicate skin. Use them for feeding, burping, bath time or a quick clean-up at home and on the go.";
    bullets = [
      "Premium soft muslin cotton",
      "Absorbent, breathable & quick drying",
      "Multi-purpose everyday essential",
      "Softens beautifully with each wash",
    ];
  } else {
    lead = `${title} — softness they will live in, all day long.`;
    body =
      "Cut from premium breathable cotton with a comfortable, flexible fit. Thoughtful details like easy snap closures and gentle seams make dressing and changing simple, while the soft hand-feel keeps delicate skin happy.";
    bullets = [
      "Premium, breathable cotton",
      "Easy snap or button closure",
      "Comfortable fit for sleep & play",
      "Made to be washed, worn & loved",
    ];
  }

  return {
    lead,
    html: `<p>${lead}</p><p>${body}</p><h3>Why you'll love it</h3><ul>${bullets
      .map((b) => `<li>${b}</li>`)
      .join("")}</ul><p>Every Babycon piece is designed in small batches and checked by hand, so it feels as good as it looks.</p>`,
    highlights: bullets.slice(0, 3),
  };
}

function parseSizesAndColors(p) {
  const sizeValues = new Set();
  const colorValues = new Set();
  const options = p.options || [];

  for (const opt of options) {
    const name = opt.name.toLowerCase();
    const values = (opt.values || []).map((v) => String(v).trim()).filter(Boolean);
    if (/(size|age|month)/.test(name)) {
      values.forEach((v) => sizeValues.add(normalizeSize(v)));
    } else if (/(color|colour|print|pattern|shade)/.test(name)) {
      values.forEach((v) => colorValues.add(v));
    } else if (name === "title") {
      // default title products
    } else if (/(type|style|target)/.test(name)) {
      // no dedicated field
    }
  }

  if (options.length === 1 && /title/i.test(options[0].name)) {
    sizeValues.add("One Size");
  }

  const variantTitles = (p.variants || []).map((v) => v.title).filter(Boolean);
  if (!sizeValues.size && !colorValues.size && variantTitles.length) {
    const guess = variantTitles.find((t) => /month|size/i.test(t));
    if (guess) sizeValues.add(normalizeSize(guess));
  }

  if (!sizeValues.size) sizeValues.add("One Size");

  return {
    sizes: [...sizeValues].sort((a, b) => sizeRank(a) - sizeRank(b)),
    colors: [...colorValues].slice(0, 10),
  };
}

function collectionsFor(p, category, sizes, hasDiscount) {
  const t = p.title.toLowerCase();
  const sets = new Set(["new-born-essentials"]);

  if (hasDiscount) sets.add("special-offers");
  if (sizes.some((s) => /0-6|0-3|3-6|newborn/i.test(s))) sets.add("size-0-6m");
  if (sizes.some((s) => /6-12|9-12|6-9/i.test(s))) sets.add("size-6-12m");
  if (category === "Accessories" || category === "Bath & Care" || category === "Blankets & Swaddles" || category === "Muslin Cloths") sets.add("accessories");
  if (category === "Sets & Combos" || /combo|set|welcome/i.test(t)) sets.add("newborn-comfort-combo-set");

  const girlWords = /(frock|belle|bow|tulle|floral|lace|ruffle|heart|blush|pink|daisy|roselle|niora|elara|winnie|june|fairy|pearl)/i;
  const boyWords = /(denim|dungaree|pinafore|cord|waffle|teddy|cub|bear|blue|mocha|matcha|latte|hoodie|strip)/i;

  if (girlWords.test(t)) sets.add("baby-girl");
  if (boyWords.test(t) && !girlWords.test(t)) sets.add("baby-boy");
  if (!girlWords.test(t) && !boyWords.test(t)) {
    sets.add("baby-girl");
    sets.add("baby-boy");
  }

  return [...sets].filter((h) => COLLECTION_ORDER.includes(h));
}

function ratingFor(handle) {
  let h = 0;
  for (const c of handle) h = (h * 31 + c.charCodeAt(0)) % 1000;
  return {
    rating: Math.round((4.6 + (h % 40) / 100) * 10) / 10,
    reviewCount: 9 + (h % 118),
  };
}

function priceNum(v) {
  return Math.round(Number(v) || 0);
}

function monogramImage(title, handle) {
  const initials = title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const hue = (handle.length * 37) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1100" viewBox="0 0 900 1100"><rect width="900" height="1100" fill="hsl(${hue},24%,90%)"/><circle cx="450" cy="480" r="220" fill="hsl(${hue},30%,84%)"/><text x="450" y="520" font-family="Georgia,serif" font-size="150" fill="hsl(${hue},20%,35%)" text-anchor="middle">${initials}</text><text x="450" y="800" font-family="Arial,sans-serif" font-size="30" letter-spacing="9" fill="hsl(${hue},15%,40%)" text-anchor="middle">BABYCON</text></svg>`;
  fs.writeFileSync(path.join(productImgDir, `${handle}-fallback.svg`), svg);
  return `/images/products/${handle}-fallback.svg`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function download(url, dest) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131 Safari/537.36",
        },
      });
      if (!res.ok) throw new Error(String(res.status));
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 800) throw new Error("too small");
      fs.writeFileSync(dest, buf);
      return true;
    } catch {
      await sleep(500 * (attempt + 1));
    }
  }
  return false;
}

async function mapLimit(items, limit, fn) {
  const results = [];
  let i = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return results;
}

const downloadJobs = [];
const products = [];

for (const p of raw.products) {
  const category = categoryOf(p);
  const { sizes, colors } = parseSizesAndColors(p);
  const price = priceNum(p.variants?.[0]?.price);
  if (!price) continue;
  const featured = FEATURED.has(p.handle);

  // Deterministic compare-at pricing for a large part of the catalogue.
  let seed = 0;
  for (const c of p.handle) seed = (seed * 33 + c.charCodeAt(0)) % 9973;
  const onOffer = featured || seed % 3 === 0;
  const discountPct = 10 + (seed % 26);
  const compareAtPrice = onOffer
    ? Math.round((price / (1 - discountPct / 100)) / 10) * 10
    : null;

  const imageCount = Math.min(featured ? 4 : 2, p.images?.length || 0);
  const localImages = [];
  for (let n = 0; n < imageCount; n++) {
    const url = p.images[n].src;
    const ext = /\.png(\?|$)/i.test(url) ? "png" : "jpg";
    const filename = `${p.handle}-${n + 1}.${ext}`;
    const dest = path.join(productImgDir, filename);
    const sized = `${url.split("?")[0]}?width=${n === 0 ? 900 : 700}&v=${p.images[n].id || ""}`;
    downloadJobs.push({ url: sized, dest, local: `/images/products/${filename}` });
    localImages.push(`/images/products/${filename}`);
  }

  if (!localImages.length) localImages.push(monogramImage(p.title, p.handle));

  const desc = buildDescription(p, category);
  const { rating, reviewCount } = ratingFor(p.handle);
  const collections = collectionsFor(p, category, sizes, Boolean(compareAtPrice));

  const badge = featured
    ? ["Bestseller", "New in", "Loved by parents"][seed % 3]
    : compareAtPrice
      ? "Sale"
      : seed % 7 === 0
        ? "New in"
        : null;

  products.push({
    handle: p.handle,
    title: p.title.replace(/\s+/g, " ").trim(),
    category,
    price,
    compareAtPrice,
    sku: `BC-${String(products.length + 1).padStart(4, "0")}`,
    stock: 12 + (seed % 45),
    sizes,
    colors,
    collections,
    featured,
    badge,
    rating,
    reviewCount,
    description: desc.html,
    lead: desc.lead,
    highlights: desc.highlights,
    images: localImages,
    alt: p.title,
    publishedAt: p.published_at,
    seoTitle: `${p.title} | Babycon`,
    seoDescription: desc.lead,
  });
}

console.log(`Preparing ${downloadJobs.length} product images...`);
let ok = 0;
let failed = 0;
await mapLimit(downloadJobs, 6, async (job) => {
  if (fs.existsSync(job.dest) && fs.statSync(job.dest).size > 800) {
    ok++;
    return;
  }
  const success = await download(job.url, job.dest);
  if (success) ok++;
  else failed++;
});
console.log(`Product images: ${ok} downloaded, ${failed} failed.`);

// Collections
const collections = [];
for (const handle of COLLECTION_ORDER) {
  const src = rawCollections.collections.find((c) => c.handle === handle);
  if (!src) continue;
  const isExtended =
    handle === "new-born-essentials"
      ? "soft"
      : handle === "baby-girl"
        ? "girl"
        : handle === "baby-boy"
          ? "boy"
          : handle === "special-offers"
            ? "offers"
            : "";
  const filename = `collection-${handle}.jpg`;
  const dest = path.join(collectionImgDir, filename);
  if (src.image?.src && (!fs.existsSync(dest) || fs.statSync(dest).size < 800)) {
    await download(`${src.image.src.split("?")[0]}?width=1400`, dest);
  }
  const local = `/images/collections/${filename}`;
  collections.push({
    handle,
    title:
      handle === "newborn-comfort-combo-set"
        ? "Newborn Combo Sets"
        : handle === "size-0-6m"
          ? "Size 0–6M"
          : handle === "size-6-12m"
            ? "Size 6–12M"
            : src.title,
    description: cleanText(src.description) || "",
    image: fs.existsSync(dest) ? local : (src.image?.src ?? ""),
    sortOrder: collections.length,
    meta: isExtended ? { tone: isExtended } : {},
  });
}

// Banner imagery used across the homepage
const bannerSources = [
  {
    file: "hero-1.jpg",
    url: "https://lillywhale.com/cdn/shop/files/391585A7-B669-4629-B4D3-660F9FDE5840.jpg?v=1791492904",
  },
  {
    file: "hero-2.jpg",
    url: "https://lillywhale.com/cdn/shop/files/7E5FDDCC-C2D3-4A4D-8E6D-F4AF426A75C5.jpg?v=1788344867",
  },
  {
    file: "hero-3.jpg",
    url: "https://lillywhale.com/cdn/shop/files/538F4A98-A5F7-4C42-9AE5-BBD1CC6A2562.jpg?v=1790442019",
  },
  {
    file: "editorial-girl.jpg",
    url: "https://lillywhale.com/cdn/shop/files/IMG_4478_JPG.jpg?v=1774084369",
  },
  {
    file: "editorial-boy.jpg",
    url: "https://lillywhale.com/cdn/shop/files/2750E223-ED05-4113-8FD1-4E7FA4301FEA.jpg?v=1773784558",
  },
  {
    file: "story.jpg",
    url: "https://lillywhale.com/cdn/shop/collections/WhatsApp_Image_2026-05-17_at_3.41.23_PM.jpg?v=1789327509",
  },
];

for (const b of bannerSources) {
  const dest = path.join(bannerImgDir, b.file);
  if (!fs.existsSync(dest) || fs.statSync(dest).size < 800) {
    await download(`${b.url.split("?")[0]}?width=1800`, dest);
  }
}

const catalog = {
  generatedAt: new Date().toISOString(),
  products,
  collections,
};

fs.writeFileSync(path.join(root, "data", "catalog.json"), JSON.stringify(catalog, null, 2));
console.log(`Wrote data/catalog.json — ${products.length} products, ${collections.length} collections.`);
