<script setup lang="ts">
import { useAnimalStore } from '../stores/animalStore';
import RegistroModal from '../components/RegistroModal.vue';
import VentaModal from '../components/VentaModal.vue';
import ConfirmarBajaModal from '../components/ConfirmarBajaModal.vue';
import { ref } from 'vue';

const store = useAnimalStore();
const mostrarModal = ref(false);
const mostrarVenta = ref(false);
const animalAVender = ref<any>(null);
const mostrarConfirmar = ref(false);
const animalSeleccionado = ref<{id: number, nombre: string} | null>(null);

const abrirModalVenta = (animal: any) => {
  animalAVender.value = animal;
  mostrarVenta.value = true;
};

const abrirConfirmacion = (id: number, nombre: string) => {
  animalSeleccionado.value = { id, nombre };
  mostrarConfirmar.value = true;
};

const ejecutarBaja = async () => {
  if (animalSeleccionado.value) {
    await store.eliminarAnimal(animalSeleccionado.value.id);
    mostrarConfirmar.value = false;
  }
};
</script>

<template>
  <div class="animate-fade-in">
    <div class="flex justify-between items-end mb-6">
      <div>
        <h2 class="text-3xl font-extrabold text-gray-800">Inventario General</h2>
        <p class="text-gray-500">Visualización en tiempo real del hato ganadero</p>
      </div>
      <button @click="mostrarModal = true" class="bg-ganadero-green hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all transform hover:scale-105">
        + Registrar Animal
      </button>
    </div>

    <div v-if="store.loading && store.animales.length === 0" class="flex justify-center p-10 font-bold text-gray-500 animate-pulse">
      Cargando ganado... 🐄
    </div>

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

    <RegistroModal v-if="mostrarModal" @close="mostrarModal = false" />
    <VentaModal v-if="mostrarVenta" :abierto="mostrarVenta" :animal="animalAVender" @close="mostrarVenta = false" />
    <ConfirmarBajaModal :abierto="mostrarConfirmar" :nombre="animalSeleccionado?.nombre || ''" @confirmar="ejecutarBaja" @cancelar="mostrarConfirmar = false" />
  </div>
</template>