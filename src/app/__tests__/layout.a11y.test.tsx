import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import RootLayout from '../layout'

expect.extend(toHaveNoViolations)

// Mock des composants Header et Footer
jest.mock('@/components/Layout/Header/Header', () => ({
  Header: () => (
    <header>
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
        </ul>
      </nav>
    </header>
  ),
}))

jest.mock('@/components/Layout/Footer/Footer', () => ({
  Footer: () => (
    <footer>
      <p>Footer content</p>
    </footer>
  ),
}))

describe('RootLayout Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has correct document structure', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )

    expect(document.querySelector('header')).toBeInTheDocument()
    expect(document.querySelector('main')).toBeInTheDocument()
    expect(document.querySelector('footer')).toBeInTheDocument()
  })

  it('has correct language attribute for screen readers', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )

    expect(document.documentElement).toHaveAttribute('lang', 'fr')
  })

  it('preserves content order for screen readers', () => {
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )

    const header = container.querySelector('header')
    const main = container.querySelector('main')
    const footer = container.querySelector('footer')

    // Vérifie que l'ordre des éléments est correct dans le DOM
    expect(header?.compareDocumentPosition(main!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    expect(main?.compareDocumentPosition(footer!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })
}) 