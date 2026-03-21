<script setup lang="ts">
import { ref } from 'vue';
import { useAnimalStore } from '../stores/animalStore';

const props = defineProps<{ animal: any, abierto: boolean }>();
const emit = defineEmits(['close']);
const store = useAnimalStore();

const precioDisplay = ref(''); 
const precioNumerico = ref(0); 
const cliente = ref('');
const guardando = ref(false);
const mensajeExito = ref('');

// --- 1. BARRERA FÍSICA: Bloquea las teclas que no son números ---
const soloNumeros = (e: KeyboardEvent) => {
  // Permitimos borrar y navegar
  if (['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) return;
  // Si la tecla presionada NO es un número del 0 al 9, bloqueamos la acción
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
  }
};

// --- 2. BARRERA DE FORMATEO: Limpia si pegan (Ctrl+V) y formatea los miles ---
const formatearPrecio = (event: Event) => {
  const input = event.target as HTMLInputElement;
  
  // Limpiamos todo lo que no sea dígito
  let valorLimpio = input.value.replace(/\D/g, '');

  if (!valorLimpio) {
    precioDisplay.value = '';
    precioNumerico.value = 0;
    input.value = ''; // Forzamos limpiar la vista
    return;
  }

  precioNumerico.value = parseInt(valorLimpio, 10);
  const nuevoValor = new Intl.NumberFormat('es-CO').format(precioNumerico.value);
  
  precioDisplay.value = nuevoValor;
  // FORZAMOS LA VISTA: Le decimos al input que su texto exacto es el formateado
  input.value = nuevoValor; 
};

const confirmarVenta = async () => {
  if (precioNumerico.value <= 0 || !cliente.value.trim()) {
    alert("Por favor ingresa un precio válido y el nombre del cliente.");
    return;
  }

  guardando.value = true;
  
  const exito = await store.venderAnimal({
    animal_id: props.animal.id,
    precio_venta: precioNumerico.value,
    cliente: cliente.value
  });
  
  if (exito) {
    mensajeExito.value = "¡Venta registrada con éxito!";
    setTimeout(() => {
      mensajeExito.value = '';
      emit('close');
      precioDisplay.value = '';
      precioNumerico.value = 0;
      cliente.value = '';
    }, 2000);
  } else {
    alert("Hubo un error al registrar la venta. Revisa la consola.");
  }
  
  guardando.value = false;
};
</script>

<template>
  <div v-if="abierto" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-blue-100">
      
      <div class="bg-blue-600 p-6 text-white text-center flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" class="w-20 h-20 mb-3 text-blue-100 opacity-80">
          <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>

        <h3 class="text-2xl font-black italic text-white leading-none">Cerrar Negocio</h3>
        <p class="text-blue-100 text-sm mt-1">Vas a vender a: <strong>{{ animal.nombre }}</strong></p>
      </div>

      <div class="p-6 space-y-4">
        
        <div v-if="mensajeExito" class="bg-green-50 text-green-700 p-4 rounded-xl flex items-center justify-center gap-3 font-bold text-lg animate-bounce border border-green-200 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6 text-green-600">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span>{{ mensajeExito }}</span>
        </div>

        <div v-else class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Precio de Venta (COP)</label>
            <div class="relative">
              <span class="absolute left-4 top-3 text-gray-400 font-bold">$</span>
              <input 
                :value="precioDisplay" 
                @input="formatearPrecio" 
                @keypress="soloNumeros"
                type="text" 
                inputmode="numeric" 
                class="w-full pl-8 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg text-blue-700" 
                placeholder="0"
              >
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre del Comprador</label>
            <input v-model="cliente" type="text" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-700" placeholder="Ej: Ganadería La Bendición">
          </div>

          <div class="flex gap-3 pt-4">
            <button @click="emit('close')" class="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition">Cancelar</button>
            <button @click="confirmarVenta" :disabled="guardando" class="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg hover:bg-blue-700 transition disabled:opacity-50">
              {{ guardando ? 'PROCESANDO...' : 'CONFIRMAR VENTA' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>