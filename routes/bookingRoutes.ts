import { Router } from "express";
import {
  createBooking,
  deleteBooking,
  getBookings,
} from "../controller/bookingController";
import { authenticateToken } from "../middlewares/authenticationToken";
import { restaurantLicense } from "../middlewares/restaurantLicense";
import { premiumLicense } from "../middlewares/premiumLicense";

const router = Router();

router.get(
  "/getAll",
  authenticateToken,
  restaurantLicense,
  premiumLicense,
  getBookings
);
router.post(
  "/create",
  authenticateToken,
  restaurantLicense,
  premiumLicense,
  createBooking
);
router.delete(
  "/delete/:id",
  authenticateToken,
  restaurantLicense,
  premiumLicense,
  deleteBooking
);

export default router;
