import { Router } from "express";
import {
  createMultipleSchedules,
  createSchedule,
  deleteSchedule,
  deleteSoonSchedulesWorker,
  getRestaurantSchedules,
  getUserSchedules,
} from "../controller/scheduleController";
import { authenticateToken } from "../middlewares/authenticationToken";
import { restaurantLicense } from "../middlewares/restaurantLicense";
import { adminCheck } from "../middlewares/adminCheck";

const router = Router();

router.get(
  "/getUserSchedules/:id",
  authenticateToken,
  restaurantLicense,
  getUserSchedules
);
router.post(
  "/create",
  authenticateToken,
  restaurantLicense,
  adminCheck,
  createSchedule
);
router.delete(
  "/delete/:id",
  authenticateToken,
  restaurantLicense,
  adminCheck,
  deleteSchedule
);
router.post(
  "/createMultiple",
  authenticateToken,
  restaurantLicense,
  adminCheck,
  createMultipleSchedules
);
router.delete(
  "/deleteSoonSchedulesWorker/:id",
  authenticateToken,
  restaurantLicense,
  adminCheck,
  deleteSoonSchedulesWorker
);
router.get(
  "/getAllRestaurantSchedules",
  authenticateToken,
  restaurantLicense,
  adminCheck,
  getRestaurantSchedules
);

export default router;
