import './assets/main.css'
import './assets/tailwind.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n/index.js'

createApp(App).use(router).use(i18n).mount('#app')
