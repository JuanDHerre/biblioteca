import { Router } from "express";
import { CategoriesController } from "./categories.controller";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";

const router = Router();

const categoriesController = new CategoriesController();


router.post("/", asyncHandler(categoriesController.create));
router.get("/", asyncHandler(categoriesController.findAll));
router.get("/:id", asyncHandler(categoriesController.findById));
router.put("/:id", asyncHandler(categoriesController.update));
router.delete("/:id", asyncHandler(categoriesController.delete));

export default router;

