<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAnimalStore } from './stores/animalStore';
import axios from 'axios';

const store = useAnimalStore();
const router = useRouter();
const route = useRoute();

const usuarioActual = ref<any>(null);
const mostrarMenuPerfil = ref(false);

const cerrarSesion = async () => {
  try {
    const token = localStorage.getItem('bovisoft_token');
    if (token) {
      await axios.post('http://localhost:4000/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  } catch (error) { console.error("Error al salir:", error); }

  localStorage.removeItem('bovisoft_token');
  localStorage.removeItem('bovisoft_user');
  usuarioActual.value = null;
  router.push('/');
};

onMounted(() => {
  const userStr = localStorage.getItem('bovisoft_user');
  if (userStr) {
    usuarioActual.value = JSON.parse(userStr);
    store.fetchAnimales();
  }
});
</script>

<template>
  <div v-if="route.name === 'login'" class="min-h-screen">
    <router-view />
  </div>

  <div v-else class="min-h-screen bg-gray-50 text-gray-900 font-sans">
    
    <nav class="bg-ganadero-dark text-white p-4 shadow-md relative z-40">
      <div class="w-full px-8 flex justify-between items-center relative">
        <div class="flex items-center gap-4">
          <img src="./assets/logo.svg" alt="Logo" class="h-16 w-auto brightness-0 invert" />
          <div class="flex flex-col">
            <h1 class="text-2xl font-extrabold tracking-widest leading-none">BOVISOFT</h1>
            <span class="text-sm font-light text-ganadero-green mt-1 text-center">Gestión Ganadera</span>
          </div>
        </div>

        <div class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <router-link to="/inventario" class="transition-all pb-1 border-b-2" :class="route.path === '/inventario' ? 'text-white border-ganadero-green' : 'border-transparent hover:text-white'">Inventario</router-link>
          <router-link to="/reportes" class="transition-all pb-1 border-b-2" :class="route.path === '/reportes' ? 'text-white border-ganadero-green' : 'border-transparent hover:text-white'">Reportes</router-link>
          <router-link to="/ventas" class="transition-all pb-1 border-b-2" :class="route.path === '/ventas' ? 'text-white border-ganadero-green' : 'border-transparent hover:text-white'">Ventas</router-link>
          <router-link to="/configuracion" class="transition-all pb-1 border-b-2" :class="route.path === '/configuracion' ? 'text-white border-ganadero-green' : 'border-transparent hover:text-white'">Configuración</router-link>
        </div>

        <div class="flex items-center gap-3 relative">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-bold leading-none text-white">{{ usuarioActual?.nombre || 'Usuario' }}</p>
            <p class="text-xs text-ganadero-green mt-1 font-medium">{{ usuarioActual?.nombre_hacienda || 'Mi Hacienda' }}</p>
          </div>

          <button @click="mostrarMenuPerfil = !mostrarMenuPerfil"
            class="w-10 h-10 rounded-full bg-gray-600 border-2 border-ganadero-green text-white font-bold hover:scale-105 transition font-mono text-sm">
            {{ usuarioActual?.nombre?.charAt(0).toUpperCase() || 'U' }}
          </button>
          
          <div v-if="mostrarMenuPerfil" class="absolute right-0 top-12 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-fade-in text-gray-800">
            <div class="p-3 border-b border-gray-50 mb-2 overflow-hidden">
                <p class="font-bold text-gray-800 text-base">{{ usuarioActual?.nombre || 'Usuario' }}</p>
                <p class="text-xs text-gray-400 font-medium truncate block w-full" :title="usuarioActual?.correo">
                    {{ usuarioActual?.correo || 'correo@ejemplo.com' }}
                </p>
            </div>

            <router-link to="/configuracion" @click="mostrarMenuPerfil = false"
              class="w-full text-left flex items-center gap-3 p-3 text-sm text-gray-600 hover:bg-ganadero-green/10 hover:text-ganadero-green rounded-xl transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.592c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.004.827a1.125 1.125 0 0 1 .26 1.43l-1.297 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.592c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              <span class="font-semibold">Configuración</span>
            </router-link>

            <button @click="cerrarSesion" class="w-full text-left flex items-center gap-3 p-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
              <span class="font-semibold">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="container mx-auto mt-8 px-4 pb-12">
      <router-view />
    </main>
  </div>
</template>

<style>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
</style>