export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* À propos */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">À propos</h2>
            <p className="text-gray-400">
              Cette application utilise l&apos;API TMDB pour fournir des informations sur les films et
              séries TV. Toutes les données sont fournies par The Movie Database.
            </p>
          </div>

          {/* Navigation rapide */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">Navigation</h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="/movies"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Films
                </a>
              </li>
              <li>
                <a href="/tv" className="text-gray-400 transition-colors hover:text-white">
                  Séries TV
                </a>
              </li>
              <li>
                <a
                  href="/search"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Recherche
                </a>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">Légal</h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="/privacy"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Conditions d&apos;utilisation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {currentYear} TMDB App. Tous droits réservés.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Ce produit utilise l&apos;API TMDB mais n&apos;est pas approuvé ou certifié par TMDB.
          </p>
        </div>
      </div>
    </footer>
  )
} 