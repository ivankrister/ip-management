import { Outlet, useMatches } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface RouteHandle {
  title?: string;
}

interface RouteMatch {
  id: string;
  pathname: string;
  params: Record<string, string | undefined>;
  data: unknown;
  handle: RouteHandle;
}

export default function MainLayout() {
  const matches = useMatches() as RouteMatch[];
  const currentMatch = matches.find((match) => match.handle?.title);
  const pageTitle = currentMatch?.handle?.title || "IP Management System";

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">{pageTitle}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
        <Outlet />
        </main>
    </SidebarInset>
    </SidebarProvider>
</TooltipProvider>
);
}
