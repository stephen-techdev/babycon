import type { Metadata } from "next";
import { Mail, Send, Trash2, Users } from "lucide-react";
import { deleteSubscriber } from "@/app/admin/actions";
import { ConfirmForm } from "@/components/admin/confirm-form";
import { SubscriberTools } from "@/components/admin/subscriber-tools";
import { AdminEmpty, AdminPageHeader, StatCard } from "@/components/admin/ui";
import { listSubscribers } from "@/lib/db";
import { formatDate, timeAgo } from "@/lib/utils";

export const metadata: Metadata = { title: "Newsletter · Admin" };
export const dynamic = "force-dynamic";

export default function AdminNewsletterPage() {
  const subscribers = listSubscribers();
  const thisMonth = subscribers.filter((subscriber) => {
    const created = new Date(subscriber.createdAt);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  return (
    <>
      <AdminPageHeader
        eyebrow="Audience"
        title="Newsletter"
        description="The soft launch list. Emails captured from the storefront footer and welcome section, ready to export into your email platform."
        action={<SubscriberTools emails={subscribers.map((subscriber) => subscriber.email)} />}
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Subscribers" value={String(subscribers.length)} note="All time" icon={Users} tone="forest" />
        <StatCard label="New this month" value={String(thisMonth)} note="Since the 1st" icon={Send} tone="clay" />
        <StatCard
          label="Latest signup"
          value={subscribers[0] ? timeAgo(subscribers[0].createdAt) : "—"}
          note={subscribers[0]?.email || "No signups yet"}
          icon={Mail}
          tone="sage"
        />
      </div>

      <div className="border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
            Subscriber list
          </h2>
          <p className="text-[9.5px] text-muted">{subscribers.length} email addresses</p>
        </div>

        {subscribers.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-line text-[8.5px] uppercase tracking-[0.12em] text-muted">
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-3 py-3 font-medium">Joined</th>
                  <th className="px-3 py-3 font-medium">Source</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="text-[11.5px] transition-colors hover:bg-sand/25">
                    <td className="px-4 py-3">
                      <a href={`mailto:${subscriber.email}`} className="flex items-center gap-2 text-ink hover:text-clay">
                        <Mail size={12} className="text-muted" /> {subscriber.email}
                      </a>
                    </td>
                    <td className="px-3 py-3 text-muted">{formatDate(subscriber.createdAt)}</td>
                    <td className="px-3 py-3">
                      <span className="bg-sand px-1.5 py-0.5 text-[8px] uppercase tracking-[0.08em] text-muted">
                        Storefront
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ConfirmForm
                        action={deleteSubscriber}
                        fields={{ id: subscriber.id }}
                        message={`Remove ${subscriber.email} from the newsletter?`}
                      >
                        <button
                          type="submit"
                          className="inline-flex h-7 w-7 items-center justify-center border border-line text-muted transition-colors hover:border-clay hover:text-clay"
                          aria-label={`Remove ${subscriber.email}`}
                        >
                          <Trash2 size={11} />
                        </button>
                      </ConfirmForm>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <AdminEmpty
              title="No subscribers yet"
              description="Signups from the footer and homepage newsletter form will appear here."
            />
          </div>
        )}
      </div>

      <div className="mt-4 border border-line bg-white p-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ink">Connecting a provider</p>
        <p className="mt-1.5 text-[10.5px] leading-relaxed text-muted">
          This demo stores subscribers locally in SQLite. To send campaigns, export the CSV and import
          it into Mailchimp, Klaviyo, Brevo or your provider of choice. For production, hook the
          newsletter API route up to your provider&apos;s list endpoint.
        </p>
      </div>
    </>
  );
}
