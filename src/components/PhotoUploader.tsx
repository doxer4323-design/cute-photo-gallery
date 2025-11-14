import React, { useRef } from 'react'

interface PhotoUploaderProps {
  onPhotoUpload: (image: string, caption: string, song?: string, songName?: string) => void
}

export default function PhotoUploader({ onPhotoUpload }: PhotoUploaderProps) {
  const [caption, setCaption] = React.useState('')
  const [songName, setSongName] = React.useState('')
  const [preview, setPreview] = React.useState<string | null>(null)
  const [songPreview, setSongPreview] = React.useState<string | null>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const songInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSongSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSongName(file.name)
      const reader = new FileReader()
      reader.onload = (event) => {
        setSongPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = () => {
    if (preview && caption.trim()) {
      onPhotoUpload(preview, caption, songPreview || undefined, songName || undefined)
      setCaption('')
      setSongName('')
      setPreview(null)
      setSongPreview(null)
      if (photoInputRef.current) photoInputRef.current.value = ''
      if (songInputRef.current) songInputRef.current.value = ''
    }
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full">
      <h2 className="text-3xl cute-text mb-6 text-center">✨ Add Photo ✨</h2>

      {/* Photo Upload */}
      <div
        className="border-2 border-dashed border-cute-pink rounded-2xl p-8 mb-6 cursor-pointer text-center hover:bg-light-pink transition"
        onClick={() => photoInputRef.current?.click()}
      >
        {preview ? (
          <div>
            <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-xl mb-3" />
            <button
              onClick={(e) => {
                e.stopPropagation()
                setPreview(null)
                if (photoInputRef.current) photoInputRef.current.value = ''
              }}
              className="text-sm text-red-500 hover:text-red-700"
            >
              ✕ Remove
            </button>
          </div>
        ) : (
          <div>
            <p className="text-4xl mb-2">📸</p>
            <p className="cute-text">Click to upload photo</p>
          </div>
        )}
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoSelect}
          className="hidden"
        />
      </div>

      {/* Caption */}
      <input
        type="text"
        placeholder="💭 Write a cute caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="cute-input w-full mb-4"
        maxLength={200}
      />
      <p className="text-xs text-gray-400 mb-4">{caption.length}/200</p>

      {/* Song Upload */}
      <div
        className="border-2 border-dashed border-cute-pink rounded-2xl p-6 mb-6 cursor-pointer text-center hover:bg-light-pink transition"
        onClick={() => songInputRef.current?.click()}
      >
        {songName ? (
          <div>
            <p className="text-2xl mb-2">🎵</p>
            <p className="text-sm cute-text truncate">{songName}</p>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSongName('')
                setSongPreview(null)
                if (songInputRef.current) songInputRef.current.value = ''
              }}
              className="text-xs text-red-500 hover:text-red-700 mt-2"
            >
              ✕ Remove
            </button>
          </div>
        ) : (
          <div>
            <p className="text-3xl mb-1">🎶</p>
            <p className="cute-text text-sm">Click to add song</p>
            <p className="text-xs text-gray-400 mt-1">(Optional)</p>
          </div>
        )}
        <input
          ref={songInputRef}
          type="file"
          accept="audio/*"
          onChange={handleSongSelect}
          className="hidden"
        />
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!preview || !caption.trim()}
        className={`cute-btn w-full ${!preview || !caption.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        💖 Upload & Share
      </button>
    </div>
  )
}
