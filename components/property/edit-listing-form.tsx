"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { PropertyType } from "@/lib/types";

type City = { id: string; name: string };
type District = { id: string; name: string };
type ExistingImage = { id: string; url: string; sort_order: number };

export function EditListingForm({
  property,
  existingImages,
  cities,
  initialDistricts,
}: {
  property: any;
  existingImages: ExistingImage[];
  cities: City[];
  initialDistricts: District[];
}) {
  const supabase = createClient();
  const router = useRouter();

  const [districts, setDistricts] = useState<District[]>(initialDistricts);
  const [images, setImages] = useState<ExistingImage[]>(existingImages);
  const [newFiles, setNewFiles] = useState<File[]>([]);
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

  function handleNewFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (images.length + files.length > 8) {
      setError("Cəmi maksimum 8 şəkil ola bilər.");
      return;
    }
    setError(null);
    setNewFiles(files);
  }

  async function handleDeleteImage(imageId: string) {
    await supabase.from("property_images").delete().eq("id", imageId);
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      title: String(form.get("title") ?? ""),
      description: String(form.get("description") ?? ""),
      city_id: String(form.get("city_id") ?? ""),
      district_id: String(form.get("district_id") ?? "") || null,
      address: String(form.get("address") ?? ""),
      map_url: String(form.get("map_url") ?? "") || null,
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
      status: "gozleyir" as const, // dəyişiklikdən sonra yenidən yoxlanılsın
    };

    if (!payload.title || !payload.city_id || !payload.price || !payload.address) {
      setError("Başlıq, şəhər, ünvan və qiymət sahələri məcburidir.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase
      .from("properties")
      .update(payload)
      .eq("id", property.id);

    if (updateError) {
      setError("Yenilənərkən xəta baş verdi: " + updateError.message);
      setLoading(false);
      return;
    }

    if (newFiles.length > 0) {
      setUploadProgress(`Şəkillər yüklənir (0/${newFiles.length})`);
      const startOrder = images.length;
      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        const path = `${property.id}/${Date.now()}-${i}-${file.name}`;

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
          .insert({ property_id: property.id, url: publicUrl.publicUrl, sort_order: startOrder + i });

        setUploadProgress(`Şəkillər yüklənir (${i + 1}/${newFiles.length})`);
      }
    }

    setLoading(false);
    router.push("/profil?elan=yenilendi");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="space-y-3.5">
        <h2 className="text-sm font-semibold text-ink-soft uppercase tracking-wide">
          Əsas məlumat
        </h2>

        <Field label="Başlıq">
          <input name="title" required defaultValue={property.title} className="input" />
        </Field>

        <Field label="Təsvir">
          <textarea
            name="description"
            rows={4}
            defaultValue={property.description}
            className="input"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3.5">
          <Field label="Şəhər">
            <select
              name="city_id"
              required
              defaultValue={property.city_id}
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
            <select name="district_id" defaultValue={property.district_id ?? ""} className="input">
              <option value="">Seç</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Ünvan">
          <input name="address" required defaultValue={property.address} className="input" />
        </Field>

        <Field label="Google Maps linki (istəyə bağlı)">
          <input
            name="map_url"
            type="url"
            defaultValue={property.map_url ?? ""}
            className="input"
            placeholder="https://maps.app.goo.gl/..."
          />
        </Field>
      </section>

      <section className="space-y-3.5">
        <h2 className="text-sm font-semibold text-ink-soft uppercase tracking-wide">
          Qiymət və ölçülər
        </h2>
        <div className="grid grid-cols-3 gap-3.5">
          <Field label="Qiymət (₼/ay)">
            <input name="price" type="number" required defaultValue={property.price} className="input" />
          </Field>
          <Field label="Otaq sayı">
            <input name="rooms" type="number" required min={1} defaultValue={property.rooms} className="input" />
          </Field>
          <Field label="Sahə (m²)">
            <input name="area_m2" type="number" required defaultValue={property.area_m2} className="input" />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-3.5">
          <Field label="Mərtəbə">
            <input name="floor" type="number" defaultValue={property.floor ?? ""} className="input" />
          </Field>
          <Field label="Ümumi mərtəbə">
            <input name="total_floors" type="number" defaultValue={property.total_floors ?? ""} className="input" />
          </Field>
          <Field label="Ev tipi">
            <select name="property_type" defaultValue={property.property_type} className="input">
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
          <Checkbox name="is_renovated" label="Təmirli" defaultChecked={property.is_renovated} />
          <Checkbox name="is_furnished" label="Əşyalı" defaultChecked={property.is_furnished} />
          <Checkbox name="has_balcony" label="Balkonu var" defaultChecked={property.has_balcony} />
          <Checkbox name="has_elevator" label="Lift var" defaultChecked={property.has_elevator} />
          <Checkbox
            name="utilities_included"
            label="Kommunal daxildir"
            defaultChecked={property.utilities_included}
          />
        </div>
      </section>

      <section className="space-y-3.5">
        <h2 className="text-sm font-semibold text-ink-soft uppercase tracking-wide">Əlaqə</h2>
        <div className="grid grid-cols-2 gap-3.5">
          <Field label="Telefon nömrəsi">
            <input name="phone" required defaultValue={property.phone} className="input" />
          </Field>
          <Field label="WhatsApp (istəyə bağlı)">
            <input name="whatsapp" defaultValue={property.whatsapp ?? ""} className="input" />
          </Field>
        </div>
      </section>

      <section className="space-y-2.5">
        <h2 className="text-sm font-semibold text-ink-soft uppercase tracking-wide">Şəkillər</h2>

        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-3">
            {images.map((img) => (
              <div key={img.id} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="w-full h-20 object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img.id)}
                  className="absolute top-1 right-1 bg-brick text-white text-xs w-5 h-5 rounded-full"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="text-sm text-teal-deep cursor-pointer">
          + Yeni şəkil əlavə et (maks. cəmi 8)
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleNewFilesChange}
            className="hidden"
          />
        </label>
        {newFiles.length > 0 && (
          <p className="text-xs text-ink-soft">{newFiles.length} yeni şəkil seçildi.</p>
        )}
      </section>

      {error && <p className="text-sm text-brick bg-brick/10 rounded-lg px-3 py-2">{error}</p>}
      {uploadProgress && <p className="text-sm text-ink-soft">{uploadProgress}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-teal hover:bg-teal-deep text-white rounded-lg px-6 py-3 text-sm font-medium disabled:opacity-60"
      >
        {loading ? "Yenilənir..." : "Dəyişiklikləri yadda saxla"}
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

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink-soft">
      <input type="checkbox" name={name} value="1" defaultChecked={defaultChecked} />
      {label}
    </label>
  );
}