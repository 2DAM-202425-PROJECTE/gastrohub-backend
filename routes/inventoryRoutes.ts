import { Router } from "express";
import {
  createInventory,
  deleteInventory,
  getInventory,
  getOneElement,
  updateInventory,
} from "../controller/inventoryController";
import { authenticateToken } from "../middlewares/authenticationToken";

const router = Router();

router.get("/getAll", authenticateToken, getInventory);
router.get("/getOne/:id", authenticateToken, getOneElement);
router.post("/create", authenticateToken, createInventory);
router.put("/update/:id", authenticateToken, updateInventory);
router.delete("/delete/:id", authenticateToken, deleteInventory);

export default router;
