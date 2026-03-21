<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps<{
  datos: any[]
}>();

const chartData = computed(() => {
  const razas = props.datos.map(a => a.raza || 'N/A');
  const conteo = razas.reduce((acc, r) => {
    acc[r] = (acc[r] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Paleta de colores ganaderos
  const colores = [
    '#10B981', '#3B82F6', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#6366F1'
  ];

  return {
    labels: Object.keys(conteo),
    datasets: [{
      label: 'Cabezas',
      // EL CAMBIO: Le decimos a TS que esto es estrictamente un array de números
      data: Object.values(conteo) as number[], 
      // Aseguramos que los colores siempre sean strings válidos
      backgroundColor: Object.keys(conteo).map((_, i) => colores[i % colores.length]) as string[],
      borderRadius: 8
    }]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { display: false } 
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1 // Para que no salgan decimales en el conteo de vacas
      }
    }
  }
};
</script>

<template>
  <div class="h-64">
    <Bar v-if="props.datos.length > 0" :data="chartData" :options="chartOptions" />
    <div v-else class="h-full flex items-center justify-center text-gray-400 text-sm italic">
      No hay datos para mostrar
    </div>
  </div>
</template>