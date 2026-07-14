import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export async function SiteHeader() {
  const t = await getTranslations("nav");
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let fullName: string | null = null;
  let unreadNotifications = 0;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    fullName = profile?.full_name ?? null;

    const { count } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
    unreadNotifications = count ?? 0;
  }

  return (
    <header className="border-b border-line py-5">
      <div className="max-w-[1120px] mx-auto px-7 flex items-center justify-between">
        <Link href="/" className="font-display text-[22px] font-semibold tracking-tight">
          Rent<span className="text-brick">Home</span> AZ
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-ink-soft">
          <Link href="/elanlar" className="hover:text-ink">{t("search")}</Link>
          <Link href="/elan-yerlesdir" className="hover:text-ink">{t("postListing")}</Link>
          <Link href="/haqqimizda" className="hover:text-ink">{t("howItWorks")}</Link>
        </nav>

        <div className="flex items-center gap-3.5">
          <LanguageSwitcher />

          {user ? (
            <>
              <NotificationBell userId={user.id} initialUnreadCount={unreadNotifications} />
              <Link href="/mesajlar" className="text-sm text-ink-soft hover:text-ink">
                {t("messages")}
              </Link>
              <Link href="/favorilerim" className="text-sm text-ink-soft hover:text-ink">
                {t("favorites")}
              </Link>
              <Link
                href="/profil"
                className="px-4 py-2 rounded-md text-sm font-medium bg-teal text-white hover:bg-teal-deep"
              >
                {fullName ? fullName.split(" ")[0] : t("profile")}
              </Link>
            </>
          ) : (
            <>
              <Link href="/giris" className="px-4 py-2 rounded-md text-sm font-medium border border-ink">
                {t("login")}
              </Link>
              <Link
                href="/qeydiyyat"
                className="px-4 py-2 rounded-md text-sm font-medium bg-teal text-white hover:bg-teal-deep"
              >
                {t("register")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
