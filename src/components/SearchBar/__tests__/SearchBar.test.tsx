import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SearchBar } from '../SearchBar'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe('SearchBar', () => {
  const mockRouter = {
    push: jest.fn(),
  }
  
  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    jest.clearAllMocks()
  })

  it('renders with default placeholder', () => {
    render(<SearchBar />)
    expect(screen.getByPlaceholderText('Rechercher un film ou une série...')).toBeInTheDocument()
  })

  it('calls onSearch prop when provided', async () => {
    const mockOnSearch = jest.fn()
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'Matrix' } })

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('Matrix')
    })
  })

  it('navigates to search page on form submission', () => {
    render(<SearchBar />)
    
    const input = screen.getByRole('searchbox')
    const form = input.closest('form')!

    fireEvent.change(input, { target: { value: 'Inception' } })
    fireEvent.submit(form)

    expect(mockRouter.push).toHaveBeenCalledWith('/search?q=Inception')
  })

  it('debounces search input', async () => {
    const mockOnSearch = jest.fn()
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'a' } })
    fireEvent.change(input, { target: { value: 'av' } })
    fireEvent.change(input, { target: { value: 'avatar' } })

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledTimes(1)
      expect(mockOnSearch).toHaveBeenCalledWith('avatar')
    })
  })
}) 