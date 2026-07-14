import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["az", "en", "ru"],
  defaultLocale: "az",
  // Hər dil URL-də prefix olaraq görünür: /az/, /en/, /ru/
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
