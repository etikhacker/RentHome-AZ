import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export async function SiteHeader() {
  const supabase = createClient();
  const locale = getLocale();
  const t = getDictionary(locale).nav;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let fullName: string | null = null;
  let unreadNotifications = 0;

  if (user) {
    const [profileResult, notifResult] = await Promise.all([
      supabase.from("profiles").select("full_name").eq("id", user.id).single(),
      supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false),
    ]);
    fullName = profileResult.data?.full_name ?? null;
    unreadNotifications = notifResult.count ?? 0;
  }

  return (
    <header className="border-b border-line py-5">
      <div className="max-w-[1120px] mx-auto px-7 flex items-center justify-between">
        <Link href="/" className="font-display text-[22px] font-semibold tracking-tight">
          Rent<span className="text-brick">Home</span> AZ
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-ink-soft">
          <Link href="/elanlar" className="hover:text-ink">{t.search}</Link>
          <Link href="/elan-yerlesdir" className="hover:text-ink">{t.post}</Link>
          <Link href="/haqqimizda" className="hover:text-ink">{t.how}</Link>
          <Link href="/elaqe" className="hover:text-ink">{t.contact}</Link>
        </nav>

        <div className="flex items-center gap-3.5">
          <LanguageSwitcher current={locale} />

          {user ? (
            <>
              <NotificationBell userId={user.id} initialUnreadCount={unreadNotifications} />
              <Link href="/mesajlar" className="text-sm text-ink-soft hover:text-ink">
                {t.messages}
              </Link>
              <Link href="/favorilerim" className="text-sm text-ink-soft hover:text-ink">
                {t.favorites}
              </Link>
              <Link
                href="/profil"
                className="px-4 py-2 rounded-md text-sm font-medium bg-teal text-white hover:bg-teal-deep"
              >
                {fullName ? fullName.split(" ")[0] : t.profile}
              </Link>
            </>
          ) : (
            <>
              <Link href="/giris" className="px-4 py-2 rounded-md text-sm font-medium border border-ink">
                {t.login}
              </Link>
              <Link
                href="/qeydiyyat"
                className="px-4 py-2 rounded-md text-sm font-medium bg-teal text-white hover:bg-teal-deep"
              >
                {t.register}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}