import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from '../Pagination'

describe('Pagination', () => {
  const mockOnPageChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correct number of pages', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('...')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('handles page changes correctly', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    )

    fireEvent.click(screen.getByText('6'))
    expect(mockOnPageChange).toHaveBeenCalledWith(6)
  })

  it('disables previous button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    )

    const prevButton = screen.getByLabelText('Page précédente')
    expect(prevButton).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    )

    const nextButton = screen.getByLabelText('Page suivante')
    expect(nextButton).toBeDisabled()
  })

  it('highlights current page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    )

    const currentPageButton = screen.getByText('5')
    expect(currentPageButton).toHaveClass('bg-yellow-500')
    expect(currentPageButton).toHaveAttribute('aria-current', 'page')
  })
}) 