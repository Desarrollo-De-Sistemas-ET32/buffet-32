import { db } from '../db';
import { users } from '../db/schema';

async function reset() {
  try {
    console.log('🗑️  Iniciando el reseteo de la base de datos...');

    // Eliminar todos los registros de la tabla users
    console.log('🧹 Eliminando todos los usuarios...');
    await db.delete(users);
    console.log('✅ Todos los usuarios han sido eliminados');

    console.log('✨ Base de datos reseteada exitosamente!');
  } catch (error) {
    console.error('❌ Error durante el reseteo:', error);
    process.exit(1);
  }

  process.exit(0);
}

reset(); 