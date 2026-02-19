import { useState } from "react"
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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  const [activeTab, setActiveTab] = useState<'all' | 'me'>('all')

  const { user } = useAuth()

  const {
    data,
    isLoading,
    error,
    searchInput,
    setSearchInput,
    handleSort,
    getSortState,
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
    filters: activeTab === 'me' ? { 'filter[created_by]': 'me' } : {},
  })

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

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'me')}>
        <TabsList>
          <TabsTrigger value="all">All Activities</TabsTrigger>
          <TabsTrigger value="me">My Activities</TabsTrigger>
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
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">Error loading audit logs</div>
          ) : data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No audit logs found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((log: AuditLogResource) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {getActionIcon(log.attributes.type)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionBadge(log.attributes.type)} className="capitalize">
                        {log.attributes.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{log.included?.user.email}</TableCell>
                    <TableCell className="max-w-[300px] whitespace-normal">{log.attributes.details}</TableCell>
                    <TableCell>
                      {log.attributes.ip_address !== '-' ? (
                        <code className="text-xs bg-muted px-2 py-1 rounded">{log.attributes.ip_address}</code>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(log.attributes.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
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
