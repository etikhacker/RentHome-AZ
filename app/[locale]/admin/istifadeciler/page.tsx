import { createClient } from "@/lib/supabase/server";
import { UserRoleRow } from "@/components/admin/user-role-row";

export default async function AdminIstifadecilerPage() {
  const supabase = createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, phone, role, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium mb-6">İstifadəçilər</h1>

      <div className="bg-paper border border-line rounded-2xl p-5 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="pb-2 text-xs text-ink-soft font-medium">Ad</th>
              <th className="pb-2 text-xs text-ink-soft font-medium">Telefon</th>
              <th className="pb-2 text-xs text-ink-soft font-medium">Qeydiyyat</th>
              <th className="pb-2 text-xs text-ink-soft font-medium">Rol</th>
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
          <p className="text-sm text-ink-soft py-4">Hələ istifadəçi yoxdur.</p>
        )}
      </div>
    </div>
  );
}