import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { FilterComponent } from '../FilterComponent'

const mockOptions = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Comédie' },
  { id: 3, name: 'Drame' },
]

describe('FilterComponent Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(
      <FilterComponent
        title="Genres"
        options={mockOptions}
        selectedValues={[]}
        onChange={() => {}}
      />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has correct ARIA attributes when closed', () => {
    render(
      <FilterComponent
        title="Genres"
        options={mockOptions}
        selectedValues={[]}
        onChange={() => {}}
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-controls', 'filter-options')
  })

  it('supports keyboard navigation', () => {
    render(
      <FilterComponent
        title="Genres"
        options={mockOptions}
        selectedValues={[]}
        onChange={() => {}}
      />
    )

    const button = screen.getByRole('button')
    button.focus()
    fireEvent.keyDown(button, { key: 'Enter' })
    
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes[0]).toBeInTheDocument()
    
    fireEvent.keyDown(checkboxes[0], { key: ' ' })
    expect(checkboxes[0]).toBeChecked()
  })

  it('maintains focus management', () => {
    render(
      <FilterComponent
        title="Genres"
        options={mockOptions}
        selectedValues={[]}
        onChange={() => {}}
      />
    )

    const button = screen.getByRole('button')
    button.focus()
    expect(document.activeElement).toBe(button)
    
    fireEvent.click(button)
    const firstOption = screen.getAllByRole('checkbox')[0]
    firstOption.focus()
    expect(document.activeElement).toBe(firstOption)
  })
}) 