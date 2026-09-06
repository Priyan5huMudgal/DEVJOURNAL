import { Router } from "express";
import {
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
} from "../controllers/resourceController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = Router();
router.use(protect);
router.get("/", getAllResources);
router.post("/", createResource);
router.put("/:id", updateResource);
router.delete("/:id", deleteResource);
var resourceRoutes_default = router;
export { resourceRoutes_default as default };
