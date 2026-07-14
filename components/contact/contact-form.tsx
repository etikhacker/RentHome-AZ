"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

export function ContactForm() {
  const t = useTranslations("contact");
  const supabase = createClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);

    const { error } = await supabase.from("contact_messages").insert({ name, email, message });

    setSending(false);
    if (error) {
      setError(t("error"));
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <p className="text-sm text-teal-deep bg-teal/10 rounded-lg px-4 py-3">
        {t("success")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div>
        <label className="block text-xs text-ink-soft mb-1.5 font-medium">{t("name")}</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs text-ink-soft mb-1.5 font-medium">{t("email")}</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs text-ink-soft mb-1.5 font-medium">{t("message")}</label>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm"
        />
      </div>
      {error && <p className="text-sm text-brick">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="bg-teal hover:bg-teal-deep text-white rounded-lg px-6 py-2.5 text-sm font-medium disabled:opacity-60"
      >
        {sending ? t("sending") : t("send")}
      </button>
    </form>
  );
}
