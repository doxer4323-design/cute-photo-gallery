// Firebase configuration using CDN (no npm install needed)
// This uses Firebase Web SDK from CDN instead of npm package

declare global {
  interface Window {
    firebase: any
  }
}

// You need to add these 3 lines to public/index.html:
// <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js"></script>

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}

export const initializeFirebase = () => {
  if (window.firebase) {
    window.firebase.initializeApp(firebaseConfig)
  }
}

export const getFirebase = () => window.firebase

// Auth functions
export const loginWithEmail = async (email: string, password: string) => {
  const firebase = getFirebase()
  const auth = firebase.auth()
  return await auth.signInWithEmailAndPassword(email, password)
}

export const signupWithEmail = async (email: string, password: string) => {
  const firebase = getFirebase()
  const auth = firebase.auth()
  return await auth.createUserWithEmailAndPassword(email, password)
}

export const logout = async () => {
  const firebase = getFirebase()
  return await firebase.auth().signOut()
}

// Firestore functions
export const savePhoto = async (userId: string, photo: any) => {
  const firebase = getFirebase()
  const db = firebase.firestore()
  return await db.collection('photos').add({
    userId,
    ...photo,
    createdAt: new Date()
  })
}

export const getPhotos = async (userId: string) => {
  const firebase = getFirebase()
  const db = firebase.firestore()
  const snapshot = await db.collection('photos').where('userId', '==', userId).get()
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
}

export const deletePhoto = async (photoId: string) => {
  const firebase = getFirebase()
  const db = firebase.firestore()
  return await db.collection('photos').doc(photoId).delete()
}

export const updatePhoto = async (photoId: string, data: any) => {
  const firebase = getFirebase()
  const db = firebase.firestore()
  return await db.collection('photos').doc(photoId).update(data)
}
