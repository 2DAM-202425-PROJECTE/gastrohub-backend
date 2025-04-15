import { Router } from "express";
import {
  createOrderProduct,
  deleteOrderProduct,
  updateOrderProduct,
} from "../controller/orderProductController";
import { authenticateToken } from "../middlewares/authenticationToken";
import { restaurantLicense } from "../middlewares/restaurantLicense";

const router = Router();

router.post(
  "/create",
  authenticateToken,
  restaurantLicense,
  createOrderProduct
);
router.put(
  "/update/:id_order/:id_product",
  authenticateToken,
  restaurantLicense,
  updateOrderProduct
);
router.delete(
  "/delete/:id_order/:id_product",
  authenticateToken,
  restaurantLicense,
  deleteOrderProduct
);

export default router;
