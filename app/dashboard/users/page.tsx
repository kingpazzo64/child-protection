'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import UserEditModal from '@/components/users/UserEditModal'
import { Button } from "@/components/ui/button"


export default function UsersPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    idNumber: '',
    role: 'enumerator',
  })

  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState<number | null>(null)
  const [editingUser, setEditingUser] = useState<any | null>(null)

  const handleEdit = (user: any) => {
    setEditingUser(user)
  }

  const handleDisable = async (id: number) => {
    const confirmed = confirm('Are you sure you want to disable this user?')
    if (!confirmed) return

    const res = await fetch(`/api/users/${id}`, {
      method: 'POST',
    })

    if (res.ok) {
      toast.success('User disabled successfully.')
      fetchUsers()
    } else {
      toast.error('Failed to disable user.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleResend = async (id: number, email: string) => {
    setResending(id)
    const res = await fetch(`/api/users/${id}/resend`, { method: 'POST' })
    const data = await res.json()

    if (res.ok) {
      toast.success('Invite resent successfully.')
    } else {
      toast.error(data.error || 'Failed to resend invite.')
    }

    setResending(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/users/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    if (res.ok) {
      toast.success('User invited successfully!')
      setForm({ name: '', email: '', phone: '', idNumber: '', role: 'enumerator' })
      fetchUsers()
    } else {
      toast.error(data.error || 'Failed to invite user.')
    }

    setLoading(false)
  }

  const fetchUsers = async () => {
    const res = await fetch('/api/users')
    const data = await res.json()
    if (res.ok) setUsers(data.users)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Invite New User</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="w-full p-2 border" />
          <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required className="w-full p-2 border" />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required className="w-full p-2 border" />
          <input name="idNumber" placeholder="ID Number (16 digits)" value={form.idNumber} onChange={handleChange} required pattern="\d{16}" className="w-full p-2 border" />
          <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border">
            <option value="enumerator">Enumerator</option>
            <option value="admin">Admin</option>
          </select>
          <Button type="submit" disabled={loading} className='w-full'>
            {loading ? (
                <>
                  <svg className="w-4 h-4 mr-2 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Invite User'
              )}
          </Button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">All Users</h2>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="border px-2 py-1 text-left">Name</th>
              <th className="border px-2 py-1 text-left">Email</th>
              <th className="border px-2 py-1 text-left">Phone</th>
              <th className="border px-2 py-1 text-left">Role</th>
              <th className="border px-2 py-1 text-left">Activated</th>
              <th className="border px-2 py-1 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border px-2 py-1">{user.name}</td>
                <td className="border px-2 py-1">{user.email}</td>
                <td className="border px-2 py-1">{user.phone}</td>
                <td className="border px-2 py-1">{user.role}</td>
                <td className="border px-2 py-1">
                  {user.password ? '✅ Yes' : (
                    <div className="flex items-center gap-2">
                      ⏳ No
                      <button
                        disabled={resending === user.id}
                        onClick={() => handleResend(user.id, user.email)}
                        className="text-blue-600 hover:underline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {resending === user.id ? 'Resending...' : 'Resend Invite'}
                      </button>
                    </div>
                  )}
                </td>
                <td className="border px-2 py-1 space-x-2">
                  <button onClick={() => handleEdit(user)} className="text-blue-600 underline">Edit</button>
                  <button onClick={() => handleDisable(user.id)} className="text-red-600 underline">Disable</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <UserEditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={() => {
            setEditingUser(null)
            fetchUsers()
          }}
        />
      )}
    </div>
  )
}
