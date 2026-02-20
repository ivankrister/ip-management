import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Plus, Search, RefreshCw, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { userService } from "@/services/user.service"
import { useDataTable } from "@/hooks/useDataTable"

import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import type { UserResource } from '@/types'
import { CreateUserForm } from './create'

export default function UserManagementIndexPage() {

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
  } = useDataTable<UserResource>({
    fetchFn: userService.getAll,
    defaultSortColumn: 'created_at',
    defaultSortOrder: '-',
  })

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserResource | null>(null)
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

  const handleDelete = (userData: UserResource) => {
    setSelectedUser(userData)
    setDeleteError(null)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedUser) return
    
    setDeleteError(null)
    try {
      // await userService.delete(selectedUser.id)
      setDeleteDialogOpen(false)
      setSelectedUser(null)
      handleRefresh()
    } catch (err: any) {
      const errorMessage = err.response?.status === 403 
        ? "You don't have permission to delete this user."
        : err.response?.data?.message || err.message || "Failed to delete user"
      setDeleteError(errorMessage)
    }
  }

  const getUserTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'super_admin':
        return 'default'
      case 'admin':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const columns: ColumnDef<UserResource>[] = [
    {
      accessorKey: "attributes.name",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => handleSort('name')}
          className="h-8 px-2 hover:bg-transparent"
        >
          Name
          {getSortIcon('name')}
        </Button>
      ),
      cell: ({ row }) => {
        const name = row.original.attributes.name
        return <span className="font-medium">{name}</span>
      },
    },
    {
      accessorKey: "attributes.email",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => handleSort('email')}
          className="h-8 px-2 hover:bg-transparent"
        >
          Email
          {getSortIcon('email')}
        </Button>
      ),
      cell: ({ row }) => {
        const email = row.original.attributes.email
        return <span className="text-sm">{email}</span>
      },
    },
    {
      accessorKey: "attributes.type",
      header: "Type",
      cell: ({ row }) => {
        const role = row.original.attributes.role
        return (
          <Badge variant={getUserTypeBadgeVariant(role)}>
            <span className="capitalize">{role.replace('_', ' ')}</span>
          </Badge>
        )
      },
    },
  
  ]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage system users and their permissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                {isLoading ? "Loading..." : `${totalCount} total users`}
              </CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
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
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>
              Create a new user account in the system.
            </DialogDescription>
          </DialogHeader>
          <CreateUserForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user{" "}
              <span className="font-semibold">{selectedUser?.attributes.name}</span>
              {" "}({selectedUser?.attributes.email}).
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
