'use client';

import { useAdminUsers } from '@/hooks/useAdmin';

export default function PortalUsersPage() {
  const { users, loading } = useAdminUsers();

  return (
    <div>
      <h1 className="text-2xl font-medium mb-8">Users</h1>
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <div className="bg-white border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Role</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50">
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-muted">{user.email}</td>
                  <td className="p-4 text-muted">{user.phone || '—'}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs uppercase px-2 py-1 ${
                        user.role === 'ADMIN' ? 'bg-black text-white' : 'bg-neutral-100'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">{user._count.orders}</td>
                  <td className="p-4 text-muted">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
