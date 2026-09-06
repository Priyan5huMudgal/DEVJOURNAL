import { Router } from "express";
import {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
} from "../controllers/journalController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = Router();
router.use(protect);
router.get("/", getAllEntries);
router.post("/", createEntry);
router.put("/:id", updateEntry);
router.delete("/:id", deleteEntry);
var journalRoutes_default = router;
export { journalRoutes_default as default };
