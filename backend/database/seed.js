import 'dotenv/config';
import { pool, query } from '../src/db.js';

try {
  await query('TRUNCATE TABLE notes RESTART IDENTITY');
  console.log('Notes table cleared. Database is ready and empty.');
} catch (error) {
  console.error('Failed to clear database:', error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
