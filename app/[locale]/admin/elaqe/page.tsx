import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ContactMessageRow } from "@/components/admin/contact-message-row";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminElaqePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("admin.contact");
  const supabase = createClient();

  const { data: messages } = await supabase
    .from("contact_messages")
    .select("id, name, email, phone, message, is_read, created_at")
    .order("created_at", { ascending: false });

  const unreadCount = messages?.filter((m) => !m.is_read).length ?? 0;

  return (
    <div>
      <h1 className="font-display text-xl sm:text-2xl font-medium mb-5 sm:mb-6">
        {t("title")}
        {unreadCount > 0 && (
          <span className="ml-2 align-middle text-xs font-medium bg-teal text-white rounded-full px-2 py-0.5">
            {unreadCount}
          </span>
        )}
      </h1>

      <div className="space-y-3">
        {messages?.map((m) => (
          <ContactMessageRow
            key={m.id}
            id={m.id}
            name={m.name}
            email={m.email}
            phone={m.phone}
            message={m.message}
            isRead={m.is_read}
            createdAt={m.created_at}
          />
        ))}

        {(!messages || messages.length === 0) && (
          <p className="text-sm text-ink-soft py-4">{t("empty")}</p>
        )}
      </div>
    </div>
  );
}