interface ShopFiltersProps {
  inStock: boolean | undefined;
  setInStock: (v: boolean | undefined) => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  clearFilters: () => void;
}

export function ShopFilters({
  inStock,
  setInStock,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  clearFilters,
}: ShopFiltersProps) {
  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-28 space-y-8">
        <FilterPanel
          inStock={inStock}
          setInStock={setInStock}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          clearFilters={clearFilters}
        />
      </div>
    </aside>
  );
}

export function FilterPanel({
  inStock,
  setInStock,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  clearFilters,
  onApply,
}: ShopFiltersProps & { onApply?: () => void }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-4">Availability</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={inStock === true}
              onChange={(e) => setInStock(e.target.checked ? true : undefined)}
              className="accent-black"
            />
            In stock
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={inStock === false}
              onChange={(e) => setInStock(e.target.checked ? false : undefined)}
              className="accent-black"
            />
            Out of stock
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-4">Price</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="₫"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="input-field !py-2 text-sm w-full"
          />
          <span className="text-muted">to</span>
          <input
            type="number"
            placeholder="₫"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="input-field !py-2 text-sm w-full"
          />
        </div>
      </div>

      <button onClick={clearFilters} className="text-sm underline hover:no-underline">
        Clear all
      </button>

      {onApply && (
        <button onClick={onApply} className="btn-primary w-full text-center lg:hidden">
          Apply filters
        </button>
      )}
    </div>
  );
}
