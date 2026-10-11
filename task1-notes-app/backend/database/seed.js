import db from '../src/db.js';

const initialNotes = [
  {
    title: 'CodeNova Full Stack Internship Roadmap',
    content: 'Review Task 1 (Notes Application) and Task 2 (Expense Tracker). Ensure database persistence, responsive UI, search filtering, and comprehensive README documentation before the submission deadline.',
    category: 'Work',
    is_pinned: 1,
    color: '#fef3c7' // amber
  },
  {
    title: 'Express & SQLite Best Practices',
    content: '1. Utilize prepared statements to prevent SQL injection.\n2. Validate incoming payloads on both client and server layers.\n3. Centralize error handling middleware.\n4. Design intuitive RESTful response contracts.',
    category: 'Study',
    is_pinned: 1,
    color: '#dbeafe' // blue
  },
  {
    title: 'Grocery & Weekend Shopping List',
    content: '- Almond milk & Greek yogurt\n- Whole grain bread\n- Organic green tea\n- Fresh avocados & spinach\n- Dark chocolate (85%)',
    category: 'Personal',
    is_pinned: 0,
    color: '#dcfce7' // green
  },
  {
    title: 'Project Architecture Ideas',
    content: 'Plan responsive card grid and list views for notes. Implement instant search filter, color tagging, pin to top, and toast notifications for network alerts.',
    category: 'Ideas',
    is_pinned: 0,
    color: '#f3e8ff' // purple
  },
  {
    title: 'Urgent: Submit GitHub Repo Link',
    content: 'Make sure git commits are clear and professional. Double check that .gitignore excludes node_modules and local temporary SQLite files.',
    category: 'Urgent',
    is_pinned: 0,
    color: '#fee2e2' // rose
  }
];

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
