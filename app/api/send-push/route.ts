import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

const typeLabels: Record<string, string> = {
  yeni_mesaj: "Yeni mesaj",
  elan_tesdiqlendi: "Elan təsdiqləndi",
  elan_reddedildi: "Elan rədd edildi",
  premium_bitir: "Premium bitir",
};

export async function POST(request: Request) {
  const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!vapidPublicKey || !vapidPrivateKey || !supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "push notifications are not configured" },
      { status: 503 }
    );
  }

  webpush.setVapidDetails("mailto:omrbabayev455@gmail.com", vapidPublicKey, vapidPrivateKey);

  // service role client - RLS-i bypass edir, çünki bu, server-to-server çağırışdır
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  const secret = request.headers.get("x-push-secret");
  if (secret !== process.env.PUSH_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { user_id, content, type, related_property_id } = body;

  const { data: subs } = await supabaseAdmin
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .eq("user_id", user_id);

  if (!subs || subs.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const payload = JSON.stringify({
    title: typeLabels[type] ?? "RentHome AZ",
    body: content,
    url: related_property_id ? `/elan/${related_property_id}` : "/mesajlar",
  });

  let sent = 0;
  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        payload
      );
      sent++;
    } catch (err: any) {
      // Abunəlik artıq etibarsızdırsa (410/404), onu sil
      if (err.statusCode === 410 || err.statusCode === 404) {
        await supabaseAdmin.from("push_subscriptions").delete().eq("id", sub.id);
      }
    }
  }

  return NextResponse.json({ sent });
}
