<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ConfiguracionPanel from '../components/ConfiguracionPanel.vue';

const usuarioActual = ref<any>(null);

const cargarUsuario = () => {
  const userStr = localStorage.getItem('bovisoft_user');
  if (userStr) {
    usuarioActual.value = JSON.parse(userStr);
  }
};

const actualizarPerfilUsuario = (nuevosDatos: any) => {
  usuarioActual.value = { ...usuarioActual.value, ...nuevosDatos };
  localStorage.setItem('bovisoft_user', JSON.stringify(usuarioActual.value));
  // Opcional: Recargar la página para que el Navbar actualice el nombre
  window.location.reload(); 
};

onMounted(cargarUsuario);
</script>

<template>
  <div class="animate-fade-in">
    <ConfiguracionPanel 
      v-if="usuarioActual"
      :usuario="usuarioActual" 
      @perfilActualizado="actualizarPerfilUsuario" 
    />
  </div>
</template>