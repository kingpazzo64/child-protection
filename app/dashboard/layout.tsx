import { ReactNode } from 'react'
import Link from 'next/link'
import { LogoutButton } from '@/components/LogoutButton'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-dark p-4 space-y-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav className="space-y-2">
          <Link href="/dashboard" className="block hover:underline">Home</Link>
          <Link href="/dashboard/directories" className="block hover:underline">Directories</Link>
          <Link href="/dashboard/service-types" className="block hover:underline">Service Types</Link>
          <Link href="/dashboard/users" className="block hover:underline">Users</Link>
          <Link href="/change-password" className="block hover:underline">Change Password</Link>
        </nav>
        <div className="mt-8">
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-dark-100">{children}</main>
    </div>
  )
}
