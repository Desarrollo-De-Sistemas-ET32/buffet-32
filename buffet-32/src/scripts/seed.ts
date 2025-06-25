import { db } from '../db';
import { users } from '../db/schema';

async function seed() {
  try {
    console.log('🌱 Iniciando el sembrado de datos...');

    // Insertar usuarios de prueba
    const seedUsers = [
      { fullName: 'Juan Pérez', phone: '+1234567890' },
      { fullName: 'María García', phone: '+0987654321' },
      { fullName: 'Carlos López', phone: '+1122334455' },
    ];

    console.log('📝 Insertando usuarios de prueba...');
    const insertedUsers = await db.insert(users).values(seedUsers).returning();
    console.log('✅ Usuarios insertados:', insertedUsers);

    console.log('✨ Sembrado completado exitosamente!');
  } catch (error) {
    console.error('❌ Error durante el sembrado:', error);
    process.exit(1);
  }

  process.exit(0);
}

seed(); 