<script setup lang="ts">
import { useRouter } from 'vue-router';
// Importamos el componente de la librería que instalamos
import { GoogleLogin } from 'vue3-google-login';

const router = useRouter();

// Esta función se ejecuta cuando el login con Google es exitoso
const handleLoginSuccess = (response: any) => {
  console.log("Token recibido:", response);
  
  // Por ahora, simulamos el éxito y entramos al sistema
  // En el futuro, aquí guardaremos tu nombre y foto en un Store
  router.push('/dashboard'); 
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      
      <div class="bg-ganadero-dark p-10 text-center text-white relative">
        <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <h1 class="text-4xl font-black italic tracking-tighter mb-2 relative">BOVISOFT</h1>
        <p class="text-green-200 font-medium relative text-sm uppercase tracking-widest">Gestión Ganadera Inteligente</p>
      </div>

      <div class="p-8 space-y-8 flex flex-col items-center">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-800">¡Bienvenido de nuevo!</h2>
          <p class="text-gray-500 mt-2">Inicia sesión para gestionar tu hacienda</p>
        </div>

        <div class="w-full flex justify-center py-4">
          <GoogleLogin :callback="handleLoginSuccess" prompt />
        </div>

        <div class="relative w-full">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-200"></div></div>
          <div class="relative flex justify-center text-xs uppercase"><span class="bg-white px-2 text-gray-400 font-bold">Acceso Seguro</span></div>
        </div>

        <p class="text-xs text-center text-gray-400 px-8">
          Al ingresar, aceptas los términos de servicio y la política de privacidad de Bovisoft.
        </p>
      </div>
    </div>
  </div>
</template>