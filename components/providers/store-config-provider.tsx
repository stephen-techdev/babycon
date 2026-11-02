"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { StoreConfig } from "@/lib/store-config";

const StoreConfigContext = createContext<StoreConfig | null>(null);

export function StoreConfigProvider({
  value,
  children,
}: {
  value: StoreConfig;
  children: React.ReactNode;
}) {
  const [config, setConfig] = useState(value);

  // The layout is part of the statically rendered storefront shell. Refresh
  // the settings from the database after mount so admin changes appear on the
  // next page load without a rebuild.
  useEffect(() => {
    let cancelled = false;

    fetch("/api/store-config", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.config) {
          setConfig((current) => ({ ...current, ...data.config }));
        }
      })
      .catch(() => {
        // Keep the server-rendered values when the refresh fails.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <StoreConfigContext.Provider value={config}>
      {children}
    </StoreConfigContext.Provider>
  );
}

export function useStoreConfig(): StoreConfig {
  const config = useContext(StoreConfigContext);
  if (!config) {
    throw new Error("useStoreConfig must be used inside StoreConfigProvider");
  }
  return config;
}
