import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg bg-gray-800 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-white">
            Oups ! Quelque chose s'est mal passé
          </h2>
          <p className="mb-6 text-gray-300">
            Une erreur est survenue lors du chargement de ce contenu.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-yellow-500 px-6 py-2 font-medium text-black transition-colors hover:bg-yellow-400"
          >
            Rafraîchir la page
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="mt-4 max-w-full overflow-auto rounded bg-red-900/20 p-4 text-left text-sm text-red-200">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
} 