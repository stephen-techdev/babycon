import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, BarChart3, Package, ShieldCheck, ShoppingBag } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/login-form";
import { getAdminSession } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "Admin sign in",
  description: "Babycon studio admin.",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const admin = await getAdminSession();
  if (admin) redirect("/admin");

  return (
    <div className="grid min-h-screen bg-forest lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative flex flex-col justify-between overflow-hidden px-6 py-8 sm:px-12 sm:py-12">
        <div className="pointer-events-none absolute -right-40 top-20 h-[480px] w-[480px] rounded-full border border-cream/5" />
        <div className="pointer-events-none absolute -right-20 top-40 h-[300px] w-[300px] rounded-full border border-cream/5" />

        <div className="relative flex items-center justify-between">
          <Link href="/" className="flex flex-col leading-none text-cream">
            <span className="relative font-serif text-[30px] tracking-[-0.03em]">
              babycon
              <span className="absolute -right-2 top-1.5 h-[5px] w-[5px] rounded-full bg-clay" />
            </span>
            <span className="mt-1 text-[7px] font-medium uppercase tracking-[0.42em] text-cream/40">
              studio admin
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-cream/40 transition-colors hover:text-cream"
          >
            <ArrowLeft size={12} /> Back to store
          </Link>
        </div>

        <div className="relative my-14 max-w-md">
          <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-clay">
            The back of house
          </p>
          <h1 className="mt-4 font-serif text-[44px] font-light leading-[1.02] text-cream sm:text-[56px]">
            Every little detail,
            <br />
            <em className="italic text-blush">in one place.</em>
          </h1>
          <p className="mt-5 max-w-sm text-[12.5px] leading-relaxed text-cream/55">
            Products, orders, customers and the quiet magic behind the storefront. Signed in with
            the Babycon studio account.
          </p>

          <div className="mt-9 grid grid-cols-3 gap-3">
            {[
              { icon: ShoppingBag, label: "Orders", value: "16" },
              { icon: Package, label: "Pieces", value: "104" },
              { icon: BarChart3, label: "Revenue", value: "₹1.1L" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="border border-cream/10 bg-cream/5 px-3 py-3.5">
                <Icon size={13} className="text-clay" />
                <p className="mt-2 font-serif text-[20px] text-cream">{value}</p>
                <p className="text-[8px] uppercase tracking-[0.14em] text-cream/35">{label}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 flex items-center gap-2 text-[10px] text-cream/35">
            <ShieldCheck size={12} className="text-sage" /> Demo environment · test data only
          </p>
        </div>

        <p className="relative text-[9px] uppercase tracking-[0.16em] text-cream/25">
          © {new Date().getFullYear()} Babycon Retail LLP · Internal use
        </p>
      </div>

      <div className="flex items-center justify-center bg-[#1B241C] px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-clay">Welcome back</p>
          <h2 className="mt-2 font-serif text-[30px] font-light text-cream">Sign in to the studio</h2>
          <p className="mt-2 text-[11.5px] leading-relaxed text-cream/40">
            Use your admin credentials to manage the store.
          </p>

          <div className="mt-7">
            <AdminLoginForm />
          </div>

          <div className="mt-8 border-t border-cream/10 pt-5">
            <p className="text-[9px] leading-relaxed text-cream/30">
              This storefront is a demonstration build. Orders and payments are simulated — no real
              money is processed. Credentials can be changed in <code className="text-cream/50">.env</code>{" "}
              before the first seed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
