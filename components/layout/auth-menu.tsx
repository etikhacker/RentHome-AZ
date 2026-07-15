"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { NotificationBell } from "@/components/notifications/notification-bell";

type AuthState =
  | { status: "loading" }
  | { status: "guest" }
  | { status: "authed"; userId: string; fullName: string | null };

export function AuthMenu() {
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const supabase = createClient();

  const [state, setState] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    let active = true;

    async function loadProfile(userId: string) {
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .maybeSingle();
      if (!active) return;
      setState({
        status: "authed",
        userId,
        fullName: data?.full_name ?? null,
      });
    }

    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;
      if (user) {
        await loadProfile(user.id);
      } else {
        setState({ status: "guest" });
      }
    }
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setState({ status: "guest" });
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state.status === "loading") {
    return (
      <div className="w-[120px] h-9" aria-hidden="true" />
    );
  }

  if (state.status === "guest") {
    return (
      <>
        <Link
          href="/giris"
          className="px-4 py-2 rounded-md text-sm font-medium border border-ink"
        >
          {tNav("login")}
        </Link>
        <Link
          href="/qeydiyyat"
          className="px-4 py-2 rounded-md text-sm font-medium bg-teal text-white hover:bg-teal-deep"
        >
          {tNav("register")}
        </Link>
      </>
    );
  }

  const firstName = state.fullName?.split(" ")[0] ?? tNav("profile");

  return (
    <>
      <NotificationBell
        userId={state.userId}
        initialUnreadCount={0}
      />
      <Link
        href="/mesajlar"
        className="text-sm text-ink-soft hover:text-ink"
      >
        {tNav("messages")}
      </Link>
      <Link
        href="/favorilerim"
        className="text-sm text-ink-soft hover:text-ink"
      >
        {tNav("favorites")}
      </Link>
      <Link
        href="/profil"
        className="px-4 py-2 rounded-md text-sm font-medium bg-teal text-white hover:bg-teal-deep"
      >
        {firstName}
      </Link>
    </>
  );
}
