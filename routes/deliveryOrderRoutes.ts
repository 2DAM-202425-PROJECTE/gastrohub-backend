import { Router } from "express";
import {
  createDeliveryOrder,
  deleteDeliveryOrder,
  getDeliveryOrders,
  updateDeliveryOrder,
} from "../controller/deliveryOrderController";
import { authenticateToken } from "../middlewares/authenticationToken";
import { restaurantLicense } from "../middlewares/restaurantLicense";
import { premiumLicense } from "../middlewares/premiumLicense";

const router = Router();

router.get(
  "/getAll",
  authenticateToken,
  restaurantLicense,
  premiumLicense,
  getDeliveryOrders
);
router.post(
  "/create",
  authenticateToken,
  restaurantLicense,
  premiumLicense,
  createDeliveryOrder
);
router.put(
  "/update/:id",
  authenticateToken,
  restaurantLicense,
  premiumLicense,
  updateDeliveryOrder
);
router.delete(
  "/delete/:id",
  authenticateToken,
  restaurantLicense,
  premiumLicense,
  deleteDeliveryOrder
);

export default router;
