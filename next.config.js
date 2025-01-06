/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
  },
  // Optimisations pour améliorer le TTFB
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
    serverMinification: true,
  },
  // Compression des réponses
  compress: true,
  // Cache des pages statiques
  staticPageGenerationTimeout: 120,
  // Configuration du cache pour les images
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
  webpack: (config, { isServer }) => {
    // Supprime l'avertissement punycode
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        punycode: false
      }
    }
    return config
  }
}

module.exports = nextConfig 