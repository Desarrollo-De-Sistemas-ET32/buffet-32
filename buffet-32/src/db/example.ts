import { db } from './index';
import { users } from './schema';

// Ejemplo de consulta
async function getUsers() {
  try {
    const allUsers = await db.select().from(users);
    console.log('Usuarios encontrados:', allUsers);
    return allUsers;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

// Ejemplo de inserción
async function createUser(fullName: string, phone: string) {
  try {
    const newUser = await db.insert(users).values({
      fullName,
      phone,
    }).returning();
    console.log('Usuario creado:', newUser);
    return newUser;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
}

export { getUsers, createUser }; 