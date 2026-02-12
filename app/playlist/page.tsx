"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, X, Edit, Trash2, Music, ExternalLink } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { MagicalParticles } from "@/components/magical-particles"
import { usePageLoad } from "@/components/page-load-provider"

interface Song {
  id: string
  title: string
  artist: string
  link?: string
  note?: string
}

export default function PlaylistPage() {
  const { shouldShowContent } = usePageLoad()
  const [songs, setSongs] = useState<Song[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingSong, setEditingSong] = useState<Song | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    link: "",
    note: "",
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedSongs = localStorage.getItem("playlist")
    if (savedSongs) {
      setSongs(JSON.parse(savedSongs))
    }
  }, [])

  const saveSongs = (newSongs: Song[]) => {
    localStorage.setItem("playlist", JSON.stringify(newSongs))
    setSongs(newSongs)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingSong) {
      const updatedSongs = songs.map((s) => (s.id === editingSong.id ? { ...editingSong, ...formData } : s))
      saveSongs(updatedSongs)
    } else {
      const newSong: Song = {
        id: Date.now().toString(),
        ...formData,
      }
      saveSongs([...songs, newSong])
    }

    resetForm()
  }

  const handleEdit = (song: Song) => {
    setEditingSong(song)
    setFormData({
      title: song.title,
      artist: song.artist,
      link: song.link || "",
      note: song.note || "",
    })
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    const updatedSongs = songs.filter((s) => s.id !== id)
    saveSongs(updatedSongs)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      artist: "",
      link: "",
      note: "",
    })
    setEditingSong(null)
    setShowModal(false)
  }

  if (!mounted) return null

  return (
    <>
      <MagicalParticles />

      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgb(20,15,18)] via-[rgb(114,47,55)] to-[rgb(35,25,30)] opacity-90" />

        {shouldShowContent && (
          <div className="relative z-10 container mx-auto px-4 py-12">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image
                src="/our-playlist.png"
                alt="Our Playlist"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <h1 className="font-serif text-5xl md:text-7xl text-[rgb(153,102,204)] text-balance">Our Playlist</h1>
              <Image
                src="/our-playlist.png"
                alt="Our Playlist"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <p className="text-cream/80 text-lg md:text-xl italic">Songs that tell our story</p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0 }} className="mb-8">
            <Button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-[rgb(153,102,204)] to-[rgb(120,75,160)] hover:from-[rgb(140,90,115)] hover:to-[rgb(100,60,140)] text-white font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Song
            </Button>
          </motion.div>

          {songs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0 }}
              className="text-center py-20"
            >
              <Music className="w-24 h-24 text-[rgb(153,102,204)]/30 mx-auto mb-6" />
              <p className="text-cream/60 text-lg">No songs yet. Start building your soundtrack!</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0 }}
              className="max-w-4xl mx-auto space-y-3"
            >
              {songs.map((song, index) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden bg-parchment/10 backdrop-blur-sm border-2 border-[rgb(153,102,204)]/30 hover:border-[rgb(153,102,204)]/50 transition-all duration-300">
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Music className="w-5 h-5 text-[rgb(153,102,204)]" />
                            <h3 className="font-serif text-xl text-[rgb(153,102,204)]">{song.title}</h3>
                          </div>
                          <p className="text-cream/70 mb-2">{song.artist}</p>

                          {song.note && <p className="text-cream/80 text-sm italic mt-3">"{song.note}"</p>}

                          {song.link && (
                            <a
                              href={song.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-[rgb(153,102,204)] hover:text-[rgb(140,90,115)] text-sm mt-3 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Listen
                            </a>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(song)}
                            className="text-[rgb(153,102,204)] hover:text-[rgb(140,90,115)]"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(song.id)}
                            className="text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
        )}
      </div>

      {/* Add/Edit Song Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={resetForm}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-slate-800 via-burgundy-dark to-slate-900 border-2 border-[rgb(153,102,204)]/50 rounded-lg p-8 max-w-2xl w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-3xl text-[rgb(153,102,204)]">{editingSong ? "Edit Song" : "Add Song"}</h2>
              <button onClick={resetForm} className="text-cream/60 hover:text-cream">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-cream/90">
                  Song Title
                </Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Song name"
                  className="mt-2 bg-slate-800/50 border-[rgb(153,102,204)]/30 text-cream"
                />
              </div>

              <div>
                <Label htmlFor="artist" className="text-cream/90">
                  Artist
                </Label>
                <Input
                  id="artist"
                  required
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  placeholder="Artist name"
                  className="mt-2 bg-slate-800/50 border-[rgb(153,102,204)]/30 text-cream"
                />
              </div>

              <div>
                <Label htmlFor="link" className="text-cream/90">
                  Link (YouTube/Spotify - optional)
                </Label>
                <Input
                  id="link"
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://..."
                  className="mt-2 bg-slate-800/50 border-[rgb(153,102,204)]/30 text-cream"
                />
              </div>

              <div>
                <Label htmlFor="note" className="text-cream/90">
                  Why this song is special (optional)
                </Label>
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="This song reminds us of..."
                  rows={3}
                  className="mt-2 bg-slate-800/50 border-[rgb(153,102,204)]/30 text-cream resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[rgb(153,102,204)] to-[rgb(120,75,160)] hover:from-[rgb(140,90,115)] hover:to-[rgb(100,60,140)]"
                >
                  {editingSong ? "Update Song" : "Add Song"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1 bg-transparent">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
