'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { productsApi } from '@/lib/api';
import type { Product } from '@/lib/types';

const SORT_OPTIONS = [
  { value: '', label: 'Featured' },
  { value: 'name-asc', label: 'Alphabetically, A-Z' },
  { value: 'name-desc', label: 'Alphabetically, Z-A' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
  { value: 'oldest', label: 'Date, old to new' },
] as const;

const COLLECTION_TITLES: Record<string, string> = {
  'all-products': 'All Products',
  tops: 'Tops',
  bottoms: 'Bottoms',
  accessories: 'Accessories',
};

export function useShop() {
  const searchParams = useSearchParams();
  const params = useParams();

  const handle = (params?.handle as string) || 'all-products';
  const category = handle === 'all-products' ? '' : handle;
  const search = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [inStock, setInStock] = useState<boolean | undefined>(undefined);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const categoryTitle = search
    ? `Search: "${search}"`
    : COLLECTION_TITLES[handle] || handle;

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams: Record<string, string> = {};
      if (category) queryParams.category = category;
      if (search) queryParams.search = search;
      if (sort) queryParams.sort = sort;
      if (inStock !== undefined) queryParams.inStock = String(inStock);
      if (minPrice) queryParams.minPrice = minPrice;
      if (maxPrice) queryParams.maxPrice = maxPrice;

      const data = await productsApi.getAll(queryParams);
      setProducts(data.products);
      setTotal(data.total);
    } catch {
      setProducts([]);
      setTotal(0);
    }
    setLoading(false);
  }, [category, search, sort, inStock, minPrice, maxPrice]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const clearFilters = () => {
    setInStock(undefined);
    setMinPrice('');
    setMaxPrice('');
    setSort('');
  };

  return {
    products,
    total,
    loading,
    sort,
    setSort,
    filterOpen,
    setFilterOpen,
    inStock,
    setInStock,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    categoryTitle,
    clearFilters,
    sortOptions: SORT_OPTIONS,
  };
}
