"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";

export function ListingReviewRow({
  id,
  title,
  price,
  status,
  isPremium,
  ownerName,
}: {
  id: string;
  title: string;
  price: number;
  status: string;
  isPremium: boolean;
  ownerName: string | null;
}) {
  const t = useTranslations("admin.listings");
  const tCommon = useTranslations("common");
  const tStatus = useTranslations("status");
  const supabase = createClient();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(newStatus: "tesdiqlendi" | "reddedildi") {
    setBusy(true);
    await supabase.from("properties").update({ status: newStatus }).eq("id", id);
    setBusy(false);
    router.refresh();
  }

  async function togglePremium() {
    setBusy(true);
    await supabase.from("properties").update({ is_premium: !isPremium }).eq("id", id);
    setBusy(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(t("confirmDelete"))) return;
    setBusy(true);
    await supabase.from("properties").delete().eq("id", id);
    setBusy(false);
    router.refresh();
  }

  const statusClasses: Record<string, string> = {
    gozleyir: "bg-gold/15 text-gold-deep",
    tesdiqlendi: "bg-teal/15 text-teal-deep",
    reddedildi: "bg-brick/15 text-brick",
  };

  const knownStatuses = ["gozleyir", "tesdiqlendi", "reddedildi"] as const;
  const badgeText = (knownStatuses as readonly string[]).includes(status)
    ? tStatus(status as (typeof knownStatuses)[number])
    : status;
  const badgeClass = statusClasses[status] ?? "bg-line text-ink-soft";

  return (
    <div className="flex items-center justify-between border border-line rounded-lg px-4 py-3 gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Link href={`/elan/${id}`} className="text-sm font-medium hover:underline truncate">
            {title}
          </Link>
          <span className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ${badgeClass}`}>
            {badgeText}
          </span>
          {isPremium && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gold text-white shrink-0">
              PREMIUM
            </span>
          )}
        </div>
        <div className="text-xs text-ink-soft mt-1">
          {ownerName ?? "—"} · {price} {tCommon("currency")}{tCommon("perMonth")}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {status !== "tesdiqlendi" && (
          <button
            onClick={() => setStatus("tesdiqlendi")}
            disabled={busy}
            className="text-xs bg-teal text-white rounded-md px-3 py-1.5 disabled:opacity-50"
          >
            {t("approve")}
          </button>
        )}
        {status !== "reddedildi" && (
          <button
            onClick={() => setStatus("reddedildi")}
            disabled={busy}
            className="text-xs border border-brick text-brick rounded-md px-3 py-1.5 disabled:opacity-50"
          >
            {t("reject")}
          </button>
        )}
        {status === "tesdiqlendi" && (
          <button
            onClick={togglePremium}
            disabled={busy}
            className={`text-xs rounded-md px-3 py-1.5 border disabled:opacity-50 ${
              isPremium ? "border-gold text-gold-deep" : "border-line text-ink-soft"
            }`}
          >
            {isPremium ? t("cancelPremium") : t("givePremium")}
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={busy}
          className="text-xs text-ink-soft hover:text-brick disabled:opacity-50"
        >
          {tCommon("delete")}
        </button>
      </div>
    </div>
  );
}
