import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Navigation } from "@/components/navigation"
import { AudioProvider } from "@/components/audio-context"
import { PageLoadProvider } from "@/components/page-load-provider"
import { VolumeVisibilityProvider } from "@/components/volume-visibility-context"
import { SoundModal } from "@/components/sound-modal"
import { FloatingHearts } from "@/components/floating-hearts"
import { AnimatePresence } from "framer-motion"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _playfair = Playfair_Display({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cherry & Disdis",
  description: "A magical journey of love between Cherry and Disdis",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/website-icon.jpg",
      },
    ],
    apple: "/website-icon.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <PageLoadProvider>
          <VolumeVisibilityProvider>
            <AudioProvider>
              <SoundModal />
              <FloatingHearts />
              <Navigation />
              <main className="pt-[73px]">{children}</main>
            </AudioProvider>
          </VolumeVisibilityProvider>
          <Analytics />
        </PageLoadProvider>
      </body>
    </html>
  )
}
