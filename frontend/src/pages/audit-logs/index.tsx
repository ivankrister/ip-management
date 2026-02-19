import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { RefreshCw } from "lucide-react"
import { useDataTable } from "@/hooks/useDataTable"
import { 
  RiFileListLine,
  RiAddCircleLine,
  RiEditLine,
  RiDeleteBinLine,
  RiLoginCircleLine,
  RiLogoutCircleLine,
  RiHistoryLine
} from "@remixicon/react";
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AuditLogResource } from '@/types';
import { useAuth } from "@/hooks/use-auth"
import { formatDate } from "@/lib/utils"
import { auditLogService } from "@/services/audit.service"


const getActionIcon = (action: string) => {
  switch (action) {
    case "create":
      return <RiAddCircleLine className="h-4 w-4 text-green-600" />;
    case "update":
      return <RiEditLine className="h-4 w-4 text-blue-600" />;
    case "delete":
      return <RiDeleteBinLine className="h-4 w-4 text-red-600" />;
    case "login":
      return <RiLoginCircleLine className="h-4 w-4 text-purple-600" />;
    case "logout":
      return <RiLogoutCircleLine className="h-4 w-4 text-gray-600" />;
    default:
      return <RiFileListLine className="h-4 w-4" />;
  }
};

const getActionBadge = (action: string) => {
  const variants: Record<string, "default" | "secondary" | "outline"> = {
    create: "default",
    update: "secondary",
    delete: "outline",
    login: "secondary",
    logout: "outline",
  };
  return variants[action] || "outline";
};

export default function AuditLogsIndexPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'ip-changes' | 'auth'>('all')

  const { user } = useAuth()

  const {
    data,
    isLoading,
    error,
    currentPage,
    lastPage,
    totalCount,
    handlePageChange,
    handlePreviousPage,
    handleNextPage,
    handleRefresh,
  } = useDataTable<AuditLogResource>({
    fetchFn: auditLogService.getAll,
    defaultSortColumn: 'created_at',
    defaultSortOrder: '-',
    filters: activeTab === 'ip-changes' ? { 'filter[entity_type]': 'IpAddress' } : activeTab === 'auth' ? { 'filter[entity_type]': 'User' } : {},
  })

  const columns: ColumnDef<AuditLogResource>[] = [
    {
      accessorKey: "icon",
      header: "",
      cell: ({ row }) => {
        return getActionIcon(row.original.attributes.type)
      },
    },
    {
      accessorKey: "attributes.action",
      header: "Action",
      cell: ({ row }) => {
        return (
          <Badge variant={getActionBadge(row.original.attributes.type)} className="capitalize">
            {row.original.attributes.action}
          </Badge>
        )
      },
    },
    {
      accessorKey: "included.user.email",
      header: "Email",
      cell: ({ row }) => {
        return <span className="font-medium">{row.original.included?.user?.email}</span>
      },
    },
    {
      accessorKey: "attributes.details",
      header: "Details",
      cell: ({ row }) => {
        return <span className="max-w-[300px] whitespace-normal">{row.original.attributes.details}</span>
      },
    },
    {
      accessorKey: "attributes.ip_address",
      header: "IP Address",
      cell: ({ row }) => {
        const ipAddress = row.original.attributes.ip_address
        return ipAddress !== '-' ? (
          <code className="text-xs bg-muted px-2 py-1 rounded">{ipAddress}</code>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
    },
    {
      accessorKey: "attributes.createdAt",
      header: "Timestamp",
      cell: ({ row }) => {
        return (
          <span className="text-muted-foreground text-sm">
            {formatDate(row.original.attributes.createdAt)}
          </span>
        )
      },
    },
  ]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <RiHistoryLine className="h-8 w-8" />
            Audit Logs
          </h1>
          <p className="text-muted-foreground">
            Real-time tracking of all system activities and changes
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'ip-changes' | 'auth')}>
        <TabsList>
              <TabsTrigger value="all">All Activities</TabsTrigger>
              <TabsTrigger value="ip-changes">IP Changes</TabsTrigger>
              <TabsTrigger value="auth">Authentication</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                {isLoading ? "Loading..." : `${totalCount} total activities`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            error={error}
          />
          
          {!isLoading && !error && lastPage > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {lastPage}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
                    let pageNum: number
                    if (lastPage <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= lastPage - 2) {
                      pageNum = lastPage - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-9"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === lastPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
