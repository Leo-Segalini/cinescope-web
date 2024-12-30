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
}) 