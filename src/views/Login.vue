<template>
  <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
    {{ error || 'An unexpected error occurred' }}
  </div>

  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {{ error }}
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input id="email" v-model="form.email" type="email" required
              class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
              :class="{ 'border-red-500': v$.form.email.$error }" placeholder="Email address" autocomplete="email">
            <span v-if="v$.form.email.$error" class="text-red-500 text-sm">
              {{ v$.form.email.$errors[0].$message }}
            </span>
          </div>

          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" v-model="form.password" type="password" autocomplete="current-password" required
              class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
              :class="{ 'border-red-500': v$.form.password.$error }" placeholder="Password">
            <span v-if="v$.form.password.$error" class="text-red-500 text-sm">
              {{ v$.form.password.$errors[0].$message }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember-me" v-model="form.rememberMe" type="checkbox"
              class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded">
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-orange-600 hover:text-orange-500" @click="forgotPassword">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button type="submit" :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <LoadingSpinner v-if="loading" />
            </span>
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button type="button" @click="handleGoogleLogin"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <!-- Google Icon SVG -->
            </svg>
            <span class="ml-2">Google</span>
          </button>

          <button type="button" @click="handleFacebookLogin"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <!-- Facebook Icon SVG -->
            </svg>
            <span class="ml-2">Facebook</span>
          </button>
        </div>
      </form>

      <div class="text-center">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <router-link to="/register" class="font-medium text-orange-600 hover:text-orange-500">
            Sign up
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';
import LoadingSpinner from '../components/LoadingSpinner.vue';

export default {
  name: 'LoginPage',
  components: { LoadingSpinner },

  setup() {
    const store = useStore();
    const router = useRouter();
    const loading = ref(false);

    const form = ref({
      email: '',
      password: '',
      rememberMe: false
    });

    const rules = {
      form: {
        email: { required, email },
        password: { required, minLength: minLength(6) }
      }
    };

    const v$ = useVuelidate(rules, { form });

    const error = computed(() => store.getters['auth/error']);

    const handleLogin = async () => {
      const isValid = await v$.value.$validate();
      if (!isValid) return;

      loading.value = true;
      try {
        const user = await store.dispatch('auth/login', {
          email: form.value.email,
          password: form.value.password,
        });

        if (user) {
          console.log('Login successful, user state updated:', store.getters['auth/currentUser']);
          router.push('/product');
        }
      } catch (error) {
        console.error('Login error details:', error);
      } finally {
        loading.value = false;
      }
    };


    const handleGoogleLogin = async () => {
      try {
        await store.dispatch('auth/loginWithGoogle');
        router.push('/dashboard');
      } catch (error) {
        console.error('Google login error:', error);
      }
    };

    const handleFacebookLogin = async () => {
      try {
        await store.dispatch('auth/loginWithFacebook');
        router.push('/dashboard');
      } catch (error) {
        console.error('Facebook login error:', error);
      }
    };

    const forgotPassword = async () => {
      // Implement password reset logic
    };

    return {
      form,
      loading,
      error,
      v$,
      handleLogin,
      handleGoogleLogin,
      handleFacebookLogin,
      forgotPassword
    };
  }
};
</script>
