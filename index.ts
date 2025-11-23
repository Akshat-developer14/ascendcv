import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const database_url = process.env.DATABASE_URL as string;

const sql = neon(database_url);
const db = drizzle({ client: sql });

export { db };