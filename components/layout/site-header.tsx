import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { AuthMenu } from "@/components/layout/auth-menu";
import { type Locale } from "@/lib/i18n/dictionary";

// Server komponent kimi qalır, lakin artıq Supabase-ə
// auth.getUser/profiles/notifications sorğuları göndərmir. Bu hissələr
// indi "use client" AuthMenu-ya köçürülüb ki, hər SSR-də Supabase-ə
// network round-trip getməsin.
//
// Qeyd: locale burda next-intl-in öz getLocale()-i ilə (next-intl/server)
// alınır — bu, URL-dəki /[locale]/ seqmentindən oxunur və HƏMİŞƏ doğrudur.
// Əvvəlki versiya lib/i18n/get-locale.ts-dəki cookie-based getLocale()-dən
// istifadə edirdi ki, bu da URL ilə uyğun olmaya bilərdi (məs. cookie "az"
// qalıb, amma səhifə /en/... altındadırsa, header səhv dildə görünürdü).
export async function SiteHeader() {
  const t = await getTranslations("nav");
  const locale = (await getLocale()) as Locale;

  return (
    <header className="border-b border-line py-5">
      <div className="max-w-[1120px] mx-auto px-7 flex items-center justify-between">
        <Link href="/" className="font-display text-[22px] font-semibold tracking-tight">
          Rent<span className="text-brick">Home</span> AZ
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-ink-soft">
          <Link href="/elanlar" className="hover:text-ink">{t("search")}</Link>
          <Link href="/elan-yerlesdir" className="hover:text-ink">{t("postListing")}</Link>
          <Link href="/haqqimizda" className="hover:text-ink">{t("howItWorks")}</Link>
          <Link href="/elaqe" className="hover:text-ink">{t("contact")}</Link>
        </nav>

        <div className="flex items-center gap-3.5">
          <LanguageSwitcher current={locale} />
          <AuthMenu />
        </div>
      </div>
    </header>
  );
}
