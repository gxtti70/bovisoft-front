<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { GoogleLogin } from 'vue3-google-login';

/**
 * --- CONFIGURACIÓN DE URL ---
 * Centralizamos la URL. Si existe la variable en el .env (producción), la usa.
 * Si no (desarrollo local), usa el localhost.
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Evento para avisar al App.vue que el usuario entró
const emit = defineEmits(['accesoConcedido']);

// Estado de la interfaz
const vistaActual = ref('login'); 
const cargando = ref(false);
const mensajeError = ref('');
const mensajeExito = ref('');

// Campos del formulario
const nombre = ref('');
const correo = ref('');
const password = ref('');

/**
 * 1. INICIAR SESIÓN (TRADICIONAL)
 */
const iniciarSesion = async () => {
  if (!correo.value || !password.value) {
    mensajeError.value = "Por favor, llena todos los campos.";
    return;
  }
  
  cargando.value = true;
  mensajeError.value = '';
  
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      correo: correo.value,
      password: password.value
    });
    
    if (response.data.ok) {
      localStorage.setItem('bovisoft_token', response.data.token);
      localStorage.setItem('bovisoft_user', JSON.stringify(response.data.usuario));
      emit('accesoConcedido', response.data.usuario);
    }
  } catch (error: any) {
    mensajeError.value = error.response?.data?.error || "Error de conexión con el servidor.";
  } finally {
    cargando.value = false;
  }
};

/**
 * 2. INICIAR SESIÓN (GOOGLE)
 */
const iniciarSesionGoogle = async (response: any) => {
  cargando.value = true;
  mensajeError.value = '';
  
  try {
    const res = await axios.post(`${API_URL}/auth/google`, {
      token: response.credential
    });
    
    if (res.data.ok) {
      localStorage.setItem('bovisoft_token', res.data.token);
      localStorage.setItem('bovisoft_user', JSON.stringify(res.data.usuario));
      emit('accesoConcedido', res.data.usuario);
    }
  } catch (error: any) {
    mensajeError.value = error.response?.data?.error || "Error al verificar con Google.";
  } finally {
    cargando.value = false;
  }
};

/**
 * 3. REGISTRAR CUENTA
 */
const registrarCuenta = async () => {
  if (!nombre.value || !correo.value || !password.value) {
    mensajeError.value = "Todos los campos son obligatorios.";
    return;
  }

  cargando.value = true;
  mensajeError.value = '';

  try {
    const response = await axios.post(`${API_URL}/auth/registro`, {
      nombre: nombre.value,
      correo: correo.value,
      password: password.value
    });

    if (response.data.ok) {
      mensajeExito.value = "¡Cuenta creada! Ahora puedes iniciar sesión.";
      password.value = '';
      vistaActual.value = 'login';
    }
  } catch (error: any) {
    mensajeError.value = error.response?.data?.error || "Error al crear la cuenta.";
  } finally {
    cargando.value = false;
  }
};

/**
 * 4. RECUPERAR CONTRASEÑA (SIMULADO)
 */
const recuperarPassword = () => {
  if (!correo.value) {
    mensajeError.value = "Ingresa tu correo para enviarte las instrucciones.";
    return;
  }
  cargando.value = true;
  setTimeout(() => {
    cargando.value = false;
    mensajeExito.value = "Si el correo existe, recibirás un enlace de recuperación pronto.";
    vistaActual.value = 'login';
  }, 1500);
};

// Utilidad para limpiar mensajes al cambiar de vista
const cambiarVista = (nuevaVista: string) => {
  vistaActual.value = nuevaVista;
  mensajeError.value = '';
  mensajeExito.value = '';
};
</script>

