"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { PropertyType } from "@/lib/types";

type City = { id: string; name: string };
type District = { id: string; name: string };

export function ListingForm({ cities, ownerId }: { cities: City[]; ownerId: string }) {
  const supabase = createClient();
  const router = useRouter();

  const [districts, setDistricts] = useState<District[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  async function handleCityChange(cityId: string) {
    if (!cityId) {
      setDistricts([]);
      return;
    }
    const { data } = await supabase
      .from("districts")
      .select("id, name")
      .eq("city_id", cityId)
      .order("name");
    setDistricts(data ?? []);
  }

  function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 8) {
      setError("Maksimum 8 şəkil yükləyə bilərsən.");
      return;
    }
    setError(null);
    setImages(files);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      owner_id: ownerId,
      title: String(form.get("title") ?? ""),
      description: String(form.get("description") ?? ""),
      city_id: String(form.get("city_id") ?? ""),
      district_id: String(form.get("district_id") ?? "") || null,
      address: String(form.get("address") ?? ""),
      price: Number(form.get("price")),
      rooms: Number(form.get("rooms")),
      floor: form.get("floor") ? Number(form.get("floor")) : null,
      total_floors: form.get("total_floors") ? Number(form.get("total_floors")) : null,
      area_m2: Number(form.get("area_m2")),
      property_type: String(form.get("property_type")) as PropertyType,
      phone: String(form.get("phone") ?? ""),
      whatsapp: String(form.get("whatsapp") ?? "") || null,
      is_renovated: form.get("is_renovated") === "1",
      is_furnished: form.get("is_furnished") === "1",
      has_balcony: form.get("has_balcony") === "1",
      has_elevator: form.get("has_elevator") === "1",
      utilities_included: form.get("utilities_included") === "1",
    };

    if (!payload.title || !payload.city_id || !payload.price || !payload.address) {
      setError("Başlıq, şəhər, ünvan və qiymət sahələri məcburidir.");
      return;
    }

    setLoading(true);

    const { data: property, error: insertError } = await supabase
      .from("properties")
      .insert(payload)
      .select("id")
      .single();

    if (insertError || !property) {
      setError("Elan yaradılarkən xəta baş verdi: " + insertError?.message);
      setLoading(false);
      return;
    }

    if (images.length > 0) {
      setUploadProgress(`Şəkillər yüklənir (0/${images.length})`);
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const path = `${property.id}/${i}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(path, file);

        if (uploadError) {
          setError("Şəkil yükləmə xətası: " + uploadError.message);
          continue;
        }

        const { data: publicUrl } = supabase.storage
          .from("property-images")
          .getPublicUrl(path);

        await supabase
          .from("property_images")
          .insert({ property_id: property.id, url: publicUrl.publicUrl, sort_order: i });

        setUploadProgress(`Şəkillər yüklənir (${i + 1}/${images.length})`);
      }
    }

    setLoading(false);
    router.push("/profil?elan=yaradildi");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="space-y-3.5">
        <h2 className="text-sm font-semibold text-ink-soft uppercase tracking-wide">
          Əsas məlumat
        </h2>

        <Field label="Başlıq">
          <input name="title" required className="input" placeholder="2 otaqlı, Nəsimi rayonu" />
        </Field>

        <Field label="Təsvir">
          <textarea name="description" rows={4} className="input" placeholder="Ev haqqında ətraflı məlumat..." />
        </Field>

        <div className="grid grid-cols-2 gap-3.5">
          <Field label="Şəhər">
            <select
              name="city_id"
              required
              onChange={(e) => handleCityChange(e.target.value)}
              className="input"
            >
              <option value="">Seç</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Rayon">
            <select name="district_id" className="input">
              <option value="">Seç</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Ünvan">
          <input name="address" required className="input" placeholder="Küçə, bina" />
        </Field>
      </section>

      <section className="space-y-3.5">
        <h2 className="text-sm font-semibold text-ink-soft uppercase tracking-wide">
          Qiymət və ölçülər
        </h2>
        <div className="grid grid-cols-3 gap-3.5">
          <Field label="Qiymət (₼/ay)">
            <input name="price" type="number" required className="input" />
          </Field>
          <Field label="Otaq sayı">
            <input name="rooms" type="number" required min={1} className="input" />
          </Field>
          <Field label="Sahə (m²)">
            <input name="area_m2" type="number" required className="input" />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-3.5">
          <Field label="Mərtəbə">
            <input name="floor" type="number" className="input" />
          </Field>
          <Field label="Ümumi mərtəbə">
            <input name="total_floors" type="number" className="input" />
          </Field>
          <Field label="Ev tipi">
            <select name="property_type" className="input" defaultValue="menzil">
              <option value="menzil">Mənzil</option>
              <option value="heyet_evi">Həyət evi</option>
              <option value="ofis">Ofis</option>
            </select>
          </Field>
        </div>
      </section>

      <section className="space-y-2.5">
        <h2 className="text-sm font-semibold text-ink-soft uppercase tracking-wide">
          Xüsusiyyətlər
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <Checkbox name="is_renovated" label="Təmirli" />
          <Checkbox name="is_furnished" label="Əşyalı" />
          <Checkbox name="has_balcony" label="Balkonu var" />
          <Checkbox name="has_elevator" label="Lift var" />
          <Checkbox name="utilities_included" label="Kommunal daxildir" />
        </div>
      </section>

      <section className="space-y-3.5">
        <h2 className="text-sm font-semibold text-ink-soft uppercase tracking-wide">
          Əlaqə
        </h2>
        <div className="grid grid-cols-2 gap-3.5">
          <Field label="Telefon nömrəsi">
            <input name="phone" required className="input" placeholder="+994 50 123 45 67" />
          </Field>
          <Field label="WhatsApp (istəyə bağlı)">
            <input name="whatsapp" className="input" placeholder="+994 50 123 45 67" />
          </Field>
        </div>
      </section>

      <section className="space-y-2.5">
        <h2 className="text-sm font-semibold text-ink-soft uppercase tracking-wide">
          Şəkillər (maks. 8)
        </h2>
        <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="text-sm" />
        {images.length > 0 && (
          <p className="text-xs text-ink-soft">{images.length} şəkil seçildi.</p>
        )}
      </section>

      {error && <p className="text-sm text-brick bg-brick/10 rounded-lg px-3 py-2">{error}</p>}
      {uploadProgress && <p className="text-sm text-ink-soft">{uploadProgress}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-teal hover:bg-teal-deep text-white rounded-lg px-6 py-3 text-sm font-medium disabled:opacity-60"
      >
        {loading ? "Göndərilir..." : "Elanı göndər"}
      </button>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid var(--line, rgba(22, 48, 44, 0.14));
          background: white;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 14px;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-ink-soft mb-1.5 font-medium">{label}</label>
      {children}
    </div>
  );
}

function Checkbox({ name, label }: { name: string; label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink-soft">
      <input type="checkbox" name={name} value="1" />
      {label}
    </label>
  );
}