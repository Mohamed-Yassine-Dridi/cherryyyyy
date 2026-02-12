"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, Check, MapPin, Users, Heart, Edit } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { MagicalParticles } from "@/components/magical-particles"
import { usePageLoad } from "@/components/page-load-provider"

interface ListItem {
  id: string
  text: string
  completed: boolean
}

interface ListData {
  dates: { count: number; items: ListItem[] }
  bucket: ListItem[]
  travel: ListItem[]
}

export default function ListsPage() {
  const { shouldShowContent } = usePageLoad()
  const [lists, setLists] = useState<ListData>({
    dates: { count: 0, items: [] },
    bucket: [],
    travel: [],
  })
  const [activeTab, setActiveTab] = useState<"dates" | "bucket" | "travel">("dates")
  const [newItemText, setNewItemText] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<ListItem | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLists = localStorage.getItem("couple_lists")
    if (savedLists) {
      const parsed = JSON.parse(savedLists)
      // Migrate old data structure to new structure
      setLists({
        dates: parsed.dates || { count: 0, items: [] },
        bucket: parsed.bucket || parsed.bucketList || [],
        travel: parsed.travel || parsed.travelList || [],
      })
    }
  }, [])

  const saveLists = (newLists: ListData) => {
    localStorage.setItem("couple_lists", JSON.stringify(newLists))
    setLists(newLists)
  }

  const addItem = (listType: keyof ListData) => {
    if (!newItemText.trim()) return

    if (editingItem) {
      // Update existing item
      if (listType === "dates") {
        const updatedItems = lists.dates.items.map((item) =>
          item.id === editingItem.id ? { ...item, text: newItemText } : item,
        )
        saveLists({
          ...lists,
          dates: { ...lists.dates, items: updatedItems },
        })
      } else {
        const updatedItems = (lists[listType] as ListItem[]).map((item) =>
          item.id === editingItem.id ? { ...item, text: newItemText } : item,
        )
        saveLists({ ...lists, [listType]: updatedItems })
      }
      setEditingItem(null)
    } else {
      // Create new item
      const newItem: ListItem = {
        id: Date.now().toString(),
        text: newItemText,
        completed: false,
      }

      if (listType === "dates") {
        saveLists({
          ...lists,
          dates: {
            ...lists.dates,
            items: [...lists.dates.items, newItem],
          },
        })
      } else {
        saveLists({
          ...lists,
          [listType]: [...lists[listType], newItem],
        })
      }
    }

    setNewItemText("")
    setShowModal(false)
  }

  const toggleItem = (listType: keyof ListData, id: string) => {
    if (listType === "dates") {
      const updatedItems = lists.dates.items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      )
      saveLists({
        ...lists,
        dates: { ...lists.dates, items: updatedItems },
      })
    } else {
      const updatedItems = (lists[listType] as ListItem[]).map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      )
      saveLists({ ...lists, [listType]: updatedItems })
    }
  }

  const deleteItem = (listType: keyof ListData, id: string) => {
    if (listType === "dates") {
      const updatedItems = lists.dates.items.filter((item) => item.id !== id)
      saveLists({
        ...lists,
        dates: { ...lists.dates, items: updatedItems },
      })
    } else {
      const updatedItems = (lists[listType] as ListItem[]).filter((item) => item.id !== id)
      saveLists({ ...lists, [listType]: updatedItems })
    }
  }

  const startEdit = (item: ListItem) => {
    setEditingItem(item)
    setNewItemText(item.text)
    setShowModal(true)
  }

  const resetForm = () => {
    setNewItemText("")
    setEditingItem(null)
    setShowModal(false)
  }

  const updateDateCount = (count: number) => {
    saveLists({
      ...lists,
      dates: { ...lists.dates, count },
    })
  }

  const getCurrentList = (): ListItem[] => {
    if (activeTab === "dates") return lists.dates.items
    return lists[activeTab] || []
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
                src="/our-adventures.png"
                alt="Adventures"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <h1 className="font-serif text-5xl md:text-7xl text-[rgb(153,102,204)] text-balance">Our Adventures</h1>
              <Image
                src="/our-adventures.png"
                alt="Adventures"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <p className="text-cream/80 text-lg md:text-xl italic">Dreams and destinations together</p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0 }} className="mb-8">
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setActiveTab("dates")}
                variant={activeTab === "dates" ? "default" : "outline"}
                className={activeTab === "dates" ? "bg-[rgb(153,102,204)] hover:bg-[rgb(140,90,115)]" : ""}
              >
                <Heart className="w-4 h-4 mr-2" />
                Dates
              </Button>
              <Button
                onClick={() => setActiveTab("bucket")}
                variant={activeTab === "bucket" ? "default" : "outline"}
                className={activeTab === "bucket" ? "bg-[rgb(153,102,204)] hover:bg-[rgb(140,90,115)]" : ""}
              >
                <Users className="w-4 h-4 mr-2" />
                Bucket List
              </Button>
              <Button
                onClick={() => setActiveTab("travel")}
                variant={activeTab === "travel" ? "default" : "outline"}
                className={activeTab === "travel" ? "bg-[rgb(153,102,204)] hover:bg-[rgb(140,90,115)]" : ""}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Places to Travel
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
              {activeTab === "dates" && (
                <div className="mb-6">
                  <h3 className="font-serif text-2xl text-[rgb(153,102,204)] mb-4">Number of Dates</h3>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      value={lists.dates.count}
                      onChange={(e) => updateDateCount(Number.parseInt(e.target.value) || 0)}
                      className="max-w-xs bg-slate-800/50 border-[rgb(153,102,204)]/30 text-cream text-2xl font-bold text-center"
                    />
                    <span className="text-cream/70 text-lg">dates together</span>
                  </div>
                </div>
              )}

              <Button
                onClick={() => {
                  setEditingItem(null)
                  setNewItemText("")
                  setShowModal(true)
                }}
                className="w-full bg-gradient-to-r from-[rgb(153,102,204)] to-[rgb(120,75,160)] hover:from-[rgb(140,90,115)] hover:to-[rgb(100,60,140)]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add {activeTab === "dates" ? "Date" : activeTab === "bucket" ? "Goal" : "Destination"}
              </Button>
            </Card>

            <div className="space-y-3">
              {getCurrentList().length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-cream/60">No items yet. Start adding!</p>
                </div>
              ) : (
                getCurrentList().map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-parchment/10 backdrop-blur-sm border border-[rgb(153,102,204)]/30 hover:border-[rgb(153,102,204)]/50 transition-all">
                      <div className="p-4 flex items-center gap-4">
                        <button
                          onClick={() => toggleItem(activeTab, item.id)}
                          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                            item.completed
                              ? "bg-emerald-600 border-emerald-600"
                              : "border-[rgb(153,102,204)]/50 hover:border-[rgb(153,102,204)]"
                          }`}
                        >
                          {item.completed && <Check className="w-4 h-4 text-white" />}
                        </button>

                        <span className={`flex-1 ${item.completed ? "text-cream/50 line-through" : "text-cream/90"}`}>
                          {item.text}
                        </span>

                        <button
                          onClick={() => startEdit(item)}
                          className="text-[rgb(153,102,204)] hover:text-[rgb(153,102,204)]/80 transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => deleteItem(activeTab, item.id)}
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
                  {editingItem ? "Edit" : "Add"}{" "}
                  {activeTab === "dates" ? "Date" : activeTab === "bucket" ? "Goal" : "Destination"}
                </h2>
                <button onClick={() => resetForm()} className="text-cream/60 hover:text-cream">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="item-text" className="text-cream/90">
                    {activeTab === "dates"
                      ? "Date Idea"
                      : activeTab === "bucket"
                        ? "What do you want to do?"
                        : "Where do you want to go?"}
                  </Label>
                  <Input
                    id="item-text"
                    value={newItemText || ""}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addItem(activeTab)}
                    placeholder={
                      activeTab === "dates"
                        ? "A date idea..."
                        : activeTab === "bucket"
                          ? "Something we want to do..."
                          : "A place to visit..."
                    }
                    className="mt-2 bg-slate-800/50 border-[rgb(153,102,204)]/30 text-cream"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => addItem(activeTab)}
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
