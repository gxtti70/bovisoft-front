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
    
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-800">Resumen Ejecutivo</h2>
      
      <div class="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
        <span class="text-sm font-bold text-gray-500 ml-2">Filtrar:</span>
        <select v-model="filtroGenero" class="w-full sm:w-auto text-sm border-none focus:ring-0 font-bold text-ganadero-green cursor-pointer bg-transparent">
          <option value="TODOS">Todos los géneros</option>
          <option value="M">Solo Machos ♂</option>
          <option value="F">Solo Hembras ♀</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
      <div class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
        <p class="text-xs md:text-sm font-medium text-gray-500 uppercase mb-1">Población Cargada</p>
        <h4 class="text-3xl md:text-4xl font-black text-ganadero-dark">{{ totalAnimales }} <span class="text-sm font-normal text-gray-400">cabezas</span></h4>
      </div>
      <div class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
        <p class="text-xs md:text-sm font-medium text-gray-500 uppercase mb-1">Peso Promedio</p>
        <h4 class="text-3xl md:text-4xl font-black text-ganadero-green">{{ pesoPromedio }} <span class="text-sm font-normal text-gray-400">kg</span></h4>
      </div>
      <div class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
        <p class="text-xs md:text-sm font-medium text-gray-500 uppercase mb-1">Biomasa Total</p>
        <h4 class="text-3xl md:text-4xl font-black text-blue-600">{{ pesoTotalHato }} <span class="text-sm font-normal text-gray-400">kg</span></h4>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
      <div class="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[300px] flex flex-col">
        <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4 text-center">Distribución por Raza</h3>
        <div class="flex-1 relative">
          <RazasChart :datos="animalesFiltrados" />
        </div>
      </div>
      <div class="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[300px] flex flex-col">
        <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-4 text-center">Proporción por Género</h3>
        <div class="flex-1 relative">
          <GeneroChart :datos="animalesFiltrados" />
        </div>
      </div>
    </div>
    
  </div>
</template>