<script setup lang="ts">
import { ref } from 'vue';
import { useAnimalStore } from '../stores/animalStore';

const emit = defineEmits(['close']);
const store = useAnimalStore();

const nuevoAnimal = ref({
  arete_visual: '',
  nombre: '',
  raza: '',
  genero: 'F' as 'F' | 'M',
  peso_actual: 0
});

const guardando = ref(false);
const mensajeExito = ref('');
const mensajeError = ref('');

const guardar = async () => {
  mensajeError.value = '';
  mensajeExito.value = '';

  if (!nuevoAnimal.value.arete_visual || !nuevoAnimal.value.nombre) {
      mensajeError.value = "Por favor, completa los campos obligatorios.";
      return;
  }
  
  guardando.value = true;
  
  const exito = await store.agregarAnimal(nuevoAnimal.value);
  
  guardando.value = false;
  
  if (exito) {
    mensajeExito.value = "¡Animal registrado correctamente!";
    setTimeout(() => {
        emit('close'); 
    }, 1500);
  } else {
    mensajeError.value = "Hubo un error al guardar. Revisa que el arete no esté repetido o tu conexión.";
  }
};
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4 transition-all">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden transform transition-all">
        
        <div class="bg-ganadero-dark p-5 sm:p-6 text-white text-center flex-shrink-0">
          <div class="flex justify-center mb-2 text-ganadero-green opacity-80">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 sm:w-10 sm:h-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <h3 class="text-xl sm:text-2xl font-black italic text-white leading-none">Nuevo Registro</h3>
          <p class="text-green-200 text-xs sm:text-sm mt-1">Ingrese los datos oficiales</p>
        </div>

        <div class="overflow-y-auto p-5 sm:p-6">
          <form @submit.prevent="guardar" class="space-y-4">
            
            <div v-if="mensajeExito" class="bg-green-50 text-green-700 p-4 rounded-xl flex items-start gap-3 text-sm font-bold animate-fade-in border border-green-200 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-green-600 shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span>{{ mensajeExito }}</span>
            </div>

            <div v-if="mensajeError" class="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 text-sm font-bold animate-fade-in border border-red-200 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-red-600 shrink-0 mt-0.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{{ mensajeError }}</span>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Número de Arete</label>
              <input v-model="nuevoAnimal.arete_visual" type="text" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ganadero-green outline-none font-bold text-gray-700" placeholder="Ej: V-105" required>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre</label>
                <input v-model="nuevoAnimal.nombre" type="text" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ganadero-green outline-none font-bold text-gray-700" placeholder="Ej: Mariposa" required>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Raza</label>
                <select v-model="nuevoAnimal.raza" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ganadero-green outline-none font-bold text-gray-700 cursor-pointer" required>
                  <option value="" disabled>Seleccione...</option>
                  <option value="Brahman">Brahman</option>
                  <option value="Holstein">Holstein</option>
                  <option value="Jersey">Jersey</option>
                  <option value="Angus">Angus</option>
                  <option value="Gyr">Gyr</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Género</label>
                    <select v-model="nuevoAnimal.genero" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ganadero-green outline-none font-bold text-gray-700 cursor-pointer" required>
                        <option value="F">Hembra</option>
                        <option value="M">Macho</option>
                    </select>
                </div>
                <div>
                <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Peso Actual (kg)</label>
                <input v-model.number="nuevoAnimal.peso_actual" type="number" step="0.01" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ganadero-green outline-none font-bold text-gray-700" required>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t mt-4">
              <button type="button" @click="emit('close')" class="w-full sm:flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl font-bold hover:bg-gray-200 transition order-last sm:order-first">Cancelar</button>
              <button type="submit" :disabled="guardando" class="w-full sm:flex-1 bg-ganadero-green text-white py-3 rounded-xl font-black shadow-lg hover:bg-green-700 transition disabled:opacity-50">
                {{ guardando ? 'Guardando...' : 'Guardar Animal' }}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  </Teleport>
</template>