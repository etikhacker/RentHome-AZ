import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, redirect } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/site-header";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("admin");
  const tUsers = await getTranslations("admin.users");
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect({ href: { pathname: "/giris", query: { next: "/admin" } }, locale });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return (
      <>
        <SiteHeader />
        <div className="max-w-[600px] mx-auto px-4 sm:px-7 py-12 sm:py-16 text-center">
          <h1 className="font-display text-xl sm:text-2xl font-medium mb-3">{tUsers("deniedTitle")}</h1>
          <p className="text-sm text-ink-soft">{tUsers("deniedText")}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <div className="max-w-[1120px] mx-auto px-4 sm:px-7 py-6 sm:py-8">
        <nav className="flex flex-wrap gap-3 sm:gap-6 border-b border-line mb-6 sm:mb-7 text-sm">
          <Link href="/admin" className="pb-3 border-b-2 border-transparent hover:border-teal whitespace-nowrap">
            {t("nav.dashboard")}
          </Link>
          <Link href="/admin/elanlar" className="pb-3 border-b-2 border-transparent hover:border-teal whitespace-nowrap">
            {t("nav.listings")}
          </Link>
          <Link href="/admin/istifadeciler" className="pb-3 border-b-2 border-transparent hover:border-teal whitespace-nowrap">
            {t("nav.users")}
          </Link>
          <Link href="/admin/elaqe" className="pb-3 border-b-2 border-transparent hover:border-teal whitespace-nowrap">
            {t("nav.contact")}
          </Link>
          <Link href="/elan-yerlesdir" className="pb-3 border-b-2 border-transparent hover:border-teal whitespace-nowrap sm:ml-auto text-teal-deep">
            + {t("nav.newListing")}
          </Link>
        </nav>
        {children}
      </div>
    </>
  );
}
