import { Router } from "express";
import {
  createProductIngredient,
  getProductIngredients,
} from "../controller/productIngredientController";
import { authenticateToken } from "../middlewares/authenticationToken";

const router = Router();

router.get("/getAll/:id", authenticateToken, getProductIngredients);
router.post("/create", authenticateToken, createProductIngredient);

export default router;
