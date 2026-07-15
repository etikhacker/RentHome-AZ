"use client";

import { useRouter } from "next/navigation";
import { type Locale } from "@/lib/i18n/dictionary";

const labels: Record<Locale, string> = { az: "AZ", en: "EN", ru: "RU" };

export function LanguageSwitcher({ current }: { current: Locale }) {
  const router = useRouter();

  function setLocale(locale: Locale) {
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }

  return (
    <div className="flex items-center border border-line rounded overflow-hidden text-[13px]">
      {(Object.keys(labels) as Locale[]).map((locale) => (
        <button
          key={locale}
          onClick={() => setLocale(locale)}
          className={`px-2 py-1 ${
            current === locale ? "bg-teal text-white" : "text-ink-soft hover:bg-white"
          }`}
        >
          {labels[locale]}
        </button>
      ))}
    </div>
  );
}