type City = { id: string; name: string };

export function PropertyFilters({
  cities,
  searchParams,
}: {
  cities: City[];
  searchParams: Record<string, string | undefined>;
}) {
  return (
    <form
      method="get"
      className="bg-paper border border-line rounded-2xl p-4.5 grid grid-cols-2 md:grid-cols-4 gap-3.5 items-end mb-8"
    >
      <div>
        <label className="block text-xs text-ink-soft mb-1.5 font-medium">Şəhər</label>
        <select
          name="city"
          defaultValue={searchParams.city ?? ""}
          className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm"
        >
          <option value="">Bütün şəhərlər</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-ink-soft mb-1.5 font-medium">Min qiymət (₼)</label>
        <input
          type="number"
          name="min_price"
          defaultValue={searchParams.min_price ?? ""}
          placeholder="0"
          className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs text-ink-soft mb-1.5 font-medium">Max qiymət (₼)</label>
        <input
          type="number"
          name="max_price"
          defaultValue={searchParams.max_price ?? ""}
          placeholder="2000"
          className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs text-ink-soft mb-1.5 font-medium">Otaq sayı</label>
        <select
          name="rooms"
          defaultValue={searchParams.rooms ?? ""}
          className="w-full border border-line bg-white rounded-lg px-3 py-2.5 text-sm"
        >
          <option value="">Fərq etməz</option>
          <option value="1">1 otaq</option>
          <option value="2">2 otaq</option>
          <option value="3">3 otaq</option>
          <option value="4">4+ otaq</option>
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
          Təmirli
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            name="furnished"
            value="1"
            defaultChecked={searchParams.furnished === "1"}
          />
          Əşyalı
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            name="elevator"
            value="1"
            defaultChecked={searchParams.elevator === "1"}
          />
          Lift
        </label>

        <button
          type="submit"
          className="ml-auto bg-brick hover:bg-brick-deep text-white rounded-lg px-5 py-2.5 text-sm font-medium"
        >
          Axtar
        </button>
        <a
          href="/elanlar"
          className="text-sm text-ink-soft border-b border-line"
        >
          Sıfırla
        </a>
      </div>
    </form>
  );
}
