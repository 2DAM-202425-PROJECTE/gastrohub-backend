import { Router } from "express";
import {
  createDeliveryOrder,
  deleteDeliveryOrder,
  getDeliveryOrders,
  updateDeliveryOrder,
} from "../controller/deliveryOrderController";
import { authenticateToken } from "../middlewares/authenticationToken";

const router = Router();

router.get("/getAll", authenticateToken, getDeliveryOrders);
router.post("/create", authenticateToken, createDeliveryOrder);
router.put("/update/:id", authenticateToken, updateDeliveryOrder);
router.delete("/delete/:id", authenticateToken, deleteDeliveryOrder);

export default router;
