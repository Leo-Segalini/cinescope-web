import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
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

describe('TVShowCard Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(<TVShowCard show={mockShow} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has proper image alt text', () => {
    const { getByRole } = render(<TVShowCard show={mockShow} />)
    const image = getByRole('img')
    expect(image).toHaveAttribute('alt', mockShow.name)
  })

  it('has accessible link text', () => {
    const { getByRole } = render(<TVShowCard show={mockShow} />)
    const link = getByRole('link')
    expect(link).toHaveAttribute('href', `/tv/${mockShow.id}`)
  })

  it('provides rating information in an accessible way', () => {
    const { getByText } = render(<TVShowCard show={mockShow} />)
    expect(getByText('8.5')).toBeInTheDocument()
    expect(getByText('2024')).toBeInTheDocument()
  })
}) 