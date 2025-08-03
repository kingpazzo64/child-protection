// components/app-sidebar.tsx

import Link from "next/link"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Layers } from "lucide-react"

interface AppSidebarProps {
  user: {
    id: string
    name: string
    email: string
    role: string
  } | null
}

export function AppSidebar() {

  return (
    <aside className="hidden lg:flex w-64 bg-white border-r border-border flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border text-xl font-bold">
        NCDA
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
        <Link
          href="/dashboard"
          className={cn("flex items-center gap-2 px-3 py-2 rounded hover:bg-muted")}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>

        
            <Link
              href="/dashboard/users"
              className={cn("flex items-center gap-2 px-3 py-2 rounded hover:bg-muted")}
            >
              <Users className="w-4 h-4" />
              Users
            </Link>

            <Link
              href="/dashboard/service-types"
              className={cn("flex items-center gap-2 px-3 py-2 rounded hover:bg-muted")}
            >
              <Layers className="w-4 h-4" />
              Service Types
            </Link>
          

        <Link
          href="/dashboard/directories"
          className={cn("flex items-center gap-2 px-3 py-2 rounded hover:bg-muted")}
        >
          <Layers className="w-4 h-4" />
          Directories
        </Link>
      </nav>
    </aside>
  )
}
