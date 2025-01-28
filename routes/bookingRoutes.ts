import { Router } from "express";
import { createBooking, deleteBooking, getBookings, updateBooking } from "../controller/bookingController";


const router = Router();

router.get("/getAll/:id", getBookings);
router.post("/create", createBooking);
router.put("/update/:id", updateBooking);
router.delete("/delete/:id", deleteBooking);

export default router;
