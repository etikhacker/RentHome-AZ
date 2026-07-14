"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ProfileForm({
  userId,
  email,
  initialFullName,
  initialPhone,
  initialAvatarUrl,
}: {
  userId: string;
  email: string;
  initialFullName: string | null;
  initialPhone: string | null;
  initialAvatarUrl: string | null;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [fullName, setFullName] = useState(initialFullName ?? "");
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const path = `avatars/${userId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("property-images").upload(path, file);

    if (!error) {
      const { data } = supabase.storage.from("property-images").getPublicUrl(path);
      setAvatarUrl(data.publicUrl);
    }
    setUploading(false);
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone, avatar_url: avatarUrl || null })
      .eq("id", userId);

    setSaving(false);
    setMessage(error ? "Yadda saxlanılmadı, yenidən cəhd et." : "Yadda saxlanıldı.");
    router.refresh();
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="bg-paper border border-line rounded-2xl p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#cfd9c9] to-[#b9c4b3] overflow-hidden flex items-center justify-center text-xs text-ink-soft">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            "şəkil"
          )}
        </div>
        <label className="text-sm text-teal-deep cursor-pointer">
          {uploading ? "Yüklənir..." : "Şəkli dəyiş"}
          <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
        </label>
      </div>

      <div className="space-y-3.5 mb-5">
        <div>
          <label className="block text-xs text-ink-soft mb-1.5 font-medium">Ad Soyad</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-ink-soft mb-1.5 font-medium">Telefon</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm"
            placeholder="+994 50 123 45 67"
          />
        </div>
        <div>
          <label className="block text-xs text-ink-soft mb-1.5 font-medium">Email</label>
          <input
            value={email}
            disabled
            className="w-full border border-line bg-bg text-ink-soft rounded-lg px-3 py-2.5 text-sm"
          />
        </div>
      </div>

      {message && <p className="text-sm text-teal-deep mb-3">{message}</p>}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-teal hover:bg-teal-deep text-white rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-60"
        >
          {saving ? "Saxlanılır..." : "Yadda saxla"}
        </button>
        <button
          onClick={handleSignOut}
          className="text-sm text-brick border-b border-brick"
        >
          Çıxış et
        </button>
      </div>
    </div>
  );
}