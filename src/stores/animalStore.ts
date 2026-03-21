import { defineStore } from 'pinia';
import axios from 'axios';

// 1. Centralizamos la URL para no repetir código
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export interface Animal {
    id?: number;
    arete_visual: string;
    nombre: string;
    raza: string;
    genero: 'M' | 'F';
    peso_actual: number;
}

// Función de ayuda para obtener headers con el token actualizado
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
        paginaActual: 1,
        hayMasResultados: true,
        totalEnBaseDeDatos: 0
    }),
    
    actions: {
        // 1. CARGAR ANIMALES
        async fetchAnimales(reset = true) {
            if (reset) {
                this.paginaActual = 1;
                this.hayMasResultados = true;
                this.animales = [];
            }

            if (!this.hayMasResultados && !reset) return;

            this.loading = true;
            try {
                // Usamos la constante API_URL y pasamos la página actual
                const response = await axios.get(`${API_URL}/animales?page=${this.paginaActual}`, getConfig());
                
                const vacasNuevas = response.data.animales || [];

                if (reset) {
                    this.animales = vacasNuevas;
                } else {
                    this.animales = [...this.animales, ...vacasNuevas];
                }

                this.hayMasResultados = response.data.hayMasResultados;
                this.totalEnBaseDeDatos = response.data.total;
                
            } catch (error) {
                console.error("Error cargando animales:", error);
            } finally {
                this.loading = false;
            }
        },

        async cargarMasPaginas() {
            if (!this.loading && this.hayMasResultados) {
                this.paginaActual++;
                await this.fetchAnimales(false);
            }
        },

        // 2. REGISTRAR ANIMAL (Actualizado con API_URL)
        async agregarAnimal(nuevoAnimal: Animal) {
            try {
                const response = await axios.post(`${API_URL}/animales`, nuevoAnimal, getConfig());
                if (response.status === 200 || response.status === 201) {
                    await this.fetchAnimales(true);
                    return true;
                }
                return false;
            } catch (error) {
                console.error("Error al guardar:", error);
                return false;
            }
        },

        // 3. ELIMINAR ANIMAL (Actualizado con API_URL)
        async eliminarAnimal(id: number) {
            try {
                const response = await axios.delete(`${API_URL}/animales/${id}`, getConfig());
                if (response.status === 200) {
                    this.animales = this.animales.filter(a => a.id !== id);
                    this.totalEnBaseDeDatos--;
                    return true;
                }
                return false;
            } catch (error) {
                console.error("Error al eliminar:", error);
                return false;
            }
        },

        // 4. VENDER ANIMAL (Actualizado con API_URL)
        async venderAnimal(datosVenta: { animal_id: number, precio_venta: number, cliente: string }) {
            try {
                const payload = {
                    animal_id: Number(datosVenta.animal_id),
                    precio_venta: Number(datosVenta.precio_venta),
                    cliente: datosVenta.cliente.trim()
                };

                const response = await axios.post(`${API_URL}/animales/vender`, payload, getConfig());
                
                if (response.data.ok) {
                    this.animales = this.animales.filter(a => a.id !== payload.animal_id);
                    this.totalEnBaseDeDatos--;
                    return true;
                }
                return false;
            } catch (error: any) {
                console.error("Error detallado en la venta:", error.response?.data?.error || error.message);
                return false;
            }
        }
    }
});