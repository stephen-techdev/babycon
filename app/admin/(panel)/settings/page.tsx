import type { Metadata } from "next";
import { CheckCircle2, Database, KeyRound, ShieldCheck, Truck } from "lucide-react";
import { saveSettings } from "@/app/admin/actions";
import {
  AdminCard,
  AdminPageHeader,
  Field,
  adminButton,
  adminInput,
  adminSelect,
  adminTextarea,
} from "@/components/admin/ui";
import { getSettings } from "@/lib/db";
import { getAdminSession } from "@/lib/auth-server";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Settings · Admin" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const input = adminInput;

export default async function AdminSettingsPage({ searchParams }: Props) {
  const raw = await searchParams;
  const saved = Array.isArray(raw.saved) ? raw.saved[0] : raw.saved;
  const settings = getSettings();
  const admin = await getAdminSession();

  return (
    <>
      <AdminPageHeader
        eyebrow="Configuration"
        title="Settings"
        description="Store details, shipping rules and demo payment configuration. Changes are saved to the local database and reflected on the storefront."
      />

      {saved && (
        <div className="mb-4 flex items-center gap-2 border border-sage/40 bg-sage/10 px-4 py-2.5 text-[11px] text-sage">
          <CheckCircle2 size={14} /> Settings saved.
        </div>
      )}

      <form action={saveSettings} className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <AdminCard title="Store details" description="Shown across the storefront, footer and emails.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Store name">
                <input name="storeName" defaultValue={settings.storeName || site.name} className={input} />
              </Field>
              <Field label="Support email">
                <input name="email" type="email" defaultValue={settings.email || site.email} className={input} />
              </Field>
              <Field label="Phone number">
                <input name="phone" defaultValue={settings.phone || site.phone} className={input} />
              </Field>
              <Field label="GSTIN">
                <input name="gstin" defaultValue={settings.gstin || site.gstin} className={input} />
              </Field>
              <Field label="Announcement bar" hint="The small line at the very top of the store." className="sm:col-span-2">
                <input name="announcement" defaultValue={settings.announcement || ""} className={input} />
              </Field>
              <Field label="Studio address" className="sm:col-span-2">
                <textarea name="address" defaultValue={settings.address || site.address} className={`${adminTextarea} min-h-[80px]`} />
              </Field>
              <Field label="Instagram URL" className="sm:col-span-2">
                <input name="instagram" defaultValue={settings.instagram || site.instagram} className={input} />
              </Field>
            </div>
          </AdminCard>

          <AdminCard title="Shipping & fees" description="Used in the checkout calculator.">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Free shipping over (₹)">
                <input name="freeShippingThreshold" type="number" min="0" defaultValue={settings.freeShippingThreshold || "1499"} className={input} />
              </Field>
              <Field label="Flat shipping fee (₹)">
                <input name="shippingFee" type="number" min="0" defaultValue={settings.shippingFee || "79"} className={input} />
              </Field>
              <Field label="COD handling fee (₹)">
                <input name="codFee" type="number" min="0" defaultValue={settings.codFee || "49"} className={input} />
              </Field>
            </div>
            <label className="mt-4 flex cursor-pointer items-start gap-2.5 border border-line p-3">
              <input type="checkbox" name="codEnabled" defaultChecked={settings.codEnabled !== "0"} className="mt-0.5 h-3.5 w-3.5 accent-ink" />
              <span>
                <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-ink">
                  <Truck size={12} className="text-clay" /> Cash on delivery enabled
                </span>
                <span className="mt-0.5 block text-[9.5px] text-muted">
                  When off, COD is hidden at checkout. Prepaid demo payments still work.
                </span>
              </span>
            </label>
          </AdminCard>

          <AdminCard title="Payments" description="This build is a simulation. No live keys are used.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Payment mode">
                <select name="paymentMode" defaultValue={settings.paymentMode || "demo"} className={adminSelect}>
                  <option value="demo">Demo (simulated)</option>
                </select>
              </Field>
              <Field label="Razorpay test key" hint="Stored for reference only. Plug real integration in later.">
                <input name="razorpayTestKey" defaultValue={settings.razorpayTestKey || "rzp_test_BabyconDemo"} className={input} />
              </Field>
            </div>
            <div className="mt-4 flex items-start gap-2 border border-amber-200 bg-amber-50 px-3 py-2.5 text-[10.5px] leading-relaxed text-amber-900">
              <ShieldCheck size={13} className="mt-0.5 shrink-0" />
              <p>
                Checkout uses a Razorpay-styled demo modal. No request is made to Razorpay, no real
                money moves, and all orders are test orders. To go live you would replace the demo
                component with the Razorpay SDK and verify signatures server-side.
              </p>
            </div>
          </AdminCard>

          <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 border border-line bg-white/95 px-4 py-3 shadow-soft backdrop-blur">
            <p className="text-[9.5px] text-muted">
              Saved values are stored in <code className="bg-sand px-1 py-0.5">data/babycon.db</code>.
            </p>
            <button type="submit" className={adminButton}>
              Save settings
            </button>
          </div>
        </div>

        <div className="space-y-4 xl:sticky xl:top-20 xl:h-fit">
          <AdminCard title="Admin account" description="Demo credentials for this build.">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-[11px] font-medium text-cream">
                {admin?.name.split(" ").filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase() || "BC"}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[12px] font-medium text-ink">{admin?.name || "Babycon Admin"}</p>
                <p className="truncate text-[10px] text-muted">{admin?.email || "admin@babycon.in"}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 border-t border-line pt-3 text-[10px] text-muted">
              <p className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><KeyRound size={11} /> Email</span>
                <code className="text-ink">admin@babycon.in</code>
              </p>
              <p className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><KeyRound size={11} /> Password</span>
                <code className="text-ink">Admin@12345</code>
              </p>
            </div>
            <p className="mt-3 text-[9.5px] leading-relaxed text-muted">
              These are seeded from <code className="bg-sand px-0.5">ADMIN_EMAIL</code> and{" "}
              <code className="bg-sand px-0.5">ADMIN_PASSWORD</code> in <code className="bg-sand px-0.5">.env</code> the
              first time the database is created. Change them before deploying.
            </p>
          </AdminCard>

          <AdminCard title="Demo data" description="A quick map of what is seeded.">
            <ul className="space-y-2 text-[10.5px] text-muted">
              {[
                "104 products across 8 collections",
                "16 demo orders in different states",
                "5 customer accounts with password Baby@12345",
                "3 coupons and a handful of reviews",
                "Contact messages and newsletter signups",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 size={11} className="mt-0.5 shrink-0 text-sage" /> {item}
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-line pt-3">
              <p className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.14em] text-muted">
                <Database size={11} /> Reset the demo
              </p>
              <p className="mt-1.5 text-[10px] leading-relaxed text-muted">
                Stop the dev server and run <code className="bg-sand px-1 py-0.5 text-ink">npm run db:reset</code>{" "}
                to rebuild the database from the catalog and seed data.
              </p>
            </div>
          </AdminCard>

          <AdminCard title="Deployment notes">
            <p className="text-[10.5px] leading-relaxed text-muted">
              The site runs on Next.js with a local SQLite database via <code className="bg-sand px-0.5">node:sqlite</code>.
              For production, mount a persistent volume for <code className="bg-sand px-0.5">data/</code> and{" "}
              <code className="bg-sand px-0.5">public/uploads</code>, set <code className="bg-sand px-0.5">NEXT_PUBLIC_SITE_URL</code>{" "}
              and a long random <code className="bg-sand px-0.5">SESSION_SECRET</code>, and use the included Dockerfile.
            </p>
          </AdminCard>
        </div>
      </form>
    </>
  );
}
