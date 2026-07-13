import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/site-header";
import { ListingForm } from "@/components/property/listing-form";

export default async function ElanYerlesdirPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris?next=/elan-yerlesdir");
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
        <div className="max-w-[600px] mx-auto px-7 py-16 text-center">
          <h1 className="font-display text-2xl font-medium mb-3">
            Bu bölmə yalnız ev sahibləri üçündür
          </h1>
          <p className="text-sm text-ink-soft">
            Elan yerləşdirmək üçün hesabını "Ev sahibi" tipinə keçirməlisən.
            Profil səhifəndən bunu dəyişə bilərsən.
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
      <div className="max-w-[720px] mx-auto px-7 py-10">
        <h1 className="font-display text-2xl font-medium mb-1">Yeni elan yerləşdir</h1>
        <p className="text-sm text-ink-soft mb-7">
          Elanın admin təsdiqindən sonra saytda görünəcək.
        </p>
        <ListingForm cities={cities ?? []} ownerId={user.id} />
      </div>
    </>
  );
}