import { db } from '../db';
import postgres from 'postgres';

async function createTable() {
  try {
    console.log('🚀 Iniciando creación de tabla...');

    const sql = postgres(process.env.DATABASE_URL!, { prepare: false });
    
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name TEXT,
        phone VARCHAR(256)
      );
    `;

    console.log('✅ Tabla creada exitosamente!');
    
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la creación de la tabla:', error);
    process.exit(1);
  }
}

createTable(); 