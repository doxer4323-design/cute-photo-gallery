import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DynamicWallpaper from './DynamicWallpaper'
import { loginUser, signupUser } from '../utils/firebaseConfig'

interface LoginProps {
  onLoginSuccess: (userId: string) => void
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [isSpecialUser, setIsSpecialUser] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Convert username to email if it's not already in email format
      let email = username
      if (!username.includes('@')) {
        email = `${username}@cute.com`
      }

      const userCredential = await loginUser(email, password)
      
      // Check if it's the special user
      if (username === 'shruti' || username === 'demo@cute.com' || email === 'shruti@cute.com') {
        setIsSpecialUser(true)
        setModalMessage("Madam Ji, You Don't Need Password! 👑")
      } else {
        setModalMessage('Welcome! 💖')
      }

      setShowModal(true)
      setTimeout(() => {
        setShowModal(false)
        onLoginSuccess(userCredential.user.uid)
      }, isSpecialUser ? 2000 : 1500)
    } catch (error: any) {
      console.error('Login error:', error)
      const errorMessage = error.message || 'Login failed!'
      setModalMessage(errorMessage)
      setShowModal(true)
    }
  }

  const demoLogin = async () => {
    try {
      const userCredential = await loginUser('demo@cute.com', 'demo123456')
      setModalMessage('Demo Login! 🎀')
      setShowModal(true)
      setTimeout(() => {
        setShowModal(false)
        onLoginSuccess(userCredential.user.uid)
      }, 1000)
    } catch {
      // Demo account doesn't exist, create it
      try {
        const userCredential = await signupUser('demo@cute.com', 'demo123456')
        setModalMessage('Demo Account Created! 🎀')
        setShowModal(true)
        setTimeout(() => {
          setShowModal(false)
          onLoginSuccess(userCredential.user.uid)
        }, 1000)
      } catch (err: any) {
        console.error('Demo error:', err)
        setModalMessage('Error: ' + err.message)
        setShowModal(true)
      }
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
            <p className="text-gray-600 text-lg">Login to your cute gallery 🎀</p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-8 shadow-xl"
          >
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username Input */}
              <div>
                <label className="block text-sm cute-text font-semibold mb-2">
                  👤 Username
                </label>
                <motion.input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username or email"
                  whileFocus={{ scale: 1.02 }}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-pink-300 focus:border-pink-500 focus:outline-none transition text-gray-700 bg-pink-50"
                  required
                />
              </div>

              {/* Password Input - Hidden for Shruti */}
              {username.toLowerCase() !== 'shruti' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm cute-text font-semibold mb-2">
                    🔐 Password
                  </label>
                  <div className="relative">
                    <motion.input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      whileFocus={{ scale: 1.02 }}
                      className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-pink-300 focus:border-pink-500 focus:outline-none transition text-gray-700 bg-pink-50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lg"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Shruti Message */}
              {username.toLowerCase() === 'shruti' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-yellow-100 to-pink-100 rounded-2xl p-4 text-center border-2 border-yellow-300"
                >
                  <p className="cute-text font-bold text-lg">✨ Special User ✨</p>
                  <p className="text-gray-600 text-sm mt-1">No password needed, Madam Ji! 👑</p>
                </motion.div>
              )}

              {/* Login Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold rounded-2xl shadow-lg"
              >
                💕 Login
              </motion.button>

              {/* Divider */}
              <div className="flex items-center">
                <div className="flex-1 border-t-2 border-pink-200"></div>
                <span className="px-4 text-pink-600 font-semibold">OR</span>
                <div className="flex-1 border-t-2 border-pink-200"></div>
              </div>

              {/* Demo Button */}
              <motion.button
                type="button"
                onClick={demoLogin}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white font-bold rounded-2xl shadow-lg"
              >
                ✨ Demo Login
              </motion.button>
            </form>

            {/* Cute Decorations */}
            <div className="flex justify-center gap-4 mt-8">
              <span className="panda">🐼</span>
              <span className="panda" style={{ animationDelay: '0.5s' }}>
                🎀
              </span>
              <span className="panda" style={{ animationDelay: '1s' }}>
                🐼
              </span>
            </div>
          </motion.div>

          {/* Modal */}
          <AnimatePresence>
            {showModal && isSpecialUser && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center p-4 z-50"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black"
                />

                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                  className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-sm relative z-10"
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1.2, 1.3, 1] }}
                    transition={{ duration: 0.8, repeat: 2 }}
                    className="text-7xl mb-4 block"
                  >
                    👑
                  </motion.div>
                  <h3 className="text-3xl cute-text font-bold mb-2">Madam Ji!</h3>
                  <p className="text-xl font-semibold text-gray-700 mb-3">
                    You Don't Need Password! 💖
                  </p>
                  <p className="text-gray-600 mb-4">Welcome to your special gallery! ✨</p>
                  <div className="flex justify-center gap-4 mt-6">
                    <span className="text-3xl animate-bounce">👑</span>
                    <span className="text-3xl animate-bounce" style={{ animationDelay: '0.1s' }}>
                      💕
                    </span>
                    <span className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>
                      👑
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modal - Other Users */}
          <AnimatePresence>
            {showModal && !isSpecialUser && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center p-4 z-50"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black"
                />

                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-sm relative z-10"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: 2 }}
                    className="text-6xl mb-4 block"
                  >
                    {modalMessage.includes('Error') ? '❌' : '💖'}
                  </motion.div>
                  <h3 className="text-2xl cute-text font-bold mb-2">{modalMessage}</h3>
                  <div className="flex justify-center gap-3 mt-4">
                    <span className="text-2xl animate-bounce">🎀</span>
                    <span className="text-2xl animate-bounce" style={{ animationDelay: '0.1s' }}>
                      💖
                    </span>
                    <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>
                      🎀
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </DynamicWallpaper>
  )
}

