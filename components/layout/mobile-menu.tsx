"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previousOverflowX = document.body.style.overflowX;
    document.body.style.overflow = "hidden";
    document.body.style.overflowX = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overflowX = previousOverflowX;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const menu =
    mounted && open
      ? createPortal(
          <aside
            className="fixed inset-0 z-[100] flex flex-col bg-paper md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobil menyu"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4 pt-[max(1rem,env(safe-area-inset-top))]">
              <span className="font-display text-lg font-semibold leading-none tracking-tight">
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

            <div className="border-b border-line px-5 py-4">
              <LanguageSwitcher current={locale} />
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto overscroll-contain px-5 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-ink hover:bg-white"
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
                    className="block rounded-lg px-3 py-3 text-base font-medium text-ink hover:bg-white"
                  >
                    Mesajlar
                  </Link>
                  <Link
                    href="/favorilerim"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-ink hover:bg-white"
                  >
                    Favoritlər
                  </Link>
                  {unreadNotifications > 0 && (
                    <Link
                      href="/profil"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-ink hover:bg-white"
                    >
                      <span>Bildirişlər</span>
                      <span className="rounded-full bg-brick px-2 py-0.5 text-[11px] font-semibold text-white">
                        {unreadNotifications > 9 ? "9+" : unreadNotifications}
                      </span>
                    </Link>
                  )}
                </>
              )}
            </nav>

            <div className="space-y-2.5 border-t border-line px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {isAuthed ? (
                <Link
                  href="/profil"
                  onClick={() => setOpen(false)}
                  className="flex min-w-0 items-center gap-3 rounded-lg bg-teal px-3 py-3 text-white"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/20 text-sm">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span>{(fullName ?? "?")[0]?.toUpperCase()}</span>
                    )}
                  </span>
                  <span className="min-w-0 truncate text-sm font-medium">{fullName ?? "Profil"}</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/giris"
                    onClick={() => setOpen(false)}
                    className="block w-full rounded-lg border border-ink px-4 py-2.5 text-center text-sm font-medium"
                  >
                    Giriş
                  </Link>
                  <Link
                    href="/qeydiyyat"
                    onClick={() => setOpen(false)}
                    className="block w-full rounded-lg bg-teal px-4 py-2.5 text-center text-sm font-medium text-white"
                  >
                    Qeydiyyat
                  </Link>
                </>
              )}
            </div>
          </aside>,
          document.body
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden -mr-2 p-2 text-ink-soft hover:text-ink"
        aria-label="Menyunu aç"
        aria-expanded={open}
      >
        <Menu size={22} />
      </button>

      {menu}
    </>
  );
}
