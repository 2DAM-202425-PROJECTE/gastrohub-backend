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

const router = Router();

router.get("/getUserSchedules/:id", authenticateToken, getUserSchedules);
router.post("/create", authenticateToken, createSchedule);
router.delete("/delete/:id", authenticateToken, deleteSchedule);
router.post("/createMultiple", authenticateToken, createMultipleSchedules);
router.delete(
  "/deleteSoonSchedulesWorker/:id",
  authenticateToken,
  deleteSoonSchedulesWorker
);
router.get(
  "/getAllRestaurantSchedules",
  authenticateToken,
  getRestaurantSchedules
);

export default router;
