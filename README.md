# babycon

**Pure. Gentle. Yours.** A complete, production-shaped e-commerce storefront and admin studio for premium baby essentials. Built as a full-stack Next.js app with a local SQLite database and a deliberately **simulated** Razorpay-style checkout — no real money ever moves.

The catalog is inspired by [lillywhale.com](https://lillywhale.com): 104 products, 8 collections, locally hosted product photography, and a soft editorial design system (cream, clay, sage and forest).

---

## What is included

### Storefront
- Homepage with hero slider, trust strip, collections, featured pieces, editorial split, offers, brand story, testimonials, Instagram strip, FAQ and newsletter.
- Catalog: `/shop` with category, collection, size and price filters plus sorting; `/collections` and `/collections/[handle]`.
- Product pages: image gallery + lightbox, size/colour selection, quantity, pincode serviceability check, accordions, size guide, reviews and review submission, related products, JSON-LD and SEO metadata.
- Search dialog with instant product results and a full `/search` page.
- Persistent cart and wishlist (localStorage), slide-out cart drawer, free-shipping progress.
- Checkout with saved-address autofill, coupon validation, shipping/COD fees, and a **Razorpay-styled demo payment modal** (UPI, card, netbanking, wallet, COD).
- Order confirmation with token-protected access, status timeline, invoice print view and demo-payment labelling.
- Order tracking with order number + email/phone verification.
- Customer accounts: register, sign in, overview, order history, saved wishlist.
- Contact form, FAQ, about/story page, privacy, shipping, refund and terms pages.
- Newsletter signup, SEO metadata, sitemap, robots, web manifest and favicon.
- Responsive, accessible, reduced-motion friendly, with careful image sizing and font loading.

### Admin studio
- Protected dashboard with revenue chart, order pipeline, top sellers, low stock and recent orders.
- Products: search, pagination, create/edit/delete, image uploads, collection assignment, featured/badge/visibility controls.
- Orders: status and payment filters, customer details, item breakdown, internal notes, fulfilment/payment updates, CSV export.
- Collections and coupons: create, edit, activate/pause, delete and usage tracking.
- Customers: search, sorting, lifetime value and one-click filtered orders.
- Reviews: approve/unpublish/delete moderation queue.
- Messages: inbox with new/read/replied workflow, mailto replies and delete.
- Newsletter: subscriber list, copy-all, CSV export and delete.
- Settings: store details, shipping thresholds, COD toggle, payment demo configuration and deployment notes.

### Demo data
- 104 products, 8 collections, 185 downloaded product images.
- 16 demo orders in every fulfilment state, 5 customer accounts, 3 coupons, approved + pending reviews, contact messages and newsletter subscribers.

---

## Demo credentials

| Area | Email | Password |
| --- | --- | --- |
| Admin studio (`/admin/login`) | `admin@babycon.in` | `Admin@12345` |
| Customer account (`/account/login`) | `ananya@example.com` | `Baby@12345` |

Order tracking demo: order **`BC-10020`**, email **`ananya@example.com`** or phone **`9845012345`**.

Coupons: **`WELCOME10`** (10%, min ₹999), **`BABYCON200`** (₹200, min ₹1,999), **`SOFTSTART15`** (15%, min ₹2,499).

> All orders, payments and emails are simulated. The checkout is labelled **TEST MODE** and never contacts Razorpay or charges a card.

---

## Stack

- **Next.js 15** App Router + React 19 + TypeScript
- **Tailwind CSS 3.4** with a custom editorial design system
- **SQLite** through Node's built-in `node:sqlite` (`DatabaseSync`) — zero native dependencies
- **lucide-react** icons
- `next/font` (Fraunces + Jost)
- Server Actions for admin mutations, route handlers for JSON APIs
- Session cookies backed by hashed tokens in SQLite

Node **24+** is required because `node:sqlite` is used directly.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Optional: copy environment defaults
cp .env.example .env      # Windows: copy .env.example .env

# 3. Run the app (the database is created and seeded automatically)
npm run dev
```

Open:

- Storefront: <http://localhost:3000>
- Admin: <http://localhost:3000/admin>
- Health check: <http://localhost:3000/api/health>

### Production

```bash
npm run build
npm start
```

### Database scripts

```bash
npm run db:seed     # Create/seed the database if it does not exist
npm run db:reset    # Delete the database and rebuild it from the catalog
npm run catalog:build  # Re-scrape the reference catalog + download images
```

The database lives at `data/babycon.db` by default; override with `DATABASE_PATH`.

---

## Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `DATABASE_PATH` | `./data/babycon.db` | SQLite file location |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Canonical URL for metadata/sitemap |
| `ADMIN_EMAIL` | `admin@babycon.in` | Admin account created on first seed |
| `ADMIN_PASSWORD` | `Admin@12345` | Admin password created on first seed |
| `NEXT_PUBLIC_PAYMENT_MODE` | `demo` | Keeps the simulated checkout enabled |
| `NEXT_PUBLIC_RAZORPAY_TEST_KEY` | `rzp_test_BabyconDemo` | Display-only demo key |

Changing `ADMIN_EMAIL`/`ADMIN_PASSWORD` only affects a **fresh** database. Delete `data/babycon.db` (or run `npm run db:reset`) before reseeding.

---

## Routes

### Storefront
`/` · `/shop` · `/collections` · `/collections/[handle]` · `/products/[handle]` · `/search` · `/cart` · `/checkout` · `/order/[number]` · `/track-order` · `/wishlist` · `/account` · `/account/login` · `/account/register` · `/account/orders` · `/contact` · `/faq` · `/pages/about` · `/pages/privacy` · `/pages/shipping` · `/pages/refund` · `/pages/terms`

### Admin
`/admin` · `/admin/products` · `/admin/products/new` · `/admin/products/[id]` · `/admin/orders` · `/admin/orders/[id]` · `/admin/collections` · `/admin/coupons` · `/admin/customers` · `/admin/reviews` · `/admin/messages` · `/admin/newsletter` · `/admin/settings`

### API
`/api/products` · `/api/store-config` · `/api/coupons/validate` · `/api/checkout` · `/api/orders/lookup` · `/api/reviews` · `/api/newsletter` · `/api/contact` · `/api/health` · `/api/auth/*` · `/api/admin/login` · `/api/admin/upload` · `/api/admin/orders/export`

---

## How the demo checkout works

1. The cart and checkout compute totals client-side for display.
2. `POST /api/checkout` **recomputes everything server-side**: catalogue prices, stock availability, coupon eligibility, shipping (₹79 under ₹1,499, free above) and COD handling (₹49). Shipping thresholds, fees and the COD toggle are editable in **Admin → Settings**; the storefront announcement, cart progress bar and checkout all follow those values.
3. The client opens a Razorpay-styled modal in test mode. Choosing UPI/card/netbanking/wallet generates a fake `pay_demo_*` reference; COD leaves payment pending.
4. The server creates the order, decrements stock, increments coupon usage and returns an order number + access token.
5. The confirmation page is protected by the token, the customer session email or an admin session. Order lookup requires the matching email or phone.

To integrate real Razorpay later, replace `components/checkout/demo-payment.tsx` with the Razorpay SDK, create an order server-side, and verify the signature in `/api/checkout` before writing the order. The schema already stores `payment_method`, `payment_status` and `payment_id`.

---

## Performance notes

- Static prerendering for the homepage, collections, cart, FAQ, wishlist, policies, sitemap and robots.
- Dynamic rendering for account, admin, search, product detail, checkout and order pages.
- `next/font` self-hosts Fraunces and Jost with `display: swap`.
- `next/image` with responsive `sizes`, AVIF/WebP formats and long-lived cache headers for local imagery.
- `optimizePackageImports` for `lucide-react`; tree-shaken icons.
- Locally downloaded hero/product images avoid third-party CDN dependencies at runtime.
- SQLite in WAL mode with a busy timeout, prepared statements and a single connection per process.
- Gzip compression, security headers, no `X-Powered-By`.

---

## Project structure

```
app/
  (store)/          Storefront route group (header/footer/cart chrome)
  admin/
    login/          Unprotected admin sign-in
    (panel)/        Protected admin studio
  api/              JSON route handlers
components/
  admin/            Admin shell, tables, forms, drawers
  account/          Auth + order history
  cart/ checkout/   Cart drawer + demo payment flow
  home/ layout/     Storefront sections and chrome
  providers/        Cart, wishlist, toasts
  ui/               Shared primitives
lib/
  database.ts       SQLite schema + connection
  seed.ts           Catalog + demo data seeding
  db.ts             Repository queries
  auth-server.ts    Cookie sessions
  money.ts types.ts utils.ts site.ts seo.ts
data/
  catalog.json      Generated catalogue
  raw/              Scraped Shopify reference JSON
public/images/      Products, collections, banners
scripts/            Catalog builder + seed entrypoint
```

---

## Docker

```bash
docker compose up --build
```

The app is served at <http://localhost:3000>. Named volumes persist the SQLite database and uploaded images across rebuilds. The seed database is created during the image build and copied into the volume on first use.

To reset a containerised demo:

```bash
docker compose down -v
docker compose up --build
```

---

## Notes & limitations

- This is a **demonstration storefront**. Orders are test records; emails and SMS are not sent.
- Product photography and catalog structure are sourced from the reference site for demo purposes. Replace imagery and copy before commercial use.
- Uploads accept JPG, PNG, WebP, AVIF and SVG up to 5MB, stored in `public/uploads`. In a multi-instance deployment, move uploads to object storage.
- Admin authentication is cookie-based with server-side sessions. Add rate limiting, 2FA and CSRF hardening before a real launch.
- The seeded `rating` and `review_count` are display values; approving a review does not recalculate them.
- `node:sqlite` is still marked experimental in Node and may print an experimental warning on startup.

---

Built with care for the first tiny days. **babycon** · Chennai, India.
#   t r i g g e r   d e p l o y  
 