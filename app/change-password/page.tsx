'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button';

export default function ChangePasswordPage() {
  const [current, setCurrent] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/users/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current, newPassword }),
    })

    if (res.ok) {
      router.push('/dashboard')
    } else {
      const data = await res.json()
      setError(data.error || 'Password change failed')
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="password" placeholder="Current Password" value={current} onChange={e => setCurrent(e.target.value)} className="w-full border p-2" required />
        <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full border p-2" required />
        <Button 
          type="submit" 
          className="w-full"
        >
          Update Password
        </Button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}
