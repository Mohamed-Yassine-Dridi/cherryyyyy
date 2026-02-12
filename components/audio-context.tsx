"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface AudioContextType {
  isPlaying: boolean
  volume: number
  play: () => void
  pause: () => void
  setVolume: (volume: number) => void
}

const AudioContext = createContext<AudioContextType | null>(null)

let globalAudio: HTMLAudioElement | null = null
let audioInitialized = false

function getGlobalAudio(): HTMLAudioElement {
  if (!globalAudio && typeof window !== "undefined") {
    globalAudio = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/There%20Is%20a%20Light%20That%20Never%20Goes%20Out%20%282011%20Remaster%29%20%5B3r-qDvD3F3c%5D-xth7rMqOQ2tYNSNzdwql5XdKnGgAa3.mp3")
    globalAudio.loop = true
    globalAudio.volume = 1
    globalAudio.preload = "auto"
    audioInitialized = true
  }
  return globalAudio!
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.3)

  useEffect(() => {
    const audio = getGlobalAudio()

    const handlePlay = () => {
      setIsPlaying(true)
    }
    const handlePause = () => {
      setIsPlaying(false)
    }

    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)

    setIsPlaying(!audio.paused)
    setVolumeState(audio.volume)

    // Audio will only play when user explicitly clicks "With Sound" in the modal

    return () => {
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
    }
  }, [])

  const play = () => {
    const audio = getGlobalAudio()
    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise
        .catch((error) => {
          // Silently catch autoplay policy errors
          if (error.name === "NotAllowedError") {
            // This is expected on autoplay without user interaction
            // The audio will play once user interacts with the page
          } else {
            console.error("Audio play error:", error)
          }
        })
    }
  }

  const pause = () => {
    const audio = getGlobalAudio()
    audio.pause()
  }

  const setVolume = (vol: number) => {
    const audio = getGlobalAudio()
    // Ensure volume is a valid number between 0 and 1
    const validVolume = Math.max(0, Math.min(1, vol))
    audio.volume = validVolume
    setVolumeState(validVolume)
  }

  return <AudioContext.Provider value={{ isPlaying, volume, play, pause, setVolume }}>{children}</AudioContext.Provider>
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error("useAudio must be used within AudioProvider")
  }
  return context
}
