import { Router } from "express";
import { createSchedule, deleteSchedule, getSchedules, updateSchedule } from "../controller/scheduleController";


const router = Router();

router.get("/getAll/:id", getSchedules);
router.post("/create/", createSchedule);
router.put("/update/:id", updateSchedule);
router.delete("/delete/:id", deleteSchedule);

export default router;
