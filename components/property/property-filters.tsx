"use client";

import { useTranslations } from "next-intl";

type City = { id: string; name: string };

export function PropertyFilters({
  cities,
  searchParams,
}: {
  cities: City[];
  searchParams: Record<string, string | undefined>;
}) {
  const t = useTranslations("listings.filter");
  const tCommon = useTranslations("common");

  return (
    <form
      method="get"
      className="bg-paper border border-line rounded-2xl p-4.5 grid grid-cols-2 md:grid-cols-4 gap-3.5 items-end mb-8"
    >
      <div>
        <label className="block text-xs text-ink-soft mb-1.5 font-medium">{t("city")}</label>
        <select
          name="city"
          defaultValue={searchParams.city ?? ""}
          className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm"
        >
          <option value="">{t("allCities")}</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-ink-soft mb-1.5 font-medium">{t("minPrice")}</label>
        <input
          type="number"
          name="min_price"
          defaultValue={searchParams.min_price ?? ""}
          placeholder="0"
          className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs text-ink-soft mb-1.5 font-medium">{t("maxPrice")}</label>
        <input
          type="number"
          name="max_price"
          defaultValue={searchParams.max_price ?? ""}
          placeholder="2000"
          className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs text-ink-soft mb-1.5 font-medium">{t("rooms")}</label>
        <select
          name="rooms"
          defaultValue={searchParams.rooms ?? ""}
          className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm"
        >
          <option value="">{t("anyRooms")}</option>
          <option value="1">{t("rooms1")}</option>
          <option value="2">{t("rooms2")}</option>
          <option value="3">{t("rooms3")}</option>
          <option value="4">{t("rooms4")}</option>
        </select>
      </div>

      <div className="col-span-2 md:col-span-4 flex flex-wrap items-center gap-4 pt-1">
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            name="renovated"
            value="1"
            defaultChecked={searchParams.renovated === "1"}
          />
          {t("renovated")}
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            name="furnished"
            value="1"
            defaultChecked={searchParams.furnished === "1"}
          />
          {t("furnished")}
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            name="elevator"
            value="1"
            defaultChecked={searchParams.elevator === "1"}
          />
          {t("elevator")}
        </label>

        <button
          type="submit"
          className="ml-auto bg-brick hover:bg-brick-deep text-white rounded-lg px-5 py-2.5 text-sm font-medium"
        >
          {tCommon("search")}
        </button>
        <a
          href="/elanlar"
          className="text-sm text-ink-soft border-b border-line"
        >
          {tCommon("reset")}
        </a>
      </div>
    </form>
  );
}
