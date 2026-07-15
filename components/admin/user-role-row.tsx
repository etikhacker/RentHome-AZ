"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
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
  const tRoles = useTranslations("roles");
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
        {new Date(createdAt).toLocaleDateString()}
      </td>
      <td className="py-3">
        <select
          defaultValue={role}
          disabled={saving}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="border border-line rounded-md px-2 py-1.5 text-sm bg-white"
        >
          <option value="icarechi">{tRoles("icarechi")}</option>
          <option value="admin">{tRoles("admin")}</option>
        </select>
      </td>
    </tr>
  );
}
