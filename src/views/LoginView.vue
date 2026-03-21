<script setup lang="ts">
import LoginScreen from '../components/LoginScreen.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const alEntrar = (usuario: any) => {
  // Cuando el login tiene éxito, mandamos al usuario al inventario
  router.push('/inventario');
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <LoginScreen @accesoConcedido="alEntrar" />
  </div>
</template>