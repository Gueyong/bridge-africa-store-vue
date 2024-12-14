<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <div class="h-48 bg-gray-200 flex items-center justify-center">
      <img :src="product.imageUrl" :alt="product.name" class="max-h-full max-w-full" />
    </div>
    <div class="p-4">
      <h3 class="text-lg font-medium">{{ product.name }}</h3>
      <p class="text-gray-600">{{ product.description }}</p>
      <div class="flex justify-between items-center mt-4">
        <span class="text-orange-500 font-medium">{{ product.price }} FCFA</span>
        <div>
          <button class="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded mr-2">
            Edit
          </button>
          <button class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  }
}
</script>
