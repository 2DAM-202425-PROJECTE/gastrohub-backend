import { Router } from "express";
import { createMultipleSchedules, createSchedule, deleteSchedule, deleteSoonSchedulesWorker, getSchedules, updateSchedule } from "../controller/scheduleController";


const router = Router();

router.get("/getAll/:id", getSchedules);
router.post("/create/", createSchedule);
router.put("/update/:id", updateSchedule);
router.delete("/delete/:id", deleteSchedule);
router.post("/createMultiple", createMultipleSchedules);
router.delete("/deleteSoonSchedulesWorker/:id", deleteSoonSchedulesWorker);

export default router;
