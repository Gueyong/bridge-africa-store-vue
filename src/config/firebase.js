import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('User is signed in:', user.uid)
  } else {
    console.log('No user is signed in.')
  }
})

export const productService = {
  async createProduct(product) {
    const user = auth.currentUser
    if (!user) throw new Error('User not authenticated')

    const productData = {
      ...product,
      userId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return await addDoc(collection(db, 'products'), productData)
  },

  async updateProduct(id, product) {
    const docRef = doc(db, 'products', id)
    await updateDoc(docRef, {
      ...product,
      updatedAt: new Date(),
    })
  },

  async deleteProduct(id) {
    const docRef = doc(db, 'products', id)
    await deleteDoc(docRef)
  },

  async getUserProducts(userId) {
    const q = query(collection(db, 'products'), where('userId', '==', userId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  },
}
