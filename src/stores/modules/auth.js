import AuthService from '../../services/auth.service'
import { sendPasswordResetEmail } from 'firebase/auth'

export default {
  namespaced: true,

  state: {
    user: null,
    loading: false,
    error: null,
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
  },

  actions: {
    logout({ commit }) {
      commit('SET_USER', null)
    },

    async register({ commit }, userData) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const user = await AuthService.register(userData)
        commit('SET_USER', user)
        return user
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async forgotPassword({ commit }, email) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        await sendPasswordResetEmail(AuthService, email)
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async login({ commit }, { email, password }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const user = await AuthService.login(email, password)
        commit('SET_USER', user)
        return user
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async loginWithGoogle({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const user = await AuthService.loginWithGoogle()
        commit('SET_USER', user)
        return user
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async loginWithFacebook({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const user = await AuthService.loginWithFacebook()
        commit('SET_USER', user)
        return user
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async logout({ commit }) {
      try {
        await AuthService.logout()
        commit('SET_USER', null)
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      }
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    loading: (state) => state.loading,
    error: (state) => state.error,
  },
}
