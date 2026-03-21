<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { RouterView } from 'vue-router';
import { useAnimalStore } from './stores/animalStore';
import RegistroModal from './components/RegistroModal.vue';
import ConfirmarBajaModal from './components/ConfirmarBajaModal.vue';
import VentaModal from './components/VentaModal.vue';
import RazasChart from './components/RazasChart.vue';
import GeneroChart from './components/GeneroChart.vue';
import VentasTabla from './components/VentasTabla.vue';
import ConfiguracionPanel from './components/ConfiguracionPanel.vue';
import LoginScreen from './components/LoginScreen.vue';
import axios from 'axios';

const store = useAnimalStore();

// --- LÓGICA DE AUTENTICACIÓN ---
const estaAutenticado = ref(false);
const usuarioActual = ref<any>(null);
const mostrarMenuPerfil = ref(false);

const manejarAcceso = (usuario: any) => {
  usuarioActual.value = usuario;
  estaAutenticado.value = true;
  store.fetchAnimales();
};

const cerrarSesion = async () => {
  try {
    const token = localStorage.getItem('bovisoft_token');
    if (token) {
      await axios.post('http://localhost:4000/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  } catch (error) {
    console.error("Error al salir:", error);
  }

  localStorage.removeItem('bovisoft_token');
  localStorage.removeItem('bovisoft_user');
  estaAutenticado.value = false;
  usuarioActual.value = null;
  mostrarMenuPerfil.value = false;
};

// Función para actualizar los datos en memoria cuando el usuario edite su perfil
const actualizarPerfilUsuario = (nuevosDatos: any) => {
    usuarioActual.value = { ...usuarioActual.value, ...nuevosDatos };
    localStorage.setItem('bovisoft_user', JSON.stringify(usuarioActual.value));
};

onMounted(() => {
  const token = localStorage.getItem('bovisoft_token');
  const userStr = localStorage.getItem('bovisoft_user');
  if (token && userStr) {
    usuarioActual.value = JSON.parse(userStr);
    estaAutenticado.value = true;
    store.fetchAnimales();
  }

  window.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (mostrarMenuPerfil.value && !target.closest('#perfil-dropdown-container')) {
      mostrarMenuPerfil.value = false;
    }
  });
});

// --- VARIABLES GLOBALES DE LA APP ---
const mostrarModal = ref(false);
const pestañaActiva = ref('inventario');

// --- LÓGICA DE VENTAS ---
const mostrarVenta = ref(false);
const animalAVender = ref<any>(null);

const abrirModalVenta = (animal: any) => {
  animalAVender.value = animal;
  mostrarVenta.value = true;
};

// --- LÓGICA DE FILTROS Y REPORTES ---
const filtroGenero = ref('TODOS');

const animalesFiltrados = computed(() => {
  if (filtroGenero.value === 'TODOS') return store.animales;
  return store.animales.filter(a => a.genero === filtroGenero.value);
});

// Para los reportes usamos los datos que están cargados
const totalAnimales = computed(() => animalesFiltrados.value.length);
const pesoTotalHato = computed(() => {
  return animalesFiltrados.value.reduce((acc, a) => acc + Number(a.peso_actual), 0);
});
const pesoPromedio = computed(() => {
  return totalAnimales.value > 0 ? (pesoTotalHato.value / totalAnimales.value).toFixed(2) : '0';
});

// --- LÓGICA DE ELIMINACIÓN ---
const mostrarConfirmar = ref(false);
const animalSeleccionado = ref<{id: number, nombre: string} | null>(null);

const abrirConfirmacion = (id: number, nombre: string) => {
  animalSeleccionado.value = { id, nombre };
  mostrarConfirmar.value = true;
};

const ejecutarBaja = async () => {
  if (animalSeleccionado.value) {
    await store.eliminarAnimal(animalSeleccionado.value.id);
    mostrarConfirmar.value = false;
    animalSeleccionado.value = null;
  }
};
</script>

