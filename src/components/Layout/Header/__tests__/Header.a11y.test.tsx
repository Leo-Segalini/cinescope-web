import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Header } from '../Header'

expect.extend(toHaveNoViolations)

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe('Header Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(<Header />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has correct ARIA labels for interactive elements', () => {
    render(<Header />)
    
    // Vérification du bouton burger
    expect(screen.getByLabelText('Ouvrir le menu')).toHaveAttribute('aria-label')
    
    // Vérification de la barre de recherche
    expect(screen.getByRole('searchbox')).toHaveAttribute('aria-label')
  })

  it('maintains focus order when menu is opened', () => {
    render(<Header />)
    
    const burgerButton = screen.getByLabelText('Ouvrir le menu')
    burgerButton.focus()
    expect(document.activeElement).toBe(burgerButton)
    
    // Ouverture du menu
    burgerButton.click()
    
    // Le premier lien du menu devrait être focusable
    const firstMenuItem = screen.getAllByText('Films')[1]
    firstMenuItem.focus()
    expect(document.activeElement).toBe(firstMenuItem)
  })
}) 