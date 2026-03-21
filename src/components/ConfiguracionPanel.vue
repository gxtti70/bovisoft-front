<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';

// Recibimos los datos del usuario actual desde App.vue
const props = defineProps<{
  usuario: any
}>();

// Evento para avisarle a App.vue que recargue el menú superior
const emit = defineEmits(['perfilActualizado']);

// Variables del formulario (Inicializadas vacías, se llenan al montar el componente)
const hacienda = ref('');
const propietario = ref('');
const correo = ref('');

// --- VARIABLES PARA LOS SELECTORES (Simulados por ahora) ---
const moneda = ref('COP');
const unidadPeso = ref('KG');

// Estados de la UI
const guardando = ref(false);
const mensaje = ref('');
const mensajeError = ref('');

// --- FUNCIÓN DE AYUDA PARA EL TOKEN ---
const getConfig = () => {
  const token = localStorage.getItem('bovisoft_token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

// Llenamos el formulario con los datos reales cuando el componente carga
const cargarDatos = () => {
    if (props.usuario) {
        hacienda.value = props.usuario.nombre_hacienda || '';
        propietario.value = props.usuario.nombre || '';
        correo.value = props.usuario.correo || '';
    }
};

onMounted(() => {
    cargarDatos();
});

// Si por alguna razón el usuario cambia rápido en App.vue, actualizamos aquí también
watch(() => props.usuario, () => {
    cargarDatos();
});

// --- FUNCIÓN PARA GUARDAR EN LA BASE DE DATOS ---
const guardarCambios = async () => {
  if (!propietario.value || !correo.value) {
      mensajeError.value = "Nombre y correo son obligatorios";
      setTimeout(() => mensajeError.value = '', 3000);
      return;
  }

  guardando.value = true;
  mensaje.value = '';
  mensajeError.value = '';

  try {
    const payload = {
        nombre: propietario.value,
        correo: correo.value,
        nombre_hacienda: hacienda.value
    };

    // Enviamos los datos a la nueva ruta del backend
    const response = await axios.put('http://localhost:4000/api/auth/perfil', payload, getConfig());

    if (response.data.ok) {
        mensaje.value = "¡Preferencias guardadas correctamente!";
        
        // Le avisamos a App.vue para que actualice la barra superior inmediatamente
        emit('perfilActualizado', payload);
        
        setTimeout(() => mensaje.value = '', 3000);
    }
  } catch (error: any) {
      console.error("Error al guardar perfil:", error);
      mensajeError.value = error.response?.data?.error || "Hubo un error al guardar los cambios";
      setTimeout(() => mensajeError.value = '', 4000);
  } finally {
      guardando.value = false;
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    
    <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
      <div class="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-3xl font-bold border-4 border-ganadero-green text-white shadow-lg font-mono uppercase">
        {{ propietario ? propietario.charAt(0) : 'U' }}
      </div>
      <div>
        <h3 class="text-2xl font-extrabold text-gray-800">{{ propietario || 'Usuario' }}</h3>
        <p class="text-gray-500 font-medium">Propietario</p>
        <span class="inline-block mt-2 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">Cuenta Activa</span>
      </div>
    </div>

    <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h3 class="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Ajustes de la Hacienda</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Nombre de la Finca</label>
          <input v-model="hacienda" type="text" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ganadero-green outline-none font-bold text-gray-700 transition" placeholder="Ej: La Esmeralda" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Propietario (Tu Nombre)</label>
          <input v-model="propietario" type="text" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ganadero-green outline-none font-bold text-gray-700 transition" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Correo de Acceso</label>
          <input v-model="correo" type="email" disabled class="w-full p-3 bg-gray-200 border border-gray-200 rounded-xl outline-none font-bold text-gray-500 cursor-not-allowed" />
        </div>
        
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Moneda Principal</label>
          <select v-model="moneda" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ganadero-green outline-none font-bold text-gray-700 cursor-pointer transition">
            <option value="COP">COP - Peso Colombiano ($)</option>
            <option value="USD">USD - Dólar Estadounidense ($)</option>
            <option value="MXN">MXN - Peso Mexicano ($)</option>
            <option value="EUR">EUR - Euro (€)</option>
            <option value="BRL">BRL - Real Brasileño (R$)</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Unidad de Peso</label>
          <select v-model="unidadPeso" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ganadero-green outline-none font-bold text-gray-700 cursor-pointer transition">
            <option value="KG">Kilogramos (kg)</option>
            <option value="LB">Libras (lb)</option>
            <option value="ARROBA">Arrobas (@)</option>
          </select>
        </div>
      </div>

      <div class="mt-8 flex items-center justify-between">
        <div class="flex-1">
          <div v-if="mensaje" class="flex items-center gap-2 text-green-600 font-bold text-sm animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {{ mensaje }}
          </div>
          <div v-if="mensajeError" class="text-red-600 font-bold text-sm animate-fade-in">
             ❌ {{ mensajeError }}
          </div>
        </div>

        <button @click="guardarCambios" :disabled="guardando" class="bg-ganadero-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg disabled:opacity-50">
          {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </div>
    </div>

  </div>
</template>