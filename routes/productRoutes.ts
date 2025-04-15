import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../controller/productController";
import { authenticateToken } from "../middlewares/authenticationToken";
import { restaurantLicense } from "../middlewares/restaurantLicense";
import { adminCheck } from "../middlewares/adminCheck";

const router = Router();

router.get("/getAll", authenticateToken, restaurantLicense, getProducts);
router.post(
  "/create",
  authenticateToken,
  restaurantLicense,
  adminCheck,
  createProduct
);
router.put(
  "/update/:id",
  authenticateToken,
  restaurantLicense,
  adminCheck,
  updateProduct
);
router.delete(
  "/delete/:id",
  authenticateToken,
  restaurantLicense,
  adminCheck,
  deleteProduct
);

export default router;
