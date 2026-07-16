import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/site-header";
import { ListingForm } from "@/components/property/listing-form";

type Props = { params: Promise<{ locale: string }> };

export default async function ElanYerlesdirPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("createListing");
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
  return redirect({
    href: { pathname: "/giris", query: { next: "/elan-yerlesdir" } },
    locale,
  });
}

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "ev_sahibi" && profile?.role !== "admin") {
    return (
      <>
        <SiteHeader />
        <div className="max-w-[600px] mx-auto px-4 sm:px-7 py-12 sm:py-16 text-center">
          <h1 className="font-display text-xl sm:text-2xl font-medium mb-3">
            {t("notOwnerTitle")}
          </h1>
          <p className="text-sm text-ink-soft">
            {t("notOwnerText")}
          </p>
        </div>
      </>
    );
  }

  const { data: cities } = await supabase
    .from("cities")
    .select("id, name")
    .order("name");

  return (
    <>
      <SiteHeader />
      <div className="max-w-[720px] mx-auto px-4 sm:px-7 py-7 sm:py-10">
        <h1 className="font-display text-xl sm:text-2xl font-medium mb-1">{t("title")}</h1>
        <p className="text-sm text-ink-soft mb-6 sm:mb-7">
          {t("subtitle")}
        </p>
        <ListingForm cities={cities ?? []} ownerId={user.id} />
      </div>
    </>
  );
}
