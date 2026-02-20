import { useState, useEffect } from 'react'

export function useDebounceSearch(delay: number = 500) {
  const [searchInput, setSearchInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
    }, delay)

    return () => clearTimeout(timer)
  }, [searchInput, delay])

  return {
    searchInput,
    searchQuery,
    setSearchInput,
  }
}
