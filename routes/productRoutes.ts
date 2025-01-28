import { Router } from "express";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../controller/productController";


const router = Router();

router.get("/getAll/:id", getProducts);
router.post("/create", createProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
