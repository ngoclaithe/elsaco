'use client';

import Image from 'next/image';
import { useAdminProducts } from '@/hooks/useAdmin';
import { formatPrice, isOnSale } from '@/lib/utils/format';
import { ProductFormModal } from '@/components/admin/ProductFormModal';
import { PortalPageHeader, PortalPanel } from '@/components/admin/PortalUI';
import type { ProductFormInput } from '@/lib/types';

export default function PortalProductsPage() {
  const admin = useAdminProducts();

  const handleSave = async (data: ProductFormInput) => {
    await admin.saveProduct(data, admin.editing?.id);
  };

  return (
    <div>
      <PortalPageHeader
        title="Products"
        description={`${admin.products.length} items in catalog`}
        action={
          <button onClick={admin.openCreate} className="btn-primary !py-2.5 !px-6">
            Add product
          </button>
        }
      />

      {admin.loading ? (
        <p className="text-muted">Loading products...</p>
      ) : (
        <PortalPanel className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr className="text-left text-xs uppercase tracking-wider text-muted">
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {admin.products.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50/80">
                    <td className="p-4">
                      <div className="flex items-center gap-3 min-w-[240px]">
                        <div className="relative w-12 h-14 bg-neutral-100 shrink-0 rounded overflow-hidden border border-neutral-200">
                          <Image
                            src={product.images[0]}
                            alt=""
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium line-clamp-2 leading-snug">{product.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {product.featured && (
                              <span className="text-[10px] uppercase px-1.5 py-0.5 bg-neutral-900 text-white rounded">
                                Featured
                              </span>
                            )}
                            {isOnSale(product) && (
                              <span className="text-[10px] uppercase px-1.5 py-0.5 bg-sale text-white rounded">
                                Sale
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted">{product.category?.name}</td>
                    <td className="p-4 font-medium">{formatPrice(product.price)}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-xs ${
                          product.stock <= 5
                            ? 'bg-red-50 text-red-700'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => admin.openEdit(product)}
                          className="text-sm px-3 py-1.5 border border-neutral-300 rounded hover:border-black"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => admin.deleteProduct(product.id)}
                          className="text-sm px-3 py-1.5 border border-red-200 text-red-600 rounded hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PortalPanel>
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
