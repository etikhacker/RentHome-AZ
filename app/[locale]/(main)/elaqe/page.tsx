import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/layout/site-header";
import { ContactForm } from "@/components/contact/contact-form";

type Props = { params: Promise<{ locale: string }> };

export default async function ElaqePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");

  return (
    <>
      <SiteHeader />
      <div className="max-w-[600px] mx-auto px-7 py-14">
        <h1 className="font-display text-2xl font-medium mb-2">{t("title")}</h1>
        <p className="text-sm text-ink-soft mb-8">
          {t("subtitle")}
        </p>
        <ContactForm />
      </div>
    </>
  );
}
