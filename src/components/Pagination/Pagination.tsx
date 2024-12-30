'use client'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) => {
  const maxVisiblePages = 5
  const halfVisible = Math.floor(maxVisiblePages / 2)

  const getPageNumbers = () => {
    let start = Math.max(1, currentPage - halfVisible)
    let end = Math.min(totalPages, start + maxVisiblePages - 1)

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  if (totalPages <= 1) return null

  return (
    <nav
      className={`flex items-center justify-center space-x-2 ${className}`}
      aria-label="Pagination"
    >
      {/* Bouton précédent */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg bg-gray-800 px-3 py-2 text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
        aria-label="Page précédente"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Première page */}
      {getPageNumbers()[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="rounded-lg bg-gray-800 px-4 py-2 text-white transition-colors hover:bg-gray-700"
          >
            1
          </button>
          {getPageNumbers()[0] > 2 && (
            <span className="px-2 text-gray-400">...</span>
          )}
        </>
      )}

      {/* Pages numérotées */}
      {getPageNumbers().map(pageNum => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`rounded-lg px-4 py-2 transition-colors ${
            pageNum === currentPage
              ? 'bg-yellow-500 text-black'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
          aria-current={pageNum === currentPage ? 'page' : undefined}
        >
          {pageNum}
        </button>
      ))}

      {/* Dernière page */}
      {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
        <>
          {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
            <span className="px-2 text-gray-400">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="rounded-lg bg-gray-800 px-4 py-2 text-white transition-colors hover:bg-gray-700"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Bouton suivant */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-lg bg-gray-800 px-3 py-2 text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
        aria-label="Page suivante"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </nav>
  )
} 