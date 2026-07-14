import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "./globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });

  const titles: Record<string, string> = {
    az: "RentHome AZ — Kirayə elanları",
    en: "RentHome AZ — Rental listings",
    ru: "RentHome AZ — Объявления об аренде",
  };
  const descriptions: Record<string, string> = {
    az: "Azərbaycanda icarə elanları platforması",
    en: "Rental listings platform in Azerbaijan",
    ru: "Платформа объявлений об аренде в Азербайджане",
  };

  return {
    title: titles[locale] ?? titles.az,
    description: descriptions[locale] ?? descriptions.az,
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enables static rendering
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
