"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/memories", label: "Memory Jar" },
  { href: "/letters", label: "Love Letters" },
  { href: "/adventures", label: "Adventures" },
  { href: "/playlist", label: "Playlist" },
  { href: "/library", label: "Library" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[rgb(114,47,55)]/80 backdrop-blur-md border-b border-[rgb(153,102,204)]/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-[rgb(255,119,130)]" />
              <span className="font-serif text-2xl text-[rgb(209,207,200)]">I & Y</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[rgb(209,207,200)]/80 hover:text-[rgb(255,119,130)] transition-colors font-medium",
                    pathname === link.href && "text-[rgb(255,119,130)]",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-[rgb(209,207,200)]">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween" }}
            className="fixed top-[73px] right-0 bottom-0 w-64 bg-[rgb(114,47,55)]/95 backdrop-blur-md border-l border-[rgb(153,102,204)]/30 z-40 md:hidden"
          >
            <div className="flex flex-col gap-2 p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-[rgb(209,207,200)]/80 hover:text-[rgb(255,119,130)] transition-colors font-medium py-3 px-4 rounded",
                    pathname === link.href && "text-[rgb(255,119,130)] bg-[rgb(153,102,204)]/20",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
