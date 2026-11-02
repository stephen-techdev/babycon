import { CartDrawer } from "@/components/layout/cart-drawer";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StoreConfigProvider } from "@/components/providers/store-config-provider";
import { StoreProvider } from "@/components/providers/store-provider";
import { getSettings } from "@/lib/db";
import { storeConfigFromSettings } from "@/lib/store-config";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const config = storeConfigFromSettings(getSettings());

  return (
    <StoreConfigProvider value={config}>
      <StoreProvider>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </StoreProvider>
    </StoreConfigProvider>
  );
}
