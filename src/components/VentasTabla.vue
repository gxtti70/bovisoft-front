<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Importamos la librería aquí en Vue

const ventas = ref<any[]>([]);
const cargando = ref(true);

// --- FUNCIÓN DE AYUDA PARA EL TOKEN ---
const getConfig = () => {
  const token = localStorage.getItem('bovisoft_token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

const fetchVentas = async () => {
  try {
    const response = await axios.get('http://localhost:4000/api/animales/ventas-historial', getConfig());
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

// --- FUNCIÓN PARA EXPORTAR EXCEL ---
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
    <div class="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
      <h3 class="text-xl font-bold text-gray-800">Transacciones Realizadas</h3>
      
      <div class="text-right flex flex-col items-end gap-2">
        <div>
          <p class="text-xs font-bold text-gray-400 uppercase">Total Ingresos</p>
          <p class="text-2xl font-black text-blue-600">$ {{ totalRecaudado.toLocaleString() }}</p>
        </div>
        <button @click="descargarExcel" class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow transition">
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

    <table v-else class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
          <th class="p-4 font-bold">Fecha</th>
          <th class="p-4 font-bold">Animal Vendido</th>
          <th class="p-4 font-bold">Comprador</th>
          <th class="p-4 font-bold text-right">Precio de Venta</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-50">
        <tr v-for="venta in ventas" :key="venta.id" class="hover:bg-blue-50/30 transition-colors">
          <td class="p-4 text-sm text-gray-500 font-medium">
            {{ new Date(venta.fecha_venta).toLocaleDateString() }}
          </td>
          <td class="p-4">
            <p class="font-bold text-gray-800">{{ venta.nombre_animal }}</p>
            <p class="text-xs text-gray-400">Arete: {{ venta.arete_visual }}</p>
          </td>
          <td class="p-4 text-sm font-medium text-gray-600">
            <span class="bg-gray-100 px-2 py-1 rounded text-gray-600">{{ venta.cliente }}</span>
          </td>
          <td class="p-4 text-right font-black text-blue-600 text-lg">
            $ {{ Number(venta.precio_venta).toLocaleString() }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>