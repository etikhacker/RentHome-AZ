"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";

export function ContactMessageRow({
  id,
  name,
  email,
  message,
  isRead,
  createdAt,
}: {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}) {
  const t = useTranslations("admin.contact");
  const supabase = createClient();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggleRead() {
    setBusy(true);
    await supabase.from("contact_messages").update({ is_read: !isRead }).eq("id", id);
    setBusy(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(t("confirmDelete"))) return;
    setBusy(true);
    await supabase.from("contact_messages").delete().eq("id", id);
    setBusy(false);
    router.refresh();
  }

  return (
    <div
      className={`border border-line rounded-xl p-3.5 sm:p-4 ${
        isRead ? "bg-white" : "bg-teal/5 border-teal/30"
      }`}
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4 mb-2 flex-wrap sm:flex-nowrap">
        <div className="min-w-0">
          <p className="text-sm font-medium break-words">{name}</p>
          <a href={`mailto:${email}`} className="text-xs text-teal-deep hover:underline break-all">
            {email}
          </a>
        </div>
        <p className="text-xs text-ink-soft whitespace-nowrap shrink-0">
          {new Date(createdAt).toLocaleString()}
        </p>
      </div>

      <p className="text-sm text-ink-soft whitespace-pre-wrap mb-3 break-words">{message}</p>

      <div className="flex gap-3 text-xs">
        <button
          onClick={toggleRead}
          disabled={busy}
          className="text-teal-deep hover:underline disabled:opacity-50"
        >
          {isRead ? t("markUnread") : t("markRead")}
        </button>
        <button
          onClick={handleDelete}
          disabled={busy}
          className="text-brick hover:underline disabled:opacity-50"
        >
          {t("delete")}
        </button>
      </div>
    </div>
  );
}
