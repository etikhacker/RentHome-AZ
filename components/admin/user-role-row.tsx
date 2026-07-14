"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function UserRoleRow({
  id,
  fullName,
  phone,
  role,
  createdAt,
}: {
  id: string;
  fullName: string | null;
  phone: string | null;
  role: string;
  createdAt: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleRoleChange(newRole: string) {
    setSaving(true);
    await supabase.from("profiles").update({ role: newRole }).eq("id", id);
    setSaving(false);
    router.refresh();
  }

  return (
    <tr className="border-b border-line">
      <td className="py-3 text-sm">{fullName ?? "—"}</td>
      <td className="py-3 text-sm text-ink-soft">{phone ?? "—"}</td>
      <td className="py-3 text-sm text-ink-soft">
        {new Date(createdAt).toLocaleDateString("az-AZ")}
      </td>
      <td className="py-3">
        <select
          defaultValue={role}
          disabled={saving}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="border border-line rounded-md px-2 py-1.5 text-sm bg-white"
        >
          <option value="icarechi">İcarəçi</option>
          <option value="ev_sahibi">Ev sahibi</option>
          <option value="admin">Admin</option>
        </select>
      </td>
    </tr>
  );
}