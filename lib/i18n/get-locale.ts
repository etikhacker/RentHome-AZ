import { cookies } from "next/headers";
import { type Locale, locales } from "./dictionary";

export function getLocale(): Locale {
  const value = cookies().get("locale")?.value;
  return locales.includes(value as Locale) ? (value as Locale) : "az";
}