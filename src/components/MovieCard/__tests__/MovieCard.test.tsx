import { render, screen } from '@testing-library/react'
import { MovieCard } from '../MovieCard'

const mockMovie = {
  id: 1,
  title: 'Test Movie',
  overview: 'Test Overview',
  poster_path: '/test-poster.jpg',
  backdrop_path: '/test-backdrop.jpg',
  release_date: '2024-01-01',
  vote_average: 8.5,
  vote_count: 100,
  genre_ids: [1, 2, 3],
}

describe('MovieCard', () => {
  it('renders movie information correctly', () => {
    render(<MovieCard movie={mockMovie} />)
    
    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    expect(screen.getByText('8.5')).toBeInTheDocument()
    expect(screen.getByText('2024')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      expect.stringContaining('test-poster.jpg')
    )
  })

  it('uses fallback image when poster_path is null', () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: null }
    render(<MovieCard movie={movieWithoutPoster} />)
    
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      expect.stringContaining('no-poster.png')
    )
  })
}) 