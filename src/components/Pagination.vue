<template>
  <div class="flex items-center">
    <button v-if="currentPage > 1" class="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded mr-2"
      @click="$emit('pageChange', currentPage - 1)">
      Previous
    </button>
    <span v-for="page in totalPages" :key="page" class="mx-2">
      <button :class="{ 'bg-orange-500 text-white': page === currentPage }"
        class="py-2 px-4 rounded hover:bg-orange-600 hover:text-white" @click="$emit('pageChange', page)">
        {{ page }}
      </button>
    </span>
    <button v-if="currentPage < totalPages" class="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded ml-2"
      @click="$emit('pageChange', currentPage + 1)">
      Next
    </button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  }
}
</script>
