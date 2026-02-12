"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2, VolumeX, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/components/audio-context"
import { usePageLoad } from "@/components/page-load-provider"
import { useVolumeVisibility } from "@/components/volume-visibility-context"

export function SoundModal() {
  const { isPageLoadOrReload } = usePageLoad()
  const { isVolumeVisible, toggleVolumeVisibility } = useVolumeVisibility()
  const [showModal, setShowModal] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { isPlaying, volume: contextVolume, play, pause, setVolume } = useAudio()
  const [volume, setVolumeLocal] = useState(0.3)

  useEffect(() => {
    // Sync local volume with context volume, ensuring it's never undefined
    if (contextVolume !== undefined && contextVolume !== null) {
      setVolumeLocal(contextVolume)
    }
  }, [contextVolume])

  useEffect(() => {
    setMounted(true)

    // Show modal on every page load/reload
    if (isPageLoadOrReload) {
      const timer = setTimeout(() => {
        setShowModal(true)
      }, 2500)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPageLoadOrReload])

  const handleChoice = (choice: boolean) => {
    setSoundEnabled(choice)
    setShowModal(false)
    
    // Handle audio playback
    if (choice) {
      play()
    } else {
      pause()
    }
  }

  const toggleSound = () => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    if (!isNaN(newVolume)) {
      setVolumeLocal(newVolume)
      setVolume(newVolume)
    }
  }

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-slate-800 via-burgundy-dark to-slate-900 border-2 border-[rgb(153,102,204)]/50 rounded-lg p-8 max-w-md mx-4 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[rgb(153,102,204)]/10 to-transparent" />

              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4 gap-3">
                  <Image
                    src="/musical-notes.png"
                    alt="Music notes"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  <Image
                    src="/musical-notes.png"
                    alt="Music notes"
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                  <Image
                    src="/musical-notes.png"
                    alt="Music notes"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </div>

                <h2 className="font-serif text-3xl text-[rgb(153,102,204)] text-center mb-4 text-balance">
                  Enhance Your Experience
                </h2>

                <p className="text-cream/80 text-center mb-6 text-pretty">
                  Would you like to continue with sound or without? We recommend with sound for the best magical
                  experience!
                </p>

                <div className="flex flex-col gap-3 mb-4">
                  <Button
                    onClick={() => handleChoice(true)}
                    className="bg-gradient-to-r from-[rgb(153,102,204)] to-[rgb(120,75,160)] hover:from-[rgb(140,90,115)] hover:to-[rgb(100,60,140)] text-white font-semibold py-6 text-lg"
                  >
                    <Volume2 className="w-5 h-5 mr-2" />
                    With Sound
                  </Button>

                  <Button
                    onClick={() => handleChoice(false)}
                    variant="outline"
                    className="border-[rgb(153,102,204)]/50 text-[rgb(153,102,204)] hover:bg-[rgb(153,102,204)]/20 py-6 text-lg"
                  >
                    <VolumeX className="w-5 h-5 mr-2" />
                    Without Sound
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showModal && mounted && isVolumeVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-40 bg-slate-800/90 backdrop-blur-sm border border-[rgb(153,102,204)]/30 rounded-lg p-4 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSound}
              className="p-2 rounded-full bg-[rgb(153,102,204)] hover:bg-[rgb(140,90,115)] transition-colors"
            >
              {isPlaying ? <Volume2 className="w-5 h-5 text-white" /> : <VolumeX className="w-5 h-5 text-white" />}
            </button>

            <div className="flex items-center gap-2">
              <VolumeX className="w-4 h-4 text-cream/60" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume || 0.3}
                onChange={handleVolumeChange}
                className="w-24 accent-[rgb(153,102,204)]"
              />
              <Volume2 className="w-4 h-4 text-cream/60" />
            </div>

            <button
              onClick={toggleVolumeVisibility}
              className="p-2 rounded-full bg-[rgb(153,102,204)]/50 hover:bg-[rgb(153,102,204)] transition-colors ml-2"
              title="Hide/Show volume controls"
            >
              {isVolumeVisible ? <EyeOff className="w-4 h-4 text-white" /> : <Eye className="w-4 h-4 text-white" />}
            </button>
          </div>
        </motion.div>
      )}

      {!showModal && mounted && !isVolumeVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <button
            onClick={toggleVolumeVisibility}
            className="p-2 rounded-full bg-[rgb(153,102,204)] hover:bg-[rgb(140,90,115)] transition-colors"
            title="Show volume controls"
          >
            <Eye className="w-5 h-5 text-white" />
          </button>
        </motion.div>
      )}
    </>
  )
}
