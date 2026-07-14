"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";

export function MyListingRow({
  id,
  title,
  price,
  status,
}: {
  id: string;
  title: string;
  price: number;
  status: string;
}) {
  const tCommon = useTranslations("common");
  const tStatus = useTranslations("status");
  const supabase = createClient();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(tCommon("delete") + "?")) return;
    setDeleting(true);
    await supabase.from("properties").delete().eq("id", id);
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
    <div className="flex items-center justify-between border border-line rounded-lg px-4 py-3">
      <div>
        <Link href={`/elan/${id}`} className="text-sm font-medium hover:underline">
          {title}
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono text-xs text-ink-soft">{price} {tCommon("currency")}{tCommon("perMonth")}</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full ${badgeClass}`}>
            {badgeText}
          </span>
        </div>
      </div>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-xs text-brick border-b border-brick disabled:opacity-50"
      >
        {deleting ? tCommon("deleting") : tCommon("delete")}
      </button>
    </div>
  );
}
