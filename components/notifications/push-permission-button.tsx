"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function PushPermissionButton({ userId }: { userId: string }) {
  const supabase = createClient();
  const [status, setStatus] = useState<"idle" | "loading" | "granted" | "denied" | "unsupported">(
    "idle"
  );

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "granted") setStatus("granted");
    else if (Notification.permission === "denied") setStatus("denied");
  }, []);

  async function handleEnable() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }

    setStatus("loading");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setStatus(permission === "denied" ? "denied" : "idle");
      return;
    }

    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });

    const raw = subscription.toJSON();
    await supabase.from("push_subscriptions").upsert(
      {
        user_id: userId,
        endpoint: raw.endpoint!,
        p256dh: raw.keys!.p256dh,
        auth: raw.keys!.auth,
      },
      { onConflict: "endpoint" }
    );

    setStatus("granted");
  }

  if (status === "unsupported" || status === "granted") return null;

  return (
    <button
      onClick={handleEnable}
      disabled={status === "loading"}
      className="text-xs bg-teal/10 text-teal-deep rounded-full px-3 py-1.5 font-medium disabled:opacity-60"
    >
      {status === "loading"
        ? "Aktivləşdirilir..."
        : status === "denied"
        ? "Bildirişlər bloklanıb (brauzer ayarlarından aç)"
        : "🔔 Telefon bildirişlərini aktivləşdir"}
    </button>
  );
}