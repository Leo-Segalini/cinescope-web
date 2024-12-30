import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Pagination } from '../Pagination'

describe('Pagination Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has proper ARIA labels', () => {
    const { getByLabelText } = render(
      <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />
    )

    expect(getByLabelText('Pagination')).toBeInTheDocument()
    expect(getByLabelText('Page précédente')).toBeInTheDocument()
    expect(getByLabelText('Page suivante')).toBeInTheDocument()
  })

  it('marks current page correctly for screen readers', () => {
    const { getByText } = render(
      <Pagination currentPage={5} totalPages={10} onPageChange={() => {}} />
    )

    expect(getByText('5')).toHaveAttribute('aria-current', 'page')
  })
}) 