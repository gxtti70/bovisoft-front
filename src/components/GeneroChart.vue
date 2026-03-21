<script setup lang="ts">
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps<{
  datos: any[]
}>();

const chartData = computed(() => {
  const machos = props.datos.filter(a => a.genero === 'M').length;
  const hembras = props.datos.filter(a => a.genero === 'F').length;

  return {
    labels: ['Machos', 'Hembras'],
    datasets: [{
      data: [machos, hembras],
      backgroundColor: ['#3B82F6', '#EC4899'], // Azul y Rosa
      hoverOffset: 4
    }]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<template>
  <div class="h-64">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>