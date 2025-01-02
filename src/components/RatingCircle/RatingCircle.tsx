'use client'

import { motion } from 'framer-motion'

// Props du composant RatingCircle
interface RatingCircleProps {
  rating: number           // Note sur 10
  size?: 'sm' | 'md' | 'lg' // Taille du cercle (petit, moyen, grand)
}

export function RatingCircle({ rating, size = 'md' }: RatingCircleProps) {
  // Conversion de la note sur 100
  const percentage = Math.round(rating * 10)

  // Configuration des tailles de cercle
  const radius = {
    sm: 20,  // Petit cercle
    md: 35,  // Cercle moyen
    lg: 45   // Grand cercle
  }

  // Configuration des épaisseurs de trait
  const strokeWidth = {
    sm: 4,   // Trait fin
    md: 6,   // Trait moyen
    lg: 8    // Trait épais
  }

  // Sélection des dimensions en fonction de la taille
  const currentRadius = radius[size]
  const currentStrokeWidth = strokeWidth[size]
  const circumference = 2 * Math.PI * currentRadius

  // Détermination de la couleur en fonction du pourcentage
  const getColor = (percent: number) => {
    if (percent >= 70) return '#22c55e' // vert pour les bonnes notes
    if (percent >= 50) return '#eab308' // jaune pour les notes moyennes
    return '#ef4444' // rouge pour les mauvaises notes
  }

  // Classes CSS pour les différentes tailles
  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',   // Petit
    md: 'w-24 h-24 text-lg',   // Moyen
    lg: 'w-32 h-32 text-2xl'   // Grand
  }

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      {/* Cercle de fond statique */}
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={currentRadius}
          strokeWidth={currentStrokeWidth}
          stroke="rgba(255, 255, 255, 0.1)"
          fill="none"
          className="transform translate-x-[2px] translate-y-[2px]"
        />
        {/* Cercle de progression avec animation */}
        <motion.circle
          cx="50%"
          cy="50%"
          r={currentRadius}
          strokeWidth={currentStrokeWidth}
          stroke={getColor(percentage)}
          fill="none"
          strokeLinecap="round"
          className="transform translate-x-[2px] translate-y-[2px]"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: circumference - (percentage / 100) * circumference
          }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      {/* Affichage du pourcentage au centre */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="font-bold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {percentage}%
        </motion.span>
      </div>
    </div>
  )
} 