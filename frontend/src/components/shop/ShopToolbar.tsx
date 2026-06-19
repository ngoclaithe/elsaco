import { FilterPanel } from './ShopFilters';

interface SortOption {
  value: string;
  label: string;
}

interface ShopToolbarProps {
  total: number;
  sort: string;
  setSort: (v: string) => void;
  sortOptions: readonly SortOption[];
  filterOpen: boolean;
  setFilterOpen: (v: boolean) => void;
  inStock: boolean | undefined;
  setInStock: (v: boolean | undefined) => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  clearFilters: () => void;
}

export function ShopToolbar({
  total,
  sort,
  setSort,
  sortOptions,
  filterOpen,
  setFilterOpen,
  ...filterProps
}: ShopToolbarProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <p className="text-sm text-muted">{total} items</p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setFilterOpen(true)}
            className="lg:hidden text-sm flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Filter
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border border-neutral-300 px-3 py-2 outline-none bg-white"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filterOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[300px] bg-white p-6 overflow-y-auto animate-slide-in-right">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium">Filter</h3>
              <button onClick={() => setFilterOpen(false)}>✕</button>
            </div>
            <FilterPanel
              {...filterProps}
              onApply={() => setFilterOpen(false)}
            />
            <button
              onClick={() => setFilterOpen(false)}
              className="btn-primary w-full text-center mt-4"
            >
              See {total} items
            </button>
          </div>
        </div>
      )}
    </>
  );
}
