import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/site-header";
import { MessagesClient } from "@/components/messages/messages-client";

type Props = { params: Promise<{ locale: string }> };

export default async function MesajlarPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("messages");
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect({ href: { pathname: "/giris", query: { next: "/mesajlar" } }, locale });

  const { data: messages } = await supabase
    .from("messages")
    .select("id, property_id, sender_id, receiver_id, content, is_read, created_at")
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order("created_at", { ascending: true });

  const propertyIds = Array.from(new Set((messages ?? []).map((m) => m.property_id)));
  const otherUserIds = Array.from(
    new Set(
      (messages ?? []).map((m) => (m.sender_id === user.id ? m.receiver_id : m.sender_id))
    )
  );

  const propertyTitles: Record<string, string> = {};
  if (propertyIds.length > 0) {
    const { data: props } = await supabase
      .from("properties")
      .select("id, title")
      .in("id", propertyIds);
    props?.forEach((p) => (propertyTitles[p.id] = p.title));
  }

  const profileNames: Record<string, string> = {};
  if (otherUserIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", otherUserIds);
    profiles?.forEach((p) => (profileNames[p.id] = p.full_name ?? t("defaultUser")));
  }

  return (
    <>
      <SiteHeader />
      <div className="max-w-[1120px] mx-auto px-4 sm:px-7 py-6 sm:py-10">
        <h1 className="font-display text-xl sm:text-2xl font-medium mb-5 sm:mb-6">{t("title")}</h1>
        <MessagesClient
          currentUserId={user.id}
          initialMessages={messages ?? []}
          propertyTitles={propertyTitles}
          profileNames={profileNames}
        />
      </div>
    </>
  );
}
