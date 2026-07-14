"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function QeydiyyatPage() {
  const supabase = createClient();
  const router = useRouter();

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
    const { data, error } = await supabase.auth.signUp({
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

    // "Confirm email" ayarı söndürülübsə, Supabase dərhal sessiya yaradır -
    // bu halda "email-ini yoxla" göstərmək əvəzinə birbaşa daxil ol
    if (data.session) {
      router.push("/");
      router.refresh();
      return;
    }

    setDone(true);
  }

  async function handleGoogleSignup() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
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

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-line" />
          <span className="text-xs text-ink-soft">və ya</span>
          <div className="flex-1 h-px bg-line" />
        </div>

        <button
          onClick={handleGoogleSignup}
          className="w-full border border-line rounded-lg py-2.5 text-sm font-medium hover:bg-white flex items-center justify-center gap-2.5"
        >
          <GoogleIcon />
          Google ilə qeydiyyat
        </button>

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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.09-1.8 2.73v2.27h2.9c1.7-1.57 2.68-3.87 2.68-6.64z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.25c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33C2.47 15.98 5.48 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.71c-.18-.54-.28-1.11-.28-1.71s.1-1.17.28-1.71V4.96H.98A8.98 8.98 0 0 0 0 9c0 1.45.35 2.83.98 4.04l2.97-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.47 2.02.98 4.96l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  );
}