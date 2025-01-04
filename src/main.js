import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueSelect from 'vue-select'

const app = createApp(App).component("v-select", VueSelect)

app.use(router)


app.mount('#app')
