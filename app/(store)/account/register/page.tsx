import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/account/auth-shell";
import { CustomerRegisterForm } from "@/components/account/register-form";
import { getCustomerSession } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a Babycon account for faster checkout and easy order tracking.",
  robots: { index: false, follow: true },
};

export default async function RegisterPage() {
  const customer = await getCustomerSession();
  if (customer) redirect("/account");

  return (
    <AuthShell
      eyebrow="Join the family"
      title="A softer way"
      accent="to shop."
      description="Create an account for faster checkout, order history and a place to keep your favourite pieces."
    >
      <CustomerRegisterForm />
    </AuthShell>
  );
}
