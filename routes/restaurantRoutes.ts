import { Router } from "express";
import {
  createRestaurant,
  getRestaurant,
  updateRestaurant,
  getWebMenu,
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

router.get('/getWebMenu/:id', getWebMenu);

export default router;
