import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/checkout-flow";
import { getCustomerSession } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "Secure checkout",
  description: "Complete your Babycon order.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const user = await getCustomerSession();
  return (
    <CheckoutFlow
      user={user ? { name: user.name, email: user.email, phone: user.phone } : null}
    />
  );
}
