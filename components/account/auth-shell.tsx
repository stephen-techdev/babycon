import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function AuthShell({
  eyebrow,
  title,
  accent,
  description,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className="container-x py-8 sm:py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink">
        <ArrowLeft size={13} /> Back to the store
      </Link>

      <div className="mt-6 grid overflow-hidden border border-line lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden min-h-[620px] bg-sand lg:block">
          <Image
            src="/images/banners/story.jpg"
            alt="Softly folded baby essentials"
            fill
            sizes="(max-width: 1024px) 0vw, 45vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-cream">
            <p className="eyebrow text-cream/60">The Babycon family</p>
            <p className="mt-3 max-w-sm font-serif text-[32px] font-light leading-[1.15]">
              Softness, saved for <em className="italic text-blush">later.</em>
            </p>
            <p className="mt-3 max-w-xs text-[12px] leading-relaxed text-cream/65">
              Keep your details handy, revisit past orders and save the pieces you love.
            </p>
          </div>
        </div>

        <div className="bg-cream p-6 sm:p-10 lg:p-14">
          <p className="eyebrow text-clay">{eyebrow}</p>
          <h1 className="display mt-3 text-[36px] sm:text-[44px]">
            {title} <em className="italic text-clay">{accent}</em>
          </h1>
          <p className="mt-3 max-w-md text-[12.5px] leading-relaxed text-muted">{description}</p>

          <div className="mt-7 max-w-md">{children}</div>
          {footer && <div className="mt-6 max-w-md">{footer}</div>}
        </div>
      </div>
    </section>
  );
}
