import 'dotenv/config';
import { db } from '../lib/drizzle';
import { sql, eq } from 'drizzle-orm';
import { users } from '../lib/drizzle/schema';

async function ensureUsersTable(): Promise<boolean> {
  const res = await db.execute(sql`select to_regclass('public.users') as regclass`);
  const row: any = Array.isArray(res) ? res[0] : (res as any).rows?.[0] ?? res;
  return !!(row && (row.regclass || row.to_regclass));
}

async function main() {
  try {
    let exists = await ensureUsersTable();
    if (!exists) {
      console.log("La tabla 'users' no existe. Creándola...");
      await db.execute(sql`create table if not exists public.users (
        id serial primary key,
        full_name text,
        phone varchar(256)
      )`);
      exists = await ensureUsersTable();
      if (!exists) {
        console.error("No se pudo crear la tabla 'users'.");
        process.exit(2);
      }
    }

    const fullName = `Test User ${Date.now()}`;
    const phone = '555-TEST';

    const inserted = await db.insert(users).values({ fullName, phone }).returning();
    console.log('Insert OK:', inserted[0]);

    const fetched = await db.select().from(users).where(eq(users.id, inserted[0].id));
    console.log('Select OK:', fetched[0]);

    // Limpieza: borrar el registro de prueba
    await db.delete(users).where(eq(users.id, inserted[0].id));
    console.log('Cleanup OK');

    process.exit(0);
  } catch (err) {
    console.error('Test FAILED:', err);
    process.exit(1);
  }
}

main();
