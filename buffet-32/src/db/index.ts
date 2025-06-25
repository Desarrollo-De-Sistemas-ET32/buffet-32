import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL no está definida en las variables de entorno');
}

// Configurar el cliente de postgres
// Desactivar prefetch ya que no es compatible con el modo "Transaction" pool
const client = postgres(process.env.DATABASE_URL, { 
  prepare: false,
  // Configuraciones adicionales recomendadas para Supabase
  max: 1, // número máximo de conexiones
  idle_timeout: 20, // tiempo de espera antes de cerrar conexiones inactivas
});

// Crear la instancia de drizzle
export const db = drizzle(client);

// Exportar los tipos generados
export type * from './schema'; 