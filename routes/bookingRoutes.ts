import { Router } from "express";
import {
  createBooking,
  deleteBooking,
  getBookings,
} from "../controller/bookingController";
import { authenticateToken } from "../middlewares/authenticationToken";

const router = Router();

router.get("/getAll", authenticateToken, getBookings);
router.post("/create", authenticateToken, createBooking);
router.delete("/delete/:id", authenticateToken, deleteBooking);

export default router;
