"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { LogoutButton } from "./LogoutButton"
import { usePathname } from "next/navigation"
import Image from "next/image"

interface AppSidebarProps {
  user: {
    id: number
    name: string
    role: string
  } | null
}

export function AppSidebar() {
  const { state } = useSidebar()
  const currentPath = usePathname()
  const isActive = (path: string) => currentPath === path

  const navigationItems = [
    { title: "Dashboard", url: "/dashboard" },
    { title: "Directories", url: "/dashboard/directories" },
    { title: "Service Types", url: "/dashboard/service-types", restricted: true },
    { title: "Users", url: "/dashboard/users", restricted: true },
    { title: "Change Password", url: "/change-password" },
  ]

  // const filteredNavigationItems = navigationItems.filter(
  //   (item) => !(item.restricted && user?.role === "enumerator")
  // )

  return (
    <Sidebar
      className={`transition-all duration-300 ${
        state === "collapsed" ? "w-14" : "w-64"
      }`}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            {state !== "collapsed" && (
              <Image
                src="/logo-color.png"
                alt="NCDA Logo"
                className="h-24 w-auto"
                width={264}
                height={64}
              />
            )}
          </div>
        </div>

        {/* {state !== "collapsed" && user && (
          <div className="px-4 py-2 border-b border-sidebar-border text-sm text-sidebar-foreground">
            <p className="font-semibold">{user.name}</p>
            <p className="capitalize text-xs text-muted-foreground">{user.role}</p>
          </div>
        )} */}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`w-full justify-start gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.url)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                  >
                    <Link href={item.url}>
                      {state !== "collapsed" && (
                        <span className="truncate">{item.title}</span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <div className="mt-8">
              <LogoutButton />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
