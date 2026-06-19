'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAdminProducts } from '@/hooks/useAdmin';
import { formatPrice, isOnSale } from '@/lib/utils/format';
import { ProductFormModal } from '@/components/admin/ProductFormModal';
import type { ProductFormInput } from '@/lib/types';

export default function AdminProductsPage() {
  const admin = useAdminProducts();

  const handleSave = async (data: ProductFormInput) => {
    await admin.saveProduct(data, admin.editing?.id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium">Products</h1>
        <button onClick={admin.openCreate} className="btn-primary !py-2 !px-6">Add product</button>
      </div>

      {admin.loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <div className="bg-white border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {admin.products.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-12 bg-neutral-100 shrink-0">
                        <Image src={product.images[0]} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1 max-w-[200px]">{product.name}</p>
                        {isOnSale(product) && <span className="text-2xs text-sale uppercase">Sale</span>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted">{product.category?.name}</td>
                  <td className="p-4">{formatPrice(product.price)}</td>
                  <td className="p-4">{product.stock}</td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <button onClick={() => admin.openEdit(product)} className="text-sm underline">Edit</button>
                      <button onClick={() => admin.deleteProduct(product.id)} className="text-sm text-sale underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {admin.showForm && (
        <ProductFormModal
          product={admin.editing}
          categories={admin.categories}
          onClose={admin.closeForm}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
