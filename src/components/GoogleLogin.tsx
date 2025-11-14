import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DynamicWallpaper from './DynamicWallpaper'

interface GoogleLoginProps {
  onLoginSuccess: (accessToken: string, userId: string, userName: string) => void
}

export default function GoogleLogin({ onLoginSuccess }: GoogleLoginProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showInfo, setShowInfo] = useState(false)

  const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
  const GOOGLE_SCOPES = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/userinfo.profile'
  ]

  useEffect(() => {
    // Load Google API
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)
  }, [])

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // This would be handled by Google Sign-In SDK
      // For now, show instructions
      setShowInfo(true)
    } catch (err) {
      setError('Failed to login with Google')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Simple login for demo
  const handleSimpleLogin = () => {
    // Use a demo token for testing
    onLoginSuccess('demo-token', 'user-123', 'Demo User')
  }

  return (
    <DynamicWallpaper>
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl max-w-md w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent mb-2">
              💖 Photo Gallery
            </h1>
            <p className="text-gray-600">Powered by Google Drive</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!showInfo ? (
              <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-white border-2 border-gray-300 rounded-full font-bold text-gray-800 hover:border-blue-500 transition flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <span className="text-2xl">🔐</span>
                  {isLoading ? 'Connecting...' : 'Login with Google'}
                </button>

                <button
                  onClick={handleSimpleLogin}
                  className="w-full px-6 py-4 bg-gradient-to-r from-pink-400 to-red-400 rounded-full font-bold text-white hover:from-pink-500 hover:to-red-500 transition flex items-center justify-center gap-3"
                >
                  <span className="text-2xl">🎉</span>
                  Demo Login
                </button>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-100 border border-red-300 rounded-xl text-red-800 text-center"
                  >
                    {error}
                  </motion.div>
                )}

                <p className="text-xs text-gray-500 text-center mt-6">
                  📱 Your photos are stored securely on Google Drive
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="p-4 bg-blue-100 rounded-xl text-blue-900">
                  <p className="font-bold mb-2">⚙️ Setup Google Drive Integration</p>
                  <ol className="text-sm space-y-2 list-decimal list-inside">
                    <li>Create a Google Cloud project</li>
                    <li>Enable Google Drive API</li>
                    <li>Create OAuth 2.0 credentials</li>
                    <li>Add your Google Client ID here</li>
                  </ol>
                </div>

                <button
                  onClick={() => setShowInfo(false)}
                  className="w-full px-6 py-3 bg-gray-300 rounded-full font-bold text-gray-800 hover:bg-gray-400 transition"
                >
                  ← Back
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </DynamicWallpaper>
  )
}
