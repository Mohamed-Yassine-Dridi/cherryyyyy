"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, Check, Book, Film, Edit } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { MagicalParticles } from "@/components/magical-particles"
import { usePageLoad } from "@/components/page-load-provider"

interface LibraryItem {
  id: string
  title: string
  completed: boolean
}

interface LibraryData {
  books: LibraryItem[]
  movies: LibraryItem[]
}

export default function LibraryPage() {
  const { shouldShowContent } = usePageLoad()
  const [library, setLibrary] = useState<LibraryData>({
    books: [],
    movies: [],
  })
  const [activeTab, setActiveTab] = useState<"books" | "movies">("books")
  const [newItemText, setNewItemText] = useState("")
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLibrary = localStorage.getItem("couple_library")
    if (savedLibrary) {
      setLibrary(JSON.parse(savedLibrary))
    }
  }, [])

  const saveLibrary = (newLibrary: LibraryData) => {
    localStorage.setItem("couple_library", JSON.stringify(newLibrary))
    setLibrary(newLibrary)
  }

  const addItem = () => {
    if (!newItemText.trim()) return

    if (editingItem) {
      // Update existing item
      const updatedItems = library[activeTab].map((item) =>
        item.id === editingItem.id ? { ...item, title: newItemText } : item,
      )
      saveLibrary({ ...library, [activeTab]: updatedItems })
      setEditingItem(null)
    } else {
      // Create new item
      const newItem: LibraryItem = {
        id: Date.now().toString(),
        title: newItemText,
        completed: false,
      }

      saveLibrary({
        ...library,
        [activeTab]: [...library[activeTab], newItem],
      })
    }

    setNewItemText("")
    setShowModal(false)
  }

  const startEdit = (item: LibraryItem) => {
    setEditingItem(item)
    setNewItemText(item.title)
    setShowModal(true)
  }

  const resetForm = () => {
    setNewItemText("")
    setEditingItem(null)
    setShowModal(false)
  }

  const toggleItem = (id: string) => {
    const updatedItems = library[activeTab].map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item,
    )
    saveLibrary({ ...library, [activeTab]: updatedItems })
  }

  const deleteItem = (id: string) => {
    const updatedItems = library[activeTab].filter((item) => item.id !== id)
    saveLibrary({ ...library, [activeTab]: updatedItems })
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
                src="/our-library.png"
                alt="Our Library"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <h1 className="font-serif text-5xl md:text-7xl text-[rgb(153,102,204)] text-balance">Our Library</h1>
              <Image
                src="/movies.png"
                alt="Our Library"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <p className="text-cream/80 text-lg md:text-xl italic">Books and films to explore together</p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0 }} className="mb-8">
            <div className="flex gap-3">
              <Button
                onClick={() => setActiveTab("books")}
                variant={activeTab === "books" ? "default" : "outline"}
                className={activeTab === "books" ? "bg-[rgb(153,102,204)] hover:bg-[rgb(140,90,115)]" : ""}
              >
                <Book className="w-4 h-4 mr-2" />
                Books to Read
              </Button>
              <Button
                onClick={() => setActiveTab("movies")}
                variant={activeTab === "movies" ? "default" : "outline"}
                className={activeTab === "movies" ? "bg-[rgb(153,102,204)] hover:bg-[rgb(140,90,115)]" : ""}
              >
                <Film className="w-4 h-4 mr-2" />
                Movies & Series
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-parchment/10 backdrop-blur-sm border-2 border-[rgb(153,102,204)]/30 p-6 mb-6">
              <Button
                onClick={() => {
                  setEditingItem(null)
                  setNewItemText("")
                  setShowModal(true)
                }}
                className="w-full bg-gradient-to-r from-[rgb(153,102,204)] to-[rgb(120,75,160)] hover:from-[rgb(140,90,115)] hover:to-[rgb(100,60,140)]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add {activeTab === "books" ? "Book" : "Movie"}
              </Button>
            </Card>

            <div className="space-y-3">
              {library[activeTab].length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-cream/60">No {activeTab} yet. Start adding!</p>
                </div>
              ) : (
                library[activeTab].map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-parchment/10 backdrop-blur-sm border border-[rgb(153,102,204)]/30 hover:border-[rgb(153,102,204)]/50 transition-all">
                      <div className="p-4 flex items-center gap-4">
                        <button
                          onClick={() => toggleItem(item.id)}
                          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                            item.completed
                              ? "bg-emerald-600 border-emerald-600"
                            : "border-[rgb(153,102,204)]/50 hover:border-[rgb(153,102,204)]"
                          }`}
                        >
                          {item.completed && <Check className="w-4 h-4 text-white" />}
                        </button>

                        {activeTab === "books" ? (
                          <Book className="w-5 h-5 text-[rgb(153,102,204)]" />
                        ) : (
                          <Film className="w-5 h-5 text-[rgb(153,102,204)]" />
                        )}

                        <span className={`flex-1 ${item.completed ? "text-cream/50 line-through" : "text-cream/90"}`}>
                          {item.title}
                        </span>

                        <button
                          onClick={() => startEdit(item)}
                          className="text-[rgb(153,102,204)] hover:text-[rgb(153,102,204)]/80 transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-rose-400 hover:text-rose-300 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 via-burgundy-dark to-slate-900 border-2 border-[rgb(153,102,204)]/50 rounded-lg p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-3xl text-[rgb(153,102,204)]">
                  {editingItem ? "Edit" : "Add"} {activeTab === "books" ? "Book" : "Movie"}
                </h2>
                <button onClick={() => resetForm()} className="text-cream/60 hover:text-cream">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="library-title" className="text-cream/90">
                    {activeTab === "books" ? "Book Title" : "Movie/Series Title"}
                  </Label>
                  <Input
                    id="library-title"
                    value={newItemText || ""}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addItem()}
                    placeholder={activeTab === "books" ? "Add a book title..." : "Add a movie or series..."}
                    className="mt-2 bg-slate-800/50 border-[rgb(153,102,204)]/30 text-cream"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={addItem}
                    className="flex-1 bg-gradient-to-r from-[rgb(153,102,204)] to-[rgb(120,75,160)] hover:from-[rgb(140,90,115)] hover:to-[rgb(100,60,140)]"
                  >
                    {editingItem ? "Update" : "Add"}
                  </Button>
                  <Button onClick={() => resetForm()} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
