import { SearchCache } from '../searchCache'

describe('SearchCache', () => {
  let cache: SearchCache<any>

  beforeEach(() => {
    cache = new SearchCache(2, 0.1) // maxSize: 2, ttl: 6 secondes
  })

  it('should store and retrieve data correctly', () => {
    const testData = { results: ['test'] }
    cache.set('test', 1, testData)
    expect(cache.get('test', 1)).toEqual(testData)
  })

  it('should return null for non-existent entries', () => {
    expect(cache.get('nonexistent', 1)).toBeNull()
  })

  it('should respect maxSize and remove oldest entries', () => {
    cache.set('query1', 1, 'data1')
    cache.set('query2', 1, 'data2')
    cache.set('query3', 1, 'data3')

    expect(cache.get('query1', 1)).toBeNull()
    expect(cache.get('query2', 1)).toBe('data2')
    expect(cache.get('query3', 1)).toBe('data3')
  })

  it('should respect TTL and expire old entries', async () => {
    cache.set('test', 1, 'data')
    expect(cache.get('test', 1)).toBe('data')

    // Attendre que l'entrée expire (TTL = 6 secondes)
    await new Promise(resolve => setTimeout(resolve, 7000))
    expect(cache.get('test', 1)).toBeNull()
  })

  it('should update LRU order when accessing entries', () => {
    cache.set('query1', 1, 'data1')
    cache.set('query2', 1, 'data2')

    // Accéder à query1 pour le rendre plus récent
    cache.get('query1', 1)

    // Ajouter une nouvelle entrée
    cache.set('query3', 1, 'data3')

    // query2 devrait être supprimé car c'est le moins récemment utilisé
    expect(cache.get('query2', 1)).toBeNull()
    expect(cache.get('query1', 1)).toBe('data1')
    expect(cache.get('query3', 1)).toBe('data3')
  })

  it('should clear all entries', () => {
    cache.set('query1', 1, 'data1')
    cache.set('query2', 1, 'data2')

    cache.clear()

    expect(cache.get('query1', 1)).toBeNull()
    expect(cache.get('query2', 1)).toBeNull()
  })
}) 