<template>
  <div class="min-h-screen bg-ganadero-dark flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute w-full h-full opacity-10 pointer-events-none" style="background-image: radial-gradient(circle at 50% 50%, #4ade80 0%, transparent 50%);"></div>

    <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative z-10">
      
      <div class="bg-gray-50 p-8 text-center border-b border-gray-100">
        <h1 class="text-3xl font-extrabold tracking-widest text-ganadero-dark leading-none mb-2">BOVISOFT</h1>
        <p class="text-sm font-bold text-ganadero-green">Gestión Ganadera Inteligente</p>
      </div>

      <div class="p-8">
        <div v-if="mensajeError" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold text-center mb-4 border border-red-200">
          {{ mensajeError }}
        </div>
        <div v-if="mensajeExito" class="bg-green-50 text-green-700 p-3 rounded-lg text-sm font-bold text-center mb-4 border border-green-200">
          {{ mensajeExito }}
        </div>

        <div v-if="vistaActual === 'login'" class="space-y-5">
          <form @submit.prevent="iniciarSesion" class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Correo Electrónico</label>
              <input v-model="correo" type="email" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ganadero-green outline-none font-medium" placeholder="admin@hacienda.com" required />
            </div>
            <div>
              <div class="flex justify-between mb-1">
                <label class="block text-xs font-bold text-gray-500 uppercase">Contraseña</label>
                <button type="button" @click="cambiarVista('recuperar')" class="text-xs font-bold text-ganadero-green hover:underline">¿Olvidaste tu clave?</button>
              </div>
              <input v-model="password" type="password" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ganadero-green outline-none font-medium" placeholder="••••••••" required />
            </div>
            <button type="submit" :disabled="cargando" class="w-full py-3 bg-ganadero-dark text-white rounded-xl font-bold shadow-lg hover:bg-gray-800 transition disabled:opacity-50 mt-2">
              {{ cargando ? 'Verificando...' : 'Iniciar Sesión' }}
            </button>
          </form>

          <div class="relative flex items-center justify-center w-full mt-6 mb-2">
            <div class="absolute border-t border-gray-200 w-full"></div>
            <span class="bg-white px-3 text-xs text-gray-400 font-bold uppercase relative">O ingresa con</span>
          </div>

          <div class="flex justify-center w-full">
            <GoogleLogin :callback="iniciarSesionGoogle" prompt />
          </div>

          <p class="text-center text-sm font-medium text-gray-500 mt-4">
            ¿No tienes cuenta? <button type="button" @click="cambiarVista('registro')" class="text-ganadero-green font-bold hover:underline">Regístrate aquí</button>
          </p>
        </div>

        <form v-else-if="vistaActual === 'registro'" @submit.prevent="registrarCuenta" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre Completo</label>
            <input v-model="nombre" type="text" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ganadero-green outline-none font-medium" placeholder="Ej: Santiago" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Correo Electrónico</label>
            <input v-model="correo" type="email" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ganadero-green outline-none font-medium" placeholder="tu@correo.com" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Crear Contraseña</label>
            <input v-model="password" type="password" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ganadero-green outline-none font-medium" placeholder="Mínimo 6 caracteres" required />
          </div>
          <button type="submit" :disabled="cargando" class="w-full py-3 bg-ganadero-green text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition disabled:opacity-50 mt-2">
            {{ cargando ? 'Creando cuenta...' : 'Crear Cuenta' }}
          </button>
          <button type="button" @click="cambiarVista('login')" class="w-full py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition mt-2">
            Volver al Login
          </button>
        </form>

        <form v-else-if="vistaActual === 'recuperar'" @submit.prevent="recuperarPassword" class="space-y-4">
          <p class="text-sm text-gray-500 text-center mb-4">Ingresa tu correo y te enviaremos las instrucciones para recuperar el acceso a tu hacienda.</p>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Correo Electrónico</label>
            <input v-model="correo" type="email" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ganadero-green outline-none font-medium" placeholder="admin@hacienda.com" required />
          </div>
          <button type="submit" :disabled="cargando" class="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition disabled:opacity-50 mt-2">
            {{ cargando ? 'Enviando...' : 'Enviar Instrucciones' }}
          </button>
          <button type="button" @click="cambiarVista('login')" class="w-full py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition mt-2">
            Cancelar
          </button>
        </form>

      </div>
    </div>
  </div>
</template>