import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { getProduct, getProductReviews, getRelated } from "@/lib/db";
import { absoluteUrl } from "@/lib/seo";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchase } from "@/components/product/product-purchase";
import { ProductGrid } from "@/components/product/product-grid";
import { ReviewForm } from "@/components/product/review-form";
import { Stars } from "@/components/ui/stars";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) return { title: "Piece not found" };
  return {
    title: `${product.title} — ${product.category}`,
    description: product.lead,
    alternates: { canonical: `/products/${product.handle}` },
    openGraph: {
      type: "website",
      title: `${product.title} | Babycon`,
      description: product.lead,
      url: absoluteUrl(`/products/${product.handle}`),
      images: product.images.slice(0, 2).map((image) => ({
        url: image,
        width: 900,
        height: 1100,
        alt: product.title,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Babycon`,
      description: product.lead,
      images: product.images.slice(0, 1),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product || !product.active) notFound();

  const reviews = getProductReviews(product.id);
  const related = getRelated(product, 4);
  const reviewTotal = Math.max(product.reviewCount, reviews.length);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images.map((image) => absoluteUrl(image)),
    description: product.lead,
    sku: product.sku,
    category: product.category,
    brand: { "@type": "Brand", name: "Babycon" },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.handle}`),
      priceCurrency: "INR",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Babycon" },
    },
    ...(reviewTotal > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: reviewTotal,
          },
        }
      : {}),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/shop") },
      {
        "@type": "ListItem",
        position: 3,
        name: product.collections[0]?.replace(/-/g, " ") || "Collection",
        item: absoluteUrl(`/collections/${product.collections[0] || "new-born-essentials"}`),
      },
      { "@type": "ListItem", position: 4, name: product.title },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <section className="container-x pb-4 pt-5 sm:pt-7">
        <nav
          className="flex flex-wrap items-center gap-1.5 pb-5 text-[9px] uppercase tracking-[0.14em] text-muted"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-ink">Home</Link>
          <ChevronRight size={10} />
          <Link href="/shop" className="hover:text-ink">Shop</Link>
          <ChevronRight size={10} />
          <Link
            href={`/collections/${product.collections[0] || "new-born-essentials"}`}
            className="capitalize hover:text-ink"
          >
            {product.collections[0]?.replace(/-/g, " ") || "Collection"}
          </Link>
          <ChevronRight size={10} />
          <span className="text-ink/70">{product.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 xl:gap-20">
          <ProductGallery
            images={product.images}
            title={product.title}
            badge={product.badge}
          />
          <ProductPurchase product={product} reviewTotal={reviewTotal} />
        </div>
      </section>

      <section id="reviews" className="container-x scroll-mt-24 py-16 sm:py-20">
        <div className="border-t border-line pt-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:gap-20">
            <div>
              <p className="eyebrow flex items-center gap-3 text-clay">
                <span className="h-px w-8 bg-clay/60" /> In real life
              </p>
              <h2 className="display mt-4 text-[36px] sm:text-[44px]">
                Notes from
                <br />
                <em className="italic text-clay">the nursery.</em>
              </h2>
              <div className="mt-6 flex items-end gap-4">
                <span className="font-serif text-[58px] leading-none text-ink">
                  {product.rating.toFixed(1)}
                </span>
                <div className="pb-1">
                  <Stars rating={product.rating} size={15} />
                  <p className="mt-1.5 text-[10.5px] text-muted">
                    Based on {reviewTotal} reviews
                  </p>
                </div>
              </div>

              <div className="mt-6 max-w-[300px] space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const pct =
                    star === 5 ? 82 : star === 4 ? 13 : star === 3 ? 3 : star === 2 ? 1 : 1;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="w-3 text-[10px] text-muted">{star}</span>
                      <StarIcon />
                      <div className="h-[3px] flex-1 bg-line">
                        <div className="h-full bg-clay" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-7 text-right text-[9.5px] text-muted">{pct}%</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-start gap-2.5 border-t border-line pt-5 text-[11px] text-muted">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-sage" />
                Every review is from a verified Babycon customer. We never edit or remove
                honest feedback.
              </div>
            </div>

            <div className="space-y-6">
              {reviews.length > 0 ? (
                <ul className="divide-y divide-line border-y border-line">
                  {reviews.slice(0, 4).map((review) => (
                    <li key={review.id} className="py-6">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <Stars rating={review.rating} size={11} />
                          <span className="text-[9px] uppercase tracking-[0.12em] text-sage">
                            Verified
                          </span>
                        </div>
                        <span className="text-[9.5px] text-muted">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <h3 className="mt-2.5 font-serif text-[18px]">{review.title}</h3>
                      <p className="mt-1.5 text-[13px] leading-[1.8] text-muted">{review.body}</p>
                      <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-muted/70">
                        {review.name}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="border border-dashed border-line p-8 text-center">
                  <p className="font-serif text-[22px]">Be the first to share.</p>
                  <p className="mt-2 text-[12.5px] text-muted">
                    Bought this piece? We would love to hear how it felt.
                  </p>
                </div>
              )}

              <ReviewForm handle={product.handle} />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-sand/30">
          <div className="container-x py-16 sm:py-20">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="eyebrow text-clay">You may also love</p>
                <h2 className="mt-3 font-serif text-[30px] font-light sm:text-[38px]">
                  More little <em className="italic text-clay">softness.</em>
                </h2>
              </div>
              <Link href="/shop" className="link-line hidden text-[10px] sm:inline-flex">
                Shop all
              </Link>
            </div>
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </>
  );
}

function StarIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-clay">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
