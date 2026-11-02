import { redirect } from "next/navigation";
import { AccountNav } from "@/components/account/account-nav";
import { getCustomerSession } from "@/lib/auth-server";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const customer = await getCustomerSession();
  if (!customer) redirect("/account/login?next=/account");

  return (
    <section className="container-x py-10 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-[250px_1fr] lg:gap-12">
        <AccountNav name={customer.name} email={customer.email} />
        <div>{children}</div>
      </div>
    </section>
  );
}
