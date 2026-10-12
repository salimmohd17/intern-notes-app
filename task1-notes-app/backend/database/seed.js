import db from '../src/db.js';
try {
  // Clear existing notes
  db.exec('DELETE FROM notes;');
  try {
    db.exec("DELETE FROM sqlite_sequence WHERE name = 'notes';");
  } catch {
    // sqlite_sequence might not exist yet on fresh databases
  }

  db.exec('BEGIN TRANSACTION;');
  const insert = db.prepare(`
    INSERT INTO notes (title, content, category, is_pinned, color, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);

  for (const note of initialNotes) {
    insert.run(note.title, note.content, note.category, note.is_pinned, note.color);
  }
  db.exec('COMMIT;');

  console.log(`✅ Successfully seeded ${initialNotes.length} initial notes into notes.db!`);
} catch (error) {
  console.error('❌ Failed to seed database:', error);
  process.exit(1);
}
