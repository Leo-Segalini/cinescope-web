import { render, screen } from '@testing-library/react'
import { TVShowCard } from '../TVShowCard'

const mockShow = {
  id: 1,
  name: 'Test Show',
  overview: 'Test Overview',
  poster_path: '/test-poster.jpg',
  backdrop_path: '/test-backdrop.jpg',
  first_air_date: '2024-01-01',
  vote_average: 8.5,
  vote_count: 100,
  genre_ids: [1, 2, 3],
}

describe('TVShowCard', () => {
  it('renders show information correctly', () => {
    render(<TVShowCard show={mockShow} />)
    
    expect(screen.getByText('Test Show')).toBeInTheDocument()
    expect(screen.getByText('8.5')).toBeInTheDocument()
    expect(screen.getByText('2024')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      expect.stringContaining('test-poster.jpg')
    )
  })

  it('uses fallback image when poster_path is null', () => {
    const showWithoutPoster = { ...mockShow, poster_path: null }
    render(<TVShowCard show={showWithoutPoster} />)
    
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      expect.stringContaining('no-poster.png')
    )
  })

  it('links to the correct show details page', () => {
    render(<TVShowCard show={mockShow} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/tv/1')
  })
}) 