import {
  COD_FEE,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
} from "./money";

export type StoreConfig = {
  storeName: string;
  announcement: string;
  freeShippingThreshold: number;
  shippingFee: number;
  codFee: number;
  codEnabled: boolean;
};

export const defaultStoreConfig: StoreConfig = {
  storeName: "babycon",
  announcement: "Complimentary shipping on orders over ₹1,499",
  freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  shippingFee: SHIPPING_FEE,
  codFee: COD_FEE,
  codEnabled: true,
};

function positive(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed) : fallback;
}

export function storeConfigFromSettings(
  settings: Record<string, string>
): StoreConfig {
  return {
    storeName: settings.storeName || defaultStoreConfig.storeName,
    announcement: settings.announcement || defaultStoreConfig.announcement,
    freeShippingThreshold: positive(
      settings.freeShippingThreshold,
      defaultStoreConfig.freeShippingThreshold
    ),
    shippingFee: positive(settings.shippingFee, defaultStoreConfig.shippingFee),
    codFee: positive(settings.codFee, defaultStoreConfig.codFee),
    codEnabled: settings.codEnabled !== "0",
  };
}
