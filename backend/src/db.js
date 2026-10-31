import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required. Configure it in the backend environment.');
}

const rejectUnauthorized = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error);
});

export function query(text, params = []) {
  return pool.query(text, params);
}

export async function checkDatabaseConnection() {
  const { rows } = await pool.query('SELECT NOW() AS current_time');
  return rows[0];
}
