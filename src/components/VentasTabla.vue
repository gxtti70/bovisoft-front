<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import * as XLSX from 'xlsx';

// --- 1. DEFINIMOS LA URL DINÁMICA ---
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const ventas = ref<any[]>([]);
const cargando = ref(true);

const getConfig = () => {
  const token = localStorage.getItem('bovisoft_token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

const fetchVentas = async () => {
  try {
    const response = await axios.get(`${API_URL}/animales/ventas-historial`, getConfig());
    ventas.value = response.data.ventas || [];
  } catch (error) {
    console.error("Error al traer ventas:", error);
  } finally {
    cargando.value = false;
  }
};

const totalRecaudado = computed(() => {
  return ventas.value.reduce((acc, v) => acc + Number(v.precio_venta), 0);
});

const descargarExcel = () => {
  if (ventas.value.length === 0) return;

  const datosFormateados = ventas.value.map(v => ({
    'Fecha de Venta': new Date(v.fecha_venta).toLocaleDateString(),
    'Nombre del Animal': v.nombre_animal,
    'Arete Visual': v.arete_visual,
    'Comprador': v.cliente,
    'Ingreso (COP)': Number(v.precio_venta)
  }));

  const hoja = XLSX.utils.json_to_sheet(datosFormateados);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Historial Comercial");

  XLSX.writeFile(libro, `Reporte_Ventas_Bovisoft_${new Date().getTime()}.xlsx`);
};

onMounted(() => {
  fetchVentas();
});
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    
    <div class="p-4 sm:p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/50 gap-4">
      <h3 class="text-xl font-bold text-gray-800">Transacciones Realizadas</h3>
      
      <div class="w-full sm:w-auto flex flex-col sm:flex-col items-start sm:items-end gap-3 sm:gap-2">
        <div>
          <p class="text-xs font-bold text-gray-400 uppercase">Total Ingresos</p>
          <p class="text-2xl font-black text-blue-600">$ {{ totalRecaudado.toLocaleString() }}</p>
        </div>
        <button @click="descargarExcel" class="w-full sm:w-auto justify-center flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Exportar Excel
        </button>
      </div>
    </div>

    <div v-if="cargando" class="p-10 text-center text-gray-400 animate-pulse font-bold">
      Cargando historial comercial... 
    </div>
    
    <div v-else-if="ventas.length === 0" class="p-10 text-center text-gray-400 italic">
      Aún no se han registrado ventas en el sistema.
    </div>

    <div v-else>
      
      <div class="block sm:hidden divide-y divide-gray-100">
        <div v-for="venta in ventas" :key="'mob-'+venta.id" class="p-4 hover:bg-blue-50/30 transition-colors">
          
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="font-bold text-gray-800 text-lg leading-none">{{ venta.nombre_animal }}</p>
              <p class="text-xs text-gray-400 mt-1">Arete: {{ venta.arete_visual }}</p>
            </div>
            <span class="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
              {{ new Date(venta.fecha_venta).toLocaleDateString() }}
            </span>
          </div>

          <div class="flex justify-between items-end mt-4">
            <div class="flex-1 pr-2">
              <p class="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Comprador</p>
              <p class="text-sm font-medium text-gray-700 truncate">👤 {{ venta.cliente }}</p>
            </div>
            <div class="text-right">
              <p class="font-black text-blue-600 text-xl leading-none">
                $ {{ Number(venta.precio_venta).toLocaleString() }}
              </p>
            </div>
          </div>
          
        </div>
      </div>

      <div class="hidden sm:block overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th class="p-4 font-bold whitespace-nowrap">Fecha</th>
              <th class="p-4 font-bold whitespace-nowrap">Animal Vendido</th>
              <th class="p-4 font-bold whitespace-nowrap">Comprador</th>
              <th class="p-4 font-bold text-right whitespace-nowrap">Precio de Venta</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="venta in ventas" :key="venta.id" class="hover:bg-blue-50/30 transition-colors">
              <td class="p-4 text-sm text-gray-500 font-medium whitespace-nowrap">
                {{ new Date(venta.fecha_venta).toLocaleDateString() }}
              </td>
              <td class="p-4 whitespace-nowrap">
                <p class="font-bold text-gray-800">{{ venta.nombre_animal }}</p>
                <p class="text-xs text-gray-400">Arete: {{ venta.arete_visual }}</p>
              </td>
              <td class="p-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                <span class="bg-gray-100 px-2 py-1 rounded text-gray-600">{{ venta.cliente }}</span>
              </td>
              <td class="p-4 text-right font-black text-blue-600 text-lg whitespace-nowrap">
                $ {{ Number(venta.precio_venta).toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>