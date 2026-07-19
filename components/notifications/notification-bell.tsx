"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Notification = {
  id: string;
  type: string;
  content: string;
  related_property_id: string | null;
  is_read: boolean;
  created_at: string;
};

const typeIcons: Record<string, string> = {
  yeni_mesaj: "💬",
  elan_tesdiqlendi: "✅",
  elan_reddedildi: "❌",
  premium_bitir: "⭐",
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "indicə";
  if (mins < 60) return `${mins} dəq əvvəl`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} saat əvvəl`;
  return `${Math.floor(hours / 24)} gün əvvəl`;
}

export function NotificationBell({
  userId,
  initialUnreadCount,
}: {
  userId: string;
  initialUnreadCount: number;
}) {
  const supabase = createClient();
  const ref = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(initialUnreadCount);
  const [items, setItems] = useState<Notification[] | null>(null);
  const [toasts, setToasts] = useState<Notification[]>([]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const channelName = useRef(
    `notifications-realtime-${userId}-${Math.random().toString(36).slice(2)}`
  ).current;

  useEffect(() => {
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const n = payload.new as Notification;
          setUnread((c) => c + 1);
          setItems((prev) => (prev ? [n, ...prev] : prev));

          // canlı toast göstər, bir neçə saniyədən sonra özü yox olsun
          setToasts((prev) => [...prev, n]);
          setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== n.id));
          }, 6000);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  function dismissToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleToggle() {
    const next = !open;
    setOpen(next);

    if (next && items === null) {
      const { data } = await supabase
        .from("notifications")
        .select("id, type, content, related_property_id, is_read, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);
      setItems(data ?? []);
    }

    if (next && unread > 0) {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);
      setUnread(0);
    }
  }

  return (
    <>
      <div className="fixed top-4 left-3 right-3 z-[100] space-y-2 w-auto sm:left-auto sm:right-4 sm:w-80">
        {toasts.map((n) => {
          const inner = (
            <div className="bg-paper border border-line rounded-xl shadow-lg p-3.5 flex gap-2.5 items-start animate-in">
              <span className="text-base shrink-0">{typeIcons[n.type] ?? "🔔"}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm">{n.content}</p>
                <p className="text-xs text-ink-soft mt-0.5">indicə</p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dismissToast(n.id);
                }}
                className="text-ink-soft hover:text-ink text-sm shrink-0"
              >
                ×
              </button>
            </div>
          );
          return n.related_property_id ? (
            <Link key={n.id} href={`/elan/${n.related_property_id}`} className="block">
              {inner}
            </Link>
          ) : (
            <div key={n.id}>{inner}</div>
          );
        })}
      </div>

      <div className="relative" ref={ref}>
      <button onClick={handleToggle} className="relative text-ink-soft hover:text-ink p-1">
        <Bell size={19} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-brick text-white text-[10px] leading-none rounded-full min-w-[16px] h-[16px] px-1 flex items-center justify-center border-2 border-bg">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[min(92vw,20rem)] max-h-96 overflow-y-auto bg-paper border border-line rounded-xl shadow-lg z-50 sm:w-80">
          {items === null ? (
            <p className="text-sm text-ink-soft p-4">Yüklənir...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-ink-soft p-4">Bildiriş yoxdur.</p>
          ) : (
            items.map((n) => {
              const content = (
                <div className="flex gap-2.5 px-4 py-3 border-b border-line last:border-0 hover:bg-white">
                  <span className="text-base shrink-0">{typeIcons[n.type] ?? "🔔"}</span>
                  <div className="min-w-0">
                    <p className="text-sm">{n.content}</p>
                    <p className="text-xs text-ink-soft mt-0.5">{timeAgo(n.created_at)}</p>
                  </div>
                </div>
              );
              return n.related_property_id ? (
                <Link key={n.id} href={`/elan/${n.related_property_id}`} className="block">
                  {content}
                </Link>
              ) : (
                <div key={n.id}>{content}</div>
              );
            })
          )}
        </div>
      )}
      </div>
    </>
  );
}
