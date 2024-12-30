import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from '../ErrorBoundary'

const ErrorComponent = () => {
  throw new Error('Test error')
}

const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

describe('ErrorBoundary', () => {
  beforeAll(() => {
    mockConsoleError.mockImplementation(() => {})
  })

  afterAll(() => {
    mockConsoleError.mockRestore()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders error UI when an error occurs', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Oups ! Quelque chose s\'est mal passé')).toBeInTheDocument()
    expect(screen.getByText('Rafraîchir la page')).toBeInTheDocument()
  })

  it('renders custom fallback when provided', () => {
    const fallback = <div>Custom error message</div>
    render(
      <ErrorBoundary fallback={fallback}>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom error message')).toBeInTheDocument()
  })

  it('calls onError prop when an error occurs', () => {
    const mockOnError = jest.fn()
    render(
      <ErrorBoundary onError={mockOnError}>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(mockOnError).toHaveBeenCalled()
  })
}) 