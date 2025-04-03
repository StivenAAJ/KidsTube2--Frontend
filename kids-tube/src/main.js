import { createApp } from 'vue'
import App from './App.vue'
import router from './router'//importa el router, desde /router/index.js.

import './style.css'

const app = createApp(App)//crea la aplicación.
app.use(router)//usa el router en la aplicación.
app.mount('#app')//monta la aplicación en el elemento con id app.

