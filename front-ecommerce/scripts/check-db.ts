import 'dotenv/config';
import { db } from '../lib/drizzle';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    const res = await db.execute(sql`select 1 as ok, now() as now`);
    console.log('DB connection OK:', res);
    process.exit(0);
  } catch (err) {
    console.error('DB connection FAILED:', err);
    process.exit(1);
  }
}

main();

