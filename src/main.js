import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { createVuetify } from 'vuetify'
import 'vuetify/styles' // Ensure Vuetify styles are included
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'
import store from './stores/index'

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(store)
app.use(vuetify) // Use Vuetify instance

app.mount('#app')
