"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function FavoriteButton({
  propertyId,
  currentUserId,
  initialFavorited,
}: {
  propertyId: string;
  /** Server-də artıq bilinirsə ötür - hər kartın öz auth sorğusu atmasının qarşısını alır */
  currentUserId?: string | null;
  initialFavorited?: boolean;
}) {
  const supabase = createClient();
  const router = useRouter();

  const knownUpfront = currentUserId !== undefined;
  const [userId, setUserId] = useState<string | null>(currentUserId ?? null);
  const [favorited, setFavorited] = useState(initialFavorited ?? false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (knownUpfront) return; // server artıq ötürüb, təkrar sorğu lazım deyil
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
  }, [propertyId, knownUpfront]);

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