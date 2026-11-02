"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CartItem, Product } from "@/lib/types";

type Toast = { id: number; message: string; tone?: "default" | "success" | "error" };

type StoreContextValue = {
  items: CartItem[];
  addItem: (
    product: Pick<
      Product,
      "id" | "handle" | "title" | "images" | "price" | "compareAtPrice" | "stock"
    >,
    options?: { size?: string; color?: string; qty?: number; openDrawer?: boolean; silent?: boolean }
  ) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (handle: string) => void;
  isWishlisted: (handle: string) => boolean;
  toast: Toast | null;
  notify: (message: string, tone?: Toast["tone"]) => void;
  hydrated: boolean;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = "babycon_cart_v1";
const WISH_KEY = "babycon_wishlist_v1";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const rawCart = localStorage.getItem(CART_KEY);
      if (rawCart) {
        const parsed = JSON.parse(rawCart);
        if (Array.isArray(parsed)) setItems(parsed);
      }
      const rawWish = localStorage.getItem(WISH_KEY);
      if (rawWish) {
        const parsed = JSON.parse(rawWish);
        if (Array.isArray(parsed)) setWishlist(parsed);
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  const notify = useCallback((message: string, tone: Toast["tone"] = "default") => {
    setToast({ id: Date.now(), message, tone });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const addItem = useCallback<StoreContextValue["addItem"]>(
    (product, options = {}) => {
      const size = options.size || "One Size";
      const color = options.color || "";
      const qty = Math.max(1, options.qty || 1);
      const key = `${product.id}-${size}-${color}`.replace(/\s+/g, "-").toLowerCase();
      setItems((prev) => {
        const existing = prev.find((i) => i.key === key);
        if (existing) {
          return prev.map((i) =>
            i.key === key
              ? { ...i, qty: Math.min(i.stock, i.qty + qty) }
              : i
          );
        }
        return [
          ...prev,
          {
            key,
            productId: product.id,
            handle: product.handle,
            title: product.title,
            image: product.images[0] || "",
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            size,
            color,
            qty: Math.min(product.stock, qty),
            stock: product.stock,
          },
        ];
      });
      if (!options.silent) notify("Added to your bag", "success");
      if (options.openDrawer !== false) setCartOpen(true);
    },
    [notify]
  );

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.key === key ? { ...i, qty: Math.max(0, Math.min(i.stock, qty)) } : i
        )
        .filter((i) => i.qty > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const toggleWishlist = useCallback(
    (handle: string) => {
      setWishlist((prev) => {
        const exists = prev.includes(handle);
        notify(exists ? "Removed from wishlist" : "Saved to wishlist", "success");
        return exists ? prev.filter((h) => h !== handle) : [...prev, handle];
      });
    },
    [notify]
  );

  const isWishlisted = useCallback(
    (handle: string) => wishlist.includes(handle),
    [wishlist]
  );

  const cartCount = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((n, i) => n + i.price * i.qty, 0),
    [items]
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      items,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      cartCount,
      subtotal,
      cartOpen,
      setCartOpen,
      wishlist,
      toggleWishlist,
      isWishlisted,
      toast,
      notify,
      hydrated,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      cartCount,
      subtotal,
      cartOpen,
      wishlist,
      toggleWishlist,
      isWishlisted,
      toast,
      notify,
      hydrated,
    ]
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className={`pointer-events-none fixed inset-x-0 bottom-6 z-[120] flex justify-center px-4 transition-all duration-300 ${
          toast ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        {toast && (
          <div
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 text-[12px] tracking-wide shadow-soft ${
              toast.tone === "error"
                ? "bg-[#7f2d2d] text-white"
                : "bg-ink text-cream"
            }`}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-clay" />
            {toast.message}
          </div>
        )}
      </div>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
