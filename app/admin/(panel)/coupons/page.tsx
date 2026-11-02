import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { deleteCoupon, saveCoupon, toggleCoupon } from "@/app/admin/actions";
import { CouponManager } from "@/components/admin/coupon-manager";
import { AdminPageHeader } from "@/components/admin/ui";
import { listCoupons } from "@/lib/db";

export const metadata: Metadata = { title: "Coupons · Admin" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminCouponsPage({ searchParams }: Props) {
  const raw = await searchParams;
  const saved = Array.isArray(raw.saved) ? raw.saved[0] : raw.saved;
  const deleted = Array.isArray(raw.deleted) ? raw.deleted[0] : raw.deleted;
  const coupons = listCoupons();

  return (
    <>
      <AdminPageHeader
        eyebrow="Promotions"
        title="Coupons"
        description="Welcome codes, seasonal offers and quiet thank-yous. Control eligibility, limits and expiry."
      />

      {(saved || deleted) && (
        <div className="mb-4 flex items-center gap-2 border border-sage/40 bg-sage/10 px-4 py-2.5 text-[11px] text-sage">
          <CheckCircle2 size={14} /> {deleted ? "Coupon deleted." : "Coupon saved."}
        </div>
      )}

      <CouponManager
        coupons={coupons}
        saveAction={saveCoupon}
        toggleAction={toggleCoupon}
        deleteAction={deleteCoupon}
      />
    </>
  );
}
