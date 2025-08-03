// app/dashboard/layout.tsx
import { ReactNode } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Menu } from "lucide-react"
import "../dashboard.css"
import { getCurrentUser } from "@/lib/getCurrentUser.server"

interface MainLayoutProps {
  children: ReactNode
}

export default async function DashboardLayout({ children }: MainLayoutProps) {
  const user = await getCurrentUser()

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar user={user} />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden">
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              <h1 className="text-xl font-semibold text-foreground">
                Child Protection Services Directory
              </h1>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {user?.name ? `Welcome back, ${user.name}` : "Welcome"}
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 p-6 bg-background">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
