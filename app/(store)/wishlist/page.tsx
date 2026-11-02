import type { Metadata } from "next";
import Link from "next/link";
import { WishlistView } from "@/components/wishlist/wishlist-view";

export const metadata: Metadata = {
  title: "Your wishlist",
  description: "The Babycon pieces you've saved for later.",
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <section className="container-x py-10 sm:py-14">
      <nav className="flex items-center gap-2 text-[9.5px] uppercase tracking-[0.16em] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <span className="text-ink">Wishlist</span>
      </nav>
      <div className="mt-6 border-b border-line pb-6">
        <p className="eyebrow flex items-center gap-3 text-clay">
          <span className="h-px w-8 bg-clay/60" /> Saved for later
        </p>
        <h1 className="display mt-3 text-[42px] sm:text-[54px]">
          Your <em className="italic text-clay">little edit.</em>
        </h1>
        <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-muted">
          The pieces you have your eye on, kept together in one soft place.
        </p>
      </div>
      <div className="mt-8">
        <WishlistView />
      </div>
    </section>
  );
}
