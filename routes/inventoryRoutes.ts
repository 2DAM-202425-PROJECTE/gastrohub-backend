import { Router } from "express";
import {
  createInventory,
  deleteInventory,
  getInventory,
  getOneElement,
  updateInventory,
} from "../controller/inventoryController";
import { authenticateToken } from "../middlewares/authenticationToken";
import { restaurantLicense } from "../middlewares/restaurantLicense";
import { adminCheck } from "../middlewares/adminCheck";

const router = Router();

router.get("/getAll", authenticateToken, restaurantLicense, getInventory);
router.get("/getOne/:id", authenticateToken, restaurantLicense, getOneElement);
router.post(
  "/create",
  authenticateToken,
  restaurantLicense,
  adminCheck,
  createInventory
);
router.put(
  "/update/:id",
  authenticateToken,
  restaurantLicense,
  adminCheck,
  updateInventory
);
router.delete(
  "/delete/:id",
  authenticateToken,
  restaurantLicense,
  adminCheck,
  deleteInventory
);

export default router;
