"use client";

import { useRouter } from "@/i18n/routing";
import { usePathname } from "@/i18n/routing";
import { type Locale } from "@/lib/i18n/dictionary";

const labels: Record<Locale, string> = { az: "AZ", en: "EN", ru: "RU" };

export function LanguageSwitcher({ current }: { current: Locale }) {
  const router = useRouter();
  const pathname = usePathname();

  function setLocale(locale: Locale) {
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    // next-intl router pathname-i locale prefiksi olmadan qəbul edir
    // və özü uyğun prefix ilə yönləndirir.
    router.replace(pathname, { locale });
    router.refresh();
  }

  return (
    <div className="grid grid-cols-3 overflow-hidden border border-line rounded text-[13px] sm:flex sm:items-center">
      {(Object.keys(labels) as Locale[]).map((locale) => (
        <button
          key={locale}
          onClick={() => setLocale(locale)}
          className={`w-full px-2 py-1 text-center ${
            current === locale ? "bg-teal text-white" : "text-ink-soft hover:bg-white"
          }`}
        >
          {labels[locale]}
        </button>
      ))}
    </div>
  );
}
