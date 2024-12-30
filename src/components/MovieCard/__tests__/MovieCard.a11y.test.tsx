import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
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

describe('MovieCard Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(<MovieCard movie={mockMovie} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has proper image alt text', () => {
    const { getByRole } = render(<MovieCard movie={mockMovie} />)
    const image = getByRole('img')
    expect(image).toHaveAttribute('alt', mockMovie.title)
  })

  it('has accessible link text', () => {
    const { getByRole } = render(<MovieCard movie={mockMovie} />)
    const link = getByRole('link')
    expect(link).toHaveAttribute('href', `/movie/${mockMovie.id}`)
  })

  it('provides rating information in an accessible way', () => {
    const { getByText } = render(<MovieCard movie={mockMovie} />)
    expect(getByText('8.5')).toBeInTheDocument()
    expect(getByText('2024')).toBeInTheDocument()
  })
}) 