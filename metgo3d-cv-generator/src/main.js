import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/styles/variables.css'
import './assets/styles/main.css'
import './assets/styles/animations.css'
import './assets/styles/print.css'

createApp(App).use(router).mount('#app')

