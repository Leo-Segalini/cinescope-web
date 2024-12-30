import { render, screen, fireEvent } from '@testing-library/react'
import { FilterComponent } from '../FilterComponent'

const mockOptions = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Comédie' },
  { id: 3, name: 'Drame' },
]

describe('FilterComponent', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with title and initially closed', () => {
    render(
      <FilterComponent
        title="Genres"
        options={mockOptions}
        selectedValues={[]}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByText('Genres')).toBeInTheDocument()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('opens options when clicked', () => {
    render(
      <FilterComponent
        title="Genres"
        options={mockOptions}
        selectedValues={[]}
        onChange={mockOnChange}
      />
    )

    fireEvent.click(screen.getByText('Genres'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    mockOptions.forEach(option => {
      expect(screen.getByLabelText(option.name)).toBeInTheDocument()
    })
  })

  it('handles option selection correctly', () => {
    render(
      <FilterComponent
        title="Genres"
        options={mockOptions}
        selectedValues={[]}
        onChange={mockOnChange}
      />
    )

    fireEvent.click(screen.getByText('Genres'))
    fireEvent.click(screen.getByLabelText('Action'))

    expect(mockOnChange).toHaveBeenCalledWith([1])
  })

  it('handles option deselection correctly', () => {
    render(
      <FilterComponent
        title="Genres"
        options={mockOptions}
        selectedValues={[1]}
        onChange={mockOnChange}
      />
    )

    fireEvent.click(screen.getByText('Genres'))
    fireEvent.click(screen.getByLabelText('Action'))

    expect(mockOnChange).toHaveBeenCalledWith([])
  })

  it('reflects selected values correctly', () => {
    render(
      <FilterComponent
        title="Genres"
        options={mockOptions}
        selectedValues={[1, 2]}
        onChange={mockOnChange}
      />
    )

    fireEvent.click(screen.getByText('Genres'))
    
    expect(screen.getByLabelText('Action')).toBeChecked()
    expect(screen.getByLabelText('Comédie')).toBeChecked()
    expect(screen.getByLabelText('Drame')).not.toBeChecked()
  })
}) 