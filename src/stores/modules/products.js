// store/modules/products.js
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db, auth } from '../../config/firebase'
import { ref, uploadBytes, getDownloadURL, deleteObject, getStorage } from 'firebase/storage'

export default {
  namespaced: true,

  state: {
    products: [],
    loading: false,
    error: null,
  },

  mutations: {
    SET_LOADING(state, status) {
      state.loading = status
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_PRODUCTS(state, products) {
      state.products = products
    },
    ADD_PRODUCT(state, product) {
      state.products.unshift(product)
    },
    UPDATE_PRODUCT(state, updatedProduct) {
      const index = state.products.findIndex((p) => p.id === updatedProduct.id)
      if (index !== -1) {
        state.products.splice(index, 1, updatedProduct)
      }
    },
    DELETE_PRODUCT(state, productId) {
      state.products = state.products.filter((p) => p.id !== productId)
    },
  },

  actions: {
    // Create Product
    async createProduct({ commit }, productData) {
      try {
        commit('SET_LOADING', true)

        let imageUrl = ''
        if (productData.image) {
          const storage = getStorage()
          const imageRef = ref(storage, `products/${Date.now()}_${productData.image.name}`)
          await uploadBytes(imageRef, productData.image)
          imageUrl = await getDownloadURL(imageRef)
        }

        const productToAdd = {
          ...productData,
          imageUrl,
          userId: auth.currentUser.uid,
          createdAt: serverTimestamp(),
          likes: 0,
          comments: [],
        }

        const docRef = await addDoc(collection(db, 'products'), productToAdd)
        commit('ADD_PRODUCT', { id: docRef.id, ...productToAdd })
        return docRef.id
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Read Product
    async fetchProduct({ commit }, productId) {
      try {
        commit('SET_LOADING', true)
        const docRef = doc(db, 'products', productId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() }
        }
        throw new Error('Product not found')
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Update Product
    async updateProduct({ commit }, { id, updates }) {
      try {
        commit('SET_LOADING', true)

        let imageUrl = updates.imageUrl
        if (updates.newImage) {
          // Delete old image if exists
          if (updates.imageUrl) {
            const oldImageRef = ref(getStorage(), updates.imageUrl)
            await deleteObject(oldImageRef)
          }

          // Upload new image
          const storage = getStorage()
          const imageRef = ref(storage, `products/${Date.now()}_${updates.newImage.name}`)
          await uploadBytes(imageRef, updates.newImage)
          imageUrl = await getDownloadURL(imageRef)
        }

        const productRef = doc(db, 'products', id)
        const updatedData = {
          ...updates,
          imageUrl,
          updatedAt: serverTimestamp(),
        }

        await updateDoc(productRef, updatedData)
        commit('UPDATE_PRODUCT', { id, ...updatedData })
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Delete Product
    async deleteProduct({ commit }, product) {
      try {
        commit('SET_LOADING', true)

        // Delete image from storage if exists
        if (product.imageUrl) {
          const imageRef = ref(getStorage(), product.imageUrl)
          await deleteObject(imageRef)
        }

        await deleteDoc(doc(db, 'products', product.id))
        commit('DELETE_PRODUCT', product.id)
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
  },
}
