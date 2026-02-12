"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface VolumeVisibilityContextType {
  isVolumeVisible: boolean
  toggleVolumeVisibility: () => void
}

const VolumeVisibilityContext = createContext<VolumeVisibilityContextType | null>(null)

export function VolumeVisibilityProvider({ children }: { children: ReactNode }) {
  const [isVolumeVisible, setIsVolumeVisible] = useState(true)

  const toggleVolumeVisibility = () => {
    setIsVolumeVisible((prev) => !prev)
  }

  return (
    <VolumeVisibilityContext.Provider value={{ isVolumeVisible, toggleVolumeVisibility }}>
      {children}
    </VolumeVisibilityContext.Provider>
  )
}

export function useVolumeVisibility() {
  const context = useContext(VolumeVisibilityContext)
  if (!context) {
    throw new Error("useVolumeVisibility must be used within VolumeVisibilityProvider")
  }
  return context
}
