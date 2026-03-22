<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAnimalStore } from './stores/animalStore';
import axios from 'axios';

const store = useAnimalStore();
const router = useRouter();
const route = useRoute();

// --- CONFIGURACIÓN DE URL ---
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const usuarioActual = ref<any>(null);
const mostrarMenuPerfil = ref(false);
const mostrarMenuMovil = ref(false); // <-- Nuevo estado para el celular

const cerrarSesion = async () => {
  try {
    const token = localStorage.getItem('bovisoft_token');
    if (token) {
      // Usamos la API_URL dinámica
      await axios.post(`${API_URL}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  } catch (error) { console.error("Error al salir:", error); }

  localStorage.removeItem('bovisoft_token');
  localStorage.removeItem('bovisoft_user');
  usuarioActual.value = null;
  router.push('/');
  mostrarMenuMovil.value = false;
};

onMounted(() => {
  const userStr = localStorage.getItem('bovisoft_user');
  if (userStr) {
    usuarioActual.value = JSON.parse(userStr);
    store.fetchAnimales();
  }
});

// Función para cerrar menús al navegar
const navegar = (ruta: string) => {
  router.push(ruta);
  mostrarMenuMovil.value = false;
  mostrarMenuPerfil.value = false;
};
</script>

<template>
  <div v-if="route.name === 'login'" class="min-h-screen">
    <router-view />
  </div>

  <div v-else class="min-h-screen bg-gray-50 text-gray-900 font-sans">
    
    <nav class="bg-ganadero-dark text-white p-4 shadow-md relative z-40">
      <div class="w-full px-2 md:px-8 flex justify-between items-center relative">
        
        <button @click="mostrarMenuMovil = !mostrarMenuMovil" class="md:hidden p-2 text-gray-300 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
            <path v-if="!mostrarMenuMovil" stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="flex items-center gap-2 md:gap-4">
          <img src="./assets/logo.svg" alt="Logo" class="h-10 md:h-16 w-auto brightness-0 invert" />
          <div class="flex flex-col">
            <h1 class="text-lg md:text-2xl font-extrabold tracking-widest leading-none">BOVISOFT</h1>
            <span class="text-[10px] md:text-sm font-light text-ganadero-green mt-1">Gestión Ganadera</span>
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
            <div class="p-3 border-b border-gray-50 mb-2">
                <p class="font-bold text-gray-800 text-base">{{ usuarioActual?.nombre || 'Usuario' }}</p>
                <p class="text-xs text-gray-400 font-medium truncate block w-full">{{ usuarioActual?.correo }}</p>
            </div>
            <button @click="navegar('/configuracion')" class="w-full text-left flex items-center gap-3 p-3 text-sm text-gray-600 hover:bg-ganadero-green/10 hover:text-ganadero-green rounded-xl transition font-semibold">
              Configuración
            </button>
            <button @click="cerrarSesion" class="w-full text-left flex items-center gap-3 p-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition font-semibold">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div v-if="mostrarMenuMovil" class="md:hidden absolute top-full left-0 w-full bg-ganadero-dark border-t border-gray-700 p-4 space-y-4 animate-fade-in shadow-xl">
        <router-link to="/inventario" @click="mostrarMenuMovil = false" class="block text-lg font-medium py-2 border-b border-gray-800" :class="route.path === '/inventario' ? 'text-ganadero-green' : 'text-gray-300'">Inventario</router-link>
        <router-link to="/reportes" @click="mostrarMenuMovil = false" class="block text-lg font-medium py-2 border-b border-gray-800" :class="route.path === '/reportes' ? 'text-ganadero-green' : 'text-gray-300'">Reportes</router-link>
        <router-link to="/ventas" @click="mostrarMenuMovil = false" class="block text-lg font-medium py-2 border-b border-gray-800" :class="route.path === '/ventas' ? 'text-ganadero-green' : 'text-gray-300'">Ventas</router-link>
        <router-link to="/configuracion" @click="mostrarMenuMovil = false" class="block text-lg font-medium py-2 border-b border-gray-800" :class="route.path === '/configuracion' ? 'text-ganadero-green' : 'text-gray-300'">Configuración</router-link>
      </div>
    </nav>

    <main class="container mx-auto mt-4 md:mt-8 px-4 pb-12">
      <router-view />
    </main>
  </div>
</template>

<style>
.animate-fade-in { animation: fadeIn 0.2s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
</style>