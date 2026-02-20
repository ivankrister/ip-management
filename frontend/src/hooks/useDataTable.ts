import { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'

interface UseDataTableOptions<T> {
  fetchFn: (params: any) => Promise<{ data: T[]; meta?: any }>
  defaultSortColumn?: string
  defaultSortOrder?: '-' | ''
  searchDebounceMs?: number
  filters?: Record<string, any>
}

export function useDataTable<T>({
  fetchFn,
  defaultSortColumn = 'created_at',
  defaultSortOrder = '-',
  searchDebounceMs = 500,
  filters = {},
}: UseDataTableOptions<T>) {
  // Search state
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Sort state
  const [sortBy, setSortBy] = useState<string>(defaultSortColumn)
  const [sortOrder, setSortOrder] = useState<'-' | ''>(defaultSortOrder)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // Data state
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  // Use refs to avoid recreating fetchData callback
  const fetchFnRef = useRef(fetchFn)
  const filtersRef = useRef(filters)

  // Update refs when values change
  useEffect(() => {
    fetchFnRef.current = fetchFn
    filtersRef.current = filters
  }, [fetchFn, filters])

  // Reset to first page when filters changes (e.g., tab change)
  useEffect(() => {
    setCurrentPage(1)
    setRefreshKey((prev) => prev + 1)
  }, [JSON.stringify(filters)])

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
      setCurrentPage(1) // Reset to first page on search
    }, searchDebounceMs)

    return () => clearTimeout(timer)
  }, [searchInput, searchDebounceMs])

  // Reset to first page when sorting changes
  useEffect(() => {
    setCurrentPage(1)
  }, [sortBy, sortOrder])

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params: any = {
        page: currentPage,
        ...filtersRef.current,
      }

      if (searchQuery) {
        params['filter[search]'] = searchQuery
      }

      const sortParam = `${sortOrder}${sortBy}`
      if (sortParam) {
        params.sort = sortParam
      }

      const result = await fetchFnRef.current(params)

      if (result.data && Array.isArray(result.data)) {
        setData(result.data)
      }

      if (result.meta) {
        setTotalCount(result.meta.total)
        setLastPage(result.meta.last_page)
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch data')
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, sortBy, sortOrder, currentPage, refreshKey])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Sort handlers
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === '' ? '-' : '')
    } else {
      setSortBy(column)
      setSortOrder('')
    }
  }

  const getSortState = (column: string): 'asc' | 'desc' | 'none' => {
    if (sortBy !== column) {
      return 'none'
    }
    return sortOrder === '' ? 'asc' : 'desc'
  }

  // Pagination handlers
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

  // Other handlers
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return {
    // Data
    data,
    isLoading,
    error,
    
    // Search
    searchInput,
    setSearchInput,
    
    // Sort
    handleSort,
    getSortState,
    sortBy,
    sortOrder,
    
    // Pagination
    currentPage,
    lastPage,
    totalCount,
    handlePageChange,
    handlePreviousPage,
    handleNextPage,
    
    // Actions
    handleRefresh,
  }
}
