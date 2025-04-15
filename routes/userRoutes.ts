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
  userAdminCheck,
  assignWorker,
  deleteWorker,
  leaveRestaurant,
  updateWorker,
  resetPin,
  createWorker,
} from "../controller/userController";
import { authenticateToken } from "../middlewares/authenticationToken";
import { restaurantLicense } from "../middlewares/restaurantLicense";
import { adminCheck } from "../middlewares/adminCheck";

const router = Router();

router.get("/getUserbyUsername/:username", getUserbyUsername);
router.post("/create", createUser);
router.post("/login", loginUser);
router.post("/pinCheck", authenticateToken, restaurantLicense, pinCheck);
router.get("/loginToken", authenticateToken, loginUserByToken);
router.get("/profile", authenticateToken, getUser);
router.get(
  "/getRestaurantWorkers",
  authenticateToken,
  restaurantLicense,
  adminCheck,
  getUsers
);
router.put("/update", authenticateToken, updateUser);
router.get("/isAdmin", authenticateToken, restaurantLicense, userAdminCheck);

router.get(
  "/assignWorker/:id",
  authenticateToken,
  restaurantLicense,
  adminCheck,
  assignWorker
);

router.get(
  "/deleteWorker/:id",
  authenticateToken,
  restaurantLicense,
  adminCheck,
  deleteWorker
);

router.get(
  "/resetPin/:id",
  authenticateToken,
  restaurantLicense,
  adminCheck,
  resetPin
);

router.get("/leaveRestaurant", authenticateToken, leaveRestaurant);

router.put(
  "/updateWorker/:id",
  authenticateToken,
  restaurantLicense,
  adminCheck,
  updateWorker
);

router.post(
  "/createWorker",
  authenticateToken,
  restaurantLicense,
  adminCheck,
  createWorker
);

export default router;
