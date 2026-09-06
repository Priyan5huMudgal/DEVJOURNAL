import { Router } from "express";
import { getDashboardStats } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = Router();
router.get("/stats", protect, getDashboardStats);
var analyticsRoutes_default = router;
export { analyticsRoutes_default as default };
