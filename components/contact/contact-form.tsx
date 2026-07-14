"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ContactForm() {
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
      setError("Göndərilmədi, yenidən cəhd et.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <p className="text-sm text-teal-deep bg-teal/10 rounded-lg px-4 py-3">
        Mesajın bizə çatdı. Tezliklə sənə geri dönəcəyik.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div>
        <label className="block text-xs text-ink-soft mb-1.5 font-medium">Ad</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs text-ink-soft mb-1.5 font-medium">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs text-ink-soft mb-1.5 font-medium">Mesaj</label>
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
        {sending ? "Göndərilir..." : "Göndər"}
      </button>
    </form>
  );
}