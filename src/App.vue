<template>
  <div id="app">
    <auth-layout v-if="initialized">
      <router-view></router-view>
    </auth-layout>
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="spinner"></div>
        <p class="mt-4">Loading...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import AuthLayout from './layouts/AuthLayout.vue'
import { useStore } from 'vuex'
import { auth } from './config/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default {
  name: 'App',
  components: { AuthLayout },

  setup() {
    const store = useStore()
    const initialized = ref(false)

    onMounted(() => {
      try {
        onAuthStateChanged(auth, (user) => {
          store.commit('auth/SET_USER', user)
          initialized.value = true
        })
      } catch (error) {
        console.error('Firebase initialization error:', error)
        initialized.value = true
      }
    })

    return {
      initialized
    }
  }
}
</script>

<style>
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ef4444;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
