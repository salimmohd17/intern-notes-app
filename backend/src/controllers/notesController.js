import db from '../db.js';

// Get all notes with search & filtering
export const getNotes = (req, res) => {
  try {
    const { search, category, pinned } = req.query;
    let query = 'SELECT * FROM notes WHERE 1=1';
    const params = [];

    if (search && search.trim() !== '') {
      query += ' AND (title LIKE ? OR content LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (pinned !== undefined && pinned !== '') {
      query += ' AND is_pinned = ?';
      params.push(pinned === 'true' || pinned === '1' ? 1 : 0);
    }

    query += ' ORDER BY is_pinned DESC, updated_at DESC, id DESC';

    const stmt = db.prepare(query);
    const notes = stmt.all(...params);

    return res.json({ success: true, count: notes.length, data: notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error while retrieving notes' });
  }
};

// Get single note by ID
export const getNoteById = (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('SELECT * FROM notes WHERE id = ?');
    const note = stmt.get(id);

    if (!note) {
      return res.status(404).json({ success: false, error: `Note with id ${id} not found` });
    }

    return res.json({ success: true, data: note });
  } catch (error) {
    console.error('Error fetching note:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error while retrieving note' });
  }
};

// Create a new note
export const createNote = (req, res) => {
  try {
    const { title, content, category, is_pinned, color } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Title is required and cannot be empty.' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Content is required and cannot be empty.' });
    }

    const noteCategory = (category && category.trim()) || 'General';
    const noteColor = color || '#ffffff';
    const notePinned = is_pinned ? 1 : 0;

    const stmt = db.prepare(`
      INSERT INTO notes (title, content, category, is_pinned, color, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    const result = stmt.run(title.trim(), content.trim(), noteCategory, notePinned, noteColor);

    const newNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid);

    return res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: newNote
    });
  } catch (error) {
    console.error('Error creating note:', error);
    return res.status(500).json({ success: false, error: 'Failed to create note' });
  }
};

// Update an existing note
export const updateNote = (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, is_pinned, color } = req.body;

    const existingNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
    if (!existingNote) {
      return res.status(404).json({ success: false, error: `Note with id ${id} not found` });
    }

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ success: false, error: 'Title cannot be empty.' });
    }
    if (content !== undefined && !content.trim()) {
      return res.status(400).json({ success: false, error: 'Content cannot be empty.' });
    }

    const updatedTitle = title !== undefined ? title.trim() : existingNote.title;
    const updatedContent = content !== undefined ? content.trim() : existingNote.content;
    const updatedCategory = category !== undefined ? category.trim() : existingNote.category;
    const updatedPinned = is_pinned !== undefined ? (is_pinned ? 1 : 0) : existingNote.is_pinned;
    const updatedColor = color !== undefined ? color : existingNote.color;

    const stmt = db.prepare(`
      UPDATE notes
      SET title = ?, content = ?, category = ?, is_pinned = ?, color = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(updatedTitle, updatedContent, updatedCategory, updatedPinned, updatedColor, id);

    const updatedNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(id);

    return res.json({
      success: true,
      message: 'Note updated successfully',
      data: updatedNote
    });
  } catch (error) {
    console.error('Error updating note:', error);
    return res.status(500).json({ success: false, error: 'Failed to update note' });
  }
};

// Delete a note
export const deleteNote = (req, res) => {
  try {
    const { id } = req.params;
    const existingNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(id);

    if (!existingNote) {
      return res.status(404).json({ success: false, error: `Note with id ${id} not found` });
    }

    db.prepare('DELETE FROM notes WHERE id = ?').run(id);

    return res.json({
      success: true,
      message: 'Note deleted successfully',
      data: { id: Number(id) }
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete note' });
  }
};

// Toggle pin status
export const togglePin = (req, res) => {
  try {
    const { id } = req.params;
    const existingNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(id);

    if (!existingNote) {
      return res.status(404).json({ success: false, error: `Note with id ${id} not found` });
    }

    const newPinned = existingNote.is_pinned ? 0 : 1;
    db.prepare('UPDATE notes SET is_pinned = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newPinned, id);

    const updatedNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
    return res.json({
      success: true,
      message: newPinned ? 'Note pinned' : 'Note unpinned',
      data: updatedNote
    });
  } catch (error) {
    console.error('Error toggling pin status:', error);
    return res.status(500).json({ success: false, error: 'Failed to toggle pin status' });
  }
};

// Get categories list
export const getCategories = (req, res) => {
  try {
    const rows = db.prepare('SELECT DISTINCT category FROM notes WHERE category IS NOT NULL AND category != "" ORDER BY category ASC').all();
    const categories = rows.map((r) => r.category);
    return res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
};
