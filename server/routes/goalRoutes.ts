import { Router } from 'express';
import { getAllGoals, createGoal, updateGoal, deleteGoal } from '../controllers/goalController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getAllGoals);
router.post('/', createGoal);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

export default router;
