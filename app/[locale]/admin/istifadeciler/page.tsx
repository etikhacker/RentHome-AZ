import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { UserRoleRow } from "@/components/admin/user-role-row";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminIstifadecilerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("admin.users");
  const supabase = createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, phone, role, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium mb-6">{t("title")}</h1>

      <div className="bg-paper border border-line rounded-2xl p-5 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="pb-2 text-xs text-ink-soft font-medium">{t("name")}</th>
              <th className="pb-2 text-xs text-ink-soft font-medium">{t("phone")}</th>
              <th className="pb-2 text-xs text-ink-soft font-medium">{t("registered")}</th>
              <th className="pb-2 text-xs text-ink-soft font-medium">{t("role")}</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <UserRoleRow
                key={u.id}
                id={u.id}
                fullName={u.full_name}
                phone={u.phone}
                role={u.role}
                createdAt={u.created_at}
              />
            ))}
          </tbody>
        </table>

        {(!users || users.length === 0) && (
          <p className="text-sm text-ink-soft py-4">{t("empty")}</p>
        )}
      </div>
    </div>
  );
}
