import { Router } from 'express';
import { getAllSnippets, createSnippet, updateSnippet, deleteSnippet } from '../controllers/snippetController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getAllSnippets);
router.post('/', createSnippet);
router.put('/:id', updateSnippet);
router.delete('/:id', deleteSnippet);

export default router;