<template>
  <LoginScreen v-if="!estaAutenticado" @accesoConcedido="manejarAcceso" />

  <div v-else class="min-h-screen bg-gray-50 text-gray-900 font-sans">
    <nav class="bg-ganadero-dark text-white p-4 shadow-md relative z-40">
      <div class="w-full px-8 flex justify-between items-center relative">
        <div class="flex items-center gap-4">
          <img src="./assets/logo.svg" alt="Bovisoft Logo" class="h-16 w-auto brightness-0 invert" />
          <div class="flex flex-col">
            <h1 class="text-2xl font-extrabold tracking-widest text-white leading-none">BOVISOFT</h1>
            <span class="text-sm font-light text-ganadero-green mt-1">Gestión Ganadera Inteligente</span>
          </div>
        </div>

        <div class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <button @click="pestañaActiva = 'inventario'" 
            class="transition-all pb-1 border-b-2"
            :class="pestañaActiva === 'inventario' ? 'text-white border-ganadero-green' : 'border-transparent hover:text-white hover:border-gray-500'">
            Inventario
          </button>
          <button @click="pestañaActiva = 'reportes'" 
            class="transition-all pb-1 border-b-2"
            :class="pestañaActiva === 'reportes' ? 'text-white border-ganadero-green' : 'border-transparent hover:text-white hover:border-gray-500'">
            Reportes
          </button>
          <button @click="pestañaActiva = 'ventas'" 
            class="transition-all pb-1 border-b-2"
            :class="pestañaActiva === 'ventas' ? 'text-white border-ganadero-green' : 'border-transparent hover:text-white hover:border-gray-500'">
            Ventas
          </button>
          <button @click="pestañaActiva = 'configuracion'" 
            class="transition-all pb-1 border-b-2"
            :class="pestañaActiva === 'configuracion' ? 'text-white border-ganadero-green' : 'border-transparent hover:text-white hover:border-gray-500'">
            Configuración
          </button>
        </div>

        <div id="perfil-dropdown-container" class="flex items-center gap-3 relative">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-bold leading-none text-white">{{ usuarioActual?.nombre || 'Usuario' }}</p>
            <p class="text-xs text-ganadero-green mt-1">{{ usuarioActual?.nombre_hacienda || 'Mi Hacienda' }}</p>
          </div>

          <button @click="mostrarMenuPerfil = !mostrarMenuPerfil"
            class="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold border-2 border-ganadero-green text-white font-mono hover:scale-105 transition-transform">
            {{ usuarioActual?.nombre ? usuarioActual.nombre.charAt(0).toUpperCase() : 'U' }}
          </button>

          <div v-if="mostrarMenuPerfil" class="absolute right-0 top-12 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-fade-in">
            <div class="p-3 border-b border-gray-50 mb-2 overflow-hidden">
              <p class="font-bold text-gray-800 text-base">{{ usuarioActual?.nombre || 'Usuario' }}</p>
              <p class="text-xs text-gray-400 font-medium truncate block w-full" :title="usuarioActual?.correo">
                {{ usuarioActual?.correo || 'correo@ejemplo.com' }}
              </p>
            </div>

            <button @click="pestañaActiva = 'configuracion'; mostrarMenuPerfil = false" 
              class="w-full text-left flex items-center gap-3 p-3 text-sm text-gray-600 hover:bg-ganadero-green/10 hover:text-ganadero-green rounded-xl transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.592c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.004.827a1.125 1.125 0 0 1 .26 1.43l-1.297 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.592c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              <span class="font-semibold text-gray-700">Configuración</span>
            </button>

            <button @click="cerrarSesion" class="w-full text-left flex items-center gap-3 p-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
              <span class="font-semibold">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="container mx-auto mt-8 px-4 pb-12 z-10 relative">
      <div v-if="pestañaActiva === 'inventario'" class="animate-fade-in">
        <div class="flex justify-between items-end mb-6">
          <div>
            <h2 class="text-3xl font-extrabold text-gray-800">Inventario General</h2>
            <p class="text-gray-500">Visualización en tiempo real del hato ganadero</p>
          </div>
          <button @click="mostrarModal = true" class="bg-ganadero-green hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all transform hover:scale-105">
            + Registrar Animal
          </button>
        </div>
        
        <div v-if="store.loading && store.animales.length === 0" class="flex justify-center p-10 font-bold text-gray-500 animate-pulse">Cargando ganado... 🐄</div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="animal in store.animales" :key="animal.id" class="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-4">
              <span class="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">Arete: {{ animal.arete_visual }}</span>
              <span class="text-gray-400 text-xs uppercase font-semibold">{{ animal.raza || 'N/A' }}</span>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-1">{{ animal.nombre }}</h3>
            <div class="flex items-center gap-2 text-gray-600 mb-4">
              <span class="text-sm">Peso:</span>
              <span class="text-lg font-bold text-ganadero-green">{{ animal.peso_actual }} kg</span>
            </div>
            <div class="pt-4 border-t flex gap-2">
              <button @click="abrirModalVenta(animal)" class="flex-1 text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 py-2.5 rounded-xl font-bold transition">Vender</button>
              <button @click="abrirConfirmacion(animal.id!, animal.nombre)" class="flex-1 text-sm bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl font-bold transition">Dar de baja</button>
            </div>
          </div>
        </div>

        <div v-if="store.hayMasResultados && !store.loading && store.animales.length > 0" class="mt-8 flex justify-center">
          <button @click="store.cargarMasPaginas()" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-xl font-bold transition">
            Cargar más animales ↓
          </button>
        </div>
        <div v-if="!store.hayMasResultados && store.animales.length > 0" class="mt-8 text-center text-sm font-bold text-gray-400">
          Has llegado al final de tu inventario ({{ store.totalEnBaseDeDatos }} cabezas).
        </div>
        
        <div v-if="store.loading && store.animales.length > 0" class="flex justify-center p-4 font-bold text-gray-500 animate-pulse">
            Trayendo más vacas... 🐄
        </div>

      </div>

      <div v-if="pestañaActiva === 'reportes'" class="animate-fade-in">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-extrabold text-gray-800">Resumen Ejecutivo</h2>
          <div class="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border">
            <span class="text-sm font-bold text-gray-500 ml-2">Filtrar:</span>
            <select v-model="filtroGenero" class="text-sm border-none focus:ring-0 font-bold text-ganadero-green cursor-pointer">
              <option value="TODOS">Todos los géneros</option>
              <option value="M">Solo Machos ♂</option>
              <option value="F">Solo Hembras ♀</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p class="text-sm font-medium text-gray-500 uppercase">Población (Cargada)</p>
            <h4 class="text-4xl font-black text-ganadero-dark">{{ totalAnimales }} <span class="text-sm font-normal text-gray-400">cabezas</span></h4>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p class="text-sm font-medium text-gray-500 uppercase">Peso Promedio</p>
            <h4 class="text-4xl font-black text-ganadero-green">{{ pesoPromedio }} <span class="text-sm font-normal text-gray-400">kg</span></h4>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p class="text-sm font-medium text-gray-500 uppercase">Biomasa Total</p>
            <h4 class="text-4xl font-black text-blue-600">{{ pesoTotalHato }} <span class="text-sm font-normal text-gray-400">kg</span></h4>
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 class="text-xl font-bold text-gray-800 mb-4 text-center">Distribución por Raza</h3>
            <RazasChart :datos="animalesFiltrados" />
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 class="text-xl font-bold text-gray-800 mb-4 text-center">Proporción por Género</h3>
            <GeneroChart :datos="animalesFiltrados" />
          </div>
        </div>
      </div>

      <div v-if="pestañaActiva === 'ventas'" class="animate-fade-in">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-3xl font-extrabold text-gray-800">Historial Comercial</h2>
            <p class="text-gray-500">Registro de todas las transacciones y salidas de ganado</p>
          </div>
        </div>
        <VentasTabla />
      </div>

      <div v-if="pestañaActiva === 'configuracion'" class="animate-fade-in">
        <ConfiguracionPanel 
          :usuario="usuarioActual" 
          @perfilActualizado="actualizarPerfilUsuario" 
        />
      </div>

    </main>

    <RegistroModal v-if="mostrarModal" @close="mostrarModal = false" />
    <VentaModal v-if="mostrarVenta" :abierto="mostrarVenta" :animal="animalAVender" @close="mostrarVenta = false" />
    <ConfirmarBajaModal :abierto="mostrarConfirmar" :nombre="animalSeleccionado?.nombre || ''" @confirmar="ejecutarBaja" @cancelar="mostrarConfirmar = false" />
  </div>
</template>

<style>
#app { max-width: 100% !important; padding: 0 !important; margin: 0 !important; width: 100%; }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
</style>