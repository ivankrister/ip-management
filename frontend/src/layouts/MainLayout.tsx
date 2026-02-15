import { Outlet, useMatches } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";

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
            <h1 className="text-xl font-semibold">{pageTitle}</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
        <Outlet />
        </main>
    </SidebarInset>
    </SidebarProvider>
</TooltipProvider>
);
}
