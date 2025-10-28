import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useAuthStore } from './stores/auth';

import '/public/assets/css/style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)
const pinia = createPinia();

app.use(pinia);

const auth = useAuthStore()

async function bootstrap() {
    await auth.checkAuth()
    app.mount('#app')
}

app.use(router)
app.use(i18n)

app.mount('#app')

