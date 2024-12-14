import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import store from '../stores'
import ProductPage from '../views/ProductPage.vue'
import ProductForm from '../components/product/ProductForm.vue'

const routes = [
  {
    path: '/',
    redirect: '/LoginPage', // Redirect root URL to LoginPage
  },
  {
    path: '/LoginPage',
    name: 'LoginPage',
    component: LoginPage, // Route for login page
  },
  {
    path: '/product',
    name: 'ProductPage', // Named route for the product list
    component: ProductPage,
  },
  {
    path: '/add-product',
    name: 'AddProduct', // Named route for adding a product
    component: ProductForm,
  },
  {
    path: '/edit-product/:id',
    name: 'EditProduct', // Named route for editing a product
    component: ProductForm,
    props: true, // Pass route params as props to the component
  },
  {
    path: '/register',
    name: 'Register',
    component: Register, // Route for registration page
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard, // Route for dashboard
    meta: { requiresAuth: true }, // Requires authentication to access
  },
]

const router = createRouter({
  history: createWebHistory(), // Enables clean URLs without hash symbols
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isAuthenticated = store.getters['auth/isAuthenticated'] // Check auth state from Vuex store

  if (requiresAuth && !isAuthenticated) {
    next('/LoginPage') // Redirect to login page if not authenticated
  } else {
    next() // Proceed to the requested route
  }
})

export default router
