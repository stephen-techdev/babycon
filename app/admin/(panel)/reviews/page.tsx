import type { Metadata } from "next";
import Link from "next/link";
import { Check, MessageSquareQuote, ShieldCheck, Star, Trash2 } from "lucide-react";
import { deleteReview, setReviewApproval } from "@/app/admin/actions";
import { ConfirmForm } from "@/components/admin/confirm-form";
import { AdminEmpty, AdminPageHeader, StatusPill } from "@/components/admin/ui";
import { Stars } from "@/components/ui/stars";
import { listAllReviews } from "@/lib/db";
import { timeAgo } from "@/lib/utils";

export const metadata: Metadata = { title: "Reviews · Admin" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const FILTERS = [
  { key: "", label: "All" },
  { key: "pending", label: "Awaiting" },
  { key: "approved", label: "Approved" },
];

export default async function AdminReviewsPage({ searchParams }: Props) {
  const raw = await searchParams;
  const filter = (Array.isArray(raw.status) ? raw.status[0] : raw.status) || "";
  const all = listAllReviews();
  const pending = all.filter((review) => !review.approved).length;
  const average = all.length ? all.reduce((sum, review) => sum + review.rating, 0) / all.length : 0;

  const reviews = all.filter((review) =>
    filter === "pending" ? !review.approved : filter === "approved" ? review.approved : true
  );

  return (
    <>
      <AdminPageHeader
        eyebrow="Community"
        title="Reviews"
        description="What parents are saying. Approve reviews to publish them on product pages, or remove anything that isn't helpful."
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Total reviews", value: String(all.length), icon: MessageSquareQuote },
          { label: "Awaiting moderation", value: String(pending), icon: ShieldCheck },
          { label: "Average rating", value: average.toFixed(1), icon: Star },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center justify-between border border-line bg-white px-4 py-3">
            <div>
              <p className="text-[9px] uppercase tracking-[0.14em] text-muted">{label}</p>
              <p className="mt-1 font-serif text-[24px] leading-none text-ink">{value}</p>
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sand text-clay">
              <Icon size={14} />
            </span>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-1">
        {FILTERS.map((item) => {
          const count = item.key === "pending" ? pending : item.key === "approved" ? all.length - pending : all.length;
          const params = item.key ? `?status=${item.key}` : "";
          return (
            <Link
              key={item.key || "all"}
              href={`/admin/reviews${params}`}
              className={`inline-flex h-8 items-center gap-1.5 px-2.5 text-[9.5px] uppercase tracking-[0.1em] transition-colors ${
                filter === item.key ? "bg-ink text-cream" : "border border-line bg-white text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {item.label}
              <span className={filter === item.key ? "text-cream/50" : "text-muted/50"}>{count}</span>
            </Link>
          );
        })}
      </div>

      {reviews.length ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {reviews.map((review) => (
            <article key={review.id} className={`border bg-white p-5 ${review.approved ? "border-line" : "border-butter"}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Stars rating={review.rating} size={11} />
                    <StatusPill status={review.approved ? "approved" : "awaiting"} />
                  </div>
                  <h2 className="mt-2 font-serif text-[19px] leading-snug text-ink">{review.title}</h2>
                </div>
                <p className="text-[9px] text-muted">{timeAgo(review.createdAt)}</p>
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">{review.body}</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                <div>
                  <p className="text-[10.5px] font-medium text-ink">{review.name}</p>
                  <Link
                    href={`/products/${review.productHandle}`}
                    target="_blank"
                    className="text-[9.5px] text-muted hover:text-clay"
                  >
                    {review.productTitle}
                  </Link>
                </div>
                <div className="flex items-center gap-1.5">
                  <form action={setReviewApproval}>
                    <input type="hidden" name="id" value={review.id} />
                    <input type="hidden" name="approved" value={review.approved ? "0" : "1"} />
                    <button
                      type="submit"
                      className={`inline-flex h-8 items-center gap-1.5 px-3 text-[9px] font-medium uppercase tracking-[0.1em] transition-colors ${
                        review.approved
                          ? "border border-line text-muted hover:border-ink hover:text-ink"
                          : "bg-sage text-white hover:bg-forest"
                      }`}
                    >
                      <Check size={11} /> {review.approved ? "Unpublish" : "Approve"}
                    </button>
                  </form>
                  <ConfirmForm
                    action={deleteReview}
                    fields={{ id: review.id }}
                    message="Delete this review permanently?"
                  >
                    <button
                      type="submit"
                      className="flex h-8 w-8 items-center justify-center border border-line text-muted transition-colors hover:border-clay hover:text-clay"
                      aria-label="Delete review"
                    >
                      <Trash2 size={12} />
                    </button>
                  </ConfirmForm>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <AdminEmpty
          title={filter === "pending" ? "Nothing waiting" : "No reviews yet"}
          description={
            filter === "pending"
              ? "All submitted reviews have been moderated. A tidy inbox."
              : "Reviews submitted on product pages will appear here for moderation."
          }
          action={
            filter && (
              <Link href="/admin/reviews" className="inline-flex h-9 items-center border border-line px-4 text-[9px] uppercase tracking-[0.12em] text-muted hover:border-ink hover:text-ink">
                View all reviews
              </Link>
            )
          }
        />
      )}

      <div className="mt-4 border border-line bg-white p-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ink">Moderation notes</p>
        <p className="mt-1.5 text-[10.5px] leading-relaxed text-muted">
          Only approved reviews are shown on the storefront product page. Star ratings and review
          counts in the catalog are seeded separately for demo purposes — approving or deleting a
          review here does not recalculate them.
        </p>
      </div>
    </>
  );
}
