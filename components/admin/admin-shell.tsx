"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ExternalLink,
  LayoutDashboard,
  Layers,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Package,
  Settings,
  ShoppingBag,
  Star,
  Store,
  Tag,
  Users,
  X,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag, key: "orders" },
  { label: "Collections", href: "/admin/collections", icon: Layers },
  { label: "Coupons", href: "/admin/coupons", icon: Tag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Reviews", href: "/admin/reviews", icon: Star, key: "reviews" },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare, key: "messages" },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminShell({
  admin,
  badges,
  children,
}: {
  admin: { name: string; email: string };
  badges: { orders: number; reviews: number; messages: number };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const sidebar = (
    <div className="flex h-full flex-col bg-forest text-cream">
      <div className="flex items-center justify-between border-b border-cream/10 px-5 py-5">
        <Link href="/admin" className="flex flex-col leading-none">
          <span className="relative font-serif text-[27px] tracking-[-0.03em]">
            babycon
            <span className="absolute -right-2 top-1 h-[4px] w-[4px] rounded-full bg-clay" />
          </span>
          <span className="mt-1 text-[7px] font-medium uppercase tracking-[0.36em] text-cream/40">
            studio admin
          </span>
        </Link>
        <button
          onClick={() => setOpen(false)}
          className="flex h-8 w-8 items-center justify-center text-cream/60 lg:hidden"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mx-4 mt-4 flex items-center gap-2 border border-cream/10 bg-cream/5 px-3 py-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-clay text-[9px] font-medium text-white">
          {admin.name.slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-medium">{admin.name}</p>
          <p className="truncate text-[9px] text-cream/40">{admin.email}</p>
        </div>
      </div>

      <nav className="mt-4 flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {NAV.map(({ label, href, icon: Icon, key }) => {
          const active = isActive(href);
          const badge = key ? badges[key as keyof typeof badges] : 0;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 text-[11.5px] transition-colors ${
                active
                  ? "bg-cream/10 text-cream"
                  : "text-cream/55 hover:bg-cream/5 hover:text-cream"
              }`}
            >
              <Icon size={15} strokeWidth={1.5} className={active ? "text-clay" : ""} />
              <span className="flex-1">{label}</span>
              {badge > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[8px] font-medium text-white">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-cream/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 text-[11px] text-cream/55 transition-colors hover:text-cream"
        >
          <Store size={14} /> View storefront <ExternalLink size={10} className="ml-auto" />
        </Link>
        <form action="/api/auth/logout?scope=admin" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-3 py-2.5 text-[11px] text-cream/55 transition-colors hover:text-clay"
          >
            <LogOut size={14} /> Sign out
          </button>
        </form>
        <p className="mt-2 px-3 text-[8px] uppercase tracking-[0.14em] text-cream/25">
          Demo admin · v1.0
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F1EB]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[236px] lg:block">{sidebar}</aside>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div
          className={`absolute inset-0 bg-ink/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 w-[270px] transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebar}
        </div>
      </div>

      <div className="lg:pl-[236px]">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-[#F4F1EB]/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="flex h-9 w-9 items-center justify-center border border-line bg-white lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={17} />
            </button>
            <p className="text-[9.5px] uppercase tracking-[0.2em] text-muted">
              Babycon studio · admin
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 border border-amber-300 bg-amber-50 px-3 py-1.5 text-[8.5px] font-medium uppercase tracking-[0.12em] text-amber-800 sm:flex">
              Demo store · test data
            </span>
            <Link
              href="/"
              target="_blank"
              className="flex h-9 items-center gap-2 border border-line bg-white px-3 text-[9px] font-medium uppercase tracking-[0.12em] text-muted transition-colors hover:border-ink hover:text-ink"
            >
              <ExternalLink size={11} /> Storefront
            </Link>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
