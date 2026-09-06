import { Router } from "express";
import {
  getAllRoadmaps,
  createRoadmap,
  updateRoadmap,
  updateTopicStatus,
  deleteRoadmap,
} from "../controllers/roadmapController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = Router();
router.use(protect);
router.get("/", getAllRoadmaps);
router.post("/", createRoadmap);
router.put("/:id", updateRoadmap);
router.patch("/:id/topic/:topicIndex", updateTopicStatus);
router.delete("/:id", deleteRoadmap);
var roadmapRoutes_default = router;
export { roadmapRoutes_default as default };
