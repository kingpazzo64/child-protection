'use client'

import { useState } from 'react'

export default function InviteUserPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    idNumber: '',
    role: 'ENUMERATOR',
  })
  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/users/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      setMessage('User invited successfully!')
      setForm({ name: '', email: '', phone: '', idNumber: '', role: 'ENUMERATOR' })
    } else {
      const data = await res.json()
      setMessage(data.error || 'Error inviting user')
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Invite a User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="w-full border p-2" required />
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border p-2" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="w-full border p-2" required />
        <input name="idNumber" value={form.idNumber} onChange={handleChange} placeholder="ID Number (16 digits)" className="w-full border p-2" required />

        <select name="role" value={form.role} onChange={handleChange} className="w-full border p-2">
          <option value="ENUMERATOR">Enumerator</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2">Send Invite</button>
      </form>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  )
}
