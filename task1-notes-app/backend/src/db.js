import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDir = path.resolve(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'notes.db');
const db = new DatabaseSync(dbPath);

// Initialize schema
const schemaPath = path.join(dbDir, 'schema.sql');
if (fs.existsSync(schemaPath)) {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);
}

// Auto-seed default notes if table is empty (helpful for fresh cloud deployments)
try {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM notes').get();
  if (countRow && countRow.count === 0) {
    const defaultNotes = [
      {
        title: 'Welcome to MY LIFE NOTES',
        content: 'Organize your thoughts, daily tasks, study materials, and personal reflections in one clean workspace. Easily create, edit, pin, and categorize notes.',
        category: 'Personal',
        is_pinned: 1,
        color: '#fef3c7'
      },
      {
        title: 'Keyboard Shortcuts & Quick Actions',
        content: 'Press "/" or "Ctrl+K" to instantly jump to search.\nPress "c" to quickly compose a new note.\nPress "Ctrl+Enter" to save immediately in the editor.',
        category: 'Study',
        is_pinned: 1,
        color: '#dbeafe'
      },
      {
        title: 'Weekly Goals & Milestones',
        content: '- Review project roadmap\n- Keep notes organized by categories\n- Update portfolio on Netlify',
        category: 'Work',
        is_pinned: 0,
        color: '#dcfce7'
      }
    ];

    db.exec('BEGIN TRANSACTION;');
    const insert = db.prepare(`
      INSERT INTO notes (title, content, category, is_pinned, color, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);
    for (const note of defaultNotes) {
      insert.run(note.title, note.content, note.category, note.is_pinned, note.color);
    }
    db.exec('COMMIT;');
  }
} catch (err) {
  console.warn('Note count check failed or skipped:', err.message);
}

export default db;
