import { Router } from "express";
import {
  createRestaurant,
  getRestaurant,
  updateRestaurant,
} from "../controller/restaurantController";
import { authenticateToken } from "../middlewares/authenticationToken";
import { restaurantLicense } from "../middlewares/restaurantLicense";
import { adminCheck } from "../middlewares/adminCheck";

const router = Router();

router.get("/get", authenticateToken, getRestaurant);
router.post("/create", createRestaurant);
router.put(
  "/update",
  authenticateToken,
  restaurantLicense,
  adminCheck,
  updateRestaurant
);

export default router;
