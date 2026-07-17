import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/site-header";
import { ContactForm } from "@/components/contact/contact-form";

type Props = { params: Promise<{ locale: string }> };

export default async function ElaqePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <>
        <SiteHeader />
        <div className="max-w-[600px] mx-auto px-4 sm:px-7 py-12 sm:py-16 text-center">
          <h1 className="font-display text-xl sm:text-2xl font-medium mb-3">
            {t("loginRequiredTitle")}
          </h1>
          <p className="text-sm text-ink-soft mb-6">{t("loginRequiredText")}</p>
          <a
            href={`/${locale}/giris?next=/elaqe`}
            className="inline-block bg-teal hover:bg-teal-deep text-white rounded-lg px-6 py-2.5 text-sm font-medium"
          >
            {t("loginCta")}
          </a>
        </div>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <div className="max-w-[600px] mx-auto px-4 sm:px-7 py-10 sm:py-14">
        <h1 className="font-display text-xl sm:text-2xl font-medium mb-2">{t("title")}</h1>
        <p className="text-sm text-ink-soft mb-7 sm:mb-8">
          {t("subtitle")}
        </p>
        <ContactForm />
      </div>
    </>
  );
}