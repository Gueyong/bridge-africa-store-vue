<template>
  <v-container fluid class="pa-0">
    <!-- Navigation Tabs -->
    <v-tabs background-color="white" class="mb-4" hide-slider>
      <v-tab>Market</v-tab>
      <v-tab>Business</v-tab>
      <v-tab>People</v-tab>
      <v-tab>Network</v-tab>
      <v-tab>Post</v-tab>
      <v-tab>All</v-tab>
    </v-tabs>

    <!-- Filters Section -->
    <v-row class="px-4">
      <v-col cols="3">
        <v-card flat class="filter-card pa-4">
          <v-select label="Country" v-model="selectedCountry" :items="countries" outlined dense></v-select>

          <v-select label="City" v-model="selectedCity" :items="cities" outlined dense></v-select>

          <v-text-field label="Neighbourhood" v-model="neighbourhood" outlined dense></v-text-field>

          <v-btn text color="orange" class="px-0">
            More filters
          </v-btn>
        </v-card>
      </v-col>

      <!-- Products Grid -->
      <v-col cols="6">
        <div class="products-container">
          <v-card v-for="product in products" :key="product.id" class="mb-4 product-card" flat
            @click="openProductDetail(product)">
            <v-row no-gutters>
              <v-col cols="4">
                <v-img :src="product.imageUrl" height="150" class="rounded-lg"></v-img>
              </v-col>
              <v-col cols="8" class="pl-4">
                <v-card-title class="text-h6 pa-0 pt-2">
                  {{ product.name }}
                </v-card-title>
                <v-card-subtitle class="pa-0 pb-2">
                  {{ product.description }}
                </v-card-subtitle>
                <v-card-text class="pa-0">
                  <div class="price-tag">{{ product.price }} FCFA</div>
                </v-card-text>
                <v-card-actions class="pa-0 mt-2">
                  <v-btn color="orange" class="white--text">
                    Buy now
                  </v-btn>
                  <v-btn outlined color="orange" class="ml-2">
                    <v-icon left>mdi-cart</v-icon>
                    Cart
                  </v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-card>
        </div>

        <!-- Pagination -->
        <v-pagination v-model="page" :length="totalPages" class="mt-4"></v-pagination>
      </v-col>

      <!-- Map Section -->
      <v-col cols="3">
        <v-card height="100%" flat>
          <!-- Integrate map component here -->
        </v-card>
      </v-col>
    </v-row>

    <!-- Product Detail Pop-up -->
    <v-dialog v-model="showPopup" max-width="600px" transition="dialog-bottom-transition">
      <v-card class="product-popup">
        <v-img :src="selectedProduct.imageUrl" height="300px" cover></v-img>
        <v-card-title class="text-h5 font-weight-bold">
          {{ selectedProduct.name }}
        </v-card-title>
        <v-card-text class="py-3 text-grey-darken-2">
          {{ selectedProduct.description }}
        </v-card-text>
        <v-card-subtitle class="text-subtitle-1 font-weight-medium">
          Price: {{ formatPrice(selectedProduct.price) }} FCFA
        </v-card-subtitle>
        <v-divider></v-divider>
        <v-card-actions class="justify-end">
          <v-btn color="red" @click="deleteProduct(selectedProduct.id)">
            <v-icon left>mdi-delete</v-icon> Delete
          </v-btn>
          <v-btn color="primary" @click="editProduct(selectedProduct)">
            <v-icon left>mdi-pencil</v-icon> Edit
          </v-btn>
          <v-btn text @click="showPopup = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<script>
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

export default {
  data() {
    return {
      products: [],
      showPopup: false,
      selectedProduct: {},
    };
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    fetchProducts() {
      const productsRef = collection(db, "products");
      onSnapshot(productsRef, (snapshot) => {
        this.products = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      });
    },
    openProductDetail(product) {
      this.selectedProduct = product;
      this.showPopup = true;
    },
    deleteProduct(id) {
      const productRef = doc(db, "products", id);
      deleteDoc(productRef).then(() => {
        this.showPopup = false;
      });
    },
    openAddForm() {
      this.$router.push("/add-product");
    },
    editProduct(product) {
      this.$router.push({ name: "EditProduct", params: { id: product.id } });
    },
    formatPrice(price) {
      return new Intl.NumberFormat().format(price);
    },
  },
};
</script>

<style scoped>
.product-card {
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
}

.product-img {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.product-popup {
  border-radius: 12px;
  overflow: hidden;
}

.v-btn {
  text-transform: none;
}
</style>
