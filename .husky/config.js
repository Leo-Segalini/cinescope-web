const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  skipCI: true,
  skipInstall: isProduction
} 