import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card";

export function ProductGrid({
  products,
  columns = 4,
}: {
  products: Product[];
  columns?: 3 | 4;
}) {
  return (
    <div
      className={`grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-12 ${
        columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
      }`}
    >
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={i < 2}
          className={i >= 4 ? "hidden sm:block" : ""}
        />
      ))}
    </div>
  );
}

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="container-x pb-20 sm:pb-24">
      <div className="mb-10 flex items-end justify-between border-t border-line pt-14 sm:mb-14">
        <div>
          <p className="eyebrow flex items-center gap-3 text-clay">
            <span className="h-px w-8 bg-clay/60" />
            Little favourites
          </p>
          <h2 className="display mt-4 text-[36px] sm:text-[44px] lg:text-[50px]">
            Loved by parents,
            <br />
            <em className="italic text-clay">worn by littles.</em>
          </h2>
        </div>
        <Link href="/shop" className="link-line hidden pb-1 text-[10px] sm:inline-flex">
          Shop all pieces
        </Link>
      </div>
      <ProductGrid products={products.slice(0, 8)} />
      <div className="mt-10 flex justify-center sm:hidden">
        <Link href="/shop" className="btn-outline">
          Shop all pieces
        </Link>
      </div>
    </section>
  );
}
