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
      data: Object.values(conteo),
      // Asigna un color diferente a cada barra
      backgroundColor: Object.keys(conteo).map((_, i) => colores[i % colores.length]),
      borderRadius: 8
    }]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } }
};
</script>

<template>
  <div class="h-64">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>