"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { AnnouncementBar } from "@/components/layout/announcement";
import { SearchDialog } from "@/components/layout/search-dialog";
import { useStore } from "@/components/providers/store-provider";

const SHOP_LINKS = [
  { label: "Shop all", href: "/shop", desc: "The full Babycon collection" },
  { label: "Newborn essentials", href: "/collections/new-born-essentials", desc: "For the first tiny days" },
  { label: "Baby girl", href: "/collections/baby-girl", desc: "Sweet silhouettes & soft florals" },
  { label: "Baby boy", href: "/collections/baby-boy", desc: "Easy denims & waffle knits" },
  { label: "Combo sets", href: "/collections/newborn-comfort-combo-set", desc: "Ready-to-gift bundles" },
  { label: "Size 0–6M", href: "/collections/size-0-6m", desc: "Tiny sizes, enormous softness" },
  { label: "Size 6–12M", href: "/collections/size-6-12m", desc: "Room to wriggle & grow" },
  { label: "Accessories", href: "/collections/accessories", desc: "Blankets, bows & little extras" },
];

const MAIN_LINKS = [
  { label: "Newborn", href: "/collections/new-born-essentials" },
  { label: "Girls", href: "/collections/baby-girl" },
  { label: "Boys", href: "/collections/baby-boy" },
  { label: "Sale", href: "/collections/special-offers", accent: true },
];

export function Header() {
  const { cartCount, wishlist, setCartOpen, hydrated } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <AnnouncementBar />
      <header
        className={`sticky top-0 z-[60] border-b transition-all duration-300 ${
          scrolled
            ? "border-line/80 bg-cream/95 shadow-[0_8px_30px_-24px_rgba(33,29,25,0.4)] backdrop-blur-md"
            : "border-transparent bg-cream"
        }`}
      >
        <div className="container-x">
          <div className="grid h-[68px] grid-cols-[1fr_auto_1fr] items-center lg:h-[80px]">
            {/* mobile menu */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="flex h-9 w-9 items-center justify-center"
              >
                <Menu size={21} strokeWidth={1.4} />
              </button>
            </div>

            {/* desktop nav */}
            <nav className="hidden items-center gap-7 lg:flex">
              <div className="group relative">
                <button className="flex items-center gap-1.5 py-6 text-[10.5px] font-medium uppercase tracking-[0.17em] transition-colors hover:text-clay">
                  Shop
                  <ChevronDown
                    size={12}
                    className="transition-transform duration-300 group-hover:rotate-180"
                  />
                </button>
                <div className="invisible absolute left-0 top-full w-[620px] -translate-y-2 border border-line bg-cream p-7 opacity-0 shadow-soft transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="grid grid-cols-2 gap-x-10 gap-y-1">
                    {SHOP_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="group/link border-b border-line/70 py-3.5"
                      >
                        <span className="flex items-center justify-between text-[13px] text-ink transition-colors group-hover/link:text-clay">
                          {link.label}
                          <ArrowRight
                            size={12}
                            className="-translate-x-1 opacity-0 transition-all group-hover/link:translate-x-0 group-hover/link:opacity-100"
                          />
                        </span>
                        <span className="mt-0.5 block text-[10.5px] text-muted">
                          {link.desc}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between bg-sand px-5 py-4">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-clay">
                        The comfort edit
                      </p>
                      <p className="mt-1 font-serif text-[19px]">Newborn combo sets</p>
                    </div>
                    <Link
                      href="/collections/newborn-comfort-combo-set"
                      className="link-line text-[10px]"
                    >
                      Explore <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
              {MAIN_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-6 text-[10.5px] font-medium uppercase tracking-[0.17em] transition-colors hover:text-clay ${
                    link.accent ? "text-clay" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/pages/about"
                className="py-6 text-[10.5px] font-medium uppercase tracking-[0.17em] transition-colors hover:text-clay"
              >
                Our story
              </Link>
            </nav>

            <div className="flex justify-center lg:justify-center">
              <Logo compact className="lg:hidden" />
              <Logo className="hidden lg:flex" />
            </div>

            <div className="flex items-center justify-end gap-1.5 sm:gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="flex h-9 w-9 items-center justify-center transition-colors hover:text-clay"
              >
                <Search size={19} strokeWidth={1.4} />
              </button>
              <Link
                href="/account"
                aria-label="My account"
                className="hidden h-9 w-9 items-center justify-center transition-colors hover:text-clay sm:flex"
              >
                <User size={19} strokeWidth={1.4} />
              </Link>
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="relative hidden h-9 w-9 items-center justify-center transition-colors hover:text-clay sm:flex"
              >
                <Heart size={19} strokeWidth={1.4} />
                {hydrated && wishlist.length > 0 && (
                  <span className="absolute right-0 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[8.5px] font-medium text-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setCartOpen(true)}
                aria-label="Open bag"
                className="relative flex h-9 items-center justify-center gap-2 pl-1.5 transition-colors hover:text-clay"
              >
                <ShoppingBag size={19} strokeWidth={1.4} />
                <span className="hidden text-[10px] font-medium uppercase tracking-[0.12em] sm:inline">
                  Bag
                </span>
                {hydrated && cartCount > 0 && (
                  <span className="flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-ink px-1 text-[9px] font-medium text-cream">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          className={`absolute inset-0 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-cream transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <Logo compact />
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center"
            >
              <X size={20} strokeWidth={1.4} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <nav className="space-y-1">
              <Link
                href="/shop"
                onClick={() => setMobileOpen(false)}
                className="block border-b border-line py-4 font-serif text-[24px] font-light"
              >
                Shop all
              </Link>
              <button
                onClick={() => setMobileShopOpen((v) => !v)}
                className="flex w-full items-center justify-between border-b border-line py-4 text-left font-serif text-[24px] font-light"
              >
                Collections
                <ChevronDown
                  size={18}
                  className={`transition-transform ${mobileShopOpen ? "rotate-180" : ""}`}
                />
              </button>
              {mobileShopOpen && (
                <div className="space-y-0.5 border-b border-line py-3">
                  {SHOP_LINKS.slice(1).map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between py-2.5 text-[13.5px] text-muted"
                    >
                      {link.label}
                      <ArrowRight size={13} />
                    </Link>
                  ))}
                </div>
              )}
              {[
                { label: "Newborn", href: "/collections/new-born-essentials" },
                { label: "Baby girl", href: "/collections/baby-girl" },
                { label: "Baby boy", href: "/collections/baby-boy" },
                { label: "Special offers", href: "/collections/special-offers" },
                { label: "Our story", href: "/pages/about" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-line py-4 font-serif text-[24px] font-light"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-8 space-y-3 text-[11px] uppercase tracking-[0.15em] text-muted">
              <Link href="/account" onClick={() => setMobileOpen(false)} className="block">
                My account
              </Link>
              <Link href="/track-order" onClick={() => setMobileOpen(false)} className="block">
                Track order
              </Link>
              <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="block">
                Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
              </Link>
            </div>
          </div>

          <div className="border-t border-line px-6 py-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted">Need a hand?</p>
            <a href="mailto:care@babycon.in" className="mt-1 block font-serif text-[17px]">
              care@babycon.in
            </a>
          </div>
        </div>
      </div>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
