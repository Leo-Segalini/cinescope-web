import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from '../Header'

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe('Header', () => {
  it('renders logo and navigation links', () => {
    render(<Header />)
    
    expect(screen.getByText('TMDB App')).toBeInTheDocument()
    expect(screen.getByText('Films')).toBeInTheDocument()
    expect(screen.getByText('Séries')).toBeInTheDocument()
    expect(screen.getByText('Recherche')).toBeInTheDocument()
  })

  it('toggles mobile menu when burger button is clicked', () => {
    render(<Header />)
    
    const burgerButton = screen.getByLabelText('Ouvrir le menu')
    fireEvent.click(burgerButton)
    
    // Le menu mobile devrait être visible
    expect(screen.getAllByText('Films')).toHaveLength(2) // Desktop + Mobile
    
    // Fermeture du menu
    const closeButton = screen.getByLabelText('Fermer le menu')
    fireEvent.click(closeButton)
    
    // Le menu mobile ne devrait plus être visible
    expect(screen.getAllByText('Films')).toHaveLength(1) // Desktop seulement
  })

  it('includes search functionality', () => {
    render(<Header />)
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('closes mobile menu when a link is clicked', () => {
    render(<Header />)
    
    // Ouverture du menu
    const burgerButton = screen.getByLabelText('Ouvrir le menu')
    fireEvent.click(burgerButton)
    
    // Click sur un lien
    const mobileLinks = screen.getAllByText('Films')
    fireEvent.click(mobileLinks[1]) // Click sur le lien mobile
    
    // Le menu devrait être fermé
    expect(screen.getAllByText('Films')).toHaveLength(1)
  })
}) 