<template>
  <div class="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-4">Reset Password</h2>

    <div v-if="success" class="mb-4 p-4 bg-green-100 text-green-700 rounded">
      Password reset email sent! Please check your inbox.
    </div>

    <form @submit.prevent="handleReset">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          Email Address
        </label>
        <input id="email" v-model="email" type="email" required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>

      <button type="submit" :disabled="loading"
        class="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        {{ loading ? 'Sending...' : 'Reset Password' }}
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import AuthService from '@/services/auth.service';

export default {
  name: 'PasswordReset',

  setup() {
    const email = ref('');
    const loading = ref(false);
    const success = ref(false);

    const handleReset = async () => {
      loading.value = true;
      try {
        await AuthService.resetPassword(email.value);
        success.value = true;
      } catch (error) {
        console.error('Password reset error:', error);
      } finally {
        loading.value = false;
      }
    };

    return {
      email,
      loading,
      success,
      handleReset
    };
  }
};
</script>
