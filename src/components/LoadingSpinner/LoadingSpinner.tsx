import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div
      data-testid="loading-spinner"
      className={cn(
        'relative flex items-center justify-center',
        className
      )}
    >
      <div
        className={cn(
          'animate-spin rounded-full border-t-2 border-b-2 border-primary',
          sizeClasses[size]
        )}
      />
      <div
        className={cn(
          'absolute animate-pulse rounded-full border-2 border-primary/30',
          sizeClasses[size]
        )}
      />
      <div
        className={cn(
          'absolute animate-ping rounded-full border border-primary/10',
          sizeClasses[size]
        )}
      />
    </div>
  )
} 