import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MobileMenu } from "@/components/layout/mobile-menu";
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
  let avatarUrl: string | null = null;
  let unreadNotifications = 0;

  if (user) {
    const [profileResult, notifResult] = await Promise.all([
      supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).single(),
      supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false),
    ]);
    fullName = profileResult.data?.full_name ?? null;
    avatarUrl = profileResult.data?.avatar_url ?? null;
    unreadNotifications = notifResult.count ?? 0;
  }

  const navItems = [
    { href: "/elanlar", label: t.search },
    { href: "/haqqimizda", label: t.how },
    { href: "/elaqe", label: t.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/95 py-4 sm:py-5 backdrop-blur">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-2 px-4 sm:px-7">
        <Link
          href="/"
          className="min-w-0 shrink font-display text-[18px] sm:text-[22px] font-semibold tracking-tight leading-none"
        >
          Rent<span className="text-brick">Home</span> AZ
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-ink-soft">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3.5">
          <div className="hidden md:block">
            <LanguageSwitcher current={locale} />
          </div>

          {user ? (
            <>
              <div className="hidden md:flex items-center gap-3.5">
                <NotificationBell userId={user.id} initialUnreadCount={unreadNotifications} />
                <Link href="/mesajlar" className="text-sm text-ink-soft hover:text-ink">
                  {t.messages}
                </Link>
                <Link href="/favorilerim" className="text-sm text-ink-soft hover:text-ink">
                  {t.favorites}
                </Link>
                <Link
                  href="/profil"
                  className="flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-md text-sm font-medium bg-teal text-white hover:bg-teal-deep"
                >
                  <span className="w-6 h-6 rounded-full bg-white/20 overflow-hidden flex items-center justify-center shrink-0">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px]">{(fullName ?? "?")[0]?.toUpperCase()}</span>
                    )}
                  </span>
                  {fullName ? fullName.split(" ")[0] : t.profile}
                </Link>
              </div>
              {/* mobil: yalnız zəng qutusu + menyu */}
              <div className="md:hidden">
                <NotificationBell userId={user.id} initialUnreadCount={unreadNotifications} />
              </div>
            </>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-3.5">
                <Link href="/giris" className="px-4 py-2 rounded-md text-sm font-medium border border-ink">
                  {t.login}
                </Link>
                <Link
                  href="/qeydiyyat"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-teal text-white hover:bg-teal-deep"
                >
                  {t.register}
                </Link>
              </div>
            </>
          )}

          <MobileMenu
            locale={locale}
            navItems={navItems}
            isAuthed={!!user}
            fullName={fullName}
            avatarUrl={avatarUrl}
            unreadNotifications={unreadNotifications}
          />
        </div>
      </div>
    </header>
  );
}
