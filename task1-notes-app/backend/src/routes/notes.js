import express from 'express';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  togglePin,
  getCategories
} from '../controllers/notesController.js';

const router = express.Router();

router.get('/', getNotes);
router.get('/categories', getCategories);
router.get('/:id', getNoteById);
router.post('/', createNote);
router.put('/:id', updateNote);
router.patch('/:id/pin', togglePin);
router.delete('/:id', deleteNote);

export default router;
