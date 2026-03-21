import './assets/main.css' 
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(vue3GoogleLogin, {
  clientId: '537987545782-adbfh7v5k8osdt8oluq6g7beg73dav3s.apps.googleusercontent.com'
})

app.mount('#app')