interface CacheEntry<T> {
  data: T
  timestamp: number
}

export class SearchCache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map()
  private readonly maxSize: number
  private readonly ttl: number // Time To Live en millisecondes

  constructor(maxSize = 100, ttlInMinutes = 5) {
    this.maxSize = maxSize
    this.ttl = ttlInMinutes * 60 * 1000
  }

  private getCacheKey(query: string, page: number): string {
    return `${query}-${page}`
  }

  get(query: string, page: number): T | null {
    const key = this.getCacheKey(query, page)
    const entry = this.cache.get(key)

    if (!entry) return null

    const now = Date.now()
    if (now - entry.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }

    // Mettre à jour le timestamp pour le LRU
    this.cache.delete(key)
    this.cache.set(key, { ...entry, timestamp: now })
    return entry.data
  }

  set(query: string, page: number, data: T): void {
    const key = this.getCacheKey(query, page)

    // Si le cache est plein, supprimer l'entrée la plus ancienne
    if (this.cache.size >= this.maxSize) {
      // Convertir l'itérateur en tableau pour un accès sûr
      const keys = Array.from(this.cache.keys())
      if (keys.length > 0) {
        this.cache.delete(keys[0])
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  clear(): void {
    this.cache.clear()
  }
} 