import { Router } from "express";
import { createTimesheet, deleteTimesheet, getActiveTimesheet, getTimesheet, getTimesheets, updateTimesheet } from "../controller/timesheetController";


const router = Router();

router.get("/getAll/:id", getTimesheets);
router.get("/get/:id", getTimesheet);
router.post("/create", createTimesheet);
router.put("/update/:id", updateTimesheet);
router.delete("/delete/:id", deleteTimesheet);
router.get("/getActiveTimesheet/:id", getActiveTimesheet);

export default router;
