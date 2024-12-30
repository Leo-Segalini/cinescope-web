import { tmdbClient } from '../client'

describe('TMDB API Integration Tests', () => {
  // Augmenter le timeout pour les tests d'intégration
  jest.setTimeout(10000)

  it('should fetch popular movies with valid data structure', async () => {
    const response = await tmdbClient.getPopularMovies()
    
    expect(response).toEqual(
      expect.objectContaining({
        page: expect.any(Number),
        results: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            overview: expect.any(String),
            release_date: expect.any(String),
          }),
        ]),
        total_pages: expect.any(Number),
        total_results: expect.any(Number),
      })
    )
  })

  it('should fetch movie details with complete information', async () => {
    // On utilise un ID de film connu
    const movieId = 550 // Fight Club
    const movie = await tmdbClient.getMovieDetails(movieId)

    expect(movie).toEqual(
      expect.objectContaining({
        id: movieId,
        title: expect.any(String),
        overview: expect.any(String),
        genres: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          }),
        ]),
      })
    )
  })

  it('should handle search with valid results', async () => {
    const searchResults = await tmdbClient.searchMulti('Matrix')
    
    expect(searchResults.results.length).toBeGreaterThan(0)
    expect(searchResults.results[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
      })
    )
  })

  describe('Search Cache Integration', () => {
    beforeEach(() => {
      tmdbClient.clearSearchCache()
    })

    it('should cache search results and return them on subsequent calls', async () => {
      // Premier appel - devrait faire un appel API
      const firstCallStart = Date.now()
      const firstResults = await tmdbClient.searchMulti('Matrix')
      const firstCallDuration = Date.now() - firstCallStart

      // Deuxième appel - devrait utiliser le cache
      const secondCallStart = Date.now()
      const secondResults = await tmdbClient.searchMulti('Matrix')
      const secondCallDuration = Date.now() - secondCallStart

      // Le deuxième appel devrait être significativement plus rapide
      expect(secondCallDuration).toBeLessThan(firstCallDuration)
      // Les résultats devraient être identiques
      expect(secondResults).toEqual(firstResults)
    })

    it('should make new API call for different pages of same query', async () => {
      const page1Results = await tmdbClient.searchMulti('Star Wars', 1)
      const page2Results = await tmdbClient.searchMulti('Star Wars', 2)

      expect(page1Results.page).toBe(1)
      expect(page2Results.page).toBe(2)
      expect(page1Results.results).not.toEqual(page2Results.results)
    })

    it('should make new API call for different search queries', async () => {
      const query1Results = await tmdbClient.searchMulti('Matrix')
      const query2Results = await tmdbClient.searchMulti('Star Wars')

      expect(query1Results.results).not.toEqual(query2Results.results)
    })

    it('should handle empty search results correctly', async () => {
      const results = await tmdbClient.searchMulti('xxxxxxxxxxxxxxxxxxx')
      expect(results.results).toHaveLength(0)
      expect(results.total_results).toBe(0)

      // Vérifier que les résultats vides sont aussi mis en cache
      const cachedResults = await tmdbClient.searchMulti('xxxxxxxxxxxxxxxxxxx')
      expect(cachedResults.results).toHaveLength(0)
      expect(cachedResults.total_results).toBe(0)
    })
  })
}) 