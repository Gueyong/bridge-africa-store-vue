import { auth, db } from '../config/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

class AuthService {
  async register(userData) {
    const { email, password, ...profile } = userData
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)

    // Save additional user data to Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      ...profile,
      createdAt: new Date(),
    })

    return userCredential.user
  }

  async login(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return result.user
  }

  async loginWithFacebook() {
    const provider = new FacebookAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return result.user
  }

  async logout() {
    await signOut(auth)
  }

  getCurrentUser() {
    return auth.currentUser
  }
}

export default new AuthService()
