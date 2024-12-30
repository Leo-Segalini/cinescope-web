import { render, screen, fireEvent } from '@testing-library/react'
import { SearchSuggestions } from '../SearchSuggestions'
import type { Movie, TVShow } from '@/types/tmdb'

const mockRouter = {
  push: jest.fn(),
}

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}))

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  overview: 'Test overview',
  poster_path: '/test.jpg',
  backdrop_path: '/test-backdrop.jpg',
  release_date: '2024-01-01',
  vote_average: 8.5,
  vote_count: 100,
  genre_ids: [28],
}

const mockTVShow: TVShow = {
  id: 2,
  name: 'Test Show',
  overview: 'Test overview',
  poster_path: '/test.jpg',
  backdrop_path: '/test-backdrop.jpg',
  first_air_date: '2024-01-01',
  vote_average: 8.0,
  vote_count: 100,
  genre_ids: [18],
}

describe('SearchSuggestions', () => {
  const mockOnSelect = jest.fn()
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders suggestions correctly', () => {
    render(
      <SearchSuggestions
        results={[mockMovie, mockTVShow]}
        isVisible={true}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    expect(screen.getByText('Test Show')).toBeInTheDocument()
    expect(screen.getByText('2024 • Film')).toBeInTheDocument()
    expect(screen.getByText('2024 • Série')).toBeInTheDocument()
  })

  it('handles item selection', () => {
    render(
      <SearchSuggestions
        results={[mockMovie]}
        isVisible={true}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    )

    fireEvent.click(screen.getByText('Test Movie'))
    expect(mockOnSelect).toHaveBeenCalledWith(mockMovie)
    expect(mockRouter.push).toHaveBeenCalledWith('/movie/1')
  })

  it('supports keyboard navigation', () => {
    render(
      <SearchSuggestions
        results={[mockMovie]}
        isVisible={true}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    )

    const option = screen.getByRole('option')
    fireEvent.keyDown(option, { key: 'Enter' })
    expect(mockOnSelect).toHaveBeenCalledWith(mockMovie)
  })

  it('closes when clicking outside', () => {
    render(
      <SearchSuggestions
        results={[mockMovie]}
        isVisible={true}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    )

    fireEvent.mouseDown(document.body)
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('renders suggestions with proper accessibility attributes', () => {
    render(
      <SearchSuggestions
        results={[mockMovie, mockTVShow]}
        isVisible={true}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    )

    const listbox = screen.getByRole('listbox')
    expect(listbox).toHaveAttribute('aria-label', 'Suggestions de recherche')

    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveAttribute(
      'aria-label',
      'Test Movie (2024) - Film'
    )
    expect(options[1]).toHaveAttribute(
      'aria-label',
      'Test Show (2024) - Série'
    )
  })

  it('supports keyboard navigation with arrow keys', () => {
    render(
      <SearchSuggestions
        results={[mockMovie, mockTVShow]}
        isVisible={true}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    )

    const listbox = screen.getByRole('listbox')
    fireEvent.keyDown(listbox, { key: 'ArrowDown' })

    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(options[1]).toHaveAttribute('aria-selected', 'false')

    fireEvent.keyDown(listbox, { key: 'ArrowDown' })
    expect(options[0]).toHaveAttribute('aria-selected', 'false')
    expect(options[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('closes suggestions with Escape key', () => {
    render(
      <SearchSuggestions
        results={[mockMovie]}
        isVisible={true}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    )

    const listbox = screen.getByRole('listbox')
    fireEvent.keyDown(listbox, { key: 'Escape' })
    expect(mockOnClose).toHaveBeenCalled()
  })
}) 