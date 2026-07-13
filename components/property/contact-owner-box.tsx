"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ContactOwnerBox({
  propertyId,
  ownerId,
  ownerPhone,
  ownerWhatsapp,
  currentUserId,
}: {
  propertyId: string;
  ownerId: string;
  ownerPhone: string;
  ownerWhatsapp: string | null;
  currentUserId: string | null;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [message, setMessage] = useState("Salam. Ev hələ boşdurmu?");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!currentUserId) {
      router.push(`/giris?next=/elan/${propertyId}`);
      return;
    }
    setLoading(true);
    setError(null);

    const { error } = await supabase.from("messages").insert({
      property_id: propertyId,
      sender_id: currentUserId,
      receiver_id: ownerId,
      content: message,
    });

    setLoading(false);
    if (error) {
      setError("Mesaj göndərilmədi. Yenidən cəhd et.");
      return;
    }
    setSent(true);
  }

  return (
    <div className="bg-paper border border-line rounded-2xl p-5">
      <h3 className="font-display text-lg font-medium mb-3">Ev sahibi ilə əlaqə</h3>

      <div className="flex gap-2 mb-4">
        <a
          href={`tel:${ownerPhone}`}
          className="flex-1 text-center border border-line rounded-lg py-2.5 text-sm font-medium"
        >
          Zəng et
        </a>
        {ownerWhatsapp && (
          <a
            href={`https://wa.me/${ownerWhatsapp.replace(/\D/g, "")}`}
            target="_blank"
            className="flex-1 text-center bg-teal text-white rounded-lg py-2.5 text-sm font-medium"
          >
            WhatsApp
          </a>
        )}
      </div>

      {sent ? (
        <p className="text-sm text-teal-deep bg-teal/10 rounded-lg px-3 py-2">
          Mesajın göndərildi. Ev sahibi "Mesajlar" bölməsindən cavab yazacaq.
        </p>
      ) : (
        <>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm mb-2"
          />
          {error && <p className="text-sm text-brick mb-2">{error}</p>}
          <button
            onClick={handleSend}
            disabled={loading}
            className="w-full bg-brick hover:bg-brick-deep text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Göndərilir..." : "Mesaj göndər"}
          </button>
        </>
      )}
    </div>
  );
}