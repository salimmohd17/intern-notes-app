import 'dotenv/config';
import { checkDatabaseConnection, pool } from '../src/db.js';

try {
  const result = await checkDatabaseConnection();
  const { rows } = await pool.query(`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename
  `);

  console.log(`Database connected: ${result.current_time.toISOString()}`);
  console.log('Tables:', rows.map(({ tablename }) => tablename).join(', ') || '(none)');
} catch (error) {
  console.error('Database connection failed:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
