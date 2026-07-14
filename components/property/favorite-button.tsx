"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function FavoriteButton({ propertyId }: { propertyId: string }) {
  const supabase = createClient();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;
      setUserId(user?.id ?? null);

      if (user) {
        const { data } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("property_id", propertyId)
          .maybeSingle();
        if (active) setFavorited(!!data);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [propertyId]);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      router.push(`/giris?next=/elan/${propertyId}`);
      return;
    }

    setLoading(true);
    if (favorited) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("property_id", propertyId);
      setFavorited(false);
    } else {
      await supabase.from("favorites").insert({ user_id: userId, property_id: propertyId });
      setFavorited(true);
    }
    setLoading(false);
    router.refresh();
  }

  return (
    <button onClick={handleClick} disabled={loading} className="shrink-0">
      <Heart
        size={16}
        className={favorited ? "fill-brick text-brick" : "text-ink-soft"}
      />
    </button>
  );
}