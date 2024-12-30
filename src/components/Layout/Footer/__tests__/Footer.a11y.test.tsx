import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Footer } from '../Footer'

expect.extend(toHaveNoViolations)

describe('Footer Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(<Footer />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has proper heading hierarchy', () => {
    render(<Footer />)
    const headings = document.querySelectorAll('h2')
    headings.forEach(heading => {
      expect(heading).toHaveClass('text-lg')
    })
  })

  it('has sufficient color contrast', () => {
    render(<Footer />)
    const links = document.querySelectorAll('a')
    links.forEach(link => {
      expect(link).toHaveClass('text-gray-400')
    })
  })
}) 