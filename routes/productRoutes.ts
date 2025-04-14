import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../controller/productController";
import { authenticateToken } from "../middlewares/authenticationToken";

const router = Router();

router.get("/getAll", authenticateToken, getProducts);
router.post("/create", authenticateToken, createProduct);
router.put("/update/:id", authenticateToken, updateProduct);
router.delete("/delete/:id", authenticateToken, deleteProduct);

export default router;
