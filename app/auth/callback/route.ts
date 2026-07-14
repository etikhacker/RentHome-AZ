import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";

const LOCALE_COOKIE = "NEXT_LOCALE";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/";

  // İstifadəçinin son seçdiyi dilə geri qaytar
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale =
    savedLocale && (routing.locales as readonly string[]).includes(savedLocale)
      ? savedLocale
      : routing.defaultLocale;

  // `next` parametri artıq locale prefix daşıyırsa olduğu kimi istifadə et
  const next = nextParam.startsWith(`/${locale}/`) || nextParam === `/${locale}`
    ? nextParam
    : nextParam === "/"
    ? `/${locale}`
    : `/${locale}${nextParam.startsWith("/") ? "" : "/"}${nextParam}`;

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/${locale}/giris?error=auth-failed`);
}
