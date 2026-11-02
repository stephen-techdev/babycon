"use client";

import { Pause, Pencil, Play, Plus, Tag, Trash2 } from "lucide-react";
import type { Coupon } from "@/lib/types";
import { formatINR } from "@/lib/money";
import { formatDate } from "@/lib/utils";
import {
  Field,
  adminButton,
  adminInput,
  adminSelect,
} from "@/components/admin/ui";
import { AdminDrawer } from "@/components/admin/drawer";

type Action = (formData: FormData) => void | Promise<void>;

function toDateInput(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function CouponFields({ coupon }: { coupon?: Coupon }) {
  return (
    <div className="space-y-4">
      <Field label="Coupon code" hint="Letters and numbers only. Shoppers type this at checkout.">
        <input
          name="code"
          defaultValue={coupon?.code}
          required
          className={`${adminInput} uppercase tracking-[0.1em]`}
          placeholder="WELCOME10"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Discount type">
          <select name="type" defaultValue={coupon?.type || "percent"} className={adminSelect}>
            <option value="percent">Percentage off</option>
            <option value="fixed">Fixed amount off</option>
          </select>
        </Field>
        <Field label="Value" hint="Percent (10) or rupees (200).">
          <input
            name="value"
            type="number"
            min="1"
            defaultValue={coupon?.value ?? ""}
            required
            className={adminInput}
          />
        </Field>
        <Field label="Minimum subtotal (₹)">
          <input
            name="minSubtotal"
            type="number"
            min="0"
            defaultValue={coupon?.minSubtotal ?? 0}
            className={adminInput}
          />
        </Field>
        <Field label="Usage limit" hint="0 means unlimited.">
          <input
            name="maxUses"
            type="number"
            min="0"
            defaultValue={coupon?.maxUses ?? 0}
            className={adminInput}
          />
        </Field>
        <Field label="Expires on" hint="Leave blank for no expiry.">
          <input
            name="expiresAt"
            type="date"
            defaultValue={toDateInput(coupon?.expiresAt ?? null)}
            className={adminInput}
          />
        </Field>
        <label className="flex cursor-pointer items-start gap-2.5 border border-line bg-white p-3">
          <input
            type="checkbox"
            name="active"
            defaultChecked={coupon ? coupon.active : true}
            className="mt-0.5 h-3.5 w-3.5 accent-ink"
          />
          <span>
            <span className="block text-[11.5px] font-medium text-ink">Active</span>
            <span className="mt-0.5 block text-[9.5px] text-muted">Shoppers can use this code.</span>
          </span>
        </label>
      </div>
      <button type="submit" className={`${adminButton} w-full`}>
        {coupon ? "Save coupon" : "Create coupon"}
      </button>
    </div>
  );
}

export function CouponManager({
  coupons,
  saveAction,
  toggleAction,
  deleteAction,
}: {
  coupons: Coupon[];
  saveAction: Action;
  toggleAction: Action;
  deleteAction: Action;
}) {
  const active = coupons.filter((coupon) => coupon.active).length;
  const uses = coupons.reduce((sum, coupon) => sum + coupon.usedCount, 0);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
          {coupons.length} codes · {active} active · {uses} redemptions
        </p>
        <AdminDrawer
          label={
            <>
              <Plus size={13} /> New coupon
            </>
          }
          title="New coupon"
          description="Create a code for the checkout."
        >
          <form action={saveAction}>
            <CouponFields />
          </form>
        </AdminDrawer>
      </div>

      {coupons.length ? (
        <div className="border border-line bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead>
                <tr className="border-b border-line text-[8.5px] uppercase tracking-[0.12em] text-muted">
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-3 py-3 font-medium">Discount</th>
                  <th className="px-3 py-3 font-medium">Minimum</th>
                  <th className="px-3 py-3 font-medium">Usage</th>
                  <th className="px-3 py-3 font-medium">Expires</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {coupons.map((coupon) => {
                  const expires = coupon.expiresAt ? new Date(coupon.expiresAt) : null;
                  const expired = Boolean(expires && expires.getTime() < Date.now());
                  const exhausted = coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses;
                  const pct = coupon.maxUses > 0 ? Math.min(100, Math.round((coupon.usedCount / coupon.maxUses) * 100)) : null;
                  return (
                    <tr key={coupon.id} className="text-[11.5px] transition-colors hover:bg-sand/25">
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2 font-medium tracking-[0.08em] text-ink">
                          <Tag size={12} className="text-clay" /> {coupon.code}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-ink">
                        {coupon.type === "percent" ? `${coupon.value}% off` : `${formatINR(coupon.value)} off`}
                      </td>
                      <td className="px-3 py-3 text-muted">{formatINR(coupon.minSubtotal)}</td>
                      <td className="px-3 py-3">
                        <p className="text-[10.5px] text-muted">
                          {coupon.usedCount}
                          {coupon.maxUses > 0 ? ` / ${coupon.maxUses}` : " uses"}
                        </p>
                        {pct !== null && (
                          <div className="mt-1 h-1 w-24 bg-sand">
                            <div className="h-full bg-clay/60" style={{ width: `${pct}%` }} />
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3 text-muted">
                        {expires ? formatDate(expires) : "No expiry"}
                        {expired && <span className="ml-1 text-[8.5px] uppercase tracking-[0.08em] text-clay">expired</span>}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 text-[8.5px] font-medium uppercase tracking-[0.1em] ${
                            !coupon.active
                              ? "bg-sand text-muted"
                              : expired || exhausted
                                ? "bg-clay/10 text-clay"
                                : "bg-sage/15 text-sage"
                          }`}
                        >
                          {!coupon.active ? "Paused" : expired || exhausted ? "Ended" : "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <AdminDrawer
                            label={<Pencil size={12} />}
                            variant="ghost"
                            className="flex h-7 w-7 items-center justify-center border border-line text-muted transition-colors hover:border-ink hover:text-ink"
                            title={`Edit ${coupon.code}`}
                          >
                            <form action={saveAction}>
                              <CouponFields coupon={coupon} />
                            </form>
                          </AdminDrawer>
                          <form action={toggleAction}>
                            <input type="hidden" name="id" value={coupon.id} />
                            <button
                              type="submit"
                              className="flex h-7 w-7 items-center justify-center border border-line text-muted transition-colors hover:border-ink hover:text-ink"
                              aria-label={coupon.active ? `Pause ${coupon.code}` : `Activate ${coupon.code}`}
                              title={coupon.active ? "Pause" : "Activate"}
                            >
                              {coupon.active ? <Pause size={11} /> : <Play size={11} />}
                            </button>
                          </form>
                          <form
                            action={deleteAction}
                            onSubmit={(event) => {
                              if (!window.confirm(`Delete the coupon ${coupon.code}?`)) {
                                event.preventDefault();
                              }
                            }}
                          >
                            <input type="hidden" name="id" value={coupon.id} />
                            <button
                              type="submit"
                              className="flex h-7 w-7 items-center justify-center border border-line text-muted transition-colors hover:border-clay hover:text-clay"
                              aria-label={`Delete ${coupon.code}`}
                            >
                              <Trash2 size={11} />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-line bg-white px-6 py-14 text-center">
          <p className="font-serif text-[22px] text-ink">No coupons yet</p>
          <p className="mt-2 text-[11.5px] text-muted">Create a welcome code to get started.</p>
        </div>
      )}

      <div className="mt-4 border border-line bg-white p-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ink">How codes work</p>
        <p className="mt-1.5 text-[10.5px] leading-relaxed text-muted">
          Discounts are applied to the subtotal before shipping and COD fees. Usage limits are
          enforced at checkout, and expired or paused codes are rejected with a helpful message.
          Coupons are simulated along with the rest of the demo checkout.
        </p>
      </div>
    </>
  );
}
