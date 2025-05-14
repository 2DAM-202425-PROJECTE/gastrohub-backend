import { Router } from "express";
import {
  createOrderProduct,
  deleteOrderProduct,
  updateOrderProduct,
  setPayedByList
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
  "/update/:id",
  authenticateToken,
  restaurantLicense,
  updateOrderProduct
);
router.delete(
  "/delete/:id",
  authenticateToken,
  restaurantLicense,
  deleteOrderProduct
);

router.post(
  "/setPayedByList",
  authenticateToken,
  restaurantLicense,
  setPayedByList
);

export default router;
