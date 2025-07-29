// components/users/UserList.tsx
'use client'

import { useState } from 'react'
import { Pencil, Mail, Ban } from 'lucide-react'
import UserEditModal from './UserEditModal'

import { User } from '@/types'

type Props = {
  users: User[]
}

export default function UserList({ users }: { users: User[] }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <table className="min-w-full text-sm border">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t hover:bg-gray-50">
              <td className="p-2 border">{user.name}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">{user.role}</td>
              <td className="p-2 border">
                {user.disabled ? 'Disabled' : user.emailVerified ? 'Active' : 'Pending'}
              </td>
              <td className="p-2 border text-center space-x-2">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="text-blue-600 hover:underline text-xs"
                >
                  <Pencil className="inline-block w-4 h-4 mr-1" />
                  Edit
                </button>
                {!user.emailVerified && (
                  <button
                    className="text-green-600 hover:underline text-xs"
                    onClick={() => alert(`Resend invite to ${user.email}`)}
                  >
                    <Mail className="inline-block w-4 h-4 mr-1" />
                    Resend
                  </button>
                )}
                <button
                  className="text-red-600 hover:underline text-xs"
                  onClick={() => alert(`Toggle disable for ${user.name}`)}
                >
                  <Ban className="inline-block w-4 h-4 mr-1" />
                  {user.disabled ? 'Enable' : 'Disable'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={(updatedUser: User) => {
            console.log('Updated:', updatedUser)
            setSelectedUser(null)
          }}
        />
      )}
    </div>
  )
}
