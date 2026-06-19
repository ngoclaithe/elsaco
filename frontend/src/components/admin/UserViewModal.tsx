'use client';

import type { AdminUser } from '@/lib/types';

interface UserViewModalProps {
  user: AdminUser;
  onClose: () => void;
  onEdit: () => void;
  onChangePassword: () => void;
}

export function UserViewModal({ user, onClose, onEdit, onChangePassword }: UserViewModalProps) {
  const rows = [
    { label: 'Name', value: user.name },
    { label: 'Email', value: user.email },
    { label: 'Phone', value: user.phone || '—' },
    { label: 'Role', value: user.role },
    { label: 'Orders', value: String(user._count.orders) },
    { label: 'Joined', value: new Date(user.createdAt).toLocaleString('vi-VN') },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <div>
            <h2 className="text-lg font-semibold">User details</h2>
            <p className="text-xs text-muted mt-0.5">Account overview</p>
          </div>
          <button type="button" onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center text-lg font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted">{user.email}</p>
            </div>
          </div>

          <dl className="divide-y divide-neutral-100 border border-neutral-200 rounded-lg">
            {rows.map((row) => (
              <div key={row.label} className="flex justify-between gap-4 px-4 py-3 text-sm">
                <dt className="text-muted">{row.label}</dt>
                <dd className="font-medium text-right">
                  {row.label === 'Role' ? (
                    <span className={`text-xs uppercase px-2 py-1 ${user.role === 'ADMIN' ? 'bg-neutral-900 text-white' : 'bg-neutral-100'}`}>
                      {row.value}
                    </span>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button type="button" onClick={onEdit} className="btn-secondary flex-1">Edit</button>
            <button type="button" onClick={onChangePassword} className="btn-primary flex-1">Change password</button>
          </div>
        </div>
      </div>
    </div>
  );
}
