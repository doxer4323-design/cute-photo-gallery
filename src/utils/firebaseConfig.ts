// Supabase configuration for cloud sync
// Instructions: Go to https://supabase.com and follow SUPABASE_SETUP.md
// Then paste your credentials here:
const SUPABASE_URL = 'https://marnepfbcrjrcarojgcw.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcm5lcGZiY3JqcmNhcm9qZ2N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDY4MjQsImV4cCI6MjA3ODcyMjgyNH0.xL6-pojIsXHNma81Js2ZUPdxyIPE7GxHZ0SWLvurJEg'

import { initSupabase, getSupabaseClient } from './supabase'

// Initialize Supabase if credentials are available
const useSupabase = initSupabase(SUPABASE_URL, SUPABASE_KEY)

// Pre-configured Firebase - using CDN
declare global {
  interface Window {
    firebase: any
  }
}

let fbApp: any = null

export const firebaseConfig = {
  apiKey: "AIzaSyCZWQRqPOZmZuSS6R1VaQ9gj0X3JqL8qXE",
  authDomain: "cute-photo-gallery-demo.firebaseapp.com",
  projectId: "cute-photo-gallery-demo",
  storageBucket: "cute-photo-gallery-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
}

// Fallback: Use localStorage for users if Firebase fails
const USERS_KEY = 'cute_gallery_users'
const CURRENT_USER_KEY = 'cute_gallery_current_user'
const PHOTOS_KEY = 'cute_gallery_photos'
const PHOTOS_SYNC_KEY = 'cute_gallery_photos_synced'

const getStoredUsers = () => {
  const stored = localStorage.getItem(USERS_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  return {
    'demo@cute.com': 'demo123456',
    'shruti@cute.com': '',
    'gauransh@cute.com': 'gauransh@123'
  }
}

// Wait for Firebase SDK to load
const waitForFirebase = () => {
  return new Promise<void>((resolve) => {
    let attempts = 0
    const checkFirebase = () => {
      if (window.firebase && window.firebase.initializeApp) {
        resolve()
      } else if (attempts < 50) {
        attempts++
        setTimeout(checkFirebase, 100)
      } else {
        resolve() // Continue anyway if Firebase doesn't load
      }
    }
    checkFirebase()
  })
}

// Initialize Firebase
export const initFirebase = async () => {
  await waitForFirebase()
  
  // Nuclear option: if photos storage is over 1MB, clear it completely
  try {
    const stored = localStorage.getItem(PHOTOS_KEY)
    if (stored && stored.length > 1000000) {
      console.log('⚠️ Storage too large, clearing...')
      localStorage.removeItem(PHOTOS_KEY)
    }
    
    // Clean up old large images from localStorage on startup
    const photos = JSON.parse(localStorage.getItem(PHOTOS_KEY) || '[]')
    const cleaned = photos.map((p: any) => ({
      id: p.id,
      userId: p.userId,
      caption: p.caption,
      songName: p.songName || '',
      createdAt: p.createdAt
      // Remove image and song to save space - they're in Supabase
    }))
    localStorage.setItem(PHOTOS_KEY, JSON.stringify(cleaned))
    console.log('🧹 Cleaned up localStorage')
  } catch (e) {
    console.log('Cleanup note:', e)
  }
  
  if (!fbApp && window.firebase && window.firebase.initializeApp) {
    try {
      fbApp = window.firebase.initializeApp(firebaseConfig)
    } catch (error) {
      // App already initialized
      try {
        fbApp = window.firebase.app()
      } catch {
        console.log('Using fallback authentication')
      }
    }
  }
}

// Auth Functions - with fallback to localStorage
export const loginUser = async (email: string, password: string) => {
  try {
    if (window.firebase && window.firebase.auth) {
      const auth = window.firebase.auth()
      return await auth.signInWithEmailAndPassword(email, password)
    }
  } catch (fbError) {
    console.log('Firebase login failed, trying fallback...')
  }

  // Fallback: Check in localStorage
  const users = getStoredUsers()
  if (users[email] !== undefined && users[email] === password) {
    // Create fake user object
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ uid: email, email }))
    return {
      user: {
        uid: email,
        email: email
      }
    }
  }

  throw new Error('Invalid email or password')
}

