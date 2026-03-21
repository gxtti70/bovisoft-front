<script setup lang="ts">
import VentasTabla from '../components/VentasTabla.vue';
</script>

<template>
  <div class="animate-fade-in">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-3xl font-extrabold text-gray-800">Historial Comercial</h2>
        <p class="text-gray-500">Registro de todas las transacciones y salidas de ganado</p>
      </div>
    </div>
    <VentasTabla />
  </div>
</template>