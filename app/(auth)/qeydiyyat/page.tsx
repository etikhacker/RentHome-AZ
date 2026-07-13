"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function QeydiyyatPage() {
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"icarechi" | "ev_sahibi">("icarechi");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Şifrə ən azı 6 simvol olmalıdır.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setError(
        error.message === "User already registered"
          ? "Bu email artıq qeydiyyatdan keçib."
          : "Qeydiyyat zamanı xəta baş verdi. Yenidən cəhd et."
      );
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-6">
        <div className="w-full max-w-sm bg-paper border border-line rounded-2xl p-7 text-center">
          <h1 className="font-display text-2xl font-medium mb-2">Email-ini yoxla</h1>
          <p className="text-sm text-ink-soft">
            {email} ünvanına təsdiq linki göndərdik. Hesabını aktivləşdirmək
            üçün ona daxil ol.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm bg-paper border border-line rounded-2xl p-7">
        <h1 className="font-display text-2xl font-medium mb-1">Qeydiyyat</h1>
        <p className="text-sm text-ink-soft mb-6">Yeni hesab yarat.</p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs text-ink-soft mb-1.5 font-medium">Ad Soyad</label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm"
              placeholder="Ömər Babayev"
            />
          </div>

          <div>
            <label className="block text-xs text-ink-soft mb-1.5 font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm"
              placeholder="sen@nümunə.az"
            />
          </div>

          <div>
            <label className="block text-xs text-ink-soft mb-1.5 font-medium">Şifrə</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm"
              placeholder="ən azı 6 simvol"
            />
          </div>

          <div>
            <label className="block text-xs text-ink-soft mb-1.5 font-medium">
              Hesab tipi
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("icarechi")}
                className={`rounded-lg py-2.5 text-sm font-medium border ${
                  role === "icarechi"
                    ? "border-teal bg-teal/10 text-teal-deep"
                    : "border-line text-ink-soft"
                }`}
              >
                İcarəçi
              </button>
              <button
                type="button"
                onClick={() => setRole("ev_sahibi")}
                className={`rounded-lg py-2.5 text-sm font-medium border ${
                  role === "ev_sahibi"
                    ? "border-teal bg-teal/10 text-teal-deep"
                    : "border-line text-ink-soft"
                }`}
              >
                Ev sahibi
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-brick bg-brick/10 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal hover:bg-teal-deep text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Göndərilir..." : "Qeydiyyatdan keç"}
          </button>
        </form>

        <p className="text-sm text-ink-soft text-center mt-6">
          Artıq hesabın var?{" "}
          <Link href="/giris" className="text-teal-deep font-medium">
            Giriş et
          </Link>
        </p>
      </div>
    </div>
  );
}
