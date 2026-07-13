"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function GirisPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Email və ya şifrə yanlışdır."
          : "Giriş zamanı xəta baş verdi. Yenidən cəhd et."
      );
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm bg-paper border border-line rounded-2xl p-7">
        <h1 className="font-display text-2xl font-medium mb-1">Giriş</h1>
        <p className="text-sm text-ink-soft mb-6">Hesabına daxil ol.</p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
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
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-brick bg-brick/10 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal hover:bg-teal-deep text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Giriş edilir..." : "Giriş et"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-line" />
          <span className="text-xs text-ink-soft">və ya</span>
          <div className="flex-1 h-px bg-line" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border border-line rounded-lg py-2.5 text-sm font-medium hover:bg-white"
        >
          Google ilə giriş
        </button>

        <p className="text-sm text-ink-soft text-center mt-6">
          Hesabın yoxdur?{" "}
          <Link href="/qeydiyyat" className="text-teal-deep font-medium">
            Qeydiyyatdan keç
          </Link>
        </p>
      </div>
    </div>
  );
}
