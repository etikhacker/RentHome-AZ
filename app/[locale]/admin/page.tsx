import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminDashboard({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("admin.dashboard");
  const supabase = createClient();

  const { data } = await supabase.rpc("admin_dashboard_stats").single();

  const stats = data as {
    total_users: number;
    total_properties: number;
    new_properties_today: number;
    active_properties: number;
  } | null;

  const cards = [
    { label: t("totalUsers"), value: stats?.total_users ?? 0 },
    { label: t("totalProperties"), value: stats?.total_properties ?? 0 },
    { label: t("newPropertiesToday"), value: stats?.new_properties_today ?? 0 },
    { label: t("activeProperties"), value: stats?.active_properties ?? 0 },
  ];

  return (
    <div>
      <h1 className="font-display text-xl sm:text-2xl font-medium mb-5 sm:mb-6">{t("title")}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-paper border border-line rounded-2xl p-4 sm:p-5">
            <div className="font-mono text-2xl sm:text-3xl font-medium text-teal-deep">{c.value}</div>
            <div className="text-xs sm:text-sm text-ink-soft mt-1 leading-tight">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
