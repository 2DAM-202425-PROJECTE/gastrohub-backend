import { Router } from "express";
import { createOrder, deleteOrder, getOrder, getOrders, updateOrder } from "../controller/orderController";


const router = Router();

router.get("/getAll/:id", getOrders);
router.get("/get/:id", getOrder);
router.post("/create", createOrder);
router.put("/update/:id", updateOrder);
router.delete("/delete/:id", deleteOrder);

export default router;
