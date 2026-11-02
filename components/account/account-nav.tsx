"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LayoutDashboard, LifeBuoy, LogOut, Package } from "lucide-react";

const LINKS = [
  { label: "Overview", href: "/account", icon: LayoutDashboard },
  { label: "My orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Help", href: "/contact", icon: LifeBuoy },
];

export function AccountNav({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();

  return (
    <aside className="lg:sticky lg:top-28 lg:h-fit">
      <div className="border border-line bg-sand/30 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-[12px] font-medium text-cream">
            {name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate font-serif text-[17px]">{name}</p>
            <p className="truncate text-[10.5px] text-muted">{email}</p>
          </div>
        </div>
      </div>

      <nav className="mt-3 border border-line">
        {LINKS.map(({ label, href, icon: Icon }) => {
          const active = href === "/account" ? pathname === "/account" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 border-b border-line px-4 py-3.5 text-[11px] uppercase tracking-[0.12em] transition-colors last:border-b-0 ${
                active ? "bg-ink text-cream" : "text-muted hover:bg-sand/40 hover:text-ink"
              }`}
            >
              <Icon size={14} strokeWidth={1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      <form action="/api/auth/logout" method="post" className="mt-3">
        <button
          type="submit"
          className="flex w-full items-center gap-3 border border-line px-4 py-3 text-[10.5px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-clay hover:text-clay"
        >
          <LogOut size={13} /> Sign out
        </button>
      </form>
    </aside>
  );
}
