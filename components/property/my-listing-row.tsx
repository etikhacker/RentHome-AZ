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
  const supabase = createClient();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Bu elanı silmək istədiyinə əminsən?")) return;
    setDeleting(true);
    await supabase.from("properties").delete().eq("id", id);
    router.refresh();
  }

  const badge = statusLabels[status] ?? { text: status, className: "bg-line text-ink-soft" };

  return (
    <div className="flex items-center justify-between border border-line rounded-lg px-4 py-3">
      <div>
        <Link href={`/elan/${id}`} className="text-sm font-medium hover:underline">
          {title}
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono text-xs text-ink-soft">{price} ₼/ay</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full ${badge.className}`}>
            {badge.text}
          </span>
        </div>
      </div>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-xs text-brick border-b border-brick disabled:opacity-50"
      >
        {deleting ? "Silinir..." : "Sil"}
      </button>
    </div>
  );
}