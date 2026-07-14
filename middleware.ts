import createMiddleware from "next-intl/middleware";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1) i18n routing əvvəl işləyir (locale prefix yoxdursa yönləndirir)
  const intlResponse = intlMiddleware(request);

  // Əgər intlMiddleware yeni cavab yaratmayıbsa, sadə NextResponse qaytar
  // (məsələn, static assetlər üçün)
  const response = intlResponse ?? NextResponse.next({ request });

  // 2) Supabase auth session refresh
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[]
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // response artıq intl middleware-dən gəlir; onun cookie-lərini qoru
          cookiesToSet.forEach(({ name, value, options }) => {
            if ("cookies" in response && typeof response.cookies.set === "function") {
              response.cookies.set(name, value, options);
            }
          });
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Bütün path-ləri əhatə et, amma static faylları və auth callback-i çıxar
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
