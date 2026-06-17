import { Router } from "express";
import { protect, authorize } from "../middleware/auth";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";

const router = Router();

router.get("/", protect, getAllCategories);
router.post("/", protect, authorize("Manager", "Admin"), createCategory);
router.put("/:id", protect, authorize("Manager", "Admin"), updateCategory);
router.delete("/:id", protect, authorize("Manager", "Admin"), deleteCategory);

export default router;
