import Link from "next/link";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { AuthMenu } from "@/components/layout/auth-menu";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionary";

// Server komponent kimi qalır, lakin artıq Supabase-ə
// auth.getUser/profiles/notifications sorğuları göndərmir. Bu hissələr
// indi "use client" AuthMenu-ya köçürülüb ki, hər SSR-də Supabase-ə
// network round-trip getməsin.
export async function SiteHeader() {
  const locale = getLocale();
  const t = getDictionary(locale).nav;

  return (
    <header className="border-b border-line py-5">
      <div className="max-w-[1120px] mx-auto px-7 flex items-center justify-between">
        <Link href="/" className="font-display text-[22px] font-semibold tracking-tight">
          Rent<span className="text-brick">Home</span> AZ
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-ink-soft">
          <Link href="/elanlar" className="hover:text-ink">{t.search}</Link>
          <Link href="/elan-yerlesdir" className="hover:text-ink">{t.post}</Link>
          <Link href="/haqqimizda" className="hover:text-ink">{t.how}</Link>
          <Link href="/elaqe" className="hover:text-ink">{t.contact}</Link>
        </nav>

        <div className="flex items-center gap-3.5">
          <LanguageSwitcher current={locale} />
          <AuthMenu />
        </div>
      </div>
    </header>
  );
}
