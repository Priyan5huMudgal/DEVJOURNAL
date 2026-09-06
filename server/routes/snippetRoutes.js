import { Router } from "express";
import {
  getAllSnippets,
  createSnippet,
  updateSnippet,
  deleteSnippet,
} from "../controllers/snippetController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = Router();
router.use(protect);
router.get("/", getAllSnippets);
router.post("/", createSnippet);
router.put("/:id", updateSnippet);
router.delete("/:id", deleteSnippet);
var snippetRoutes_default = router;
export { snippetRoutes_default as default };
