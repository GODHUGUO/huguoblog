// server/db/index.ts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './shema';

const sqlite = new Database('.data/db/sqlite.db')
export const db = drizzle(sqlite, { schema });