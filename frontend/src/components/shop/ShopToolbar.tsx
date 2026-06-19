'use client';

import { useState, type ReactNode } from 'react';
import { FilterPanel } from './ShopFilters';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

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

function FilterDropdown({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-sm flex items-center gap-1.5 py-2"
      >
        {label}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 z-20 bg-white border border-neutral-200 shadow-sm min-w-[200px] p-4">
          {children}
        </div>
      )}
    </div>
  );
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
  const hasFilters =
    filterProps.inStock !== undefined ||
    filterProps.minPrice ||
    filterProps.maxPrice;

  useBodyScrollLock(filterOpen);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 lg:mb-8 pb-4 border-b border-neutral-200">
        <div className="hidden lg:flex items-center gap-8">
          <FilterDropdown label="Availability">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterProps.inStock === true}
                  onChange={(e) =>
                    filterProps.setInStock(e.target.checked ? true : undefined)
                  }
                  className="accent-black"
                />
                In stock
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterProps.inStock === false}
                  onChange={(e) =>
                    filterProps.setInStock(e.target.checked ? false : undefined)
                  }
                  className="accent-black"
                />
                Out of stock
              </label>
            </div>
          </FilterDropdown>

          <FilterDropdown label="Price">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="From"
                  value={filterProps.minPrice}
                  onChange={(e) => filterProps.setMinPrice(e.target.value)}
                  className="input-field !py-2 text-sm w-full"
                />
                <span className="text-muted text-sm">–</span>
                <input
                  type="number"
                  placeholder="To"
                  value={filterProps.maxPrice}
                  onChange={(e) => filterProps.setMaxPrice(e.target.value)}
                  className="input-field !py-2 text-sm w-full"
                />
              </div>
              {hasFilters && (
                <button
                  onClick={filterProps.clearFilters}
                  className="text-sm underline hover:no-underline"
                >
                  Clear all
                </button>
              )}
            </div>
          </FilterDropdown>
        </div>

        <button
          onClick={() => setFilterOpen(true)}
          className="lg:hidden text-sm flex items-center gap-2 touch-target -ml-2"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Filter
        </button>

        <div className="flex items-center gap-4 lg:gap-6 ml-auto">
          <p className="text-sm">{total} items</p>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm appearance-none border-0 outline-none bg-transparent pr-6 cursor-pointer min-h-[44px]"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.value ? opt.label : 'Sort'}
                </option>
              ))}
            </select>
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
            >
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
        </div>
      </div>

      {filterOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[min(300px,85vw)] bg-white p-4 sm:p-6 overflow-y-auto animate-slide-in-left safe-bottom">
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
