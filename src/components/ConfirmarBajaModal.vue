<script setup lang="ts">
defineProps<{
  abierto: boolean;
  nombre: string;
}>();

const emit = defineEmits(['confirmar', 'cancelar']);
</script>

<template>
  <div v-if="abierto" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-red-100">
      
      <div class="bg-red-600 p-6 text-white text-center flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" class="w-20 h-20 mb-3 text-red-100 opacity-80">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>

        <h3 class="text-2xl font-black italic text-white leading-none">Confirmar Baja</h3>
      </div>

      <div class="p-6 text-center space-y-4">
        
        <p class="text-gray-600 text-lg">
          ¿Estás seguro de que deseas eliminar a <strong class="text-gray-900 text-xl">{{ nombre }}</strong> del inventario?
        </p>
        
        <div class="bg-red-50 p-3 rounded-xl border border-red-100">
          <p class="text-sm font-bold text-red-700">
            Esta acción no se puede deshacer y los datos se perderán permanentemente.
          </p>
        </div>

        <div class="flex gap-3 pt-4">
          <button @click="emit('cancelar')" class="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition">
            Cancelar
          </button>
          
          <button @click="emit('confirmar')" class="flex-1 py-3 bg-red-600 text-white rounded-xl font-black shadow-lg hover:bg-red-700 transition flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Dar de Baja
          </button>
        </div>
      </div>
    </div>
  </div>
</template>