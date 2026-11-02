import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, MessageCircle, PackageCheck, Truck } from "lucide-react";
import { TrackOrderForm } from "@/components/order/track-order-form";
import { getCustomerSession } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Follow your Babycon parcel from our studio to your door.",
  alternates: { canonical: "/track-order" },
};

type Props = { searchParams: Promise<{ order?: string | string[] }> };

export default async function TrackOrderPage({ searchParams }: Props) {
  const raw = await searchParams;
  const order = (Array.isArray(raw.order) ? raw.order[0] : raw.order) || "";
  const customer = await getCustomerSession();

  return (
    <>
      <section className="border-b border-line bg-sand/50">
        <div className="container-x py-12 sm:py-16">
          <nav className="flex items-center gap-2 text-[9.5px] uppercase tracking-[0.16em] text-muted">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span>/</span>
            <span className="text-ink">Track order</span>
          </nav>
          <p className="eyebrow mt-6 flex items-center gap-3 text-clay">
            <span className="h-px w-8 bg-clay/60" /> From our studio to your door
          </p>
          <h1 className="display mt-4 max-w-2xl text-[44px] sm:text-[58px]">
            Where is my <em className="italic text-clay">little parcel?</em>
          </h1>
          <p className="mt-4 max-w-lg text-[13.5px] leading-relaxed text-muted">
            Enter your order number and the email or mobile number you used at checkout. We&apos;ll
            show you exactly where your pieces are.
          </p>
        </div>
      </section>

      <section className="container-x py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <TrackOrderForm initialOrder={order} email={customer?.email || ""} />

          <div>
            <p className="eyebrow text-clay">What happens next</p>
            <h2 className="mt-3 font-serif text-[30px] font-light sm:text-[36px]">
              Packed slowly, <em className="italic text-clay">sent swiftly.</em>
            </h2>
            <div className="mt-7 space-y-5">
              {[
                {
                  icon: PackageCheck,
                  title: "Order placed & confirmed",
                  body: "You'll receive an email confirmation straight away. Our team verifies stock and begins preparing your pieces.",
                },
                {
                  icon: Truck,
                  title: "Packed & dispatched",
                  body: "Most orders leave our Chennai studio within 24–48 hours. Tracking details arrive by email and SMS.",
                },
                {
                  icon: MessageCircle,
                  title: "Delivered, or a helping hand",
                  body: "Metro deliveries take 2–4 working days; elsewhere in India, 4–7. If anything looks off, we're one email away.",
                },
              ].map(({ icon: Icon, title, body }, i) => (
                <div key={title} className="flex gap-4 border-t border-line pt-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand text-clay">
                    <Icon size={16} strokeWidth={1.4} />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Step 0{i + 1}</p>
                    <h3 className="mt-1 font-serif text-[19px]">{title}</h3>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 border border-line bg-sand/40 p-5">
              <p className="flex items-center gap-2 font-serif text-[18px]">
                <Mail size={15} className="text-clay" /> Prefer email?
              </p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
                Write to{" "}
                <a href="mailto:care@babycon.in" className="text-clay underline underline-offset-2">
                  care@babycon.in
                </a>{" "}
                with your order number and we&apos;ll reply within one working day.
              </p>
              <Link href="/account" className="link-line mt-4 text-[9.5px] text-ink">
                View all my orders <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
