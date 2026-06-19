'use client';

import { useState } from 'react';
import { useAdminUsers } from '@/hooks/useAdmin';
import { PortalPageHeader, PortalPanel } from '@/components/admin/PortalUI';
import { UserFormModal } from '@/components/admin/UserFormModal';
import { UserViewModal } from '@/components/admin/UserViewModal';
import { UserPasswordModal } from '@/components/admin/UserPasswordModal';
import type { AdminUser, AdminUserFormInput } from '@/lib/types';

type ModalMode = 'view' | 'create' | 'edit' | 'password' | null;

export default function PortalUsersPage() {
  const admin = useAdminUsers();
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [modal, setModal] = useState<ModalMode>(null);

  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  const openView = (user: AdminUser) => {
    setSelected(user);
    setModal('view');
  };

  const handleSave = async (data: AdminUserFormInput & { password?: string }) => {
    if (modal === 'edit' && selected) {
      await admin.updateUser(selected.id, data);
    } else if (data.password) {
      await admin.createUser({ ...data, password: data.password });
    }
    closeModal();
  };

  const handlePassword = async (password: string) => {
    if (!selected) return;
    await admin.changePassword(selected.id, password);
    closeModal();
  };

  return (
    <div>
      <PortalPageHeader
        title="Users"
        description={`${admin.users.length} registered accounts`}
        action={
          <button onClick={() => setModal('create')} className="btn-primary !py-2.5 !px-6">
            Add user
          </button>
        }
      />

      {admin.loading ? (
        <p className="text-muted">Loading users...</p>
      ) : (
        <PortalPanel className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr className="text-left text-xs uppercase tracking-wider text-muted">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Phone</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Orders</th>
                  <th className="p-4 font-medium">Joined</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {admin.users.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50/80">
                    <td className="p-4 font-medium">{user.name}</td>
                    <td className="p-4 text-muted">{user.email}</td>
                    <td className="p-4 text-muted">{user.phone || '—'}</td>
                    <td className="p-4">
                      <span
                        className={`text-xs uppercase px-2 py-1 rounded ${
                          user.role === 'ADMIN' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">{user._count.orders}</td>
                    <td className="p-4 text-muted">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openView(user)}
                          className="text-sm px-3 py-1.5 border border-neutral-300 rounded hover:border-black"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setSelected(user);
                            setModal('edit');
                          }}
                          className="text-sm px-3 py-1.5 border border-neutral-300 rounded hover:border-black"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelected(user);
                            setModal('password');
                          }}
                          className="text-sm px-3 py-1.5 border border-neutral-300 rounded hover:border-black"
                        >
                          Password
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

      {modal === 'create' && (
        <UserFormModal user={null} onClose={closeModal} onSave={handleSave} />
      )}
      {modal === 'edit' && selected && (
        <UserFormModal user={selected} onClose={closeModal} onSave={handleSave} />
      )}
      {modal === 'view' && selected && (
        <UserViewModal
          user={selected}
          onClose={closeModal}
          onEdit={() => setModal('edit')}
          onChangePassword={() => setModal('password')}
        />
      )}
      {modal === 'password' && selected && (
        <UserPasswordModal user={selected} onClose={closeModal} onSave={handlePassword} />
      )}
    </div>
  );
}
