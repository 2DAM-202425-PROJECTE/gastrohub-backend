import { Router } from "express";
import {
  createTimesheet,
  getActiveTimesheet,
  getTimesheets,
  updateTimesheet,
} from "../controller/timesheetController";
import { authenticateToken } from "../middlewares/authenticationToken";

const router = Router();

router.get("/getAll/:id", authenticateToken, getTimesheets);
router.post("/create", authenticateToken, createTimesheet);
router.put("/update/:id", authenticateToken, updateTimesheet);
router.get("/getActiveTimesheet/:id", authenticateToken, getActiveTimesheet);

export default router;
