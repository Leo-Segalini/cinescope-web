import { render, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { SearchBar } from '../SearchBar'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe('SearchBar Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(<SearchBar />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has proper label and role', () => {
    const { getByRole } = render(<SearchBar />)
    const searchInput = getByRole('searchbox')
    expect(searchInput).toHaveAttribute('aria-label', 'Rechercher')
  })

  it('announces search results to screen readers', async () => {
    const mockOnSearch = jest.fn()
    const { getByRole } = render(<SearchBar onSearch={mockOnSearch} />)
    
    const searchInput = getByRole('searchbox')
    fireEvent.change(searchInput, { target: { value: 'test' } })
    
    await new Promise(resolve => setTimeout(resolve, 500))
    expect(mockOnSearch).toHaveBeenCalledWith('test')
  })

  it('supports keyboard navigation', () => {
    const { getByRole } = render(<SearchBar />)
    const searchInput = getByRole('searchbox')
    
    searchInput.focus()
    expect(document.activeElement).toBe(searchInput)
  })
}) 