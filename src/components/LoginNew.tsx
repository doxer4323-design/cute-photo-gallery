import React, { useState } from 'react'
import { motion } from 'framer-motion'
import DynamicWallpaper from './DynamicWallpaper'
import { loginUser, signupUser } from '../utils/firebaseConfig'

interface LoginProps {
  onLoginSuccess: (userId: string) => void
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      let userCredential
      if (mode === 'login') {
        userCredential = await loginUser(email, password)
      } else {
        userCredential = await signupUser(email, password)
      }

      setSuccess(mode === 'login' ? 'Login successful! 💖' : 'Account created! 🎀')
      setTimeout(() => {
        onLoginSuccess(userCredential.user.uid)
      }, 1000)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const demoLogin = async () => {
    setLoading(true)
    try {
      const userCredential = await loginUser('demo@cute.com', 'demo123456')
      setSuccess('Demo login successful! 🎀')
      setTimeout(() => {
        onLoginSuccess(userCredential.user.uid)
      }, 1000)
    } catch {
      // Demo account doesn't exist, create it
      try {
        const userCredential = await signupUser('demo@cute.com', 'demo123456')
        setSuccess('Demo account created! Welcome! 💖')
        setTimeout(() => {
          onLoginSuccess(userCredential.user.uid)
        }, 1000)
      } catch (err: any) {
        setError('Demo login failed: ' + err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <DynamicWallpaper>
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-bold mb-3">
              <span className="animate-heartbeat">💖</span>
              <span className="cute-text ml-2">Photo Gallery</span>
              <span className="animate-heartbeat ml-2">💖</span>
            </h1>
            <p className="text-white text-lg drop-shadow-lg">
              {mode === 'login' ? 'Login to your cute gallery 🎀' : 'Create your cute gallery 🎀'}
            </p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-8 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-pink-600">
                  📧 Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-pink-300 focus:border-pink-500 focus:outline-none transition text-gray-700 bg-pink-50"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-pink-600">
                  🔐 Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-pink-300 focus:border-pink-500 focus:outline-none transition text-gray-700 bg-pink-50"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
                >
                  {error}
                </motion.div>
              )}

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded"
                >
                  {success}
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-50 shadow-lg"
              >
                {loading ? '⏳ Loading...' : mode === 'login' ? '💖 Login' : '🎀 Sign Up'}
              </button>

              {/* Toggle Mode */}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login')
                  setError('')
                  setSuccess('')
                }}
                className="w-full text-center text-sm text-pink-600 hover:text-pink-700 font-semibold py-2"
              >
                {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Login'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t-2 border-pink-200"></div>
              <span className="px-4 text-pink-600 font-semibold">OR</span>
              <div className="flex-1 border-t-2 border-pink-200"></div>
            </div>

            {/* Demo Button */}
            <button
              onClick={demoLogin}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-50 shadow-lg"
            >
              {loading ? '⏳ Loading...' : '✨ Try Demo (demo@cute.com)'}
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              Demo password: demo123456
            </p>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-white drop-shadow-lg mt-8 text-sm"
          >
            🎀 Made with 💕 for cute moments 🎀
          </motion.p>
        </motion.div>
      </div>
    </DynamicWallpaper>
  )
}
