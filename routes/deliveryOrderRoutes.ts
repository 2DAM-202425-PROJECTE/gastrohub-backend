import { Router } from "express";
import { createDeliveryOrder, deleteDeliveryOrder, getDeliveryOrder, getDeliveryOrders, updateDeliveryOrder } from "../controller/deliveryOrderController";


const router = Router();

router.get("/getAll/:id", getDeliveryOrders);
router.get("/get/:id", getDeliveryOrder);
router.post("/create", createDeliveryOrder);
router.put("/update/:id", updateDeliveryOrder);
router.delete("/delete/:id", deleteDeliveryOrder);

export default router;
