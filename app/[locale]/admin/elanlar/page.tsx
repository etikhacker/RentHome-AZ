import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { ListingReviewRow } from "@/components/admin/listing-review-row";

type Props = {
  searchParams: { status?: string };
  params: Promise<{ locale: string }>;
};

export default async function AdminElanlarPage({ searchParams, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("admin.listings");
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

  const tabs = [
    { key: "gozleyir", label: t("tabGozleyir") },
    { key: "tesdiqlendi", label: t("tabTesdiqlendi") },
    { key: "reddedildi", label: t("tabReddedildi") },
    { key: "hamisi", label: t("tabHamisi") },
  ];

  return (
    <div>
      <h1 className="font-display text-xl sm:text-2xl font-medium mb-4 sm:mb-5">{t("title")}</h1>

      <div className="flex gap-2 mb-5 sm:mb-6 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-1">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={`/admin/elanlar?status=${tab.key}`}
            className={`text-sm px-3.5 py-1.5 rounded-full border whitespace-nowrap shrink-0 ${
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
          <p className="text-sm text-ink-soft">{t("empty")}</p>
        )}
      </div>
    </div>
  );
}
