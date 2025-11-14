import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DynamicWallpaper from './DynamicWallpaper'

interface LoginProps {
  onLoginSuccess: (userId: string) => void
}

const API_URL = 'http://localhost:5000/api'

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
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password: password || undefined })
      })

      const data = await res.json()

      if (data.success && data.user) {
        const { id, isSpecialUser: isSpecial } = data.user
        setIsSpecialUser(isSpecial)

        if (isSpecial) {
          setModalMessage('Madam Ji, You Don\'t Need Password! 👑')
        } else {
          setModalMessage('Welcome Gauransh! 💖')
        }

        setShowModal(true)
        setTimeout(() => {
          setShowModal(false)
          onLoginSuccess(id)
        }, isSpecial ? 2000 : 1500)
      } else {
        setModalMessage(data.error || 'Login failed!')
        setShowModal(true)
      }
    } catch (error) {
      console.error('Login error:', error)
      setModalMessage('Error connecting to server! 😢')
      setShowModal(true)
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
                placeholder="Enter username"
                whileFocus={{ scale: 1.02 }}
                className="w-full px-4 py-3 rounded-2xl border-2 border-cute-pink focus:border-dark-pink focus:outline-none transition text-gray-700"
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
                    className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-cute-pink focus:border-dark-pink focus:outline-none transition text-gray-700"
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
              className="w-full cute-btn py-3 text-lg font-bold"
            >
              💕 Login
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
      </motion.div>

      {/* Cute Modal - Shruti Special */}
      <AnimatePresence>
        {showModal && isSpecialUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center p-4"
          >
            {/* Background blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
            />

            {/* Modal */}
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

      {/* Cute Modal - Other Users */}
      <AnimatePresence>
        {showModal && !isSpecialUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center p-4"
          >
            {/* Background blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
            />

            {/* Modal */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-sm relative z-10"
            >
              {modalMessage.includes('Welcome') ? (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: 2 }}
                    className="text-6xl mb-4 block"
                  >
                    ✨
                  </motion.div>
                  <h3 className="text-3xl cute-text font-bold mb-2">Welcome Gauransh! 💖</h3>
                  <p className="text-gray-600">You're all logged in! 🎉</p>
                  <div className="flex justify-center gap-3 mt-4">
                    <span className="text-2xl animate-bounce">🎀</span>
                    <span className="text-2xl animate-bounce" style={{ animationDelay: '0.1s' }}>
                      �
                    </span>
                    <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>
                      🎀
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ rotate: [0, -5, 5, -5, 0] }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl mb-4 block"
                  >
                    {modalMessage.includes('Wrong') ? '❌' : '😅'}
                  </motion.div>
                  <h3 className="text-2xl cute-text font-bold mb-2">{modalMessage}</h3>
                  <p className="text-gray-600 text-sm">Please try again! 💪</p>
                  <div className="flex justify-center gap-3 mt-4">
                    <span className="text-2xl animate-bounce">😢</span>
                    <span className="text-2xl animate-bounce" style={{ animationDelay: '0.1s' }}>
                      💔
                    </span>
                    <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>
                      😢
                    </span>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </DynamicWallpaper>
  )
}

