import { defineStore } from 'pinia';
import axios from 'axios';

// Definimos la estructura de un Animal
export interface Animal {
    id?: number;
    arete_visual: string;
    nombre: string;
    raza: string;
    genero: 'M' | 'F';
    peso_actual: number;
}

// --- FUNCIÓN DE AYUDA PARA EL TOKEN ---
const getConfig = () => {
    const token = localStorage.getItem('bovisoft_token');
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

export const useAnimalStore = defineStore('animalStore', {
    state: () => ({
        animales: [] as Animal[],
        loading: false,
        // --- NUEVAS VARIABLES PARA PAGINACIÓN ---
        paginaActual: 1,
        hayMasResultados: true,
        totalEnBaseDeDatos: 0
    }),
    
    actions: {
        // 1. Cargar animales (Ahora soporta paginación)
        async fetchAnimales(reset = true) {
            // Si nos piden resetear (ej: al iniciar sesión o registrar un animal nuevo)
            if (reset) {
                this.paginaActual = 1;
                this.hayMasResultados = true;
                this.animales = [];
            }

            // Si ya no hay más vacas que cargar, no hacemos peticiones innecesarias
            if (!this.hayMasResultados) return;

            this.loading = true;
            try {
                // Le pasamos la página en la URL (Query Params)
                const url = `http://localhost:4000/api/animales?pagina=${this.paginaActual}`;
                const response = await axios.get(url, getConfig());
                
                const vacasNuevas = response.data.animales || [];

                if (reset) {
                    this.animales = vacasNuevas; // Reemplazamos
                } else {
                    this.animales = [...this.animales, ...vacasNuevas]; // Juntamos las viejas con las nuevas
                }

                // Actualizamos nuestros datos de paginación con lo que dijo el backend
                this.hayMasResultados = response.data.hayMasResultados;
                this.totalEnBaseDeDatos = response.data.total;
                
            } catch (error) {
                console.error("Error cargando animales:", error);
            } finally {
                this.loading = false;
            }
        },

        // --- NUEVA FUNCIÓN PARA EL SCROLL INFINITO ---
        async cargarMasPaginas() {
            if (!this.loading && this.hayMasResultados) {
                this.paginaActual++; // Sumamos 1 a la página
                await this.fetchAnimales(false); // Llamamos a la API sin resetear la lista
            }
        },

        // 2. Registrar un nuevo animal
        async agregarAnimal(nuevoAnimal: Animal) {
            try {
                const response = await axios.post('http://localhost:4000/api/animales', nuevoAnimal, getConfig());
                if (response.status === 200 || response.status === 201) {
                    await this.fetchAnimales(true); // Reseteamos la lista para ver al nuevo de primero
                    return true;
                }
                return false;
            } catch (error) {
                console.error("Error al guardar:", error);
                return false;
            }
        },

        // 3. Eliminar un animal
        async eliminarAnimal(id: number) {
            try {
                const response = await axios.delete(`http://localhost:4000/api/animales/${id}`, getConfig());
                if (response.status === 200) {
                    this.animales = this.animales.filter(a => a.id !== id);
                    this.totalEnBaseDeDatos--; // Restamos 1 al contador
                    return true;
                }
                return false;
            } catch (error) {
                console.error("Error al eliminar:", error);
                return false;
            }
        },

        // 4. Registrar una venta
        async venderAnimal(datosVenta: { animal_id: number, precio_venta: number, cliente: string }) {
            try {
                const payload = {
                    animal_id: Number(datosVenta.animal_id),
                    precio_venta: Number(datosVenta.precio_venta),
                    cliente: datosVenta.cliente.trim()
                };

                const response = await axios.post('http://localhost:4000/api/animales/vender', payload, getConfig());
                
                if (response.data.ok) {
                    this.animales = this.animales.filter(a => a.id !== payload.animal_id);
                    this.totalEnBaseDeDatos--; // Restamos 1 al contador
                    return true;
                }
                return false;
            } catch (error: any) {
                const mensajeError = error.response?.data?.error || error.message;
                console.error("Error detallado en la venta:", mensajeError);
                return false;
            }
        }
    }
});