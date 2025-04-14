import { Router } from "express";
import {
  createOrderProduct,
  deleteOrderProduct,
  updateOrderProduct,
} from "../controller/orderProductController";
import { authenticateToken } from "../middlewares/authenticationToken";

const router = Router();

router.post("/create", authenticateToken, createOrderProduct);
router.put(
  "/update/:id_order/:id_product",
  authenticateToken,
  updateOrderProduct
);
router.delete(
  "/delete/:id_order/:id_product",
  authenticateToken,
  deleteOrderProduct
);

export default router;
