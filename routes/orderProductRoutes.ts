import { Router } from "express";
import { createOrderProduct, deleteOrderProduct, getOrderProducts, updateOrderProduct } from "../controller/orderProductController";


const router = Router();

router.get("/getAll/:id", getOrderProducts);
router.post("/create", createOrderProduct);
router.put("/update/:id_order/:id_product", updateOrderProduct);
router.delete("/delete/:id", deleteOrderProduct);

export default router;
