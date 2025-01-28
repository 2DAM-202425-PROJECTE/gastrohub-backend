import { Router } from "express";
import { createInventory, deleteInventory, getInventory, updateInventory } from "../controller/inventoryController";


const router = Router();

router.get("/getAll/:id", getInventory);
router.post("/create", createInventory);
router.put("/update/:id", updateInventory);
router.delete("/delete/:id", deleteInventory);

export default router;
