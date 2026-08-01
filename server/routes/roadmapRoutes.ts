import { Router } from 'express';
import { getAllRoadmaps, createRoadmap, updateRoadmap, updateTopicStatus, deleteRoadmap } from '../controllers/roadmapController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getAllRoadmaps);
router.post('/', createRoadmap);
router.put('/:id', updateRoadmap);
router.patch('/:id/topic/:topicIndex', updateTopicStatus);
router.delete('/:id', deleteRoadmap);

export default router;