export const signupUser = async (email: string, password: string) => {
  try {
    if (window.firebase && window.firebase.auth) {
      const auth = window.firebase.auth()
      return await auth.createUserWithEmailAndPassword(email, password)
    }
  } catch (fbError) {
    console.log('Firebase signup failed, trying fallback...')
  }

  // Fallback: Save to localStorage
  const users = getStoredUsers()
  users[email] = password
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ uid: email, email }))

  return {
    user: {
      uid: email,
      email: email
    }
  }
}

export const logoutUser = async () => {
  try {
    if (window.firebase && window.firebase.auth) {
      const auth = window.firebase.auth()
      return await auth.signOut()
    }
  } catch (error) {
    console.log('Firebase logout failed')
  }

  localStorage.removeItem(CURRENT_USER_KEY)
}

export const getCurrentUser = () => {
  try {
    if (window.firebase && window.firebase.auth) {
      const auth = window.firebase.auth()
      return auth?.currentUser || null
    }
  } catch (error) {
    console.log('Firebase getCurrentUser failed')
  }

  // Fallback: Check localStorage
  const stored = localStorage.getItem(CURRENT_USER_KEY)
  return stored ? JSON.parse(stored) : null
}

// Firestore Functions - localStorage + Supabase cloud sync
export const savePhoto = async (userId: string, photo: any) => {
  // Create metadata object (without storing huge image in localStorage)
  const id = Date.now().toString()
  const photoMetadata = {
    id,
    userId,
    caption: photo.caption,
    songName: photo.songName || '',
    createdAt: new Date().toISOString()
    // NOTE: image and song are NOT stored in localStorage to save space
  }

  // Save metadata to localStorage
  const photos = JSON.parse(localStorage.getItem(PHOTOS_KEY) || '[]')
  photos.push(photoMetadata)
  localStorage.setItem(PHOTOS_KEY, JSON.stringify(photos))
  console.log('💾 Saved metadata to localStorage')

  // Then sync full photo to Supabase in background (cross-device sync)
  const supabase = getSupabaseClient()
  if (supabase) {
    try {
      await supabase.savePhoto(userId, photo)
      console.log('✓ Photo synced to Supabase cloud with full image')
    } catch (error) {
      console.log('⚠ Supabase sync failed, metadata saved locally:', error)
    }
  }

  return id
}

export const getPhotos = async (userId: string) => {
  // Try loading from Supabase first (cloud - has newest photos)
  const supabase = getSupabaseClient()
  if (supabase) {
    try {
      const supabasePhotos = await supabase.getPhotos(userId)
      if (supabasePhotos && supabasePhotos.length > 0) {
        console.log('✓ Loaded photos from Supabase cloud')
        // Update localStorage with cloud photos
        localStorage.setItem(PHOTOS_KEY, JSON.stringify(supabasePhotos))
        return supabasePhotos
      }
    } catch (error) {
      console.log('⚠ Supabase load failed, using local photos:', error)
    }
  }

  // Fallback: Get from localStorage
  const photos = JSON.parse(localStorage.getItem(PHOTOS_KEY) || '[]')
  return photos.filter((p: any) => p.userId === userId)
}

export const deletePhoto = async (photoId: string) => {
  // Delete from localStorage first (instant)
  const photos = JSON.parse(localStorage.getItem(PHOTOS_KEY) || '[]')
  const filtered = photos.filter((p: any) => p.id !== photoId)
  localStorage.setItem(PHOTOS_KEY, JSON.stringify(filtered))

  // Then delete from Supabase in background
  const supabase = getSupabaseClient()
  if (supabase) {
    try {
      await supabase.deletePhoto(photoId)
      console.log('✓ Photo deleted from Supabase cloud')
    } catch (error) {
      console.log('⚠ Supabase delete failed, but deleted locally:', error)
    }
  }
}

export const updatePhoto = async (photoId: string, data: any) => {
  // Update in localStorage first (instant)
  const photos = JSON.parse(localStorage.getItem(PHOTOS_KEY) || '[]')
  const updated = photos.map((p: any) =>
    p.id === photoId ? { ...p, ...data } : p
  )
  localStorage.setItem(PHOTOS_KEY, JSON.stringify(updated))

  // Then update in Supabase in background
  const supabase = getSupabaseClient()
  if (supabase) {
    try {
      await supabase.updatePhoto(photoId, data)
      console.log('✓ Photo updated in Supabase cloud')
    } catch (error) {
      console.log('⚠ Supabase update failed, but updated locally:', error)
    }
  }
}
