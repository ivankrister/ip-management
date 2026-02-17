import { useState, useEffect } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Plus, Search, RefreshCw, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import axios from "axios"
import { ipAddressService } from "@/services/ip-address.service"

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { IpAddressResource } from '@/types';

export default function IpManagementIndexPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedIp, setSelectedIp] = useState<IpAddressResource | null>(null)
  const [data, setData] = useState<IpAddressResource[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [sortBy, setSortBy] = useState<string>("createdAt")
  const [sortOrder, setSortOrder] = useState<'-' | ''>("-")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const sortParam = `${sortOrder}${sortBy}`
        const result = await ipAddressService.getAll({ 
          search: searchQuery,
          page: currentPage,
          sort: sortParam
        })
        
        if (result.data && Array.isArray(result.data)) {
          setData(result.data)
          
          if (result.meta) {
            setTotalCount(result.meta.total)
            setLastPage(result.meta.last_page)
          }
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message || "Failed to fetch data")
        } else {
          setError(err instanceof Error ? err.message : "An error occurred")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [searchQuery, refreshKey, currentPage, sortBy, sortOrder])

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle sort order if same column
      setSortOrder(sortOrder === '' ? '-' : '')
    } else {
      // Set new column and default to ascending
      setSortBy(column)
      setSortOrder('')
    }
    setCurrentPage(1) // Reset to first page when sorting changes
  }

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    return sortOrder === '' ? 
      <ArrowUp className="ml-2 h-4 w-4" /> : 
      <ArrowDown className="ml-2 h-4 w-4" />
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < lastPage) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleEdit = (ip: IpAddressResource) => {
    console.log("Edit IP:", ip)
    // TODO: Open edit dialog/modal
  }

  const handleDelete = (ip: IpAddressResource) => {
    setSelectedIp(ip)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedIp) return
    
    try {
      await ipAddressService.delete(selectedIp.id)
      setDeleteDialogOpen(false)
      setSelectedIp(null)
      handleRefresh()
    } catch (error) {
      console.error("Failed to delete IP:", error)
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to delete IP address")
      }
    }
  }

  const columns: ColumnDef<IpAddressResource>[] = [
    {
      accessorKey: "attributes.value",
      header: ({ column }) => (
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
      header: ({ column }) => (
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
      header: ({ column }) => (
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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(ip.attributes.value)}
              >
                Copy IP address
              </DropdownMenuItem>
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
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add IP Address
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>IP Addresses</CardTitle>
              <CardDescription>
                {totalCount > 0 ? `${totalCount} total addresses` : "Loading..."}
              </CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search IP addresses..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
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
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
