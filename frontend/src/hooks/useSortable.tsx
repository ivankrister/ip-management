import { useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

export function useSortable(defaultColumn: string = 'created_at', defaultOrder: '-' | '' = '-') {
  const [sortBy, setSortBy] = useState<string>(defaultColumn)
  const [sortOrder, setSortOrder] = useState<'-' | ''>(defaultOrder)

  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle sort order if same column
      setSortOrder(sortOrder === '' ? '-' : '')
    } else {
      // Set new column and default to ascending
      setSortBy(column)
      setSortOrder('')
    }
  }

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    return sortOrder === '' ? 
      <ArrowUp className="ml-2 h-4 w-4" /> : 
      <ArrowDown className="ml-2 h-4 w-4" />
  }

  const getSortParam = () => `${sortOrder}${sortBy}`

  return {
    sortBy,
    sortOrder,
    handleSort,
    getSortIcon,
    getSortParam,
  }
}
