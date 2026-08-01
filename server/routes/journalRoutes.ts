import { Router } from 'express';
import { getAllEntries, createEntry, updateEntry, deleteEntry } from '../controllers/journalController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getAllEntries);
router.post('/', createEntry);
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);

export default router;
