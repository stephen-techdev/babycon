import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminSession } from "@/lib/auth-server";
import { listAllReviews, listMessages, listOrders } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");

  const orders = listOrders();
  const pendingOrders = orders.filter(
    (order) => order.status === "placed" || order.status === "confirmed"
  ).length;
  const pendingReviews = listAllReviews().filter((review) => !review.approved).length;
  const newMessages = listMessages().filter((message) => message.status === "new").length;

  return (
    <AdminShell
      admin={{ name: admin.name, email: admin.email }}
      badges={{ orders: pendingOrders, reviews: pendingReviews, messages: newMessages }}
    >
      {children}
    </AdminShell>
  );
}
