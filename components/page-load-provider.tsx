"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface PageLoadContextType {
  isPageLoadOrReload: boolean
  shouldShowContent: boolean
}

const PageLoadContext = createContext<PageLoadContextType>({ isPageLoadOrReload: false, shouldShowContent: true })

export function PageLoadProvider({ children }: { children: React.ReactNode }) {
  const [isPageLoadOrReload, setIsPageLoadOrReload] = useState(false)
  const [shouldShowContent, setShouldShowContent] = useState(false)

  useEffect(() => {
    // Get the current page load count to detect actual reloads
    const currentLoadId = sessionStorage.getItem("pageLoadId")
    const newLoadId = Date.now().toString()

    // If there's no currentLoadId or it's different from the timestamp, it's a new load/reload
    if (currentLoadId !== newLoadId) {
      setIsPageLoadOrReload(true)
      setShouldShowContent(false)
      sessionStorage.setItem("pageLoadId", newLoadId)

      // After 3.5 seconds, show the content (modal + hearts finish around 4 seconds)
      const contentTimer = setTimeout(() => {
        setShouldShowContent(true)
      }, 3500)

      // After 5 seconds, turn off the page load flag
      const pageLoadTimer = setTimeout(() => {
        setIsPageLoadOrReload(false)
      }, 5000)

      return () => {
        clearTimeout(contentTimer)
        clearTimeout(pageLoadTimer)
      }
    } else {
      setIsPageLoadOrReload(false)
      setShouldShowContent(true)
    }
  }, [])

  return (
    <PageLoadContext.Provider value={{ isPageLoadOrReload, shouldShowContent }}>
      {children}
    </PageLoadContext.Provider>
  )
}

export function usePageLoad() {
  return useContext(PageLoadContext)
}
