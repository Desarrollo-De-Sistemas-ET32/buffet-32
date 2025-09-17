import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

if (!process.env.POSTGRES_URL) {
  throw new Error('La variable de entorno POSTGRES_URL no está definida.');
}

// Crea el pool de conexiones
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

// Crea la instancia de Drizzle y la exporta para ser usada en la aplicación
export const db = drizzle(pool, { schema });
