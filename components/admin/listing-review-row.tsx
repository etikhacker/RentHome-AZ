"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const statusLabels: Record<string, { text: string; className: string }> = {
  gozleyir: { text: "Gözləyir", className: "bg-gold/15 text-gold-deep" },
  tesdiqlendi: { text: "Təsdiqləndi", className: "bg-teal/15 text-teal-deep" },
  reddedildi: { text: "Rədd edildi", className: "bg-brick/15 text-brick" },
};

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
    if (!confirm("Bu elanı tamamilə silmək istədiyinə əminsən?")) return;
    setBusy(true);
    await supabase.from("properties").delete().eq("id", id);
    setBusy(false);
    router.refresh();
  }

  const badge = statusLabels[status] ?? { text: status, className: "bg-line text-ink-soft" };

  return (
    <div className="flex items-center justify-between border border-line rounded-lg px-4 py-3 gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Link href={`/elan/${id}`} className="text-sm font-medium hover:underline truncate">
            {title}
          </Link>
          <span className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ${badge.className}`}>
            {badge.text}
          </span>
          {isPremium && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gold text-white shrink-0">
              PREMIUM
            </span>
          )}
        </div>
        <div className="text-xs text-ink-soft mt-1">
          {ownerName ?? "—"} · {price} ₼/ay
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {status !== "tesdiqlendi" && (
          <button
            onClick={() => setStatus("tesdiqlendi")}
            disabled={busy}
            className="text-xs bg-teal text-white rounded-md px-3 py-1.5 disabled:opacity-50"
          >
            Təsdiqlə
          </button>
        )}
        {status !== "reddedildi" && (
          <button
            onClick={() => setStatus("reddedildi")}
            disabled={busy}
            className="text-xs border border-brick text-brick rounded-md px-3 py-1.5 disabled:opacity-50"
          >
            Rədd et
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
            {isPremium ? "Premium-u ləğv et" : "Premium ver"}
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={busy}
          className="text-xs text-ink-soft hover:text-brick disabled:opacity-50"
        >
          Sil
        </button>
      </div>
    </div>
  );
}