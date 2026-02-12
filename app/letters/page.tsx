"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, Mail, Eye, EyeOff, Calendar, Unlock, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { MagicalParticles } from "@/components/magical-particles"
import { usePageLoad } from "@/components/page-load-provider"

interface Letter {
  id: string
  from: string
  to: string
  message: string
  dateWritten: string
  revealDate?: string
  revealed: boolean
  revealImmediately: boolean
}

export default function LettersPage() {
  const { shouldShowContent } = usePageLoad()
  const [letters, setLetters] = useState<Letter[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)
  const [formData, setFormData] = useState({
    from: "Ichrak",
    to: "Yassine",
    message: "",
    dateWritten: new Date().toISOString().split("T")[0],
    revealDate: "",
    revealImmediately: true,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLetters = localStorage.getItem("love_letters")
    if (savedLetters) {
      const parsedLetters: Letter[] = JSON.parse(savedLetters)
      // Check if any scheduled letters should be revealed
      const updatedLetters = parsedLetters.map((letter) => {
        if (!letter.revealed && letter.revealDate && new Date(letter.revealDate) <= new Date()) {
          return { ...letter, revealed: true }
        }
        return letter
      })
      setLetters(updatedLetters)
      if (JSON.stringify(parsedLetters) !== JSON.stringify(updatedLetters)) {
        localStorage.setItem("love_letters", JSON.stringify(updatedLetters))
      }
    }
  }, [])

  const saveLetters = (newLetters: Letter[]) => {
    localStorage.setItem("love_letters", JSON.stringify(newLetters))
    setLetters(newLetters)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedLetter) {
      // Update existing letter
      const updatedLetters = letters.map((letter) =>
        letter.id === selectedLetter.id
          ? {
              ...letter,
              from: formData.from,
              to: formData.to,
              message: formData.message,
              dateWritten: formData.dateWritten,
              revealDate: formData.revealImmediately ? undefined : formData.revealDate,
              revealed: formData.revealImmediately ? true : letter.revealed,
              revealImmediately: formData.revealImmediately,
            }
          : letter,
      )
      saveLetters(updatedLetters)
    } else {
      // Create new letter
      const newLetter: Letter = {
        id: Date.now().toString(),
        from: formData.from,
        to: formData.to,
        message: formData.message,
        dateWritten: formData.dateWritten,
        revealDate: formData.revealImmediately ? undefined : formData.revealDate,
        revealed: formData.revealImmediately,
        revealImmediately: formData.revealImmediately,
      }
      saveLetters([...letters, newLetter])
    }

    resetForm()
  }

  const handleEditLetter = (letter: Letter) => {
    setSelectedLetter(letter)
    setFormData({
      from: letter.from,
      to: letter.to,
      message: letter.message,
      dateWritten: letter.dateWritten,
      revealDate: letter.revealDate || "",
      revealImmediately: letter.revealImmediately,
    })
    setShowModal(true)
  }

  const deleteLetter = (id: string) => {
    const updatedLetters = letters.filter((letter) => letter.id !== id)
    saveLetters(updatedLetters)
    setSelectedLetter(null)
  }

  const resetForm = () => {
    setFormData({
      from: "Ichrak",
      to: "Yassine",
      message: "",
      dateWritten: new Date().toISOString().split("T")[0],
      revealDate: "",
      revealImmediately: true,
    })
    setShowModal(false)
    setSelectedLetter(null)
  }

  const revealLetter = (id: string) => {
    const updatedLetters = letters.map((letter) =>
      letter.id === id ? { ...letter, revealed: true } : letter,
    )
    saveLetters(updatedLetters)
  }

  const revealedLetters = letters
    .filter((l) => l.revealed)
    .sort((a, b) => new Date(b.dateWritten).getTime() - new Date(a.dateWritten).getTime())
  const sealedLetters = letters
    .filter((l) => !l.revealed)
    .sort((a, b) => {
      if (a.revealDate && b.revealDate) {
        return new Date(a.revealDate).getTime() - new Date(b.revealDate).getTime()
      }
      return 0
    })

  if (!mounted) return null

  return (
    <>
      <MagicalParticles />

      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgb(20,15,18)] via-[rgb(114,47,55)] to-[rgb(35,25,30)] opacity-90" />

        {shouldShowContent && (
          <div className="relative z-10 container mx-auto px-4 py-12 pt-24">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image
                src="/love-letters.png"
                alt="Love Letters"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <h1 className="font-serif text-5xl md:text-7xl text-[rgb(153,102,204)] text-balance">Love Letters</h1>
              <Image
                src="/love-letters.png"
                alt="Love Letters"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <p className="text-[rgb(209,207,200)]/80 text-lg md:text-xl italic">Messages from the heart</p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0 }} className="mb-8">
            <Button
              onClick={() => setShowModal(true)}
              className="bg-[rgb(153,102,204)] hover:bg-[rgb(153,102,204)]/80 text-white font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Write Letter
            </Button>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-12">
            {/* Sealed Letters */}
            {sealedLetters.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0 }}>
                <h2 className="font-serif text-3xl text-[rgb(153,102,204)] mb-6 flex items-center gap-3">
                  <EyeOff className="w-8 h-8 text-[rgb(153,102,204)]" />
                  Sealed Letters
                </h2>
                <div className="space-y-4">
                  {sealedLetters.map((letter, index) => (
                    <motion.div
                      key={letter.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden bg-gradient-to-br from-[rgb(161,113,136)]/60 to-[rgb(114,47,55)]/60 backdrop-blur-sm border-2 border-[rgb(153,102,204)]/30">
                        <div className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Mail className="w-5 h-5 text-[rgb(153,102,204)]" />
                                <p className="text-[rgb(209,207,200)]/90 font-medium">
                                  From {letter.from} to {letter.to}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 text-[rgb(209,207,200)]/70 text-sm">
                                <Calendar className="w-4 h-4" />
                                {letter.revealDate && (
                                  <span>
                                    Scheduled for{" "}
                                    {new Date(letter.revealDate).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button
                              onClick={() => revealLetter(letter.id)}
                              variant="outline"
                              className="border-[rgb(153,102,204)] text-[rgb(153,102,204)] hover:bg-[rgb(153,102,204)]/20"
                            >
                              <Unlock className="w-4 h-4 mr-2" />
                              Reveal Now
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Revealed Letters */}
            {revealedLetters.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0 }}
              >
                <h2 className="font-serif text-3xl text-[rgb(153,102,204)] mb-6 flex items-center gap-3">
                  <Eye className="w-8 h-8 text-[rgb(153,102,204)]" />
                  Revealed Letters
                </h2>
                <div className="space-y-6">
                  {revealedLetters.map((letter, index) => (
                    <motion.div
                      key={letter.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className="overflow-hidden bg-[rgb(161,113,136)]/10 backdrop-blur-sm border-2 border-[rgb(153,102,204)]/30 hover:border-[rgb(153,102,204)]/80 transition-all duration-300"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Mail className="w-5 h-5 text-[rgb(153,102,204)]" />
                                <p className="text-[rgb(209,207,200)]/90 font-medium">
                                  From {letter.from} to {letter.to}
                                </p>
                              </div>
                              <p className="text-[rgb(209,207,200)]/70 text-sm">
                                {new Date(letter.dateWritten).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditLetter(letter)}
                                className="text-[rgb(153,102,204)] hover:text-[rgb(140,90,115)]"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteLetter(letter.id)}
                                className="text-rose-400 hover:text-rose-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div
                            onClick={() => setSelectedLetter(letter)}
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                          >
                            <p className="text-[rgb(209,207,200)]/90 leading-relaxed line-clamp-3">{letter.message}</p>
                            <p className="text-[rgb(153,102,204)] text-sm mt-3">Click to read full letter</p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {letters.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0 }}
                className="text-center py-20"
              >
                <Mail className="w-24 h-24 text-[rgb(153,102,204)]/30 mx-auto mb-6" />
                <p className="text-[rgb(209,207,200)]/60 text-lg">No letters yet. Start writing your heart out!</p>
              </motion.div>
            )}
          </div>
        </div>
        )}
      </div>

      {/* Write Letter Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 via-burgundy-dark to-slate-900 border-2 border-[rgb(153,102,204)]/50 rounded-lg p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-3xl text-[rgb(153,102,204)]">
                  {selectedLetter ? "Edit Love Letter" : "Write a Love Letter"}
                </h2>
                <button onClick={resetForm} className="text-cream/60 hover:text-cream">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="from" className="text-cream/90">
                      From
                    </Label>
                    <select
                      id="from"
                      value={formData.from}
                      onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                      className="w-full mt-2 bg-slate-800/50 border border-[rgb(153,102,204)]/30 text-cream rounded-md p-2"
                    >
                      <option value="Ichrak">Ichrak</option>
                      <option value="Yassine">Yassine</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="to" className="text-cream/90">
                      To
                    </Label>
                    <select
                      id="to"
                      value={formData.to}
                      onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                      className="w-full mt-2 bg-slate-800/50 border border-[rgb(153,102,204)]/30 text-cream rounded-md p-2"
                    >
                      <option value="Yassine">Yassine</option>
                      <option value="Ichrak">Ichrak</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="dateWritten" className="text-cream/90">
                    Date Written
                  </Label>
                  <Input
                    id="dateWritten"
                    type="date"
                    value={formData.dateWritten}
                    onChange={(e) => setFormData({ ...formData, dateWritten: e.target.value })}
                    className="mt-2 bg-slate-800/50 border-[rgb(153,102,204)]/30 text-cream"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-cream/90">
                    Your Message
                  </Label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Pour your heart out..."
                    rows={8}
                    className="mt-2 bg-slate-800/50 border-[rgb(153,102,204)]/30 text-cream resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-cream/90 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.revealImmediately}
                        onChange={() => setFormData({ ...formData, revealImmediately: true })}
                        className="accent-[rgb(153,102,204)]"
                      />
                      Reveal Immediately
                    </label>
                    <label className="flex items-center gap-2 text-cream/90 cursor-pointer">
                      <input
                        type="radio"
                        checked={!formData.revealImmediately}
                        onChange={() => setFormData({ ...formData, revealImmediately: false })}
                        className="accent-[rgb(153,102,204)]"
                      />
                      Schedule for Later
                    </label>
                  </div>

                  {!formData.revealImmediately && (
                    <div>
                      <Label htmlFor="revealDate" className="text-cream/90">
                        Reveal Date
                      </Label>
                      <Input
                        id="revealDate"
                        type="date"
                        required={!formData.revealImmediately}
                        value={formData.revealDate || ""}
                        onChange={(e) => setFormData({ ...formData, revealDate: e.target.value })}
                        min={new Date().toISOString().split("T")[0]}
                        className="mt-2 bg-slate-800/50 border-[rgb(153,102,204)]/30 text-cream"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[rgb(153,102,204)] to-[rgb(120,75,160)] hover:from-[rgb(140,90,115)] hover:to-[rgb(100,60,140)]"
                  >
                    {selectedLetter ? "Update Letter" : "Send Letter"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1 bg-transparent">
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Read Letter Modal */}
      <AnimatePresence>
        {selectedLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedLetter(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-parchment via-cream to-parchment border-4 border-[rgb(153,102,204)]/70 rounded-lg p-12 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto relative"
              style={{
                backgroundImage: "url('/vintage-paper-texture.png')",
                backgroundBlendMode: "multiply",
              }}
            >
              <button
                onClick={() => setSelectedLetter(null)}
                className="absolute top-4 right-4 text-slate-600 hover:text-slate-500"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-6 text-slate-900">
                <div className="text-center border-b-2 border-slate-400/30 pb-4">
                  <p className="font-serif text-sm text-slate-700">
                    {new Date(selectedLetter.dateWritten).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <p className="font-serif text-lg text-slate-700 mb-2">Dear {selectedLetter.to},</p>
                </div>

                <div className="leading-relaxed whitespace-pre-wrap font-serif text-slate-900">
                  {selectedLetter.message}
                </div>

                <div className="text-right pt-4 border-t-2 border-slate-400/30">
                  <p className="font-serif text-lg text-slate-700">With all my love,</p>
                  <p className="font-serif text-xl text-slate-700 mt-2">{selectedLetter.from}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
