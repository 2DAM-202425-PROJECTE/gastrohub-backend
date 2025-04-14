import { Router } from "express";
import {
  createUser,
  getUser,
  getUserbyUsername,
  getUsers,
  loginUser,
  updateUser,
  loginUserByToken,
  pinCheck,
} from "../controller/userController";
import { authenticateToken } from "../middlewares/authenticationToken";

const router = Router();

router.get("/getUserbyUsername/:username", getUserbyUsername);
router.post("/create", createUser);
router.post("/login", loginUser);
router.post("/pinCheck", authenticateToken, pinCheck);
router.get("/loginToken", authenticateToken, loginUserByToken);
router.get("/profile", authenticateToken, getUser);
router.get("/getRestaurantWorkers", authenticateToken, getUsers);
router.put("/update", authenticateToken, updateUser);

export default router;
