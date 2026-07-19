"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import type { PropertyType } from "@/lib/types";

type City = { id: string; name: string };
type District = { id: string; name: string };

export function ListingForm({ cities, ownerId }: { cities: City[]; ownerId: string }) {
  const t = useTranslations("createListing");
  const tPropertyType = useTranslations("propertyType");
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
    const newFiles = Array.from(e.target.files ?? []);
    const combined = [...images, ...newFiles];
    if (combined.length > 8) {
      setError(t("maxImagesError"));
      return;
    }
    setError(null);
    setImages(combined);
    e.target.value = ""; // eyni faylı təkrar seçmək mümkün olsun deyə
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
    };

    if (!payload.title || !payload.city_id || !payload.price || !payload.address) {
      setError(t("requiredFieldsError"));
      return;
    }

    setLoading(true);

    const { data: property, error: insertError } = await supabase
      .from("properties")
      .insert(payload)
      .select("id")
      .single();

    if (insertError || !property) {
      setError(t("createError", { message: insertError?.message ?? "" }));
      setLoading(false);
      return;
    }

    if (images.length > 0) {
      setUploadProgress(t("uploadingProgress", { current: 0, total: images.length }));
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${property.id}/${i}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(path, file);

        if (uploadError) {
          setError(t("uploadError", { message: uploadError.message }));
          continue;
        }

        const { data: publicUrl } = supabase.storage
          .from("property-images")
          .getPublicUrl(path);

        const mediaType = file.type.startsWith("video/") ? "video" : "image";

        await supabase
          .from("property_images")
          .insert({
            property_id: property.id,
            url: publicUrl.publicUrl,
            sort_order: i,
            media_type: mediaType,
          });

        setUploadProgress(t("uploadingProgress", { current: i + 1, total: images.length }));
      }
    }

    setLoading(false);
    router.push("/profil?elan=yaradildi");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="space-y-3.5">
        <h2 className="text-sm font-semibold text-ink-soft uppercase tracking-wide">
          {t("sectionMain")}
        </h2>

        <Field label={t("fields.title")}>
          <input name="title" required className="input" placeholder={t("fields.titlePlaceholder")} />
        </Field>

        <Field label={t("fields.description")}>
          <textarea name="description" rows={4} className="input" placeholder={t("fields.descriptionPlaceholder")} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Field label={t("fields.city")}>
            <select
              name="city_id"
              required
              onChange={(e) => handleCityChange(e.target.value)}
              className="input"
            >
              <option value="">{t("fields.select")}</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label={t("fields.district")}>
            <select name="district_id" className="input">
              <option value="">{t("fields.select")}</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label={t("fields.address")}>
          <input name="address" required className="input" placeholder={t("fields.addressPlaceholder")} />
        </Field>

        <Field label={t("fields.mapUrl")}>
          <input
            name="map_url"
            type="url"
            className="input"
            placeholder={t("fields.mapUrlPlaceholder")}
          />
        </Field>
      </section>

      <section className="space-y-3.5">
        <h2 className="text-sm font-semibold text-ink-soft uppercase tracking-wide">
          {t("sectionPricing")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <Field label={t("fields.price")}>
            <input name="price" type="number" required className="input" />
          </Field>
          <Field label={t("fields.rooms")}>
            <input name="rooms" type="number" required min={1} className="input" />
          </Field>
          <Field label={t("fields.area")}>
            <input name="area_m2" type="number" required className="input" />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <Field label={t("fields.floor")}>
            <input name="floor" type="number" className="input" />
          </Field>
          <Field label={t("fields.totalFloors")}>
            <input name="total_floors" type="number" className="input" />
          </Field>
          <Field label={t("fields.propertyType")}>
            <select name="property_type" className="input" defaultValue="menzil">
              <option value="menzil">{tPropertyType("menzil")}</option>
              <option value="heyet_evi">{tPropertyType("heyet_evi")}</option>
              <option value="ofis">{tPropertyType("ofis")}</option>
            </select>
          </Field>
        </div>
      </section>

      <section className="space-y-2.5">
        <h2 className="text-sm font-semibold text-ink-soft uppercase tracking-wide">
          {t("sectionFeatures")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Checkbox name="is_renovated" label={t("featureRenovated")} />
          <Checkbox name="is_furnished" label={t("featureFurnished")} />
          <Checkbox name="has_balcony" label={t("featureBalcony")} />
          <Checkbox name="has_elevator" label={t("featureElevator")} />
          <Checkbox name="utilities_included" label={t("featureUtilities")} />
        </div>
      </section>

      <section className="space-y-3.5">
        <h2 className="text-sm font-semibold text-ink-soft uppercase tracking-wide">
          {t("sectionContact")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Field label={t("fields.phone")}>
            <input name="phone" required className="input" placeholder="+994 50 123 45 67" />
          </Field>
          <Field label={t("fields.whatsapp")}>
            <input name="whatsapp" className="input" placeholder="+994 50 123 45 67" />
          </Field>
        </div>
      </section>

      <section className="space-y-2.5">
        <h2 className="text-sm font-semibold text-ink-soft uppercase tracking-wide">
          {t("sectionImages")}
        </h2>

        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
            {images.map((file, i) => (
              <div key={i} className="relative">
                {file.type.startsWith("video/") ? (
                  <video
                    src={URL.createObjectURL(file)}
                    className="w-full h-20 object-cover rounded-md bg-black"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="w-full h-20 object-cover rounded-md"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-brick text-white text-xs w-5 h-5 rounded-full"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <input type="file" accept="image/*,video/*" multiple onChange={handleImagesChange} className="text-sm" />
        {images.length > 0 && (
          <p className="text-xs text-ink-soft">{t("imagesSelected", { count: images.length })}</p>
        )}
      </section>

      {error && <p className="text-sm text-brick bg-brick/10 rounded-lg px-3 py-2">{error}</p>}
      {uploadProgress && <p className="text-sm text-ink-soft">{uploadProgress}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto bg-teal hover:bg-teal-deep text-white rounded-lg px-6 py-3 text-sm font-medium disabled:opacity-60"
      >
        {loading ? t("submitting") : t("submit")}
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
