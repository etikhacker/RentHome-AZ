"use client";

import { Suspense, useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

export default function GirisPage() {
  return (
    <Suspense fallback={null}>
      <GirisForm />
    </Suspense>
  );
}

function GirisForm() {
  const t = useTranslations("auth.login");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
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
          ? t("errorInvalid")
          : t("errorGeneric")
      );
      setLoading(false);
      return;
    }

    const next = searchParams.get("next") || "/";
    router.push(next);
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
        <h1 className="font-display text-2xl font-medium mb-1">{t("title")}</h1>
        <p className="text-sm text-ink-soft mb-6">{t("subtitle")}</p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs text-ink-soft mb-1.5 font-medium">{t("email")}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm"
              placeholder={t("emailPlaceholder")}
            />
          </div>

          <div>
            <label className="block text-xs text-ink-soft mb-1.5 font-medium">{t("password")}</label>
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
            {loading ? t("submitting") : t("submit")}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-line" />
          <span className="text-xs text-ink-soft">{tCommon("or")}</span>
          <div className="flex-1 h-px bg-line" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border border-line rounded-lg py-2.5 text-sm font-medium hover:bg-white flex items-center justify-center gap-2.5"
        >
          <GoogleIcon />
          {t("google")}
        </button>

        <p className="text-sm text-ink-soft text-center mt-6">
          {t("noAccount")}{" "}
          <Link href="/qeydiyyat" className="text-teal-deep font-medium">
            {t("registerLink")}
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
