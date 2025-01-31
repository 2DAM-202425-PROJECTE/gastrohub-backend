import { Router } from "express";
import { createUser, deleteUser, getUser, getUserbyUsername, getUsers, loginUser, updateUser } from "../controller/userController";


const router = Router();

router.get("/getUserbyUsername/:username", getUserbyUsername);
router.get("/getRestaurantWorkers/:id", getUsers);
router.get("/profile/:id", getUser);
router.post("/login", loginUser)
router.post("/create", createUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;
