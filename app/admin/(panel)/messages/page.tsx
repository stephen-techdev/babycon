import type { Metadata } from "next";
import Link from "next/link";
import { CheckCheck, Mail, MessageSquare, Phone, Reply, Trash2 } from "lucide-react";
import { deleteMessage, setMessageStatus } from "@/app/admin/actions";
import { ConfirmForm } from "@/components/admin/confirm-form";
import { AdminEmpty, AdminPageHeader, StatusPill } from "@/components/admin/ui";
import { listMessages } from "@/lib/db";
import { timeAgo } from "@/lib/utils";

export const metadata: Metadata = { title: "Messages · Admin" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const FILTERS = [
  { key: "", label: "All" },
  { key: "new", label: "New" },
  { key: "read", label: "Read" },
  { key: "replied", label: "Replied" },
];

export default async function AdminMessagesPage({ searchParams }: Props) {
  const raw = await searchParams;
  const filter = (Array.isArray(raw.status) ? raw.status[0] : raw.status) || "";
  const all = listMessages();
  const counts = all.reduce<Record<string, number>>((acc, message) => {
    acc[message.status] = (acc[message.status] || 0) + 1;
    return acc;
  }, {});
  const messages = filter ? all.filter((message) => message.status === filter) : all;

  return (
    <>
      <AdminPageHeader
        eyebrow="Inbox"
        title="Messages"
        description="Enquiries from the contact form — sizing questions, order follow-ups, gifting and wholesale. Reply by email, then mark the thread."
      />

      <div className="mb-4 flex flex-wrap gap-1">
        {FILTERS.map((item) => {
          const count = item.key ? counts[item.key] || 0 : all.length;
          return (
            <Link
              key={item.key || "all"}
              href={item.key ? `/admin/messages?status=${item.key}` : "/admin/messages"}
              className={`inline-flex h-8 items-center gap-1.5 px-2.5 text-[9.5px] uppercase tracking-[0.1em] transition-colors ${
                filter === item.key ? "bg-ink text-cream" : "border border-line bg-white text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {item.label}
              <span className={filter === item.key ? "text-cream/50" : "text-muted/50"}>{count}</span>
            </Link>
          );
        })}
      </div>

      {messages.length ? (
        <div className="space-y-3">
          {messages.map((message) => (
            <article key={message.id} className={`border bg-white ${message.status === "new" ? "border-clay/40" : "border-line"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-3">
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[9px] font-medium ${message.status === "new" ? "bg-clay/15 text-clay" : "bg-sand text-muted"}`}>
                    {message.name.split(" ").filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase()}
                  </span>
                  <div>
                    <p className="text-[12.5px] font-medium text-ink">{message.name}</p>
                    <p className="text-[9.5px] text-muted">{message.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill status={message.status} />
                  <span className="text-[9px] text-muted">{timeAgo(message.createdAt)}</span>
                </div>
              </div>

              <div className="px-5 py-4">
                <p className="text-[12.5px] leading-[1.8] text-muted">{message.message}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-muted">
                  <a href={`mailto:${message.email}`} className="flex items-center gap-1.5 hover:text-clay">
                    <Mail size={12} /> {message.email}
                  </a>
                  {message.phone && (
                    <a href={`tel:+91${message.phone}`} className="flex items-center gap-1.5 hover:text-clay">
                      <Phone size={12} /> +91 {message.phone}
                    </a>
                  )}
                  <span className="flex items-center gap-1.5">
                    <MessageSquare size={12} /> Contact form
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-sand/20 px-5 py-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  {message.status !== "new" && (
                    <form action={setMessageStatus}>
                      <input type="hidden" name="id" value={message.id} />
                      <input type="hidden" name="status" value="new" />
                      <button type="submit" className="inline-flex h-7 items-center gap-1.5 border border-line bg-white px-2.5 text-[8.5px] font-medium uppercase tracking-[0.1em] text-muted transition-colors hover:border-ink hover:text-ink">
                        Mark unread
                      </button>
                    </form>
                  )}
                  {message.status === "new" && (
                    <form action={setMessageStatus}>
                      <input type="hidden" name="id" value={message.id} />
                      <input type="hidden" name="status" value="read" />
                      <button type="submit" className="inline-flex h-7 items-center gap-1.5 border border-line bg-white px-2.5 text-[8.5px] font-medium uppercase tracking-[0.1em] text-muted transition-colors hover:border-ink hover:text-ink">
                        <CheckCheck size={11} /> Mark read
                      </button>
                    </form>
                  )}
                  {message.status !== "replied" && (
                    <form action={setMessageStatus}>
                      <input type="hidden" name="id" value={message.id} />
                      <input type="hidden" name="status" value="replied" />
                      <button type="submit" className="inline-flex h-7 items-center gap-1.5 border border-sage/40 bg-sage/10 px-2.5 text-[8.5px] font-medium uppercase tracking-[0.1em] text-sage transition-colors hover:bg-sage/20">
                        <Reply size={11} /> Mark replied
                      </button>
                    </form>
                  )}
                  <a
                    href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject} — Babycon`)}`}
                    className="inline-flex h-7 items-center gap-1.5 bg-ink px-2.5 text-[8.5px] font-medium uppercase tracking-[0.1em] text-cream transition-colors hover:bg-forest"
                  >
                    <Reply size={11} /> Reply by email
                  </a>
                </div>
                <ConfirmForm
                  action={deleteMessage}
                  fields={{ id: message.id }}
                  message={`Delete the message from ${message.name}?`}
                >
                  <button
                    type="submit"
                    className="flex h-7 items-center gap-1.5 px-1.5 text-[8.5px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-clay"
                  >
                    <Trash2 size={11} /> Delete
                  </button>
                </ConfirmForm>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <AdminEmpty
          title={filter ? "Nothing in this folder" : "A quiet inbox"}
          description={
            filter
              ? "No messages with this status right now."
              : "New enquiries from the contact form will land here."
          }
          action={
            filter && (
              <Link href="/admin/messages" className="inline-flex h-9 items-center border border-line px-4 text-[9px] uppercase tracking-[0.12em] text-muted hover:border-ink hover:text-ink">
                View all messages
              </Link>
            )
          }
        />
      )}
    </>
  );
}
