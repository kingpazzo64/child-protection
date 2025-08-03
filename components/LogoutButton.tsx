'use client'

import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <button onClick={handleLogout} className="text-red-600 hover:underline w-full text-left p-3 pt-0">
      Logout
    </button>
  )
}
