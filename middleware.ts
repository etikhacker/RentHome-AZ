// Qeyd: Əvvəl middleware hər request üçün Supabase `auth.getUser()` çağırırdı
// ki, bu da Vercel Edge Function-ı Supabase region şəbəkəsinə bağlayırdı
// (~500-800ms TTFB). İndi Supabase auth yoxlaması yalnız auth tələb edən
// server komponentlərdə çağırılır; middleware yalnız locale redirect edir
// (next-intl avtomatik).
import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.next({ request });
}

export const config = {
  // Yalnız app route-ları üçün işləsin — _next, api, statik fayllar
  // və Supabase storage istisna olunsun ki, edge function mümkün qədər
  // az çağırılsın.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};