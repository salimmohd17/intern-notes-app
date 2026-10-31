/**
 * seed.js — Task 1 Notes App
 *
 * Seed data has been removed. The database starts empty so you can
 * enter your own notes. Run this file only if you want to clear all
 * existing notes and reset the auto-increment counter.
 *
 *   node task1-notes-app/backend/database/seed.js
 */
import db from '../src/db.js';

try {
  db.exec('DELETE FROM notes;');
  try {
    db.exec("DELETE FROM sqlite_sequence WHERE name = 'notes';");
  } catch {
    // sqlite_sequence may not exist if no rows were ever inserted — that's fine
  }
  console.log('✓ Notes table cleared. Database is ready and empty.');
} catch (error) {
  console.error('✗ Failed to clear database:', error);
  process.exit(1);
}
