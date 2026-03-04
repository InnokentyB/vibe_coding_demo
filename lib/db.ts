import Database from 'better-sqlite3';
import { env } from './env';

const sqlite = new Database(env.DATABASE_URL, { verbose: console.log });

console.log(`[DB Initialization] Connect to SQLite at ${env.DATABASE_URL}`);

// Initialize the database structure if it doesn't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS requests (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    urgency TEXT NOT NULL DEFAULT 'low',
    status TEXT NOT NULL DEFAULT 'pending',
    createdAt TEXT NOT NULL
  )
`);
console.log(`[DB Initialization] Verified requests table structure`);

/**
 * Returns the configured better-sqlite3 database instance.
 * @returns {Database.Database} The database instance.
 */
export const getDb = () => sqlite;
