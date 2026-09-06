import { Router } from "express";
import {
  getAllGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../controllers/goalController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = Router();
router.use(protect);
router.get("/", getAllGoals);
router.post("/", createGoal);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);
var goalRoutes_default = router;
export { goalRoutes_default as default };
