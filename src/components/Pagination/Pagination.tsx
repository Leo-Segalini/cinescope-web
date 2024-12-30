'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const maxVisiblePages = 5
  const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  const end = Math.min(totalPages, start + maxVisiblePages - 1)
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-400 transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Page précédente"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
            page === currentPage
              ? 'border-purple-500 bg-purple-500 text-white'
              : 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-400 transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Page suivante"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
} 