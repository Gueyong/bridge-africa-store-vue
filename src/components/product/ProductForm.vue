<template>
  <v-container>
    <v-form ref="form" @submit.prevent="handleSubmit">
      <v-text-field v-model="name" label="Product Name" :rules="[rules.required]" required></v-text-field>
      <v-text-field v-model="price" label="Price (FCFA)" type="number" :rules="[rules.required, rules.isNumber]"
        required></v-text-field>
      <v-textarea v-model="description" label="Description" :rules="[rules.required]" required></v-textarea>

      <v-file-input v-model="imageFile" label="Select Image" accept="image/*" :rules="[rules.required]" required
        @change="onFileChange"></v-file-input>

      <v-btn type="submit" color="primary" :loading="loading" :disabled="loading">
        {{ isEdit ? "Update" : "Add" }} Product
      </v-btn>
      <v-btn color="grey" :disabled="loading" @click="goBack">
        Cancel
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebase";

export default {
  name: "ProductForm",
  data() {
    return {
      id: null,
      name: "",
      price: "",
      description: "",
      imageFile: null, // Changed to hold the file
      imageUrl: "", // URL to be generated from the file
      isEdit: false,
      loading: false,
      rules: {
        required: (value) => !!value || "This field is required.",
        isNumber: (value) => !isNaN(value) || "Must be a number.",
      },
    };
  },
  created() {
    const productId = this.$route.params.id;
    if (productId) {
      this.isEdit = true;
      this.id = productId;
      this.fetchProduct(productId);
    }
  },
  methods: {
    async fetchProduct(id) {
      try {
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          const product = productSnap.data();
          this.name = product.name;
          this.price = product.price;
          this.description = product.description;
          this.imageUrl = product.imageUrl; // You may want to handle the image display separately
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Failed to fetch product details.");
      }
    },

    async handleSubmit() {
      if (!(await this.$refs.form.validate())) {
        alert("Please correct the errors before submitting.");
        return;
      }

      this.loading = true;
      const productData = {
        name: this.name,
        price: parseFloat(this.price),
        description: this.description,
        imageUrl: this.imageUrl, // Use the image URL generated
      };

      try {
        if (this.isEdit) {
          const productRef = doc(db, "products", this.id);
          await updateDoc(productRef, productData);
          alert("Product updated successfully.");
        } else {
          const productsRef = collection(db, "products");
          await addDoc(productsRef, productData);
          alert("Product added successfully.");
        }
        this.$router.push("/product");
      } catch (error) {
        console.error("Error saving product:", error);
        alert("An error occurred while saving the product.");
      } finally {
        this.loading = false;
      }
    },

    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.imageUrl = reader.result; // Store the image URL for submission
        };
        reader.readAsDataURL(file);
      }
    },

    goBack() {
      this.$router.back();
    },
  },
};
</script>
