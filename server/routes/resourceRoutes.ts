import { Router } from 'express';
import { getAllResources, createResource, updateResource, deleteResource } from '../controllers/resourceController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getAllResources);
router.post('/', createResource);
router.put('/:id', updateResource);
router.delete('/:id', deleteResource);

export default router;
