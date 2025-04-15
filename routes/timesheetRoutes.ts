import { Router } from "express";
import {
  createTimesheet,
  getActiveTimesheet,
  getTimesheets,
  updateTimesheet,
} from "../controller/timesheetController";
import { authenticateToken } from "../middlewares/authenticationToken";
import { restaurantLicense } from "../middlewares/restaurantLicense";
import { adminCheck } from "../middlewares/adminCheck";

const router = Router();

router.get(
  "/getAll/:id",
  authenticateToken,
  restaurantLicense,
  adminCheck,
  getTimesheets
);
router.post("/create", authenticateToken, restaurantLicense, createTimesheet);
router.put(
  "/update/:id",
  authenticateToken,
  restaurantLicense,
  updateTimesheet
);
router.get(
  "/getActiveTimesheet/:id",
  authenticateToken,
  restaurantLicense,
  getActiveTimesheet
);

export default router;
