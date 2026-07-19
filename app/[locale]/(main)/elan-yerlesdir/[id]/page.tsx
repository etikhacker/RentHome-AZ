import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/site-header";
import { EditListingForm } from "@/components/property/edit-listing-form";

export default async function DuzenlemeSayfasi({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/giris?next=/elan-yerlesdir/${params.id}`);

  const { data: property } = await supabase
    .from("properties")
    .select("*, property_images ( id, url, sort_order, media_type )")
    .eq("id", params.id)
    .single();

  if (!property) notFound();
  if (property.owner_id !== user.id) {
    return (
      <>
        <SiteHeader />
        <div className="max-w-[600px] mx-auto px-4 sm:px-7 py-12 sm:py-16 text-center">
          <h1 className="font-display text-xl sm:text-2xl font-medium mb-3">Bu sənin elanın deyil</h1>
          <p className="text-sm text-ink-soft">Yalnız öz elanlarını redaktə edə bilərsən.</p>
        </div>
      </>
    );
  }

  const { data: cities } = await supabase.from("cities").select("id, name").order("name");
  const { data: districts } = property.city_id
    ? await supabase
        .from("districts")
        .select("id, name")
        .eq("city_id", property.city_id)
        .order("name")
    : { data: [] };

  return (
    <>
      <SiteHeader />
      <div className="max-w-[720px] mx-auto px-4 sm:px-7 py-7 sm:py-10">
        <h1 className="font-display text-xl sm:text-2xl font-medium mb-1">Elanı redaktə et</h1>
        <p className="text-sm text-ink-soft mb-6 sm:mb-7">
          Dəyişiklik etdikdən sonra elan yenidən admin təsdiqini gözləməyəcək.
        </p>
        <EditListingForm
          property={property}
          existingImages={(property.property_images ?? []).sort(
            (a: any, b: any) => a.sort_order - b.sort_order
          )}
          cities={cities ?? []}
          initialDistricts={districts ?? []}
        />
      </div>
    </>
  );
}