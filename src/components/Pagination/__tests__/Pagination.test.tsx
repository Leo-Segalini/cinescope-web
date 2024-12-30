import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from '../Pagination'

describe('Pagination', () => {
  const mockOnPageChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correct number of page buttons', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />
    )
    
    const pageButtons = screen.getAllByRole('button').filter(
      button => !button.getAttribute('aria-label')
    )
    expect(pageButtons).toHaveLength(5)
  })

  it('marks current page as active', () => {
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={mockOnPageChange} />
    )
    
    const currentPageButton = screen.getByRole('button', { current: 'page' })
    expect(currentPageButton).toHaveTextContent('2')
    expect(currentPageButton).toHaveClass('bg-yellow-500')
  })

  it('disables previous button on first page', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />
    )
    
    const prevButton = screen.getByLabelText('Page précédente')
    expect(prevButton).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={mockOnPageChange} />
    )
    
    const nextButton = screen.getByLabelText('Page suivante')
    expect(nextButton).toBeDisabled()
  })

  it('calls onPageChange with correct page number', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />
    )
    
    const pageButton = screen.getByText('3')
    fireEvent.click(pageButton)
    expect(mockOnPageChange).toHaveBeenCalledWith(3)
  })
}) 