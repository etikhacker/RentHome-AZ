import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = createClient();

  const { data } = await supabase.rpc("admin_dashboard_stats").single();

  const stats = data as {
    total_users: number;
    total_properties: number;
    new_properties_today: number;
    active_properties: number;
  } | null;

  const cards = [
    { label: "İstifadəçi sayı", value: stats?.total_users ?? 0 },
    { label: "Elan sayı (ümumi)", value: stats?.total_properties ?? 0 },
    { label: "Bugünkü yeni elanlar", value: stats?.new_properties_today ?? 0 },
    { label: "Aktiv (təsdiqlənmiş) elanlar", value: stats?.active_properties ?? 0 },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-medium mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-paper border border-line rounded-2xl p-5">
            <div className="font-mono text-3xl font-medium text-teal-deep">{c.value}</div>
            <div className="text-sm text-ink-soft mt-1">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}