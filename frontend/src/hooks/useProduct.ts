'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { productsApi } from '@/lib/api';
import type { Product } from '@/lib/types';
import { useAuth } from './useAuth';
import { useCart } from './useCart';

export function useProduct() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { user } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setActiveImage(0);
      try {
        const [p, r] = await Promise.all([
          productsApi.getBySlug(slug),
          productsApi.getRelated(slug),
        ]);
        setProduct(p);
        setRelated(r);
        if (p.sizes.length === 1) setSelectedSize(p.sizes[0]);
        else setSelectedSize('');
      } catch {
        setProduct(null);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  const validateSize = useCallback(() => {
    if (!selectedSize) {
      setError('Please select a size');
      return false;
    }
    if (!user) {
      window.location.href =
        '/account/login?redirect=' + encodeURIComponent(window.location.pathname);
      return false;
    }
    return true;
  }, [selectedSize, user]);

  const handleAddToCart = useCallback(async () => {
    if (!product || !validateSize()) return;

    setAdding(true);
    setError('');
    try {
      await addItem(product.id, selectedSize, quantity, true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add to cart');
    }
    setAdding(false);
  }, [product, selectedSize, quantity, validateSize, addItem]);

  const handleBuyNow = useCallback(async () => {
    if (!product || !validateSize()) return;

    setBuying(true);
    setError('');
    try {
      await addItem(product.id, selectedSize, quantity, false);
      router.push('/checkout');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to proceed to checkout');
    }
    setBuying(false);
  }, [product, selectedSize, quantity, validateSize, addItem, router]);

  return {
    product,
    related,
    selectedSize,
    setSelectedSize,
    activeImage,
    setActiveImage,
    loading,
    adding,
    buying,
    error,
    handleAddToCart,
    handleBuyNow,
  };
}
