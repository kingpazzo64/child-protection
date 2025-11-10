import { SidebarProvider, SidebarTrigger, SidebarInset, SidebarHeader } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { getCurrentUser } from "@/lib/getCurrentUser.server"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <SidebarHeader className="sticky top-0 z-10 border-b border-border bg-background">
          <div className="flex h-16 items-center gap-4 px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-6" />
            <div className="flex flex-1 items-center gap-2">
              <h1 className="text-lg font-semibold">Child Protection Services Directory</h1>
            </div>
            {user && (
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <span>Welcome, {user.name}</span>
              </div>
            )}
          </div>
        </SidebarHeader>
        <div className="flex-1 p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

