import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, Instagram, Mail, MapPin, MessageCircle, Phone, Sparkles } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { contactPage, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Questions about sizing, fabric or an order? Write to the Babycon team — we reply within one working day.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-line bg-sand/50">
        <div className="container-x py-12 sm:py-16">
          <nav className="flex items-center gap-2 text-[9.5px] uppercase tracking-[0.16em] text-muted">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span>/</span>
            <span className="text-ink">Contact</span>
          </nav>
          <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <p className="eyebrow flex items-center gap-3 text-clay">
                <span className="h-px w-8 bg-clay/60" /> A real person, at the other end
              </p>
              <h1 className="display mt-4 max-w-2xl text-[44px] sm:text-[60px]">
                {contactPage.title.split(" ").slice(0, 2).join(" ")}{" "}
                <em className="italic text-clay">{contactPage.title.split(" ").slice(2).join(" ")}</em>
              </h1>
              <p className="mt-4 max-w-lg text-[13.5px] leading-relaxed text-muted">
                {contactPage.intro}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {["Sizing", "Fabric", "Orders", "Gifting"].map((tag) => (
                <span key={tag} className="border border-line bg-cream px-3 py-1.5 text-[9.5px] uppercase tracking-[0.14em] text-muted">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <div className="flex items-center gap-3 border-b border-line pb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-clay">
                <Sparkles size={16} />
              </span>
              <div>
                <h2 className="font-serif text-[24px] font-light">Write to us</h2>
                <p className="text-[10.5px] text-muted">A few details and we&apos;ll take it from there.</p>
              </div>
            </div>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-line bg-sand/40 p-6">
              <p className="text-[9.5px] uppercase tracking-[0.18em] text-muted">The studio</p>
              <div className="mt-5 space-y-4 text-[12.5px]">
                <a href={`mailto:${site.email}`} className="flex items-start gap-3 text-ink transition-colors hover:text-clay">
                  <Mail size={15} className="mt-0.5 shrink-0 text-clay" />
                  <span>
                    <span className="block text-[9.5px] uppercase tracking-[0.12em] text-muted">Email</span>
                    {site.email}
                  </span>
                </a>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex items-start gap-3 text-ink transition-colors hover:text-clay">
                  <Phone size={15} className="mt-0.5 shrink-0 text-clay" />
                  <span>
                    <span className="block text-[9.5px] uppercase tracking-[0.12em] text-muted">Phone</span>
                    {site.phone}
                  </span>
                </a>
                <a href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-ink transition-colors hover:text-clay">
                  <MessageCircle size={15} className="mt-0.5 shrink-0 text-clay" />
                  <span>
                    <span className="block text-[9.5px] uppercase tracking-[0.12em] text-muted">WhatsApp</span>
                    {site.whatsapp}
                  </span>
                </a>
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-ink transition-colors hover:text-clay">
                  <Instagram size={15} className="mt-0.5 shrink-0 text-clay" />
                  <span>
                    <span className="block text-[9.5px] uppercase tracking-[0.12em] text-muted">Instagram</span>
                    @babycon.in
                  </span>
                </a>
                <div className="flex items-start gap-3">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-clay" />
                  <span>
                    <span className="block text-[9.5px] uppercase tracking-[0.12em] text-muted">Studio</span>
                    {site.address}
                  </span>
                </div>
              </div>
              <div className="mt-5 flex items-start gap-3 border-t border-line pt-5 text-[12px] text-muted">
                <Clock3 size={15} className="mt-0.5 shrink-0 text-clay" />
                <span>
                  <span className="block text-[9.5px] uppercase tracking-[0.12em] text-muted">Hours</span>
                  {contactPage.hours}
                </span>
              </div>
            </div>

            <div className="relative overflow-hidden border border-line bg-forest p-6 text-cream">
              <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border border-cream/10" />
              <p className="eyebrow text-clay">Quick answers</p>
              <h3 className="mt-3 font-serif text-[26px] font-light">
                In a hurry? The <em className="italic text-blush">FAQs</em> may help.
              </h3>
              <p className="mt-2 max-w-xs text-[11.5px] leading-relaxed text-cream/60">
                Sizing, shipping, returns, COD and the demo checkout — most questions are answered
                there.
              </p>
              <Link href="/faq" className="link-line mt-5 text-[9.5px] text-cream">
                Read the FAQs
              </Link>
            </div>

            <div className="border border-line p-5">
              <p className="text-[9.5px] uppercase tracking-[0.16em] text-muted">Order help</p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                Have an order number handy? Track your parcel or view it from your account.
              </p>
              <div className="mt-4 flex flex-wrap gap-4">
                <Link href="/track-order" className="link-line text-[9.5px] text-ink">Track order</Link>
                <Link href="/account/orders" className="link-line text-[9.5px] text-ink">My orders</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-sand/30">
        <div className="container-x grid gap-6 py-10 sm:grid-cols-3">
          {[
            { title: "Sizing help", body: "Not sure between 0–6M and 6–12M? Tell us their age and weight and we'll guide you." },
            { title: "Gifting & bulk", body: "Baby showers, corporate gifting and hospital bags — we can put together something special." },
            { title: "Returns", body: "Something not right? Start a return within 7 days and we'll make it right." },
          ].map((item) => (
            <div key={item.title} className="border-l border-line pl-4">
              <h3 className="font-serif text-[18px]">{item.title}</h3>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
