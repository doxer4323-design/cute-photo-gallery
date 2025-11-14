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

// Firestore Functions - using localStorage fallback
const PHOTOS_KEY = 'cute_gallery_photos'

export const savePhoto = async (userId: string, photo: any) => {
  try {
    if (window.firebase && window.firebase.firestore) {
      const db = window.firebase.firestore()
      const docRef = await db.collection('photos').add({
        userId,
        ...photo,
        createdAt: new Date()
      })
      return docRef.id
    }
  } catch (error) {
    console.log('Firebase savePhoto failed, using fallback...')
  }

  // Fallback: Save to localStorage
  const photos = JSON.parse(localStorage.getItem(PHOTOS_KEY) || '[]')
  const id = Date.now().toString()
  photos.push({
    id,
    userId,
    ...photo,
    createdAt: new Date().toISOString()
  })
  localStorage.setItem(PHOTOS_KEY, JSON.stringify(photos))
  return id
}

export const getPhotos = async (userId: string) => {
  try {
    if (window.firebase && window.firebase.firestore) {
      const db = window.firebase.firestore()
      const snapshot = await db.collection('photos').where('userId', '==', userId).get()
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
    }
  } catch (error) {
    console.log('Firebase getPhotos failed, using fallback...')
  }

  // Fallback: Get from localStorage
  const photos = JSON.parse(localStorage.getItem(PHOTOS_KEY) || '[]')
  return photos.filter((p: any) => p.userId === userId)
}

export const deletePhoto = async (photoId: string) => {
  try {
    if (window.firebase && window.firebase.firestore) {
      const db = window.firebase.firestore()
      await db.collection('photos').doc(photoId).delete()
      return
    }
  } catch (error) {
    console.log('Firebase deletePhoto failed, using fallback...')
  }

  // Fallback: Delete from localStorage
  const photos = JSON.parse(localStorage.getItem(PHOTOS_KEY) || '[]')
  const filtered = photos.filter((p: any) => p.id !== photoId)
  localStorage.setItem(PHOTOS_KEY, JSON.stringify(filtered))
}

export const updatePhoto = async (photoId: string, data: any) => {
  try {
    if (window.firebase && window.firebase.firestore) {
      const db = window.firebase.firestore()
      await db.collection('photos').doc(photoId).update(data)
      return
    }
  } catch (error) {
    console.log('Firebase updatePhoto failed, using fallback...')
  }

  // Fallback: Update in localStorage
  const photos = JSON.parse(localStorage.getItem(PHOTOS_KEY) || '[]')
  const updated = photos.map((p: any) =>
    p.id === photoId ? { ...p, ...data } : p
  )
  localStorage.setItem(PHOTOS_KEY, JSON.stringify(updated))
}
