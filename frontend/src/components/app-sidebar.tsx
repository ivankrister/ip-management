import * as React from "react"
import { Link } from "react-router-dom"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { RiDashboardLine,  RiFileTextLine, RiSettingsLine, RiDatabase2Line, RiCommandLine } from "@remixicon/react"
import { useAuth } from "@/hooks/use-auth"

const data = {
 
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <RiDashboardLine
        />
      ),
    },
    {
      title: "IP Address Management",
      url: "/ip-management",
      icon: (
        <RiDatabase2Line
        />
      ),
    },
    {
      title: "Audit Logs",
      url: "/audit-logs",
      icon: (
        <RiFileTextLine
        />
      ),
    },
    
  ],

  
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
const { user} = useAuth()

  const navMainFiltered = data.navMain.filter(item => {
    // Only super_admin can access Dashboard and Audit Logs
    if (item.title === "Dashboard" || item.title === "Audit Logs") {
      return user?.type === "super_admin"
    }
    return true
  })

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="/dashboard">
                <RiCommandLine className="size-5!" />
                <span className="text-base font-semibold">IP Management System</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainFiltered} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
