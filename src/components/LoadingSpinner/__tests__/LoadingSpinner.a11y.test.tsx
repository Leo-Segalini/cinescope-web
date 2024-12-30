import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { LoadingSpinner } from '../LoadingSpinner'

describe('LoadingSpinner Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(<LoadingSpinner />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has proper role and aria-label', () => {
    const { getByRole } = render(<LoadingSpinner />)
    const spinner = getByRole('status')
    expect(spinner).toHaveAttribute('aria-label', 'Chargement')
  })

  it('includes screen reader text', () => {
    const { getByText } = render(<LoadingSpinner />)
    const srText = getByText('Chargement...')
    expect(srText).toHaveClass('sr-only')
  })
}) 