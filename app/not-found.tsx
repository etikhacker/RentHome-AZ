import { redirect } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

export default function NotFound() {
  // Locale olmayan URL-lər üçün default locale-ə yönləndir
  redirect({ href: "/", locale: routing.defaultLocale });
}
