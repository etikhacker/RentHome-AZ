import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ListingReviewRow } from "@/components/admin/listing-review-row";

const tabs = [
  { key: "gozleyir", label: "Gözləyir" },
  { key: "tesdiqlendi", label: "Təsdiqləndi" },
  { key: "reddedildi", label: "Rədd edildi" },
  { key: "hamisi", label: "Hamısı" },
];

export default async function AdminElanlarPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const supabase = createClient();
  const activeTab = searchParams.status ?? "gozleyir";

  let query = supabase
    .from("properties")
    .select("id, title, price, status, is_premium, profiles ( full_name )")
    .order("created_at", { ascending: false });

  if (activeTab !== "hamisi") {
    query = query.eq("status", activeTab);
  }

  const { data: properties } = await query;

  return (
    <div>
      <h1 className="font-display text-2xl font-medium mb-5">Elanların idarə edilməsi</h1>

      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={`/admin/elanlar?status=${tab.key}`}
            className={`text-sm px-3.5 py-1.5 rounded-full border ${
              activeTab === tab.key
                ? "bg-teal text-white border-teal"
                : "border-line text-ink-soft"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="space-y-2.5">
        {properties?.map((p: any) => (
          <ListingReviewRow
            key={p.id}
            id={p.id}
            title={p.title}
            price={p.price}
            status={p.status}
            isPremium={p.is_premium}
            ownerName={p.profiles?.full_name ?? null}
          />
        ))}

        {(!properties || properties.length === 0) && (
          <p className="text-sm text-ink-soft">Bu kateqoriyada elan yoxdur.</p>
        )}
      </div>
    </div>
  );
}