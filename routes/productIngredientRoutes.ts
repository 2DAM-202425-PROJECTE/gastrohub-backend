import { Router } from "express";
import {
  createProductIngredient,
  getProductIngredients,
} from "../controller/productIngredientController";
import { authenticateToken } from "../middlewares/authenticationToken";
import { restaurantLicense } from "../middlewares/restaurantLicense";
import { adminCheck } from "../middlewares/adminCheck";

const router = Router();

router.get(
  "/getAll/:id",
  authenticateToken,
  restaurantLicense,
  getProductIngredients
);
router.post(
  "/create",
  authenticateToken,
  restaurantLicense,
  adminCheck,
  createProductIngredient
);

export default router;
