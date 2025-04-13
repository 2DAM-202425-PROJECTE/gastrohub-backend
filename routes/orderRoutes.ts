import { Router } from "express";
import { createOrder, deleteOrder, getOrder, getAllActiveOrders, updateOrder, getAnalytics } from "../controller/orderController";


const router = Router();

router.get("/getAllActiveOrders/:id", getAllActiveOrders);
router.get("/get/:id", getOrder);
router.post("/create", createOrder);
router.put("/update/:id", updateOrder);
router.delete("/delete/:id", deleteOrder);
router.get("/getAnalytics/:id", getAnalytics);

export default router;
