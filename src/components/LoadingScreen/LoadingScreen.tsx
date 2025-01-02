'use client'

import { motion } from 'framer-motion'

// Props du composant LoadingScreen
interface LoadingScreenProps {
  fullScreen?: boolean  // Détermine si l'écran de chargement doit être en plein écran
}

export const LoadingScreen = ({ fullScreen = true }: LoadingScreenProps) => {
  return (
    <div className={`${fullScreen ? 'fixed inset-0' : 'w-full h-full min-h-[400px]'} bg-black flex flex-col items-center justify-center gap-8`}>
      {/* Animation de la bobine de film */}
      <div className="loader" />

      {/* Logo CinéScope avec animation de fondu et effet de dégradé */}
      <motion.div
        className="text-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <motion.span 
          className="inline-block text-xl font-bold bg-gradient-to-r from-cyan-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          CinéScope
        </motion.span>
      </motion.div>

      {/* Styles CSS pour l'animation de la bobine */}
      <style jsx>{`
        /* Conteneur principal de la bobine */
        .loader {
          width: 120px;
          height: 80px;
          position: relative;
          transform: rotate(0deg);
          background: linear-gradient(174deg, transparent 49%, #0ff 50%, transparent 51%);
        }

        /* Création des roues de la bobine */
        .loader:after,
        .loader:before {
          content: "";
          border-radius: 100%;
          width: 35px;
          height: 35px;
          display: block;
          position: absolute;
          border: 4px dashed #0ff;
          bottom: 49px;
          transform: rotate(0deg);
          box-sizing: border-box;
          animation: tape 4s linear infinite;
        }

        /* Roue droite avec effets lumineux */
        .loader:before {
          right: -14px;
          box-shadow: 
            0 0 0 4px #0ff,
            0 0 0 34px rgb(6 182 212),      /* Effet cyan */
            0 0 5px 34px rgba(168, 85, 247, 0.4), /* Effet violet */
            0 0 15px 34px rgba(217, 70, 239, 0.2); /* Effet fuchsia */
        }

        /* Roue gauche avec effets lumineux */
        .loader:after {
          left: -13px;
          box-shadow: 
            0 0 0 4px #0ff,
            0 0 0 65px rgb(6 182 212),      /* Effet cyan */
            0 0 5px 65px rgba(168, 85, 247, 0.4), /* Effet violet */
            0 0 15px 65px rgba(217, 70, 239, 0.2); /* Effet fuchsia */
        }

        /* Animation de rotation des roues */
        @keyframes tape {
          0% { transform: rotate(0deg) scale(0.4) }
          100% { transform: rotate(-360deg) scale(0.4) }
        }
      `}</style>
    </div>
  )
} 