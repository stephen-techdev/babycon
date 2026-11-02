import Link from "next/link";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { FooterNewsletter } from "@/components/layout/announcement";
import { Logo } from "@/components/brand/logo";
import { footerLinks, paymentMethods, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-forest text-cream">
      <div className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full border border-cream/5" />
      <div className="pointer-events-none absolute -right-20 top-20 h-[300px] w-[300px] rounded-full border border-cream/5" />

      <div className="container-x relative pt-16 sm:pt-20">
        <FooterNewsletter />

        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
          <div>
            <Logo inverted />
            <p className="mt-5 max-w-[280px] text-[13px] leading-[1.8] text-cream/55">
              Premium baby essentials, thoughtfully made in small batches. Soft fabrics,
              honest details and pieces made to be kept.
            </p>
            <div className="mt-6 space-y-2.5 text-[12px] text-cream/60">
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-2.5 transition-colors hover:text-cream"
              >
                <Mail size={13} strokeWidth={1.5} />
                {site.email}
              </a>
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2.5 transition-colors hover:text-cream"
              >
                <Phone size={13} strokeWidth={1.5} />
                {site.phone}
              </a>
              <p className="flex items-start gap-2.5 leading-relaxed">
                <MapPin size={13} strokeWidth={1.5} className="mt-1 shrink-0" />
                {site.address}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center border border-cream/20 transition-colors hover:border-clay hover:bg-clay"
              >
                <Instagram size={14} strokeWidth={1.5} />
              </a>
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center border border-cream/20 transition-colors hover:border-clay hover:bg-clay"
              >
                <Facebook size={14} strokeWidth={1.5} />
              </a>
              <a
                href={`mailto:${site.email}`}
                aria-label="Email us"
                className="flex h-9 w-9 items-center justify-center border border-cream/20 transition-colors hover:border-clay hover:bg-clay"
              >
                <Mail size={14} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-medium uppercase tracking-[0.24em] text-cream/40">
              Shop
            </h3>
            <ul className="mt-5 space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[12.5px] text-cream/65 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-medium uppercase tracking-[0.24em] text-cream/40">
              Help
            </h3>
            <ul className="mt-5 space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[12.5px] text-cream/65 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-medium uppercase tracking-[0.24em] text-cream/40">
              The house
            </h3>
            <ul className="mt-5 space-y-3">
              {footerLinks.house.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[12.5px] text-cream/65 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 text-[12.5px] text-cream/40 transition-colors hover:text-clay"
                >
                  Admin dashboard <ArrowUpRight size={11} />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-cream/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10.5px] tracking-wide text-cream/40">
            © {new Date().getFullYear()} {site.legalName}. All rights reserved. GSTIN {site.gstin}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="border border-cream/15 px-2.5 py-1 text-[8.5px] font-medium uppercase tracking-[0.12em] text-cream/50"
              >
                {method}
              </span>
            ))}
            <span className="ml-1 border border-clay/40 px-2.5 py-1 text-[8.5px] font-medium uppercase tracking-[0.12em] text-clay">
              Demo store
            </span>
          </div>
        </div>
      </div>

      <div className="relative select-none overflow-hidden">
        <p className="pointer-events-none translate-y-[22%] text-center font-serif text-[26vw] font-light leading-none tracking-[-0.05em] text-cream/[0.045]">
          babycon
        </p>
      </div>
    </footer>
  );
}
