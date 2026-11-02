import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow text-clay">404 — lost in the nursery</p>
      <h1 className="display mt-5 text-[64px] sm:text-[90px]">
        Oops, <em className="italic text-clay">little one.</em>
      </h1>
      <p className="mt-4 max-w-md text-[14px] leading-relaxed text-muted">
        This page seems to have wandered off. Let&apos;s get you back to something soft.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-dark">
          <ArrowLeft size={14} /> Back home
        </Link>
        <Link href="/shop" className="btn-outline">
          <Search size={14} /> Shop all
        </Link>
      </div>
    </section>
  );
}
