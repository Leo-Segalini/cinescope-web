import { render, screen } from '@testing-library/react'
import { Footer } from '../Footer'

describe('Footer', () => {
  it('renders all sections correctly', () => {
    render(<Footer />)
    
    // Vérification des titres de section
    expect(screen.getByText('À propos')).toBeInTheDocument()
    expect(screen.getByText('Navigation')).toBeInTheDocument()
    expect(screen.getByText('Légal')).toBeInTheDocument()
  })

  it('displays current year in copyright notice', () => {
    const currentYear = new Date().getFullYear()
    render(<Footer />)
    
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument()
  })

  it('includes all navigation links', () => {
    render(<Footer />)
    
    const links = ['Films', 'Séries TV', 'Recherche']
    links.forEach(link => {
      expect(screen.getByText(link)).toBeInTheDocument()
    })
  })

  it('includes legal links', () => {
    render(<Footer />)
    
    expect(screen.getByText('Politique de confidentialité')).toBeInTheDocument()
    expect(screen.getByText('Conditions d\'utilisation')).toBeInTheDocument()
  })

  it('includes TMDB attribution', () => {
    render(<Footer />)
    
    expect(
      screen.getByText(/Ce produit utilise l'API TMDB/i)
    ).toBeInTheDocument()
  })
}) 