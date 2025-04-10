import { Router } from "express";
import { createMultipleSchedules, createSchedule, deleteSchedule, deleteSoonSchedulesWorker, getRestaurantSchedules, getUserSchedules, updateSchedule } from "../controller/scheduleController";


const router = Router();

router.get("/getUserSchedules/:id", getUserSchedules);
router.post("/create/", createSchedule);
router.put("/update/:id", updateSchedule);
router.delete("/delete/:id", deleteSchedule);
router.post("/createMultiple", createMultipleSchedules);
router.delete("/deleteSoonSchedulesWorker/:id", deleteSoonSchedulesWorker);
router.get("/getAllRestaurantSchedules/:id", getRestaurantSchedules);

export default router;
