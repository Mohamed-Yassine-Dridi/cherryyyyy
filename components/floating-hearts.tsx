"use client"

import { motion } from "framer-motion"
import { usePageLoad } from "@/components/page-load-provider"

export function FloatingHearts() {
  const { isPageLoadOrReload } = usePageLoad()

  // Only render if it's a page load or reload
  if (!isPageLoadOrReload) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 1, 0.8],
        y: [0, -50, 50, -100, 0],
      }}
      transition={{
        duration: 4,
        times: [0, 0.2, 0.5, 0.8, 1],
        ease: "easeInOut",
      }}
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
    >
      <div className="relative">
        {/* Main central heart with pulse animation */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1, 1.05, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: 2,
            ease: "easeInOut",
          }}
          className="relative"
        >
          <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-2xl">
            <defs>
              <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="50%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M60,100 C60,100 20,70 20,50 C20,35 30,25 40,25 C50,25 55,30 60,40 C65,30 70,25 80,25 C90,25 100,35 100,50 C100,70 60,100 60,100 Z"
              fill="url(#heartGradient)"
              filter="url(#glow)"
            />
          </svg>

          {/* Inner highlight */}
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: 2,
              ease: "easeInOut",
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <svg width="80" height="80" viewBox="0 0 80 80" className="opacity-60">
              <path
                d="M40,65 C40,65 15,45 15,30 C15,20 22,15 28,15 C34,15 37,18 40,25 C43,18 46,15 52,15 C58,15 65,20 65,30 C65,45 40,65 40,65 Z"
                fill="rgba(255, 255, 255, 0.4)"
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Floating smaller hearts around the main heart */}
        {[
          { angle: 0, delay: 0, distance: 80, size: 40 },
          { angle: 60, delay: 0.2, distance: 90, size: 35 },
          { angle: 120, delay: 0.4, distance: 85, size: 38 },
          { angle: 180, delay: 0.6, distance: 95, size: 36 },
          { angle: 240, delay: 0.8, distance: 88, size: 37 },
          { angle: 300, delay: 1, distance: 92, size: 39 },
        ].map((heart, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0],
              x: Math.cos((heart.angle * Math.PI) / 180) * heart.distance,
              y: Math.sin((heart.angle * Math.PI) / 180) * heart.distance,
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              delay: heart.delay,
              ease: "easeOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <svg width={heart.size} height={heart.size} viewBox="0 0 40 40" className="drop-shadow-lg opacity-80">
              <path
                d="M20,35 C20,35 5,22 5,13 C5,8 8,5 11,5 C14,5 16,7 20,12 C24,7 26,5 29,5 C32,5 35,8 35,13 C35,22 20,35 20,35 Z"
                fill="#fb7185"
              />
            </svg>
          </motion.div>
        ))}

        {/* Romantic sparkles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              x: Math.cos((i * Math.PI) / 6) * (70 + Math.random() * 40),
              y: Math.sin((i * Math.PI) / 6) * (70 + Math.random() * 40),
            }}
            transition={{
              duration: 1.2,
              delay: i * 0.15,
              ease: "easeOut",
            }}
            className="absolute top-1/2 left-1/2 w-3 h-3 bg-rose-300 rounded-full"
            style={{
              boxShadow: "0 0 10px rgba(251, 113, 133, 0.8)",
            }}
          />
        ))}

        {/* Love text that appears */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -20] }}
          transition={{ duration: 3, delay: 1, ease: "easeOut" }}
          className="absolute top-full mt-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          <span className="font-serif text-4xl text-rose-300 drop-shadow-lg">Ichrak & Yassine</span>
        </motion.div>
      </div>
    </motion.div>
  )
}