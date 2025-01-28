import { Router } from "express";
import { createTimesheet, deleteTimesheet, getTimesheet, getTimesheets, updateTimesheet } from "../controller/timesheetController";


const router = Router();

router.get("/getAll/:id", getTimesheets);
router.get("/get/:id", getTimesheet);
router.post("/create", createTimesheet);
router.put("/update/:id", updateTimesheet);
router.delete("/delete/:id", deleteTimesheet);

export default router;
