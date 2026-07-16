"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type RawMessage = {
  id: string;
  property_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
};

type Conversation = {
  key: string;
  propertyId: string;
  propertyTitle: string;
  otherId: string;
  otherName: string;
  lastMessage: string;
  lastAt: string;
  unread: boolean;
};

export function MessagesClient({
  currentUserId,
  initialMessages,
  propertyTitles,
  profileNames,
}: {
  currentUserId: string;
  initialMessages: RawMessage[];
  propertyTitles: Record<string, string>;
  profileNames: Record<string, string>;
}) {
  const t = useTranslations("messages");
  const supabase = createClient();
  const [messages, setMessages] = useState<RawMessage[]>(initialMessages);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const conversations = useMemo<Conversation[]>(() => {
    const map = new Map<string, Conversation>();
    for (const m of messages) {
      const otherId = m.sender_id === currentUserId ? m.receiver_id : m.sender_id;
      const key = `${m.property_id}::${otherId}`;
      const existing = map.get(key);
      if (!existing || new Date(m.created_at) > new Date(existing.lastAt)) {
        map.set(key, {
          key,
          propertyId: m.property_id,
          propertyTitle: propertyTitles[m.property_id] ?? t("defaultListing"),
          otherId,
          otherName: profileNames[otherId] ?? t("defaultUser"),
          lastMessage: m.content,
          lastAt: m.created_at,
          unread: m.receiver_id === currentUserId && !m.is_read,
        });
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime()
    );
  }, [messages, currentUserId, propertyTitles, profileNames, t]);

  const active = conversations.find((c) => c.key === selectedKey) ?? conversations[0] ?? null;

  useEffect(() => {
    if (!selectedKey && conversations.length > 0) {
      setSelectedKey(conversations[0].key);
    }
  }, [conversations, selectedKey]);

  const thread = useMemo(() => {
    if (!active) return [];
    return messages
      .filter(
        (m) =>
          m.property_id === active.propertyId &&
          ((m.sender_id === currentUserId && m.receiver_id === active.otherId) ||
            (m.sender_id === active.otherId && m.receiver_id === currentUserId))
      )
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [messages, active, currentUserId]);

  // Realtime: yeni mesajları canlı dinlə
  useEffect(() => {
    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const m = payload.new as RawMessage;
          if (m.sender_id === currentUserId || m.receiver_id === currentUserId) {
            setMessages((prev) => (prev.some((p) => p.id === m.id) ? prev : [...prev, m]));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  // aktiv söhbəti oxundu kimi işarələ
  useEffect(() => {
    if (!active) return;
    supabase
      .from("messages")
      .update({ is_read: true })
      .eq("property_id", active.propertyId)
      .eq("sender_id", active.otherId)
      .eq("receiver_id", currentUserId)
      .eq("is_read", false)
      .then(() => {});
  }, [active?.key]);

  async function handleSend() {
    if (!draft.trim() || !active) return;
    setSending(true);
    const { data } = await supabase
      .from("messages")
      .insert({
        property_id: active.propertyId,
        sender_id: currentUserId,
        receiver_id: active.otherId,
        content: draft.trim(),
      })
      .select()
      .single();

    if (data) setMessages((prev) => [...prev, data as RawMessage]);
    setDraft("");
    setSending(false);
  }

  if (conversations.length === 0) {
    return <p className="text-sm text-ink-soft">{t("empty")}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:h-[520px]">
      {/* Söhbətlər siyahısı — mobil: yalnız söhbət seçilməyibsə görünür */}
      <div
        className={`border border-line rounded-2xl overflow-y-auto bg-paper md:block ${
          active ? "hidden md:block" : "block"
        }`}
      >
        {conversations.map((c) => (
          <button
            key={c.key}
            onClick={() => setSelectedKey(c.key)}
            className={`w-full text-left px-4 py-3 border-b border-line last:border-0 ${
              active?.key === c.key ? "bg-teal/10" : "hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium truncate">{c.otherName}</span>
              {c.unread && <span className="w-2 h-2 rounded-full bg-brick shrink-0" />}
            </div>
            <div className="text-xs text-ink-soft truncate">{c.propertyTitle}</div>
            <div className="text-xs text-ink-soft truncate mt-0.5">{c.lastMessage}</div>
          </button>
        ))}
      </div>

      {/* Aktiv söhbət — mobil: yalnız söhbət seçiləndə görünür */}
      <div
        className={`md:col-span-2 border border-line rounded-2xl bg-paper flex flex-col overflow-hidden md:flex ${
          active ? "flex" : "hidden md:flex"
        }`}
      >
        {active && (
          <>
            <div className="px-3 sm:px-4 py-3 border-b border-line flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedKey(null)}
                className="md:hidden p-1 -ml-1 text-ink-soft hover:text-ink"
                aria-label="Söhbətlərə qayıt"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{active.otherName}</div>
                <div className="text-xs text-ink-soft truncate">{active.propertyTitle}</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-2.5 min-h-[300px] md:min-h-0">
              {thread.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm break-words ${
                    m.sender_id === currentUserId
                      ? "ml-auto bg-teal text-white"
                      : "bg-white border border-line"
                  }`}
                >
                  {m.content}
                </div>
              ))}
            </div>

            <div className="p-2.5 sm:p-3 border-t border-line flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={t("inputPlaceholder")}
                className="flex-1 min-w-0 border border-line rounded-lg px-3 py-2 text-sm bg-white"
              />
              <button
                onClick={handleSend}
                disabled={sending}
                className="bg-teal hover:bg-teal-deep text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-60 shrink-0"
              >
                {t("send")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
