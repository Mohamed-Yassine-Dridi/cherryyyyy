"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, Edit, Trash2, Heart } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { MagicalParticles } from "@/components/magical-particles"
import { usePageLoad } from "@/components/page-load-provider"

interface Memory {
  id: string
  title: string
  description: string
  date: string
  imageUrl?: string
}

export default function MemoriesPage() {
  const { shouldShowContent } = usePageLoad()
  const [memories, setMemories] = useState<Memory[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    imageUrl: "",
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedMemories = localStorage.getItem("memories")
    if (savedMemories) {
      setMemories(JSON.parse(savedMemories))
    }
  }, [])

  const saveMemories = (newMemories: Memory[]) => {
    localStorage.setItem("memories", JSON.stringify(newMemories))
    setMemories(newMemories)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingMemory) {
      const updatedMemories = memories.map((m) => (m.id === editingMemory.id ? { ...editingMemory, ...formData } : m))
      saveMemories(updatedMemories)
    } else {
      const newMemory: Memory = {
        id: Date.now().toString(),
        ...formData,
      }
      saveMemories([...memories, newMemory])
    }

    resetForm()
  }

  const handleEdit = (memory: Memory) => {
    setEditingMemory(memory)
    setFormData({
      title: memory.title,
      description: memory.description,
      date: memory.date,
      imageUrl: memory.imageUrl || "",
    })
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    const updatedMemories = memories.filter((m) => m.id !== id)
    saveMemories(updatedMemories)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      imageUrl: "",
    })
    setEditingMemory(null)
    setShowModal(false)
  }

  const sortedMemories = [...memories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

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
                src="/memory-jar.png"
                alt="Memory Jar"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <h1 className="font-serif text-5xl md:text-7xl text-[rgb(153,102,204)] text-balance">Memory Jar</h1>
              <Image
                src="/memory-jar.png"
                alt="Memory Jar"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <p className="text-[rgb(209,207,200)]/80 text-lg md:text-xl italic">
              Special moments we'll cherish forever
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0 }} className="mb-8">
            <Button
              onClick={() => setShowModal(true)}
              className="bg-[rgb(153,102,204)] hover:bg-[rgb(153,102,204)]/80 text-white font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Memory
            </Button>
          </motion.div>

          {memories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0 }}
              className="text-center py-20"
            >
              <Heart className="w-24 h-24 text-[rgb(153,102,204)]/30 mx-auto mb-6" />
              <p className="text-[rgb(209,207,200)]/60 text-lg">
                No memories yet. Start preserving your special moments!
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              {sortedMemories.map((memory, index) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden bg-[rgb(161,113,136)]/10 backdrop-blur-sm border-2 border-[rgb(153,102,204)]/30 hover:border-[rgb(153,102,204)]/80 transition-all duration-300">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-serif text-2xl text-[rgb(153,102,204)]">{memory.title}</h3>
                          </div>
                          <p className="text-[rgb(209,207,200)]/70 text-sm">
                            {new Date(memory.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(memory)}
                            className="text-[rgb(153,102,204)] hover:text-[rgb(153,102,204)]/80"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(memory.id)}
                            className="text-[rgb(153,102,204)] hover:text-[rgb(153,102,204)]/80"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {memory.imageUrl && (
                        <div className="relative aspect-video rounded-lg overflow-hidden mb-4 border-2 border-[rgb(153,102,204)]/30">
                          <Image
                            src={memory.imageUrl || "/placeholder.svg"}
                            alt={memory.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <p className="text-[rgb(209,207,200)]/90 leading-relaxed whitespace-pre-wrap">
                        {memory.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
        )}
      </div>

      {/* Add/Edit Memory Modal */}
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
                  {editingMemory ? "Edit Memory" : "Add Memory"}
                </h2>
                <button onClick={resetForm} className="text-[rgb(209,207,200)]/60 hover:text-[rgb(209,207,200)]">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-[rgb(209,207,200)]/90">
                    Title
                  </Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Our special moment..."
                    className="mt-2 bg-slate-800/50 border-[rgb(153,102,204)]/30 text-[rgb(209,207,200)]"
                  />
                </div>

                <div>
                  <Label htmlFor="date" className="text-[rgb(209,207,200)]/90">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-2 bg-slate-800/50 border-[rgb(153,102,204)]/30 text-[rgb(209,207,200)]"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-[rgb(209,207,200)]/90">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tell the story of this memory..."
                    rows={5}
                    className="mt-2 bg-slate-800/50 border-[rgb(153,102,204)]/30 text-[rgb(209,207,200)] resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="imageUrl" className="text-[rgb(209,207,200)]/90">
                    Image URL (optional)
                  </Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="mt-2 bg-slate-800/50 border-[rgb(153,102,204)]/30 text-[rgb(209,207,200)]"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[rgb(153,102,204)] to-[rgb(153,102,204)]/80"
                  >
                    {editingMemory ? "Update Memory" : "Add Memory"}
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
    </>
  )
}
