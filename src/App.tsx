import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Login from './components/Login'
import PhotoUploader from './components/PhotoUploader'
import PhotoCard from './components/PhotoCard'
import DynamicWallpaper from './components/DynamicWallpaper'
import { Photo } from './types'
import './globals.css'

const API_URL = 'https://cute-photo-gallery.onrender.com/api'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Always start with login page - clear any previous session
  useEffect(() => {
    // Always require fresh login
    setIsLoggedIn(false)
    setUserId(null)
    setPhotos([])
  }, [])

  // Load photos from API when user is logged in
  useEffect(() => {
    if (isLoggedIn && userId) {
      fetchPhotos()
    }
  }, [isLoggedIn, userId])

  const fetchPhotos = async () => {
    if (!userId) return
    try {
      setIsLoading(true)
      const res = await fetch(`${API_URL}/photos/${userId}`)
      const data = await res.json()
      if (data.photos) {
        setPhotos(data.photos)
      }
    } catch (error) {
      console.error('Failed to fetch photos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginSuccess = (newUserId: string) => {
    setUserId(newUserId)
    setIsLoggedIn(true)
    localStorage.setItem('cuteGalleryLoggedIn', 'true')
    localStorage.setItem('cuteGalleryUserId', newUserId)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserId(null)
    setPhotos([])
    localStorage.removeItem('cuteGalleryLoggedIn')
    localStorage.removeItem('cuteGalleryUserId')
  }

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  const handlePhotoUpload = async (image: string, caption: string, song?: string, songName?: string) => {
    if (!userId) return
    try {
      const res = await fetch(`${API_URL}/photos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          image,
          caption,
          song,
          songName
        })
      })
      const data = await res.json()
      if (data.photo) {
        setPhotos([data.photo, ...photos])
      }
    } catch (error) {
      console.error('Failed to upload photo:', error)
    }
  }

  const handleDeletePhoto = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/photos/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setPhotos(photos.filter((p) => p.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete photo:', error)
    }
  }

  const handleUpdatePhoto = (id: string, caption: string, song?: string, songName?: string) => {
    setPhotos(photos.map((p) => 
      p.id === id 
        ? { ...p, caption, song, songName }
        : p
    ))
  }

  return (
    <DynamicWallpaper>
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 relative"
          >
            <div className="absolute top-0 right-0">
              <button
                onClick={handleLogout}
                className="cute-btn text-sm"
              >
                🚪 Logout
              </button>
            </div>
            <h1 className="text-6xl font-bold mb-4">
              <span className="heart animate-heartbeat">💖</span>
              <span className="cute-text ml-3">Cute Photo Gallery</span>
              <span className="heart animate-heartbeat ml-3">💖</span>
            </h1>
            <p className="text-gray-600 text-lg mb-2">
              🎀 Share your precious moments with cute captions and music 🎀
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <span className="panda">🐼</span>
              <span className="panda" style={{ animationDelay: '0.5s' }}>🎀</span>
              <span className="panda" style={{ animationDelay: '1s' }}>🐼</span>
            </div>
          </motion.div>

        {/* Main Container */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1 flex justify-center"
          >
            <PhotoUploader onPhotoUpload={handlePhotoUpload} />
          </motion.div>

          {/* Gallery Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-3"
          >
            {photos.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 md:p-16 text-center shadow-xl">
                <p className="text-4xl md:text-6xl mb-4">📸</p>
                <p className="text-xl md:text-2xl cute-text mb-2">No photos yet!</p>
                <p className="text-sm md:text-base text-gray-600">
                  Upload your first photo to start your cute gallery ✨
                </p>
              </div>
            ) : (
              <>
                <p className="text-white text-sm md:text-lg mb-4 md:mb-6 font-semibold">
                  ✨ {photos.length} Photo{photos.length !== 1 ? 's' : ''} ✨
                </p>
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {photos.map((photo) => (
                    <PhotoCard
                      key={photo.id}
                      photo={photo}
                      onDelete={handleDeletePhoto}
                      onUpdate={handleUpdatePhoto}
                    />
                  ))}
                </motion.div>
              </>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16 text-white"
        >
          <p className="text-lg mb-4">Made with 💕 for cute moments</p>
          <div className="flex justify-center gap-8">
            <span className="text-3xl animate-bounce">🎀</span>
            <span className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>🐼</span>
            <span className="text-3xl animate-bounce" style={{ animationDelay: '0.4s' }}>💖</span>
            <span className="text-3xl animate-bounce" style={{ animationDelay: '0.6s' }}>🌸</span>
          </div>
        </motion.div>
        </div>
      </div>
    </DynamicWallpaper>
  )
}
