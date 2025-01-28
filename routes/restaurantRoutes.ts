import { Router } from "express";
import { createRestaurant, deleteRestaurant, getRestaurant, getRestaurants, updateRestaurant } from "../controller/restaurantController";


const router = Router();

router.get("/getAll", getRestaurants);
router.get("/get/:id", getRestaurant);
router.post("/create/", createRestaurant);
router.put("/update/:id", updateRestaurant);
router.delete("/delete/:id", deleteRestaurant);

export default router;
