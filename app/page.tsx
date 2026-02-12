"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import Link from "next/link"
import { FloatingPhotos } from "@/components/floating-photos"
import { MagicalParticles } from "@/components/magical-particles"
import { usePageLoad } from "@/components/page-load-provider"
import Image from "next/image"

function formatTime(value: number, unit: string): string {
  return `${value} ${value === 1 ? unit.slice(0, -1) : unit}`
}

export default function HomePage() {
  const { shouldShowContent } = usePageLoad()
  const [daysTogether, setDaysTogether] = useState({ total: 0, years: 0, months: 0, days: 0 })

  useEffect(() => {
    const startDate = new Date("2024-05-15")
    const today = new Date()

    const totalMs = today.getTime() - startDate.getTime()
    const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24))

    // Calculate years, months, and days properly
    let years = today.getFullYear() - startDate.getFullYear()
    let months = today.getMonth() - startDate.getMonth()
    let days = today.getDate() - startDate.getDate()

    // Adjust if current day is before the start day in the month
    if (days < 0) {
      months--
      // Get the number of days in the previous month
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
      days += prevMonth.getDate()
    }

    // Adjust if current month is before the start month in the year
    if (months < 0) {
      years--
      months += 12
    }

    setDaysTogether({ total: totalDays, years, months, days })
  }, [])

  return (
    <>
      <MagicalParticles />
      <FloatingPhotos />

      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgb(20,15,18)] via-[rgb(114,47,55)] to-[rgb(35,25,30)] opacity-90" />

        {shouldShowContent && (
          <div className="relative z-10 container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0, duration: 1 }}
            className="text-center mb-16"
          >
            <h1 className="font-serif text-6xl md:text-8xl text-[rgb(255,119,130)] mb-4 text-balance">
              Ichrak <span className="text-[rgb(153,102,204)]">&</span> Yassine
            </h1>
            <p className="font-sans text-xl md:text-2xl text-[rgb(209,207,200)] italic">Our Private Love Space</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0, duration: 0.8 }}
            className="max-w-2xl mx-auto mb-16"
          >
            <div className="bg-[rgb(161,113,136)]/10 backdrop-blur-md border-2 border-[rgb(153,102,204)]/30 rounded-lg p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgb(153,102,204)]/20 to-transparent" />
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-[rgb(255,119,130)]" />
                  <h2 className="font-serif text-3xl text-[rgb(153,102,204)]">We've been together for</h2>
                  <Sparkles className="w-6 h-6 text-[rgb(255,119,130)]" />
                </div>

                <div className="text-center">
                  <div className="text-6xl font-bold text-[rgb(153,102,204)] mb-4">{daysTogether.total} days</div>
                  <div className="text-lg text-[rgb(209,207,200)] space-y-1">
                    <p>
                      That's {formatTime(daysTogether.years, "years")}, {formatTime(daysTogether.months, "months")}, {formatTime(daysTogether.days, "days")} !!!
                    </p>
                    <p className="text-sm text-[rgb(209,207,200)]/70 italic">Since May 15, 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0, duration: 0.8 }}
            className="max-w-3xl mx-auto mb-16"
          >
            <div className="relative group">
              {/* Decorative corner elements */}
              <div className="absolute -top-6 -left-6 w-20 h-20 border-t-4 border-l-4 border-[rgb(153,102,204)]/40 rounded-tl-2xl group-hover:border-[rgb(153,102,204)]/60 transition-colors duration-300" />
              <div className="absolute -top-6 -right-6 w-20 h-20 border-t-4 border-r-4 border-[rgb(153,102,204)]/40 rounded-tr-2xl group-hover:border-[rgb(153,102,204)]/60 transition-colors duration-300" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 border-b-4 border-l-4 border-[rgb(153,102,204)]/40 rounded-bl-2xl group-hover:border-[rgb(153,102,204)]/60 transition-colors duration-300" />
              <div className="absolute -bottom-6 -right-6 w-20 h-20 border-b-4 border-r-4 border-[rgb(153,102,204)]/40 rounded-br-2xl group-hover:border-[rgb(153,102,204)]/60 transition-colors duration-300" />

              <div className="relative bg-gradient-to-br from-[rgb(239,224,205)] via-[rgb(245,232,215)] to-[rgb(239,224,205)] backdrop-blur-md border-2 border-[rgb(153,102,204)]/50 rounded-2xl p-12 shadow-2xl overflow-hidden group-hover:shadow-[0_0_40px_rgba(153,102,204,0.2)] transition-all duration-300">
                <div className="absolute inset-0 opacity-30 bg-[url('/vintage-paper-texture.png')] bg-cover mix-blend-multiply" />
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_30px_rgba(153,102,204,0.1)]" />

                {/* Decorative top accent */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-[rgb(153,102,204)] to-[rgb(183,110,121)] rounded-full opacity-20" />

                <div className="relative z-10 text-center">
                  <p className="text-[rgb(114,47,55)] text-2xl md:text-3xl leading-relaxed italic font-serif px-8 text-balance">
                    From the moment I met you, all those years ago, not a day has gone by when I haven't thought of
                    you...
                  </p>

                  <div className="mt-10 flex justify-center">
                    <Image
                      src="/quote-icon.png"
                      alt="Quote"
                      width={56}
                      height={56}
                      className="opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            <Link href="/gallery">
              <div className="group bg-[rgb(183,110,121)]/90 backdrop-blur-sm border border-[rgb(153,102,204)]/30 rounded-lg p-6 hover:bg-[rgb(183,110,121)] transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src="/our-gallery.png"
                    alt="Gallery"
                    width={32}
                    height={32}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <h3 className="font-serif text-xl text-white">Our Gallery</h3>
                </div>
                <p className="text-white/80 text-sm">Treasured moments captured in time</p>
              </div>
            </Link>

            <Link href="/memories">
              <div className="group bg-[rgb(183,110,121)]/90 backdrop-blur-sm border border-[rgb(153,102,204)]/30 rounded-lg p-6 hover:bg-[rgb(183,110,121)] transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src="/memory-jar.png"
                    alt="Memory Jar"
                    width={32}
                    height={32}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <h3 className="font-serif text-xl text-white">Memory Jar</h3>
                </div>
                <p className="text-white/80 text-sm">Special moments we'll never forget</p>
              </div>
            </Link>

            <Link href="/letters">
              <div className="group bg-[rgb(183,110,121)]/90 backdrop-blur-sm border border-[rgb(153,102,204)]/30 rounded-lg p-6 hover:bg-[rgb(183,110,121)] transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src="/love-letters.png"
                    alt="Love Letters"
                    width={32}
                    height={32}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <h3 className="font-serif text-xl text-white">Love Letters</h3>
                </div>
                <p className="text-white/80 text-sm">Messages from the heart</p>
              </div>
            </Link>

            <Link href="/adventures">
              <div className="group bg-[rgb(183,110,121)]/90 backdrop-blur-sm border border-[rgb(153,102,204)]/30 rounded-lg p-6 hover:bg-[rgb(183,110,121)] transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src="/our-adventures.png"
                    alt="Our Adventures"
                    width={32}
                    height={32}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <h3 className="font-serif text-xl text-white">Our Adventures</h3>
                </div>
                <p className="text-white/80 text-sm">Dreams and destinations together</p>
              </div>
            </Link>

            <Link href="/playlist">
              <div className="group bg-[rgb(183,110,121)]/90 backdrop-blur-sm border border-[rgb(153,102,204)]/30 rounded-lg p-6 hover:bg-[rgb(183,110,121)] transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src="/our-playlist.png"
                    alt="Our Playlist"
                    width={32}
                    height={32}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <h3 className="font-serif text-xl text-white">Our Playlist</h3>
                </div>
                <p className="text-white/80 text-sm">Songs that tell our story</p>
              </div>
            </Link>

            <Link href="/library">
              <div className="group bg-[rgb(183,110,121)]/90 backdrop-blur-sm border border-[rgb(153,102,204)]/30 rounded-lg p-6 hover:bg-[rgb(183,110,121)] transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src="/our-library.png"
                    alt="Our Library"
                    width={32}
                    height={32}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <h3 className="font-serif text-xl text-white">Our Library</h3>
                </div>
                <p className="text-white/80 text-sm">Books and films to explore</p>
              </div>
            </Link>
          </motion.div>
        </div>
        )}
      </div>
    </>
  )
}
