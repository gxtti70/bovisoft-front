<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAnimalStore } from '../stores/animalStore';
import RazasChart from '../components/RazasChart.vue';
import GeneroChart from '../components/GeneroChart.vue';

const store = useAnimalStore();
const filtroGenero = ref('TODOS');

const animalesFiltrados = computed(() => {
  if (filtroGenero.value === 'TODOS') return store.animales;
  return store.animales.filter(a => a.genero === filtroGenero.value);
});

const totalAnimales = computed(() => animalesFiltrados.value.length);
const pesoTotalHato = computed(() => animalesFiltrados.value.reduce((acc, a) => acc + Number(a.peso_actual), 0));
const pesoPromedio = computed(() => totalAnimales.value > 0 ? (pesoTotalHato.value / totalAnimales.value).toFixed(2) : '0');
</script>

<template>
  <div class="animate-fade-in">
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
        <p class="text-sm font-medium text-gray-500 uppercase">Población Cargada</p>
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
</template>