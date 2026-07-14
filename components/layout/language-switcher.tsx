"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleChange(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale as (typeof routing.locales)[number] });
    });
  }

  return (
    <div className="relative flex items-center gap-1.5 text-[13px] text-ink-soft border border-line px-2.5 py-1 rounded">
      <Languages size={14} />
      <select
        value={locale}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-transparent text-ink-soft focus:outline-none cursor-pointer pr-1"
        aria-label={t("switch")}
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} className="text-ink">
            {l.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
