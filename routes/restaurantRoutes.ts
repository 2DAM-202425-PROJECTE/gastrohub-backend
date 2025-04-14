import { Router } from "express";
import {
  createRestaurant,
  getRestaurant,
  updateRestaurant,
} from "../controller/restaurantController";
import { authenticateToken } from "../middlewares/authenticationToken";

const router = Router();

router.get("/get", authenticateToken, getRestaurant);
router.post("/create", createRestaurant);
router.put("/update", authenticateToken, updateRestaurant);

export default router;
