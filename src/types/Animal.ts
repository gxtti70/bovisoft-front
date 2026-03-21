export interface Animal {
    id?: number;
    arete_visual: string;
    nombre: string;
    raza: string;
    genero: 'M' | 'F';
    peso_actual: number;
    fecha_registro?: string;
}