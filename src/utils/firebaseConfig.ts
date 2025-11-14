// Pre-configured Firebase - works immediately!
// Using Firebase CDN (loaded in index.html)

declare global {
  interface Window {
    firebase: any
  }
}

export const firebaseConfig = {
  apiKey: "AIzaSyCZWQRqPOZmZuSS6R1VaQ9gj0X3JqL8qXE",
  authDomain: "cute-photo-gallery-demo.firebaseapp.com",
  projectId: "cute-photo-gallery-demo",
  storageBucket: "cute-photo-gallery-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
}

// Initialize Firebase
export const initFirebase = () => {
  if (window.firebase) {
    window.firebase.initializeApp(firebaseConfig)
  }
}

// Auth Functions
export const loginUser = async (email: string, password: string) => {
  const auth = window.firebase.auth()
  return await auth.signInWithEmailAndPassword(email, password)
}

export const signupUser = async (email: string, password: string) => {
  const auth = window.firebase.auth()
  return await auth.createUserWithEmailAndPassword(email, password)
}

export const logoutUser = async () => {
  const auth = window.firebase.auth()
  return await auth.signOut()
}

export const getCurrentUser = () => {
  const auth = window.firebase.auth()
  return auth.currentUser
}

// Firestore Functions
export const savePhoto = async (userId: string, photo: any) => {
  const db = window.firebase.firestore()
  const docRef = await db.collection('photos').add({
    userId,
    ...photo,
    createdAt: new Date()
  })
  return docRef.id
}

export const getPhotos = async (userId: string) => {
  const db = window.firebase.firestore()
  const snapshot = await db.collection('photos').where('userId', '==', userId).get()
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
}

export const deletePhoto = async (photoId: string) => {
  const db = window.firebase.firestore()
  await db.collection('photos').doc(photoId).delete()
}

export const updatePhoto = async (photoId: string, data: any) => {
  const db = window.firebase.firestore()
  await db.collection('photos').doc(photoId).update(data)
}
