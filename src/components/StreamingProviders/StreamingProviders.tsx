'use client'

import Image from 'next/image'
import { Provider } from '@/types/tmdb'

export interface StreamingProvidersProps {
  providers: Provider[]
  title: string
}

export function StreamingProviders({ providers, title }: StreamingProvidersProps) {
  if (providers.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="flex flex-wrap gap-4">
        {providers.map((provider) => (
          <div
            key={provider.provider_id}
            className="relative w-12 h-12 rounded-lg overflow-hidden"
          >
            <Image
              src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
              alt={provider.provider_name}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
} 