import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Plus, Search, RefreshCw, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { ipAddressService } from "@/services/ip-address.service"
import { useDataTable } from "@/hooks/useDataTable"

import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { IpAddressResource } from '@/types';
import { CreateIpAddressForm } from './create'
import { EditIpAddressForm } from './edit'
import { IpAddressDetail } from './show'

export default function IpManagementIndexPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'me'>('all')

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
  } = useDataTable<IpAddressResource>({
    fetchFn: ipAddressService.getAll,
    defaultSortColumn: 'created_at',
    defaultSortOrder: '-',
    filters: activeTab === 'me' ? { 'filter[created_by]': 'me' } : {},
  })

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [showDialogOpen, setShowDialogOpen] = useState(false)
  const [selectedIp, setSelectedIp] = useState<IpAddressResource | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const getSortIcon = (column: string) => {
    const state = getSortState(column)
    if (state === 'none') {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    return state === 'asc' ? 
      <ArrowUp className="ml-2 h-4 w-4" /> : 
      <ArrowDown className="ml-2 h-4 w-4" />
  }

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false)
    handleRefresh()
  }

  const handleEdit = (ip: IpAddressResource) => {
    setSelectedIp(ip)
    setEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    setEditDialogOpen(false)
    setSelectedIp(null)
    handleRefresh()
  }

  const handleRowClick = (ip: IpAddressResource) => {
    setSelectedIp(ip)
    setShowDialogOpen(true)
  }

  const handleDelete = (ip: IpAddressResource) => {
    setSelectedIp(ip)
    setDeleteError(null)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedIp) return
    
    setDeleteError(null)
    try {
      await ipAddressService.delete(selectedIp.id)
      setDeleteDialogOpen(false)
      setSelectedIp(null)
      handleRefresh()
    } catch (err: any) {
      const errorMessage = err.response?.status === 403 
        ? "You don't have permission to delete this IP address."
        : err.response?.data?.message || err.message || "Failed to delete IP address"
      setDeleteError(errorMessage)
    }
  }

  const columns: ColumnDef<IpAddressResource>[] = [
    {
      accessorKey: "attributes.value",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => handleSort('value')}
          className="h-8 px-2 hover:bg-transparent"
        >
          IP Address
          {getSortIcon('value')}
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.original.attributes.value
        return <span className="font-mono font-medium">{value}</span>
      },
    },
    {
      accessorKey: "attributes.label",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => handleSort('label')}
          className="h-8 px-2 hover:bg-transparent"
        >
          Label
          {getSortIcon('label')}
        </Button>
      ),
      cell: ({ row }) => {
        const label = row.original.attributes.label
        return label ? (
          <Badge variant="secondary">{label}</Badge>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )
      },
    },
    {
      accessorKey: "attributes.comment",
      header: "Comment",
      cell: ({ row }) => {
        const comment = row.original.attributes.comment
        return comment ? (
          <span className="text-sm">{comment}</span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )
      },
    },
    {
      accessorKey: "included.createdBy.name",
      header: "Created By",
      cell: ({ row }) => {
        const createdBy = row.original.included?.createdBy
        return createdBy ? (
          <span className="text-sm">{createdBy.name}</span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )
      },
    },
    {
      accessorKey: "attributes.createdAt",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => handleSort('created_at')}
          className="h-8 px-2 hover:bg-transparent"
        >
          Created At
          {getSortIcon('created_at')}
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.original.attributes.createdAt
        return (
          <span className="text-sm text-muted-foreground">
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const ip = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEdit(ip)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(ip)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">IP Address Management</h1>
          <p className="text-muted-foreground">
            Manage and track your IP address inventory
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add IP Address
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'me')}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="me">My IP Addresses</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>IP Addresses</CardTitle>
              <CardDescription>
                {isLoading ? "Loading..." : `${totalCount} total addresses`}
              </CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search IP addresses..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            error={error}
            onRowClick={handleRowClick}
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

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add IP Address</DialogTitle>
            <DialogDescription>
              Create a new IP address entry in your inventory.
            </DialogDescription>
          </DialogHeader>
          <CreateIpAddressForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit IP Address</DialogTitle>
            <DialogDescription>
              Update the IP address details.
            </DialogDescription>
          </DialogHeader>
          {selectedIp && (
            <EditIpAddressForm
              ipAddress={selectedIp}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showDialogOpen} onOpenChange={setShowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>IP Address Details</DialogTitle>
            <DialogDescription>
              View complete information about this IP address.
            </DialogDescription>
          </DialogHeader>
          {selectedIp && <IpAddressDetail ipAddress={selectedIp} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the IP address{" "}
              <span className="font-mono font-semibold">{selectedIp?.attributes.value}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {deleteError}
            </div>
          )}
          <AlertDialogFooter>
             <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} variant="destructive">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
