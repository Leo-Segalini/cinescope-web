import { render, screen } from '@testing-library/react'
import SearchPage from '../page'
import { tmdbClient } from '@/services/tmdb/client'

jest.mock('@/services/tmdb/client', () => ({
  tmdbClient: {
    searchMulti: jest.fn(),
    getMovieGenres: jest.fn(),
    getTVGenres: jest.fn(),
  },
}))

const mockSearchResults = {
  results: [
    {
      id: 1,
      title: 'Test Movie',
      media_type: 'movie',
      genre_ids: [28, 12],
      // ... autres propriétés du film
    },
    {
      id: 2,
      name: 'Test Show',
      media_type: 'tv',
      genre_ids: [18, 10765],
      // ... autres propriétés de la série
    },
  ],
  total_pages: 1,
  total_results: 2,
}

const mockGenres = {
  movieGenres: [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Aventure' },
  ],
  tvGenres: [
    { id: 18, name: 'Drame' },
    { id: 10765, name: 'Science-Fiction & Fantastique' },
  ],
}

describe('SearchPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(tmdbClient.searchMulti as jest.Mock).mockResolvedValue(mockSearchResults)
    ;(tmdbClient.getMovieGenres as jest.Mock).mockResolvedValue(mockGenres.movieGenres)
    ;(tmdbClient.getTVGenres as jest.Mock).mockResolvedValue(mockGenres.tvGenres)
  })

  it('renders search results correctly', async () => {
    render(await SearchPage({ searchParams: { q: 'test' } }))

    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    expect(screen.getByText('Test Show')).toBeInTheDocument()
  })

  it('displays filters correctly', async () => {
    render(await SearchPage({ searchParams: { q: 'test' } }))

    expect(screen.getByText('Type de contenu')).toBeInTheDocument()
    expect(screen.getByText('Genres')).toBeInTheDocument()
    expect(screen.getByText('Films')).toBeInTheDocument()
    expect(screen.getByText('Séries')).toBeInTheDocument()
  })

  it('handles empty search results', async () => {
    ;(tmdbClient.searchMulti as jest.Mock).mockResolvedValue({
      results: [],
      total_pages: 0,
      total_results: 0,
    })

    render(await SearchPage({ searchParams: { q: 'nonexistent' } }))

    expect(screen.getByText('Aucun résultat trouvé')).toBeInTheDocument()
  })

  it('filters by type correctly', async () => {
    render(
      await SearchPage({
        searchParams: { q: 'test', type: 'movie' },
      })
    )

    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    expect(screen.queryByText('Test Show')).not.toBeInTheDocument()
  })
}) 