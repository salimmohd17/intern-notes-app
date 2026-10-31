import { query } from '../db.js';

function parseNoteId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export const getNotes = async (req, res) => {
  try {
    const { search, category, pinned } = req.query;
    let queryText = 'SELECT * FROM notes WHERE 1=1';
    const params = [];

    if (search && search.trim() !== '') {
      params.push(`%${search.trim()}%`);
      queryText += ` AND (title ILIKE $${params.length} OR content ILIKE $${params.length})`;
    }

    if (category && category !== 'All') {
      params.push(category);
      queryText += ` AND category = $${params.length}`;
    }

    if (pinned !== undefined && pinned !== '') {
      params.push(pinned === 'true' || pinned === '1');
      queryText += ` AND is_pinned = $${params.length}`;
    }

    queryText += ' ORDER BY is_pinned DESC, updated_at DESC, id DESC';
    const { rows: notes } = await query(queryText, params);
    return res.json({ success: true, count: notes.length, data: notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error while retrieving notes' });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const id = parseNoteId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, error: 'Invalid note id' });
    }

    const { rows: [note] } = await query('SELECT * FROM notes WHERE id = $1', [id]);
    if (!note) {
      return res.status(404).json({ success: false, error: `Note with id ${id} not found` });
    }

    return res.json({ success: true, data: note });
  } catch (error) {
    console.error('Error fetching note:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error while retrieving note' });
  }
};

export const createNote = async (req, res) => {
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
    const notePinned = Boolean(is_pinned);
    const { rows: [newNote] } = await query(`
      INSERT INTO notes (title, content, category, is_pinned, color, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `, [title.trim(), content.trim(), noteCategory, notePinned, noteColor]);

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

export const updateNote = async (req, res) => {
  try {
    const id = parseNoteId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, error: 'Invalid note id' });
    }
    const { title, content, category, is_pinned, color } = req.body;
    const { rows: [existingNote] } = await query('SELECT * FROM notes WHERE id = $1', [id]);

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
    const updatedPinned = is_pinned !== undefined ? Boolean(is_pinned) : existingNote.is_pinned;
    const updatedColor = color !== undefined ? color : existingNote.color;
    const { rows: [updatedNote] } = await query(`
      UPDATE notes
      SET title = $1, content = $2, category = $3, is_pinned = $4, color = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `, [updatedTitle, updatedContent, updatedCategory, updatedPinned, updatedColor, id]);

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

export const deleteNote = async (req, res) => {
  try {
    const id = parseNoteId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, error: 'Invalid note id' });
    }
    const { rows: [existingNote] } = await query('SELECT id FROM notes WHERE id = $1', [id]);

    if (!existingNote) {
      return res.status(404).json({ success: false, error: `Note with id ${id} not found` });
    }
    await query('DELETE FROM notes WHERE id = $1', [id]);

    return res.json({
      success: true,
      message: 'Note deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete note' });
  }
};

export const togglePin = async (req, res) => {
  try {
    const id = parseNoteId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, error: 'Invalid note id' });
    }
    const { rows: [existingNote] } = await query('SELECT * FROM notes WHERE id = $1', [id]);

    if (!existingNote) {
      return res.status(404).json({ success: false, error: `Note with id ${id} not found` });
    }

    const newPinned = !existingNote.is_pinned;
    const { rows: [updatedNote] } = await query(`
      UPDATE notes
      SET is_pinned = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [newPinned, id]);

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

export const getCategories = async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT DISTINCT category
      FROM notes
      WHERE category IS NOT NULL AND category <> ''
      ORDER BY category ASC
    `);
    const categories = rows.map((row) => row.category);
    return res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
};
