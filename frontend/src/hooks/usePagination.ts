import { useState } from 'react'

export function usePagination() {
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

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

  const resetToFirstPage = () => {
    setCurrentPage(1)
  }

  const updatePaginationMeta = (meta: { total: number; last_page: number; current_page?: number }) => {
    setTotalCount(meta.total)
    setLastPage(meta.last_page)
    if (meta.current_page) {
      setCurrentPage(meta.current_page)
    }
  }

  return {
    currentPage,
    lastPage,
    totalCount,
    handlePageChange,
    handlePreviousPage,
    handleNextPage,
    resetToFirstPage,
    updatePaginationMeta,
  }
}
