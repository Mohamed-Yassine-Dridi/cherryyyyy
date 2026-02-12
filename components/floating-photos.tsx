"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

const photoPositions = [
  { top: "10%", left: "5%", rotation: -8 },
  { top: "15%", right: "8%", rotation: 5 },
  { top: "35%", left: "3%", rotation: 12 },
  { top: "45%", right: "5%", rotation: -6 },
  { top: "65%", left: "7%", rotation: 8 },
  { top: "70%", right: "10%", rotation: -10 },
  { top: "25%", left: "50%", rotation: 3 },
  { top: "55%", left: "48%", rotation: -5 },
  { top: "80%", left: "45%", rotation: 7 },
  { top: "5%", left: "35%", rotation: -4 },
]

export function FloatingPhotos() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {photoPositions.map((position, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{
            opacity: 0.3,
            scale: 1,
            rotate: position.rotation,
            y: [0, -20, 0],
          }}
          transition={{
            opacity: { delay: 4 + index * 0.1, duration: 0.5 },
            scale: { delay: 4 + index * 0.1, duration: 0.5 },
            rotate: { delay: 4 + index * 0.1, duration: 0.5 },
            y: { duration: 4 + index * 0.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          style={{
            position: "absolute",
            ...position,
          }}
          className="group"
        >
          <div className="relative">
            {/* Vintage wooden frame */}
            <div
              className="absolute -inset-4 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 rounded-sm shadow-2xl"
              style={{
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.4)",
              }}
            >
              <div className="absolute inset-2 bg-gradient-to-br from-amber-700/50 to-amber-900/50 rounded-sm" />
            </div>

            {/* Photo placeholder */}
            <div className="relative w-32 h-40 md:w-40 md:h-48 bg-sepia rounded-sm overflow-hidden">
              <Image
                src={`/romantic-couple-photo-.jpg?height=240&width=180&query=romantic couple photo ${index + 1}`}
                alt={`Memory ${index + 1}`}
                fill
                className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
