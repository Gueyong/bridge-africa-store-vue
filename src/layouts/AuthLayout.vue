<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <router-link to="/" class="flex-shrink-0 flex items-center">
              <span class="text-2xl font-bold text-orange-600">Logo</span>
            </router-link>
          </div>

          <!-- Added Search Bar -->
          <div v-if="isAuthenticated" class="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div class="max-w-lg w-full lg:max-w-xs">
              <div class="relative">
                <input type="search" placeholder="Search"
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center" v-if="isAuthenticated">
            <!-- Added Logout Button -->
            <button @click="handleLogout"
              class="mr-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
              Logout
            </button>

            <div class="ml-3 relative">
              <div>
                <button @click="showDropdown = !showDropdown"
                  class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                  <img :src="currentUser?.photoURL || '../../public/images/profile.png'" class="h-8 w-8 rounded-full">
                </button>
              </div>

              <div v-if="showDropdown"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                <a href="#" @click.prevent="handleLogout"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Sign out
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <slot></slot>
    </main>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { getAuth, signOut } from 'firebase/auth';

export default {
  name: 'AuthLayout',

  setup() {
    const store = useStore();
    const router = useRouter();
    const showDropdown = ref(false);
    const auth = getAuth();

    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
    const currentUser = computed(() => store.getters['auth/currentUser']);

    const handleLogout = async () => {
      try {
        await signOut(auth); // Firebase logout
        await store.dispatch('auth/logout'); // Vuex store logout
        router.push('/LoginPage'); // Redirect to login page
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    return {
      showDropdown,
      isAuthenticated,
      currentUser,
      handleLogout
    };
  }
};
</script>
