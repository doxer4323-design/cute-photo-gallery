import React from 'react'
import { motion } from 'framer-motion'
import { Photo } from '../types'

interface PhotoCardProps {
  photo: Photo
  onDelete: (id: string) => void
  onUpdate: (id: string, caption: string, song?: string, songName?: string) => void
}

const API_URL = 'http://localhost:5000/api'

export default function PhotoCard({ photo, onDelete, onUpdate }: PhotoCardProps) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editCaption, setEditCaption] = React.useState(photo.caption)
  const [editSongName, setEditSongName] = React.useState(photo.songName || '')
  const [editSong, setEditSong] = React.useState<string | undefined>(photo.song)
  const [isSaving, setIsSaving] = React.useState(false)
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const songInputRef = React.useRef<HTMLInputElement>(null)

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleEditSong = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditSong(event.target.result as string)
          setEditSongName(file.name)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveEdit = async () => {
    try {
      setIsSaving(true)
      const res = await fetch(`${API_URL}/photos/${photo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          caption: editCaption,
          song: editSong,
          songName: editSongName
        })
      })

      if (res.ok) {
        onUpdate(photo.id, editCaption, editSong, editSongName)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Failed to update photo:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ y: -10 }}
      className="photo-card relative group"
      onContextMenu={(e) => {
        e.preventDefault()
        setIsEditing(true)
      }}
    >
      <div className="relative">
        <img src={photo.image} alt={photo.caption} className="w-full h-48 md:h-64 object-cover rounded-t-3xl" />

        {/* Edit & Delete buttons - Always visible on mobile, hidden on hover on desktop */}
        <div className="absolute inset-0 bg-black/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition rounded-t-3xl flex items-center justify-center gap-2 md:gap-4">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl transition transform hover:scale-110"
            title="Edit (Right-click also works)"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(photo.id)}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-lg md:text-xl transition transform hover:scale-110 active:scale-95"
            title="Delete"
          >
            🗑️
          </button>
        </div>

        {/* Music indicator */}
        {photo.song && (
          <div className="absolute bottom-3 right-3 bg-black/50 rounded-full p-3">
            <button
              onClick={handlePlayPause}
              className="text-white text-xl hover:text-yellow-300 transition"
            >
              {isPlaying ? '⏸' : '🎵'}
            </button>
          </div>
        )}
      </div>

      <div className="p-4 bg-white rounded-b-3xl">
        <p className="text-gray-700 mb-3 line-clamp-2">{photo.caption}</p>

        {/* Song player */}
        {photo.song && (
          <div className="bg-light-pink rounded-lg p-3 mb-3">
            <p className="text-xs cute-text mb-2">🎶 {photo.songName || 'Song'}</p>
            <audio
              ref={audioRef}
              src={photo.song}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-6 cursor-pointer"
              controls
            />
          </div>
        )}

        <p className="text-xs text-gray-400">
          {new Date(photo.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Edit Modal - Simple separate window */}
      {isEditing && (
        <div 
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setIsEditing(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl md:rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-2xl md:text-3xl cute-text">✏️ Edit Post</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xl md:text-2xl text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
            </div>

              {/* Caption */}
              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-semibold mb-2">Caption</label>
                <textarea
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="w-full p-3 border-2 border-pink-300 rounded-xl focus:outline-none focus:border-pink-500 text-base"
                  rows={4}
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {editCaption.length}/200 characters
                </p>
              </div>

              {/* Song */}
              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-semibold mb-2">🎵 Song (Optional)</label>
                <input
                  ref={songInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleEditSong}
                  className="w-full p-2 border-2 border-pink-300 rounded-xl text-sm cursor-pointer"
                />
                {editSongName && (
                  <p className="text-xs text-green-600 mt-2">✓ {editSongName}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-2 md:gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 md:px-6 py-2 md:py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full font-bold transition active:scale-95 text-sm md:text-base"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-pink-400 to-red-400 hover:from-pink-500 hover:to-red-500 text-white rounded-full font-bold transition disabled:opacity-50 active:scale-95 text-sm md:text-base"
                  disabled={isSaving}
                >
                  {isSaving ? '💫 Saving...' : '💾 Save'}
                </button>
              </div>
            </motion.div>
        </div>
      )}
    </motion.div>
  )
}
