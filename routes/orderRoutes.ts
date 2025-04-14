import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getAllActiveOrders,
  updateOrder,
  getAnalytics,
} from "../controller/orderController";
import { authenticateToken } from "../middlewares/authenticationToken";

const router = Router();

router.get("/getAllActiveOrders", authenticateToken, getAllActiveOrders);
router.post("/create", authenticateToken, createOrder);
router.put("/update/:id", authenticateToken, updateOrder);
router.delete("/delete/:id", authenticateToken, deleteOrder);
router.get("/getAnalytics", authenticateToken, getAnalytics);

export default router;
