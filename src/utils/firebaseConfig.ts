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
      }
    }
    checkFirebase()
  })
}

// Initialize Firebase
export const initFirebase = async () => {
  await waitForFirebase()
  
  if (!fbApp && window.firebase) {
    try {
      fbApp = window.firebase.initializeApp(firebaseConfig)
    } catch (error) {
      // App already initialized
      fbApp = window.firebase.app()
    }
  }
}

// Auth Functions
export const loginUser = async (email: string, password: string) => {
  await initFirebase()
  const auth = window.firebase.auth()
  return await auth.signInWithEmailAndPassword(email, password)
}

export const signupUser = async (email: string, password: string) => {
  await initFirebase()
  const auth = window.firebase.auth()
  return await auth.createUserWithEmailAndPassword(email, password)
}

export const logoutUser = async () => {
  await initFirebase()
  const auth = window.firebase.auth()
  return await auth.signOut()
}

export const getCurrentUser = () => {
  if (!window.firebase) return null
  const auth = window.firebase.auth()
  return auth?.currentUser || null
}

// Firestore Functions
export const savePhoto = async (userId: string, photo: any) => {
  await initFirebase()
  const db = window.firebase.firestore()
  const docRef = await db.collection('photos').add({
    userId,
    ...photo,
    createdAt: new Date()
  })
  return docRef.id
}

export const getPhotos = async (userId: string) => {
  await initFirebase()
  const db = window.firebase.firestore()
  const snapshot = await db.collection('photos').where('userId', '==', userId).get()
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
}

export const deletePhoto = async (photoId: string) => {
  await initFirebase()
  const db = window.firebase.firestore()
  await db.collection('photos').doc(photoId).delete()
}

export const updatePhoto = async (photoId: string, data: any) => {
  await initFirebase()
  const db = window.firebase.firestore()
  await db.collection('photos').doc(photoId).update(data)
}
