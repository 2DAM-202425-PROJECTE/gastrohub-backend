import { Router } from "express";
import { createProductIngredient, deleteProductIngredient, getProductIngredients, updateProductIngredient } from "../controller/productIngredientController";


const router = Router();

router.get("/getAll/:id", getProductIngredients);
router.post("/create", createProductIngredient);
router.put("/update/:id", updateProductIngredient);
router.delete("/delete/:id", deleteProductIngredient);

export default router;
