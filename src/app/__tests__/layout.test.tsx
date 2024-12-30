import { render, screen } from '@testing-library/react'
import RootLayout from '../layout'

// Mock des composants Header et Footer
jest.mock('@/components/Layout/Header/Header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>,
}))

jest.mock('@/components/Layout/Footer/Footer', () => ({
  Footer: () => <div data-testid="mock-footer">Footer</div>,
}))

describe('RootLayout', () => {
  it('renders header, main content, and footer', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )

    expect(screen.getByTestId('mock-header')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument()
  })

  it('uses correct language attribute', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )

    expect(document.documentElement).toHaveAttribute('lang', 'fr')
  })

  it('applies Inter font class to body', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )

    // La classe exacte dépend de l'implémentation de next/font
    expect(document.body).toHaveClass(expect.stringContaining('inter'))
  })

  it('maintains correct layout structure', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )

    const mainContent = screen.getByRole('main')
    expect(mainContent).toHaveClass('flex-1')
    expect(mainContent.parentElement).toHaveClass('flex', 'min-h-screen', 'flex-col')
  })
}) 