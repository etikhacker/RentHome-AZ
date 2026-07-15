// Qeyd: Əvvəl middleware hər request üçün Supabase `auth.getUser()` çağırırdı
// ki, bu da Vercel Edge Function-ı Supabase region şəbəkəsinə bağlayırdı
// (~500-800ms TTFB). Həmin hissə silinib; Supabase auth yoxlaması yalnız
// auth tələb edən server komponentlərdə çağırılır.
//
// Amma next-intl-in öz marşrutlama middleware-i (aşağıda) SAXLANMALIDIR —
// bu, şəbəkə çağırışı ETMİR (yalnız request path-ini yoxlayıb locale prefiksi
// əlavə edir), sürətə təsiri yoxdur. Bunsuz /elanlar kimi linklər 404/not-found-a
// düşür, çünki bütün səhifələr app/[locale]/... altındadır.
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Yalnız app route-ları üçün işləsin — _next, api, statik fayllar
  // və Supabase storage istisna olunsun ki, edge function mümkün qədər
  // az çağırılsın.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};