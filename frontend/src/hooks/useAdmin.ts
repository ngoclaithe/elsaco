'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApi, categoriesApi } from '@/lib/api';
import type {
  AdminUser,
  AdminUserFormInput,
  DashboardStats,
  Order,
  Product,
  ProductFormInput,
} from '@/lib/types';

export function useAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    adminApi.getDashboard().then(setStats).catch(() => setStats(null));
  }, []);

  return { stats };
}

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([
        adminApi.getProducts(),
        categoriesApi.getAll(),
      ]);
      setProducts(p);
      setCategories(c);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await adminApi.deleteProduct(id);
    load();
  };

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setShowForm(true);
  };

  const closeForm = () => setShowForm(false);

  const saveProduct = async (data: ProductFormInput, id?: string) => {
    if (id) await adminApi.updateProduct(id, data);
    else await adminApi.createProduct(data);
    setShowForm(false);
    load();
  };

  return {
    products,
    categories,
    loading,
    showForm,
    editing,
    openCreate,
    openEdit,
    closeForm,
    deleteProduct,
    saveProduct,
  };
}

export function useAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setOrders(await adminApi.getOrders());
    } catch {
      setOrders([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (orderId: string, status: string) => {
    await adminApi.updateOrderStatus(orderId, status);
    load();
  };

  return { orders, loading, expanded, setExpanded, updateStatus };
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(await adminApi.getUsers());
    } catch {
      setUsers([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createUser = async (data: AdminUserFormInput & { password: string }) => {
    await adminApi.createUser(data);
    load();
  };

  const updateUser = async (id: string, data: Partial<AdminUserFormInput>) => {
    await adminApi.updateUser(id, data);
    load();
  };

  const changePassword = async (id: string, password: string) => {
    await adminApi.changeUserPassword(id, password);
  };

  return { users, loading, load, createUser, updateUser, changePassword };
}
