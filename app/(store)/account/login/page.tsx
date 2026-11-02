import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/account/auth-shell";
import { CustomerLoginForm } from "@/components/account/login-form";
import { getCustomerSession } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Babycon account to view orders and saved pieces.",
  robots: { index: false, follow: true },
};

type Props = { searchParams: Promise<{ next?: string | string[] }> };

export default async function LoginPage({ searchParams }: Props) {
  const customer = await getCustomerSession();
  const raw = await searchParams;
  const next = (Array.isArray(raw.next) ? raw.next[0] : raw.next) || "/account";
  if (customer) redirect(next);

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Good to see you"
      accent="again."
      description="Sign in to see your orders, track a delivery or pick up where you left off."
    >
      <CustomerLoginForm next={next} />
    </AuthShell>
  );
}
