import { useState } from 'react'

export const useApiError = () => {
  const [error, setError] = useState<Error | null>(null)

  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      setError(error)
    } else {
      setError(new Error('An unknown error occurred'))
    }
  }

  const clearError = () => setError(null)

  return { error, handleError, clearError }
} 