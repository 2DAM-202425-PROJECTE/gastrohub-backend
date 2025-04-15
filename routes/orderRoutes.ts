import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getAllActiveOrders,
  updateOrder,
  getAnalytics,
} from "../controller/orderController";
import { authenticateToken } from "../middlewares/authenticationToken";
import { restaurantLicense } from "../middlewares/restaurantLicense";
import { adminCheck } from "../middlewares/adminCheck";
import { premiumLicense } from "../middlewares/premiumLicense";

const router = Router();

router.get(
  "/getAllActiveOrders",
  authenticateToken,
  restaurantLicense,
  getAllActiveOrders
);
router.post("/create", authenticateToken, restaurantLicense, createOrder);
router.put("/update/:id", authenticateToken, restaurantLicense, updateOrder);
router.delete("/delete/:id", authenticateToken, restaurantLicense, deleteOrder);
router.get(
  "/getAnalytics",
  authenticateToken,
  restaurantLicense,
  adminCheck,
  premiumLicense,
  getAnalytics
);

export default router;
