"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import type { Locale } from "@/lib/i18n/dictionary";

type NavItem = { href: string; label: string };

type Props = {
  locale: Locale;
  navItems: NavItem[];
  isAuthed: boolean;
  fullName: string | null;
  avatarUrl: string | null;
  unreadNotifications: number;
};

export function MobileMenu({
  locale,
  navItems,
  isAuthed,
  fullName,
  avatarUrl,
  unreadNotifications,
}: Props) {
  const [open, setOpen] = useState(false);

  // scroll-u bağla açıq olanda
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // ESC ilə bağla
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden -mr-2 p-2 text-ink-soft hover:text-ink"
        aria-label="Menyunu aç"
      >
        <Menu size={22} />
      </button>

      <aside
        className={`fixed inset-0 bg-paper z-[70] md:hidden flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-line pt-[max(1rem,env(safe-area-inset-top))]">
          <span className="font-display text-lg font-semibold tracking-tight leading-none">
            Rent<span className="text-brick">Home</span> AZ
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-2 text-ink-soft hover:text-ink"
            aria-label="Menyunu bağla"
          >
            <X size={22} />
          </button>
        </div>

        <div className="px-5 py-4 border-b border-line">
          <LanguageSwitcher current={locale} />
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base text-ink hover:bg-white"
            >
              {item.label}
            </Link>
          ))}

          {isAuthed && (
            <>
              <div className="my-3 border-t border-line" />
              <Link
                href="/mesajlar"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-base text-ink hover:bg-white"
              >
                <span>Mesajlar</span>
              </Link>
              <Link
                href="/favorilerim"
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base text-ink hover:bg-white"
              >
                Favorilər
              </Link>
              {unreadNotifications > 0 && (
                <Link
                  href="/profil"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-base text-ink hover:bg-white"
                >
                  <span>Bildirişlər</span>
                  <span className="bg-brick text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </span>
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="px-5 py-4 border-t border-line space-y-2.5 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {isAuthed ? (
            <Link
              href="/profil"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-teal text-white"
            >
              <span className="w-8 h-8 rounded-full bg-white/20 overflow-hidden flex items-center justify-center shrink-0 text-sm">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span>{(fullName ?? "?")[0]?.toUpperCase()}</span>
                )}
              </span>
              <span className="text-sm font-medium">
                {fullName ?? "Profil"}
              </span>
            </Link>
          ) : (
            <>
              <Link
                href="/giris"
                onClick={() => setOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium border border-ink"
              >
                Giriş
              </Link>
              <Link
                href="/qeydiyyat"
                onClick={() => setOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium bg-teal text-white"
              >
                Qeydiyyat
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
