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
  const pages = Array.from({ length: Math.min(maxVisiblePages, totalPages) }, (_, i) => {
    if (totalPages <= maxVisiblePages) return i + 1
    
    const middle = Math.floor(maxVisiblePages / 2)
    if (currentPage <= middle + 1) return i + 1
    if (currentPage >= totalPages - middle) return totalPages - maxVisiblePages + i + 1
    return currentPage - middle + i
  })

  return (
    <nav
      className={`flex items-center justify-center gap-2 ${className}`}
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Page précédente"
      >
        ←
      </button>

      {currentPage > 3 && totalPages > maxVisiblePages && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
          >
            1
          </button>
          <span className="text-gray-400">...</span>
        </>
      )}

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            currentPage === page
              ? 'bg-yellow-500 text-black'
              : 'text-white hover:bg-gray-700'
          }`}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages - 2 && totalPages > maxVisiblePages && (
        <>
          <span className="text-gray-400">...</span>
          <button
            onClick={() => onPageChange(totalPages)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Page suivante"
      >
        →
      </button>
    </nav>
  )
} 