"use client";

import { useEffect, useMemo, useState } from "react";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { useStoreConfig } from "@/components/providers/store-config-provider";
import { formatINR } from "@/lib/money";

export function AnnouncementBar() {
  const { announcement, freeShippingThreshold } = useStoreConfig();
  const messages = useMemo(
    () =>
      Array.from(
        new Set(
          [
            announcement,
            "New here? Use WELCOME10 for 10% off your first order",
            "Thoughtfully made in small batches, in India",
          ].filter(Boolean)
        )
      ),
    [announcement]
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % messages.length), 4500);
    return () => clearInterval(timer);
  }, [messages]);

  return (
    <div className="relative overflow-hidden bg-forest text-cream">
      <div className="container-x flex h-9 items-center justify-between gap-4">
        <span className="hidden text-[9px] font-medium uppercase tracking-[0.22em] text-cream/60 md:block">
          Free shipping over {formatINR(freeShippingThreshold)}
        </span>
        <div className="relative h-full flex-1 overflow-hidden text-center md:flex-none">
          {messages.map((message, i) => (
            <p
              key={message}
              className={`absolute inset-0 flex items-center justify-center text-[9.5px] font-medium uppercase tracking-[0.18em] transition-all duration-700 sm:text-[10px] ${
                i === index ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            >
              {message}
            </p>
          ))}
        </div>
        <a
          href="/track-order"
          className="hidden text-[9px] font-medium uppercase tracking-[0.22em] text-cream/60 transition-colors hover:text-cream md:block"
        >
          Track order
        </a>
      </div>
    </div>
  );
}

export function FooterNewsletter() {
  return (
    <div className="border-b border-cream/10 pb-14">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div>
          <p className="eyebrow mb-4 text-clay">Little letters</p>
          <h3 className="display max-w-lg text-[34px] text-cream sm:text-[42px]">
            Soft launches, tiny stories, <em className="text-clay">first dibs.</em>
          </h3>
          <p className="mt-4 max-w-md text-[13px] leading-relaxed text-cream/60">
            Join the Babycon family for new collections, care notes and 10% off your first order.
          </p>
        </div>
        <NewsletterForm inverted />
      </div>
    </div>
  );
}
