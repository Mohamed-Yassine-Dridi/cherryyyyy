"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, ImageIcon, LinkIcon, Camera, Trash2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { MagicalParticles } from "@/components/magical-particles"
import { usePageLoad } from "@/components/page-load-provider"

interface Photo {
  id: string
  url: string
  caption: string
  date: string
}

const loadPhotos = async (): Promise<Photo[]> => {
  try {
    const response = await fetch("/api/gallery")
    if (!response.ok) throw new Error("Failed to load photos")
    return await response.json()
  } catch (error) {
    console.error("Failed to load photos:", error)
    return []
  }
}

const savePhotosToAPI = async (photos: Photo[]): Promise<void> => {
  try {
    const response = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(photos),
    })
    if (!response.ok) throw new Error("Failed to save photos")
  } catch (error) {
    console.error("Failed to save photos:", error)
    throw error
  }
}

const deletePhotoFromAPI = async (id: string): Promise<void> => {
  try {
    const response = await fetch("/api/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    if (!response.ok) throw new Error("Failed to delete photo")
  } catch (error) {
    console.error("Failed to delete photo:", error)
    throw error
  }
}

export default function GalleryPage() {
  const { shouldShowContent } = usePageLoad()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file")
  const [imageUrl, setImageUrl] = useState("")
  const [caption, setCaption] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [mounted, setMounted] = useState(false)
  const [tempUploadedImage, setTempUploadedImage] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    // Load photos from Neon database
    loadPhotos()
      .then((loadedPhotos) => setPhotos(loadedPhotos))
      .catch((error) => console.error("Failed to load photos:", error))
  }, [])

  const savePhotos = (newPhotos: Photo[]) => {
    savePhotosToAPI(newPhotos)
      .then(() => setPhotos(newPhotos))
      .catch((error) => console.error("Failed to save photos:", error))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        // Store the uploaded image temporarily to show preview
        setTempUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const confirmFileUpload = () => {
    if (tempUploadedImage) {
      if (selectedPhoto) {
        // Update existing photo
        const updatedPhotos = photos.map((photo) =>
          photo.id === selectedPhoto.id
            ? { ...photo, url: tempUploadedImage, caption, date: selectedDate }
            : photo,
        )
        savePhotos(updatedPhotos)
        setSelectedPhoto({
          ...selectedPhoto,
          url: tempUploadedImage,
          caption,
          date: selectedDate,
        })
      } else {
        // Create new photo
        const newPhoto: Photo = {
          id: Date.now().toString(),
          url: tempUploadedImage,
          caption,
          date: selectedDate,
        }
        savePhotos([...photos, newPhoto])
      }
      resetForm()
    }
  }

  const handleUrlUpload = () => {
    if (imageUrl) {
      if (selectedPhoto) {
        // Update existing photo
        const updatedPhotos = photos.map((photo) =>
          photo.id === selectedPhoto.id
            ? { ...photo, url: imageUrl, caption, date: selectedDate }
            : photo,
        )
        savePhotos(updatedPhotos)
        setSelectedPhoto({ ...selectedPhoto, url: imageUrl, caption, date: selectedDate })
      } else {
        // Create new photo
        const newPhoto: Photo = {
          id: Date.now().toString(),
          url: imageUrl,
          caption,
          date: selectedDate,
        }
        savePhotos([...photos, newPhoto])
      }
      resetForm()
    }
  }

  const handleEditPhoto = (photo: Photo) => {
    setSelectedPhoto(photo)
    setImageUrl(photo.url)
    setCaption(photo.caption)
    setSelectedDate(photo.date)
    setUploadMethod("url")
    setShowUploadModal(true)
  }

  const deletePhoto = (id: string) => {
    const updatedPhotos = photos.filter((photo) => photo.id !== id)
    deletePhotoFromAPI(id)
      .then(() => savePhotos(updatedPhotos))
      .catch((error) => console.error("Failed to delete photo:", error))
    setSelectedPhoto(null)
  }

  const resetForm = () => {
    setImageUrl("")
    setCaption("")
    setSelectedDate(new Date().toISOString().split("T")[0])
    setShowUploadModal(false)
    setSelectedPhoto(null)
    setTempUploadedImage(null)
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
                src="/our-gallery.png"
                alt="Gallery"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <h1 className="font-serif text-5xl md:text-7xl text-[rgb(153,102,204)] text-balance">Tsawerna</h1>
              <Image
                src="/our-gallery.png"
                alt="Gallery"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <p className="text-[rgb(209,207,200)]/80 text-lg md:text-xl italic">Treasured pictures that will last us forever</p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0 }} className="mb-8">
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-[rgb(153,102,204)] hover:bg-[rgb(153,102,204)]/80 text-white font-semibold"
            >
              <Camera className="w-5 h-5 mr-2" />
              Add a Photo
            </Button>
          </motion.div>

          {photos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0 }}
              className="text-center py-20"
            >
                <ImageIcon className="w-24 h-24 text-[rgb(153,102,204)]/30 mx-auto mb-6" />
              <p className="text-[rgb(209,207,200)]/60 text-lg">No photos yet?? Then it's time to start uploading!</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0 }}
              className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group cursor-pointer"
                >
                  <Card className="overflow-hidden bg-[rgb(161,113,136)]/10 backdrop-blur-sm border-2 border-[rgb(153,102,204)]/30 hover:border-[rgb(255,119,130)]/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    {/* Vintage frame effect */}
                    <div className="p-2 bg-gradient-to-br from-[rgb(183,110,121)]/50 to-[rgb(161,113,136)]/50">
                      <div className="relative aspect-square overflow-hidden rounded-sm">
                        <Image
                          src={photo.url || "/placeholder.svg"}
                          alt={photo.caption || "Gallery photo"}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </div>

                    {(photo.caption || photo.date) && (
                      <div className="p-3 bg-[rgb(161,113,136)]/5 border-t border-[rgb(153,102,204)]/20">
                        {photo.caption && (
                          <p className="text-[rgb(209,207,200)]/90 text-xs mb-0.5 line-clamp-1">{photo.caption}</p>
                        )}
                        {photo.date && <p className="text-[rgb(209,207,200)]/60 text-xs">{photo.date}</p>}
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 via-burgundy-dark to-slate-900 border-2 border-[rgb(153,102,204)]/50 rounded-lg p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-3xl text-[rgb(153,102,204)]">Add a Photo</h2>
                <button onClick={() => setShowUploadModal(false)} className="text-cream/60 hover:text-cream">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex gap-2">
                  <Button
                    variant={uploadMethod === "file" ? "default" : "outline"}
                    onClick={() => setUploadMethod("file")}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                  <Button
                    variant={uploadMethod === "url" ? "default" : "outline"}
                    onClick={() => setUploadMethod("url")}
                    className="flex-1"
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Image URL
                  </Button>
                </div>

                {tempUploadedImage && (
                  <div>
                    <div className="relative w-full max-h-64 overflow-hidden rounded-sm mb-4 border-2 border-[rgb(153,102,204)]/30">
                      <Image
                        src={tempUploadedImage}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}

                {uploadMethod === "file" ? (
                  <div>
                    <Label htmlFor="file-upload" className="text-cream/90">
                      Select Photo
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="mt-2 bg-slate-800/50 border-[rgb(153,102,204)]/30 text-cream"
                      key={selectedPhoto?.id || "new"}
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="image-url" className="text-cream/90">
                      Image URL
                    </Label>
                    <Input
                      id="image-url"
                      type="url"
                      value={imageUrl || ""}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="mt-2 bg-slate-800/50 border-[rgb(153,102,204)]/30 text-cream"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="caption" className="text-cream/90">
                    Caption (optional)
                  </Label>
                  <Input
                    id="caption"
                    value={caption || ""}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="A special moment..."
                    className="mt-2 bg-slate-800/50 border-[rgb(153,102,204)]/30 text-cream"
                  />
                </div>

                <div>
                  <Label htmlFor="date" className="text-cream/90">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate || ""}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="mt-2 bg-slate-800/50 border-[rgb(153,102,204)]/30 text-cream"
                  />
                </div>

                {uploadMethod === "url" && (
                  <Button
                    onClick={handleUrlUpload}
                    className="w-full bg-gradient-to-r from-[rgb(153,102,204)] to-[rgb(120,75,160)] hover:from-[rgb(140,90,115)] hover:to-[rgb(100,60,140)]"
                  >
                    Add Photo
                  </Button>
                )}

                {uploadMethod === "file" && tempUploadedImage && (
                  <Button
                    onClick={confirmFileUpload}
                    className="w-full bg-gradient-to-r from-[rgb(153,102,204)] to-[rgb(120,75,160)] hover:from-[rgb(140,90,115)] hover:to-[rgb(100,60,140)]"
                  >
                    Confirm & Add Photo
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Detail Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-12 right-0 text-white hover:text-[rgb(153,102,204)] transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="bg-gradient-to-br from-[rgb(153,102,204)]/20 to-[rgb(120,75,160)]/20 p-6 rounded-lg max-h-[80vh] overflow-y-auto">
                <div className="relative w-full h-96 overflow-hidden rounded-sm mb-4">
                  <Image
                    src={selectedPhoto.url || "/placeholder.svg"}
                    alt={selectedPhoto.caption || "Gallery photo"}
                    fill
                    className="object-contain"
                  />
                </div>

                {(selectedPhoto.caption || selectedPhoto.date) && (
                  <div className="bg-parchment/10 backdrop-blur-sm p-4 rounded">
                    {selectedPhoto.caption && <p className="text-cream text-lg mb-2">{selectedPhoto.caption}</p>}
                    {selectedPhoto.date && <p className="text-cream/70 text-sm">{selectedPhoto.date}</p>}
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <Button onClick={() => handleEditPhoto(selectedPhoto)} className="flex-1 bg-gradient-to-r from-[rgb(153,102,204)] to-[rgb(120,75,160)] hover:from-[rgb(140,90,115)] hover:to-[rgb(100,60,140)]">
                    <Camera className="w-4 h-4 mr-2" />
                    Edit Photo
                  </Button>
                  <Button onClick={() => deletePhoto(selectedPhoto.id)} variant="destructive" className="flex-1">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Photo
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
