import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, redirect } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/site-header";
import { ProfileForm } from "@/components/profile/profile-form";
import { MyListingRow } from "@/components/property/my-listing-row";

type Props = { params: Promise<{ locale: string }> };

export default async function ProfilPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("profile");
  const tRoles = await getTranslations("roles");
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect({ href: "/giris", locale, query: { next: "/profil" } });

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, avatar_url, role")
    .eq("id", user.id)
    .single();

  const isOwner = profile?.role === "ev_sahibi" || profile?.role === "admin";

  const { data: myListings } = isOwner
    ? await supabase
        .from("properties")
        .select("id, title, price, status")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  const { count: favoriteCount } = await supabase
    .from("favorites")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: unreadCount } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("receiver_id", user.id)
    .eq("is_read", false);

  return (
    <>
      <SiteHeader />
      <div className="max-w-[900px] mx-auto px-7 py-10">
        <h1 className="font-display text-2xl font-medium mb-6">{t("title")}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <ProfileForm
              userId={user.id}
              email={user.email ?? ""}
              initialFullName={profile?.full_name ?? null}
              initialPhone={profile?.phone ?? null}
              initialAvatarUrl={profile?.avatar_url ?? null}
            />

            {isOwner && (
              <div className="bg-paper border border-line rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg font-medium">{t("myListings")}</h2>
                  <Link
                    href="/elan-yerlesdir"
                    className="text-sm text-teal-deep border-b border-teal-deep"
                  >
                    {t("newListing")}
                  </Link>
                </div>

                {!myListings || myListings.length === 0 ? (
                  <p className="text-sm text-ink-soft">{t("noListings")}</p>
                ) : (
                  <div className="space-y-2.5">
                    {myListings.map((p) => (
                      <MyListingRow
                        key={p.id}
                        id={p.id}
                        title={p.title}
                        price={p.price}
                        status={p.status}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Link
              href="/favorilerim"
              className="block bg-paper border border-line rounded-2xl p-5 hover:border-teal"
            >
              <div className="text-2xl font-mono font-medium">{favoriteCount ?? 0}</div>
              <div className="text-sm text-ink-soft">{t("favoriteCount")}</div>
            </Link>

            <Link
              href="/mesajlar"
              className="block bg-paper border border-line rounded-2xl p-5 hover:border-teal"
            >
              <div className="text-2xl font-mono font-medium">{unreadCount ?? 0}</div>
              <div className="text-sm text-ink-soft">{t("unreadMessages")}</div>
            </Link>

            <div className="bg-paper border border-line rounded-2xl p-5">
              <div className="text-sm text-ink-soft mb-1">{t("accountType")}</div>
              <div className="text-sm font-medium">
                {profile?.role ? tRoles(profile.role as "admin" | "ev_sahibi" | "icarechi") : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
